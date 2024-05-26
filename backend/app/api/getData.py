from flask import Blueprint, jsonify, session, request
from app.main.models import db, Invoice, User
import base64

getData_bp = Blueprint('getdata', __name__)


def create_entity_data(entity):
    return {
        'ICO': entity.ico,
        'Name': entity.name,
        'Street': entity.address,
        'PSC': entity.psc,
        'City': entity.city,
        'DIC': entity.dic,
    } if entity else {}


def serializableInvoices(invoices):
    invoice_data = [{
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
        'supplier_data': create_entity_data(invoice.supplier),
        'buyer_data': create_entity_data(invoice.buyer),
        'text': invoice.text,
        'pdf_file': base64.b64encode(invoice.pdf_file).decode() if invoice.pdf_file else None,
        'image_file': base64.b64encode(invoice.image_file).decode() if invoice.image_file else None,
    } for invoice in invoices]
    return invoice_data


@getData_bp.route('/get-invoices')
def getInvoices():
    user_id = session.get("user_id")
    invoices = Invoice.query.filter_by(user_id=user_id).all()
    invoice_data = serializableInvoices(invoices)
    return jsonify({'invoices': invoice_data})


@getData_bp.route('/get-organizations')
def getOrganizations():
    user_id = session.get("user_id")
    user = User.query.get(user_id)
    organization_data = [{'id': org.id, 'name': org.name, 'description': org.description,
                          'invite_code': org.invite_code} for org in user.organizations]

    active_organization = [org for org in organization_data if org['id'] ==
                           user.active_organization_id][0] if user.active_organization_id else None
    return jsonify({'organizations': organization_data, 'active_organization': active_organization})


@getData_bp.route('/get-users')
def getUsers():
    users = User.query.all()
    user_data = [{'id': user.id, 'name': user.name,
                  'email': user.email, 'role': user.role.value} for user in users]
    return jsonify({'users': user_data})


@getData_bp.route('/get-organization-invoices', methods=['POST'])
def getOrganizationInvoices():
    organization_id = request.json['organization_id']
    invoices = Invoice.query.filter_by(organization_id=organization_id).all()
    invoice_data = serializableInvoices(invoices)
    return jsonify({'invoices': invoice_data})


@getData_bp.route('/save-time-other', methods=['POST'])
def saveTimeOther():
    invoice_id = request.json['invoice_id']
    time_other = request.json['time_other']
    invoice = Invoice.query.get(invoice_id)
    performance = invoice.performance
    if performance:
        performance.other_time = time_other
        db.session.commit()
        return jsonify({'success': True})
    else:
        return jsonify({
            'error': 'No performance data found for the given invoice_id.'
        }), 404


@getData_bp.route('/get-performance-data', methods=['POST'])
def getPerformanceData():
    invoice_id = request.json['invoice_id']
    invoice = Invoice.query.get(invoice_id)
    performance = invoice.performance
    if performance:
        return jsonify({
            'average_score': performance.average_score,
            'recognition_time': performance.recognition_time,
            'parsing_time': performance.parsing_time,
            'other_time': performance.other_time,
            'ocr_method': performance.ocr_method
        })
    else:
        return jsonify({
            'error': 'No performance data found for the given invoice_id.'
        }), 404
