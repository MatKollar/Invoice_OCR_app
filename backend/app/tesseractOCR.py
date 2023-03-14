from flask import Blueprint, request, jsonify, session
from app.parserOCR import parse_text
from app.models import db, Invoice, User
import numpy as np
import cv2
import pytesseract

tesseract_bp = Blueprint('tesseract', __name__)


def load_image():
    file = request.files['file'].read()
    npimg = np.fromstring(file, np.uint8)
    img = cv2.imdecode(npimg, cv2.IMREAD_COLOR)
    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    return img


def add_invoice_to_db(parsed_data):
    user_id = session.get("user_id")

    user = User.query.get(user_id)
    active_org_id = user.active_organization_id

    invoice = Invoice(
        user_id=session.get("user_id"),
        organization_id=None,
        invoice_number=parsed_data['invoice_number'],
        var_symbol=parsed_data['var_symbol'],
        date_of_issue=parsed_data['date_of_issue'],
        due_date=parsed_data['due_date'],
        delivery_date=parsed_data['delivery_date'],
        payment_method=parsed_data['payment_method'],
        total_price=parsed_data['total_price'],
        bank=parsed_data['bank'],
        swift=parsed_data['swift'],
        iban=parsed_data['iban'],
        supplier_ico=parsed_data['supplier_ico'],
        buyer_ico=parsed_data['buyer_ico'],
    )

    if parsed_data['supplier_data'].get('Name'):
        invoice.supplier_name = parsed_data['supplier_data']['Name']
        invoice.supplier_address=parsed_data['supplier_data']['Street'],
        invoice.supplier_psc=parsed_data['supplier_data']['PSC'],
        invoice.supplier_city=parsed_data['supplier_data']['City'],
        invoice.supplier_dic=parsed_data['supplier_data']['DIC'],
    
    if parsed_data['buyer_data'].get('Name'):
        invoice.buyer_name = parsed_data['buyer_data']['Name']
        invoice.buyer_address=parsed_data['buyer_data']['Street'],
        invoice.buyer_psc=parsed_data['buyer_data']['PSC'],
        invoice.buyer_city=parsed_data['buyer_data']['City'],
        invoice.buyer_dic=parsed_data['buyer_data']['DIC'],
    
    if active_org_id:
        invoice.organization_id = active_org_id

    db.session.add(invoice)
    db.session.commit()


@tesseract_bp.route('/tesseract', methods=['POST'])
def tesseract():
    img = load_image()
    text = pytesseract.image_to_string(img, lang='slk')
    parsed_data = parse_text(text)
    add_invoice_to_db(parsed_data)
    return jsonify({'text': text, 'parsed_data': parsed_data})
