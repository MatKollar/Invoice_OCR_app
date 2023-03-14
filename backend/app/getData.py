from flask import Blueprint, jsonify, session
from app.models import Invoice, User

getData_bp = Blueprint('getdata', __name__)


@getData_bp.route('/get-invoices')
def getInvoices():
    user_id = session.get("user_id")

    invoices = Invoice.query.filter_by(user_id=user_id).all()
    invoice_data = []
    for invoice in invoices:
        supplier_data = {
            'ICO': invoice.supplier_ico,
            'Name': invoice.supplier_name,
            'Street': invoice.supplier_address,
            'PSC': invoice.supplier_psc,
            'City': invoice.supplier_city,
            'DIC': invoice.supplier_dic,
        }
        buyer_data = {
            'ICO': invoice.buyer_ico,
            'Name': invoice.buyer_name,
            'Street': invoice.buyer_address,
            'PSC': invoice.buyer_psc,
            'City': invoice.buyer_city,
            'DIC': invoice.buyer_dic,
        }
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
            'supplier_data': supplier_data,
            'buyer_data': buyer_data,
        }
        invoice_data.append(invoice_dict)

    return jsonify({'invoices': invoice_data})


@getData_bp.route('/get-organizations')
def getOrganizations():
    user_id = session.get("user_id")

    user = User.query.get(user_id)
    organization_data = [{'id': org.id, 'name': org.name, 'description': org.description, 'invite_code': org.invite_code}
                         for org in user.organizations]

    active_organization_id = user.active_organization
    active_organization = [org for org in organization_data if org['id'] == active_organization_id][0]

    return jsonify({'organizations': organization_data, 'active_organization': active_organization})


@getData_bp.route('/get-users')
def getUsers():
    users = User.query.all()
    user_data = [{'id': user.id, 'name': user.name, 'email': user.email, 'role': user.role.value}
                 for user in users]

    return jsonify({'users': user_data})
