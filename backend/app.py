from flask import Flask, request, jsonify, session
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from flask_session import Session
from config import ApplicationConfig
from models import db, User
from preprocessing import preprocessing

app = Flask(__name__)
app.config.from_object(ApplicationConfig)
app.config.update(ENV='development')
CORS(app, supports_credentials=True)
app.config['CORS_HEADERS'] = 'Content-Type'
app.register_blueprint(preprocessing)

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
        "id": user.id,
        "email": user.email
    }) 

@app.route("/register", methods=["POST"])
def register_user():
    email = request.json["email"]
    password = request.json["password"]

    user_exists = User.query.filter_by(email=email).first() is not None
    
    if user_exists:
        return jsonify({"error": "User already exists"}), 409
        
    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
    new_user = User(email=email, password=hashed_password)
    db.session.add(new_user)
    db.session.commit()
    
    session["user_id"] = new_user.id

    return jsonify({
        "id": new_user.id,
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
        "email": user.email
    })

@app.route("/logout", methods=["POST"])
def logout_user():
    session.pop("user_id")
    return "200"