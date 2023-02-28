from flask import Flask, request, jsonify, session
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from flask_session import Session
from config import ApplicationConfig
from app.models import db, User, UserRole
from app.preprocessing import preprocessing_bp
from app.tesseractOCR import tesseract_bp
from app.paddleOCR import paddleocr_bp
from app.companyAPI import companyAPI_bp
from app.organizations import organizations_bp
from app.getData import getData_bp

app = Flask(__name__)
app.config.from_object(ApplicationConfig)
app.config.update(ENV='development')
CORS(app, supports_credentials=True)
app.config['CORS_HEADERS'] = 'Content-Type'
app.register_blueprint(preprocessing_bp)
app.register_blueprint(tesseract_bp)
app.register_blueprint(paddleocr_bp)
app.register_blueprint(companyAPI_bp)
app.register_blueprint(organizations_bp)
app.register_blueprint(getData_bp)
app.config['SESSION_SQLALCHEMY'] = db

bcrypt = Bcrypt(app)
server_session = Session(app)
db.init_app(app)

with app.app_context():
    db.create_all()


@app.route("/hello")
def hello():
    return "Hello, World!"


@app.route("/@me")
def get_current_user():

    user_id = session.get("user_id")

    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401

    user = User.query.filter_by(id=user_id).first()
    return jsonify({
        "name": user.name,
        "email": user.email,
        "role": user.role.value
    })


@app.route('/promoteuser/<string:user_id>', methods=['POST'])
def promote_user(user_id):
    user = User.query.filter_by(id=user_id).first()

    if not user:
        return jsonify({'message': 'User not found'}), 404

    user.role = UserRole.ADMIN

    db.session.commit()

    return jsonify({'message': 'User has been promoted to admin'}), 200


@app.route("/register", methods=["POST"])
def register_user():
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


@app.route("/login", methods=["POST"])
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


@app.route("/logout", methods=["POST"])
def logout_user():
    session.pop("user_id")
    return "200"
