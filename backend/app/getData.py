from flask import Blueprint, request, jsonify
from app.models import db, Invoice

getData_bp = Blueprint('getdata', __name__)

@getData_bp.route('/get-invoices')
def getInvoices():
    invoices = Invoice.query.all()
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
