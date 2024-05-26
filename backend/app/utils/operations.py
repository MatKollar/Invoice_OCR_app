from flask import session
from app.models import db, Invoice, User, Performance, Supplier, Buyer


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

    supplier = None
    if parsed_data.get('supplier_data'):
        supplier = Supplier(
            ico=parsed_data['supplier_data']['ICO'],
            name=parsed_data['supplier_data']['Name'],
            address=parsed_data['supplier_data']['Street'],
            psc=parsed_data['supplier_data']['PSC'],
            city=parsed_data['supplier_data']['City'],
            dic=parsed_data['supplier_data']['DIC']
        )
        db.session.add(supplier)
        db.session.flush()

    buyer = None
    if parsed_data.get('buyer_data'):
        buyer = Buyer(
            ico=parsed_data['buyer_data']['ICO'],
            name=parsed_data['buyer_data']['Name'],
            address=parsed_data['buyer_data']['Street'],
            psc=parsed_data['buyer_data']['PSC'],
            city=parsed_data['buyer_data']['City'],
            dic=parsed_data['buyer_data']['DIC']
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
