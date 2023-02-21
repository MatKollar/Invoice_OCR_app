from flask_sqlalchemy import SQLAlchemy
from uuid import uuid4

db = SQLAlchemy()

def get_uuid():
    return uuid4().hex

class User(db.Model):
    __tablename__ = "users"
    id = db.Column(db.String(32), primary_key=True, unique=True, default=get_uuid)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(345), unique=True)
    password = db.Column(db.Text, nullable=False)
    invoices = db.relationship("Invoice", backref="user")

class Invoice(db.Model):
    __tablename__ = "invoices"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.String(32), db.ForeignKey('users.id'), nullable=False)
    invoice_number = db.Column(db.String(100))
    var_symbol = db.Column(db.String(100))
    date_of_issue = db.Column(db.String(100))
    due_date = db.Column(db.String(100))
    delivery_date = db.Column(db.String(100))
    payment_method = db.Column(db.String(100))
    total_price = db.Column(db.String(100))
    bank = db.Column(db.String(100))
    swift = db.Column(db.String(100))
    iban = db.Column(db.String(100))
    buyer_ico = db.Column(db.String(100))
    supplier_ico = db.Column(db.String(100))
