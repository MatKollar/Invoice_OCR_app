from flask import Blueprint, jsonify
import time
from paddleocr import PaddleOCR
from app.parsers.paddleParser import parse_text
from app.utils.operations import add_invoice_to_db, check_if_invoice, process_paddleocr_text
from app.utils.utils import load_image, get_files_from_request

paddleocr_bp = Blueprint('paddleocr', __name__)


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

    average_confidence, text = process_paddleocr_text(result)

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
        'average_confidence': average_confidence * 100
    }

    if check_if_invoice(parsed_data):
        pdf_file, image_file = get_files_from_request()
        invoice_id = add_invoice_to_db(parsed_data, text, pdf_file, image_file,
                                       average_confidence * 100, recognition_time, parsing_time, ocr_method)
        response['invoice_id'] = invoice_id

    return jsonify(response)
