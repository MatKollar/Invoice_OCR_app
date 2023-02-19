from flask import Blueprint, request, jsonify
from app.models import db, Invoice


getData_bp = Blueprint('getdata', __name__)

@getData_bp.route('/get-invoices')
def getInvoices():
    invoices = Invoice.query.all()

    invoice_numbers = [invoice.invoice_number for invoice in invoices]

    return jsonify({'invoice_numbers': invoice_numbers})