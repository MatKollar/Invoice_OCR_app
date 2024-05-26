from flask import Blueprint, request, jsonify
import time
from paddleocr import PaddleOCR
from app.ocr.paddleParser import parse_text
from app.services.operations import load_image, add_invoice_to_db, check_if_invoice

paddleocr_bp = Blueprint('paddleocr', __name__)


def compute_average_score_and_text(result):
    total_score = 0
    num_words = 0
    text = ""
    for res in result:
        for line in res:
            text += line[1][0] + "\n"
            total_score += line[1][1]
            num_words += 1

    average_score = total_score / num_words if num_words > 0 else 0
    return average_score, text


def get_files_from_request():
    pdf_file = request.files['pdf'].read(
    ) if request.files.get('pdf') else None
    image_file = request.files['image'].read(
    ) if request.files.get('image') else None
    return pdf_file, image_file


@paddleocr_bp.route('/paddleOCR', methods=['POST'])
def process_paddleocr():
    ocr = PaddleOCR(
        det_model_dir='paddle_models/en_PP-OCRv3_det_infer',
        rec_model_dir='paddle_models/en_PP-OCRv3_rec_infer',
        cls_model_dir='paddle_models/ch_ppocr_mobile_v2.0_cls_infer',
        use_angle_cls=True,
        lang='en'
    )
    img = load_image()
    ocr_method = 'PaddleOCR'

    start_time_recognition = time.time()
    result = ocr.ocr(img, cls=True)
    recognition_time = time.time() - start_time_recognition

    average_score, text = compute_average_score_and_text(result)

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
        'average_score': average_score * 100
    }

    if check_if_invoice(parsed_data):
        pdf_file, image_file = get_files_from_request()
        invoice_id = add_invoice_to_db(parsed_data, text, pdf_file, image_file,
                                       average_score * 100, recognition_time, parsing_time, ocr_method)
        response['invoice_id'] = invoice_id

    return jsonify(response)
