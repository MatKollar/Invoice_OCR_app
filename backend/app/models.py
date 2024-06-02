import string
import random

from enum import Enum

from app.extensions import db
from app.utils.utils import get_uuid


class UserRole(Enum):
    ADMIN = "admin"
    OWNER = "owner"
    USER = "user"


user_organization = db.Table('user_organization', db.metadata,
                             db.Column('user_id', db.String(32),
                                       db.ForeignKey('users.id')),
                             db.Column('organization_id', db.String(32),
                                       db.ForeignKey('organizations.id'))
                             )


def generate_invite_code(length):
    letters_and_digits = string.ascii_uppercase + string.digits
    while True:
        code = ''.join(random.choices(letters_and_digits, k=length))
        if not Organization.query.filter_by(invite_code=code).first():
            return code


class User(db.Model):
    __tablename__ = "users"
    id = db.Column(db.String(32), primary_key=True,
                   unique=True, default=get_uuid)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(345), unique=True)
    password = db.Column(db.Text, nullable=False)
    role = db.Column(db.Enum(UserRole), nullable=False, default=UserRole.USER)
    invoices = db.relationship("Invoice", backref="user")
    organizations = db.relationship(
        "Organization", secondary=user_organization, backref=db.backref('users', lazy='dynamic'))
    active_organization_id = db.Column(db.String(32))


class Organization(db.Model):
    __tablename__ = "organizations"
    id = db.Column(db.String(32), primary_key=True,
                   unique=True, default=get_uuid)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(1000))
    invite_code = db.Column(db.String(5), unique=True,
                            default=lambda: generate_invite_code(5))
    invoices = db.relationship("Invoice", backref="organization")


class Invoice(db.Model):
    __tablename__ = "invoices"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.String(32), db.ForeignKey(
        'users.id'), nullable=False)
    organization_id = db.Column(db.String(32), db.ForeignKey(
        'organizations.id'))
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
    supplier_id = db.Column(
        db.Integer, db.ForeignKey('suppliers.id'), unique=True)
    buyer_id = db.Column(db.Integer, db.ForeignKey('buyers.id'), unique=True)
    text = db.Column(db.String(100000))
    pdf_file = db.Column(db.LargeBinary)
    image_file = db.Column(db.LargeBinary)
    performance_id = db.Column(db.Integer, db.ForeignKey('performance.id'))


class Supplier(db.Model):
    __tablename__ = "suppliers"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    ico = db.Column(db.String(100))
    name = db.Column(db.String(100))
    address = db.Column(db.String(100))
    psc = db.Column(db.String(100))
    city = db.Column(db.String(100))
    dic = db.Column(db.String(100))
    invoices = db.relationship("Invoice", backref="supplier")


class Buyer(db.Model):
    __tablename__ = "buyers"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    ico = db.Column(db.String(100))
    name = db.Column(db.String(100))
    psc = db.Column(db.String(100))
    address = db.Column(db.String(100))
    city = db.Column(db.String(100))
    dic = db.Column(db.String(100))
    invoices = db.relationship("Invoice", backref="buyer")


class Performance(db.Model):
    __tablename__ = "performance"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    average_confidence = db.Column(db.Float)
    recognition_time = db.Column(db.Float)
    parsing_time = db.Column(db.Float)
    other_time = db.Column(db.Float)
    ocr_method = db.Column(db.String(100))
    invoice = db.relationship("Invoice", backref="performance", uselist=False)
