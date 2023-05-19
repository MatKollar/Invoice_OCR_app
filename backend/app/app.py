from flask import Flask, jsonify, session, request
from flask_cors import CORS
from flask_session import Session
from config import ApplicationConfig
from app.models import db, User, UserRole, Invoice, Supplier, Buyer
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

    admin_user = User.query.filter_by(email='admin').first()
    if not admin_user:
        hashed_password = bcrypt.generate_password_hash(
            'admin').decode('utf-8')
        admin_user = User(email='admin',
                          name='Admin', password=hashed_password)
        admin_user.role = UserRole.ADMIN
        db.session.add(admin_user)
        db.session.commit()


@app.route("/@me")
def get_current_user():
    user_id = session.get("user_id")

    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401

    user = User.query.get(user_id)

    return jsonify({
        "name": user.name,
        "email": user.email,
        "role": user.role.value
    })


@app.route("/edit-role", methods=["POST"])
def edit_role():
    role = request.json["role"]
    user_id = request.json["user_id"]

    user = User.query.get(user_id)
    user.role = UserRole[role]
    db.session.commit()

    return jsonify({"success": True}), 200


@app.route("/update-user", methods=["POST"])
def update_user():
    user_id = session.get("user_id")

    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401

    user = User.query.get(user_id)
    user.name = request.json["name"]
    user.email = request.json["email"]
    db.session.commit()

    return jsonify({"success": True}), 200


@app.route('/delete-invoice', methods=['DELETE'])
def delete_invoice():
    invoice_id = request.args.get('id', type=int)

    if not invoice_id:
        return jsonify({"error": "ID parameter is missing"}), 400

    invoice = Invoice.query.get(invoice_id)

    if not invoice:
        return jsonify({"error": "Invoice not found"}), 404

    if invoice.supplier_id:
        supplier = Supplier.query.get(invoice.supplier_id)
        if supplier:
            db.session.delete(supplier)

    if invoice.buyer_id:
        buyer = Buyer.query.get(invoice.buyer_id)
        if buyer:
            db.session.delete(buyer)

    performance = invoice.performance

    if performance:
        db.session.delete(performance)

    db.session.delete(invoice)
    db.session.commit()

    return jsonify({"message": f"Invoice {invoice_id} has been deleted"}), 200


@app.route('/update-invoice', methods=['POST'])
def update_invoice():
    new_data = request.json["new_data"]
    invoice_id = new_data["id"]

    if not invoice_id:
        return jsonify({"error": "ID parameter is missing"}), 400

    invoice = Invoice.query.get(invoice_id)

    if not invoice:
        return jsonify({"error": "Invoice not found"}), 404

    invoice.invoice_number = new_data.get(
        "invoice_number", invoice.invoice_number)

    invoice.var_symbol = new_data.get("var_symbol", invoice.var_symbol)
    invoice.date_of_issue = new_data.get(
        "date_of_issue", invoice.date_of_issue)
    invoice.due_date = new_data.get("due_date", invoice.due_date)
    invoice.delivery_date = new_data.get(
        "delivery_date", invoice.delivery_date)
    invoice.payment_method = new_data.get(
        "payment_method", invoice.payment_method)
    invoice.total_price = new_data.get("total_price", invoice.total_price)
    invoice.bank = new_data.get("bank", invoice.bank)
    invoice.swift = new_data.get("swift", invoice.swift)
    invoice.iban = new_data.get("iban", invoice.iban)

    supplier_data = new_data.get("supplier_data", {})
    if invoice.supplier:
        invoice.supplier.ico = supplier_data.get("ICO", invoice.supplier.ico)
        invoice.supplier.name = supplier_data.get(
            "Name", invoice.supplier.name)
        invoice.supplier.address = supplier_data.get(
            "Street", invoice.supplier.address)
        invoice.supplier.psc = supplier_data.get("PSC", invoice.supplier.psc)
        invoice.supplier.city = supplier_data.get(
            "City", invoice.supplier.city)
        invoice.supplier.dic = supplier_data.get("DIC", invoice.supplier.dic)

    buyer_data = new_data.get("buyer_data", {})
    if invoice.buyer:
        invoice.buyer.ico = buyer_data.get("ICO", invoice.buyer.ico)
        invoice.buyer.name = buyer_data.get("Name", invoice.buyer.name)
        invoice.buyer.psc = buyer_data.get("PSC", invoice.buyer.psc)
        invoice.buyer.address = buyer_data.get("Street", invoice.buyer.address)
        invoice.buyer.city = buyer_data.get("City", invoice.buyer.city)
        invoice.buyer.dic = buyer_data.get("DIC", invoice.buyer.dic)

    db.session.commit()

    return jsonify({"message": f"Invoice has been updated"}), 200
