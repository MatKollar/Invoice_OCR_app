from flask import Blueprint, jsonify, request
import time
import pytesseract
from app.utils.operations import add_invoice_to_db, check_if_invoice, compute_confidence
from app.utils.utils import load_image, get_files_from_request
from app.config import INVOICE_LANG
from app.deepseek.deepseekOCR import categorize_text  # Import categorize_text

tesseract_bp = Blueprint('tesseract', __name__)

@tesseract_bp.route('/tesseract', methods=['POST'])
def process_tesseract():
    img = load_image()
    ocr_method = 'Tesseract'

    start_time_recognition = time.time()
    text = pytesseract.image_to_string(img, lang=INVOICE_LANG)
    data = pytesseract.image_to_data(img, lang=INVOICE_LANG, output_type="dict")
    recognition_time = time.time() - start_time_recognition

    average_confidence = compute_confidence(data)

    start_time_categorization = time.time()
    categorized_result = categorize_text(text)
    categorization_time = time.time() - start_time_categorization

    if "error" in categorized_result:
        return jsonify({"error": categorized_result["error"]}), 500

    parsed_data = categorized_result.get("parsed_data", {})
    categorized_data = categorized_result.get("categorized_data", {})

    response = {
        'text': text,
        'parsed_data': parsed_data,
        'categorized_data': categorized_data,
        'time': {
            'recognition': recognition_time,
            'categorization': categorization_time,
        },
        'average_confidence': average_confidence
    }

    if check_if_invoice(parsed_data):
        pdf_file, image_file = get_files_from_request()
        invoice_id = add_invoice_to_db(
            parsed_data,
            text,
            pdf_file,
            image_file,
            average_confidence,
            recognition_time,
            categorization_time,
            ocr_method
        )
        response['invoice_id'] = invoice_id

    return jsonify(response)