from flask import Blueprint, jsonify, session
from app.models import Invoice, Organization, User

getData_bp = Blueprint('getdata', __name__)


@getData_bp.route('/get-invoices')
def getInvoices():
    user_id = session.get("user_id")

    invoices = Invoice.query.filter_by(user_id=user_id).all()
    invoice_data = []
    for invoice in invoices:
        invoice_dict = {
            'id': invoice.id,
            'invoice_number': invoice.invoice_number,
            'var_symbol': invoice.var_symbol,
            'date_of_issue': invoice.date_of_issue,
            'due_date': invoice.due_date,
            'delivery_date': invoice.delivery_date,
            'payment_method': invoice.payment_method,
            'total_price': invoice.total_price,
            'bank': invoice.bank,
            'swift': invoice.swift,
            'iban': invoice.iban,
            'buyer_ico': invoice.buyer_ico,
            'supplier_ico': invoice.supplier_ico
        }
        invoice_data.append(invoice_dict)

    return jsonify({'invoices': invoice_data})


@getData_bp.route('/get-organizations')
def getOrganizations():
    user_id = session.get("user_id")

    user = User.query.get(user_id)
    organization_data = [{'id': org.id, 'name': org.name, 'description': org.description, 'invite_code': org.invite_code}
                         for org in user.organizations]

    return jsonify({'organizations': organization_data})
