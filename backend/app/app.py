from flask import Flask, jsonify, session
from flask_cors import CORS
from flask_session import Session
from config import ApplicationConfig
from app.models import db, User, UserRole
from app.authentication import authentication_bp
from app.preprocessing import preprocessing_bp
from app.tesseractOCR import tesseract_bp
from app.paddleOCR import paddleocr_bp
from app.companyAPI import companyAPI_bp
from app.organizations import organizations_bp
from app.getData import getData_bp
from flask_bcrypt import Bcrypt

app = Flask(__name__)
app.config.from_object(ApplicationConfig)
app.config.update(ENV='development')
app.config['SESSION_SQLALCHEMY'] = db
app.config['CORS_HEADERS'] = 'Content-Type'
CORS(app, supports_credentials=True)
app.register_blueprint(authentication_bp)
app.register_blueprint(preprocessing_bp)
app.register_blueprint(tesseract_bp)
app.register_blueprint(paddleocr_bp)
app.register_blueprint(companyAPI_bp)
app.register_blueprint(organizations_bp)
app.register_blueprint(getData_bp)
bcrypt = Bcrypt()

server_session = Session(app)
db.init_app(app)

with app.app_context():
    db.create_all()

    admin_user = User.query.filter_by(email='admin@admin.com').first()
    if not admin_user:
        hashed_password = bcrypt.generate_password_hash(
            'admin').decode('utf-8')
        admin_user = User(email='admin@admin.com',
                          name='Admin', password=hashed_password)
        admin_user.role = UserRole.ADMIN
        db.session.add(admin_user)
        db.session.commit()


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
