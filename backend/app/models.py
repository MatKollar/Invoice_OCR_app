from flask_sqlalchemy import SQLAlchemy
from uuid import uuid4
from enum import Enum
import string
import random

db = SQLAlchemy()


def get_uuid():
    return uuid4().hex


def generate_invite_code(length):
    letters_and_digits = string.ascii_uppercase + string.digits
    return ''.join(random.choice(letters_and_digits) for i in range(length))


class UserRole(Enum):
    ADMIN = "admin"
    USER = "user"


user_organization = db.Table('user_organization', db.metadata,
    db.Column('user_id', db.String(32), db.ForeignKey('users.id')),
    db.Column('organization_id', db.String(32), db.ForeignKey('organizations.id'))
)


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


class Organization(db.Model):
    __tablename__ = "organizations"
    id = db.Column(db.String(32), primary_key=True,
                   unique=True, default=get_uuid)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(1000))
    invite_code = db.Column(db.String(5), unique=True,
                            default=generate_invite_code(5))


class Invoice(db.Model):
    __tablename__ = "invoices"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.String(32), db.ForeignKey(
        'users.id'), nullable=False)
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
