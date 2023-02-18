from flask import Blueprint, request, jsonify
from app.models import db, Invoice


getData_bp = Blueprint('getdata', __name__)

@getData_bp.route('/get-invoices')
def getInvoices():

    return jsonify({'text': "Hello"})