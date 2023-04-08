from flask import request, session
from app.models import db, Invoice, User, Performance
import numpy as np
import cv2


def load_image():
    file = request.files['file'].read()
    npimg = np.fromstring(file, np.uint8)
    img = cv2.imdecode(npimg, cv2.IMREAD_COLOR)
    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    return img


def add_invoice_to_db(parsed_data, text, pdf_file, img_file, average_score, recognition_time, parsing_time, ocr_method):
    user_id = session.get("user_id")

    user = User.query.get(user_id)
    active_org_id = user.active_organization_id

    performance = Performance(
        average_score=average_score,
        recognition_time=recognition_time,
        parsing_time=parsing_time,
        other_time=None, 
        ocr_method=ocr_method
    )

    db.session.add(performance)
    db.session.flush()

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
        text=text,
        performance_id=performance.id
    )

    if pdf_file:
        invoice.pdf_file = pdf_file

    if img_file:
        invoice.image_file = img_file

    if parsed_data['supplier_data'].get('Name'):
        invoice.supplier_name = parsed_data['supplier_data']['Name']
        invoice.supplier_address = parsed_data['supplier_data']['Street'],
        invoice.supplier_psc = parsed_data['supplier_data']['PSC'],
        invoice.supplier_city = parsed_data['supplier_data']['City'],
        invoice.supplier_dic = parsed_data['supplier_data']['DIC'],

    if parsed_data['buyer_data'].get('Name'):
        invoice.buyer_name = parsed_data['buyer_data']['Name']
        invoice.buyer_address = parsed_data['buyer_data']['Street'],
        invoice.buyer_psc = parsed_data['buyer_data']['PSC'],
        invoice.buyer_city = parsed_data['buyer_data']['City'],
        invoice.buyer_dic = parsed_data['buyer_data']['DIC'],

    if active_org_id:
        invoice.organization_id = active_org_id

    db.session.add(invoice)
    db.session.commit()

    return invoice.id


def check_if_invoice(parsed_data):
    if (parsed_data['invoice_number'] or parsed_data['var_symbol'] or parsed_data['total_price'] or parsed_data['due_date'] or parsed_data['iban']
            or parsed_data['buyer_ico'] or parsed_data['supplier_ico'] or parsed_data["bank"]):
        return True
    else:
        return False
