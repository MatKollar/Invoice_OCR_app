from flask import session
from app.models import db, Invoice, User, Performance, Supplier, Buyer
import logging

logger = logging.getLogger(__name__)

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
    if not user_id:
        logger.error("No user_id in session")
        raise ValueError("User not authenticated")

    user = User.query.get(user_id)
    if not user:
        logger.error(f"User with ID {user_id} not found")
        raise ValueError("User not found")
    active_org_id = user.active_organization_id

    try:
        # Performance
        performance = Performance(
            average_confidence=average_confidence,
            recognition_time=recognition_time,
            parsing_time=parsing_time,
            other_time=None,
            ocr_method=ocr_method
        )
        db.session.add(performance)
        db.session.flush()
        logger.debug(f"Added performance record with ID {performance.id}")

        # Supplier
        supplier_data = parsed_data.get('supplier_data', {})
        supplier = Supplier(
            ico=supplier_data.get('ICO'),
            name=supplier_data.get('Name', ""),
            address=supplier_data.get('Street', ""),
            psc=supplier_data.get('PSC', ""),
            city=supplier_data.get('City', ""),
            dic=supplier_data.get('DIC', "")
        )
        if not supplier.ico:
            logger.warning("Supplier ICO not found in parsed_data")
        db.session.add(supplier)
        db.session.flush()
        logger.debug(f"Added supplier with ID {supplier.id}")

        # Buyer
        buyer_data = parsed_data.get('buyer_data', {})
        buyer = Buyer(
            ico=buyer_data.get('ICO'),
            name=buyer_data.get('Name', ""),
            address=buyer_data.get('Street', ""),
            psc=buyer_data.get('PSC', ""),
            city=buyer_data.get('City', ""),
            dic=buyer_data.get('DIC', "")
        )
        if not buyer.ico:
            logger.warning("Buyer ICO not found in parsed_data")
        db.session.add(buyer)
        db.session.flush()
        logger.debug(f"Added buyer with ID {buyer.id}")

        # Invoice
        invoice = Invoice(
            user_id=user_id,
            organization_id=active_org_id,
            invoice_number=parsed_data.get('invoice_number'),
            var_symbol=parsed_data.get('var_symbol'),
            date_of_issue=parsed_data.get('date_of_issue'),
            due_date=parsed_data.get('due_date'),
            delivery_date=parsed_data.get('delivery_date'),
            payment_method=parsed_data.get('payment_method'),
            total_price=parsed_data.get('total_price'),
            bank=parsed_data.get('bank'),
            swift=parsed_data.get('swift'),
            iban=parsed_data.get('iban'),
            supplier_id=supplier.id,
            buyer_id=buyer.id,
            text=text,
            performance_id=performance.id
        )

        if pdf_file:
            invoice.pdf_file = pdf_file
        if img_file:
            invoice.image_file = img_file

        db.session.add(invoice)
        db.session.commit()
        logger.info(f"Invoice added with ID {invoice.id}")

        return invoice.id

    except Exception as e:
        db.session.rollback()
        logger.error(f"Failed to add invoice to DB: {str(e)}")
        raise

def check_if_invoice(parsed_data):
    required_fields = [
        'invoice_number', 'var_symbol', 'total_price', 'due_date', 'iban', 'bank'
    ]
    supplier_data = parsed_data.get('supplier_data', {})
    buyer_data = parsed_data.get('buyer_data', {})
    has_supplier_ico = supplier_data.get('ICO') is not None
    has_buyer_ico = buyer_data.get('ICO') is not None
    has_required_field = any(parsed_data.get(field) for field in required_fields)
    return has_supplier_ico or has_buyer_ico or has_required_field