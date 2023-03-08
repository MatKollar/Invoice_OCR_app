from flask import Blueprint, request, session, jsonify
from flask_bcrypt import Bcrypt
from app.models import db, User

authentication_bp = Blueprint('authentication', __name__)
bcrypt = Bcrypt()


@authentication_bp.route('/register', methods=['POST'])
def register():
    name = request.json["name"]
    email = request.json["email"]
    password = request.json["password"]

    user_exists = User.query.filter_by(email=email).first() is not None

    if user_exists:
        return jsonify({"error": "User already exists"}), 409

    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
    new_user = User(name=name, email=email, password=hashed_password)
    db.session.add(new_user)
    db.session.commit()

    session["user_id"] = new_user.id

    return jsonify({
        "id": new_user.id,
        "name": new_user.name,
        "email": new_user.email
    })


@authentication_bp.route("/login", methods=["POST"])
def login_user():
    email = request.json["email"]
    password = request.json["password"]

    user = User.query.filter_by(email=email).first()

    if user is None:
        return jsonify({"error": "Unauthorized"}), 401

    if not bcrypt.check_password_hash(user.password, password):
        return jsonify({"error": "Unauthorized"}), 401

    session["user_id"] = user.id

    return jsonify({
        "id": user.id,
        "name": user.name,
        "email": user.email
    })


@authentication_bp.route("/logout", methods=["POST"])
def logout_user():
    session.pop("user_id")
    return "200"


@authentication_bp.route("/change-password", methods=["POST"])
def change_password():
    user_id = session.get("user_id")

    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401

    user = User.query.filter_by(id=user_id).first()
    old_password = request.json["oldPassword"]
    new_password = request.json["newPassword"]

    if not bcrypt.check_password_hash(user.password, old_password):
        return jsonify({"error": "Unauthorized"}), 401

    user.password = bcrypt.generate_password_hash(new_password).decode('utf-8')
    db.session.commit()

    return jsonify({"success": True}), 200
