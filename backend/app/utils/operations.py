from flask import session
from app.models import db, Invoice, User, Performance, Supplier, Buyer


def compute_confidence(data):
    total_confidence = 0
    num_confident_words = 0
    num_words = len(data['text'])
    for i in range(num_words):
        if int(data['conf'][i]) > 0:
            total_confidence += int(data['conf'][i])
            num_confident_words += 1

    return total_confidence / num_confident_words if num_confident_words > 0 else 0


def process_paddleocr_text(result):
    total_score = 0
    num_words = 0
    text = ""
    for res in result:
        for line in res:
            text += line[1][0] + "\n"
            total_score += line[1][1]
            num_words += 1

    average_confidence = total_score / num_words if num_words > 0 else 0
    return average_confidence, text


def add_invoice_to_db(parsed_data, text, pdf_file, img_file, average_confidence, recognition_time, parsing_time, ocr_method):
    user_id = session.get("user_id")

    user = User.query.get(user_id)
    active_org_id = user.active_organization_id

    performance = Performance(
        average_confidence=average_confidence,
        recognition_time=recognition_time,
        parsing_time=parsing_time,
        other_time=None,
        ocr_method=ocr_method
    )

    db.session.add(performance)
    db.session.flush()

    supplier = Supplier(
        ico=parsed_data['supplier_data']['ICO'] if parsed_data.get('supplier_data') else None,
        name=parsed_data['supplier_data']['Name'] if parsed_data.get('supplier_data') else "",
        address=parsed_data['supplier_data']['Street'] if parsed_data.get('supplier_data') else "",
        psc=parsed_data['supplier_data']['PSC'] if parsed_data.get('supplier_data') else "",
        city=parsed_data['supplier_data']['City'] if parsed_data.get('supplier_data') else "",
        dic=parsed_data['supplier_data']['DIC'] if parsed_data.get('supplier_data') else ""
    )
    db.session.add(supplier)
    db.session.flush()

    buyer = Buyer(
        ico=parsed_data['buyer_data']['ICO'] if parsed_data.get('buyer_data') else None,
        name=parsed_data['buyer_data']['Name'] if parsed_data.get('buyer_data') else "",
        address=parsed_data['buyer_data']['Street'] if parsed_data.get('buyer_data') else "",
        psc=parsed_data['buyer_data']['PSC'] if parsed_data.get('buyer_data') else "",
        city=parsed_data['buyer_data']['City'] if parsed_data.get('buyer_data') else "",
        dic=parsed_data['buyer_data']['DIC'] if parsed_data.get('buyer_data') else ""
    )
    db.session.add(buyer)
    db.session.flush()

    invoice = Invoice(
        user_id=user_id,
        organization_id=active_org_id if active_org_id else None,
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
        supplier_id=supplier.id if supplier else None,
        buyer_id=buyer.id if buyer else None,
        text=text,
        performance_id=performance.id
    )

    if pdf_file:
        invoice.pdf_file = pdf_file

    if img_file:
        invoice.image_file = img_file

    db.session.add(invoice)
    db.session.commit()

    return invoice.id


def check_if_invoice(parsed_data):
    required_fields = ['invoice_number', 'var_symbol', 'total_price',
                       'due_date', 'iban', 'buyer_ico', 'supplier_ico', "bank"]
    return any(parsed_data.get(field) for field in required_fields)
