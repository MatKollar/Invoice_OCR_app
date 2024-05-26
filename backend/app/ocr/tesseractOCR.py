from flask import Blueprint, request, jsonify
import time
import pytesseract
from app.ocr.tesseractParser import parse_text
from app.utils.operations import add_invoice_to_db, check_if_invoice
from app.utils.utils import load_image

tesseract_bp = Blueprint('tesseract', __name__)


def compute_average_score(data):
    total_confidence = 0
    num_confident_words = 0
    num_words = len(data['text'])
    for i in range(num_words):
        if int(data['conf'][i]) > 0:
            total_confidence += int(data['conf'][i])
            num_confident_words += 1

    return total_confidence / num_confident_words if num_confident_words > 0 else 0


def get_files_from_request():
    pdf_file = request.files['pdf'].read(
    ) if request.files.get('pdf') else None
    image_file = request.files['image'].read(
    ) if request.files.get('image') else None
    return pdf_file, image_file


@tesseract_bp.route('/tesseract', methods=['POST'])
def process_tesseract():
    img = load_image()
    ocr_method = 'Tesseract'

    start_time_recognition = time.time()
    text = pytesseract.image_to_string(img, lang='slk')
    data = pytesseract.image_to_data(img, lang='slk', output_type="dict")
    recognition_time = time.time() - start_time_recognition

    average_score = compute_average_score(data)

    start_time_parsing = time.time()
    parsed_data = parse_text(text)
    parsing_time = time.time() - start_time_parsing

    response = {
        'text': text,
        'parsed_data': parsed_data,
        'time': {
            'recognition': recognition_time,
            'parsing': parsing_time,
        },
        'average_score': average_score
    }

    if check_if_invoice(parsed_data):
        pdf_file, image_file = get_files_from_request()
        invoice_id = add_invoice_to_db(parsed_data, text, pdf_file, image_file,
                                       average_score, recognition_time, parsing_time, ocr_method)
        response['invoice_id'] = invoice_id

    return jsonify(response)
