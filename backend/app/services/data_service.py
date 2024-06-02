from app.models import db, Invoice, User
import base64


def create_entity_data(entity):
    return {
        'ICO': entity.ico,
        'Name': entity.name,
        'Street': entity.address,
        'PSC': entity.psc,
        'City': entity.city,
        'DIC': entity.dic,
    } if entity else {}


def serializable_invoices(invoices):
    return [{
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


def get_invoices(user_id):
    invoices = Invoice.query.filter_by(user_id=user_id).all()
    return serializable_invoices(invoices)


def get_organizations(user_id):
    user = User.query.get(user_id)
    organization_data = [{'id': org.id, 'name': org.name, 'description': org.description,
                          'invite_code': org.invite_code} for org in user.organizations]
    active_organization = next((org for org in organization_data if org['id'] ==
                                user.active_organization_id), None)
    return organization_data, active_organization


def get_users():
    users = User.query.all()
    return [{'id': user.id, 'name': user.name, 'email': user.email, 'role': user.role.value} for user in users]


def get_organization_invoices(organization_id):
    invoices = Invoice.query.filter_by(organization_id=organization_id).all()
    return serializable_invoices(invoices)


def save_time_other(invoice_id, time_other):
    invoice = Invoice.query.get(invoice_id)
    performance = invoice.performance
    if performance:
        performance.other_time = time_other
        db.session.commit()
        return True
    return False


def get_performance_data(invoice_id):
    invoice = Invoice.query.get(invoice_id)
    performance = invoice.performance
    if performance:
        return {
            'average_confidence': performance.average_confidence,
            'recognition_time': performance.recognition_time,
            'parsing_time': performance.parsing_time,
            'other_time': performance.other_time,
            'ocr_method': performance.ocr_method
        }
    return None
