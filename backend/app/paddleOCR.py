from flask import Blueprint, request, jsonify
import time
from paddleocr import PaddleOCR
from app.paddleParser import parse_text
from app.operations import load_image, add_invoice_to_db

paddleocr_bp = Blueprint('paddleocr', __name__)


@paddleocr_bp.route('/paddleOCR', methods=['POST'])
def paddleocr():
    ocr = PaddleOCR(
        det_model_dir='paddle_models/en_PP-OCRv3_det_infer',
        rec_model_dir='paddle_models/latin_PP-OCRv3_rec_infer',
        cls_model_dir='paddle_models/ch_ppocr_mobile_v2.0_cls_infer',
        use_angle_cls=True,
        lang='sk'
    )
    img = load_image()

    start_time_recognition = time.time()
    result = ocr.ocr(img, cls=True)
    recognition_time = time.time() - start_time_recognition

    text = ""
    total_score = 0
    num_words = 0
    for res in result:
        for line in res:
            text += line[1][0] + "\n"
            total_score += line[1][1]
            num_words += 1
    average_score = total_score / num_words if num_words > 0 else 0

    start_time_parsing = time.time()
    parsed_data = parse_text(text)
    parsing_time = time.time() - start_time_parsing

    pdf_file = None
    image_file = None
    if request.files.get('pdf'):
        pdf_file = request.files['pdf'].read()
    elif request.files.get('image'):
        image_file = request.files['image'].read()
    invoice_id = add_invoice_to_db(parsed_data, text, pdf_file, image_file,
                      average_score*100, recognition_time, parsing_time)

    return jsonify({
        'invoice_id': invoice_id,
        'text': text,
        'parsed_data': parsed_data,
        'time': {
            'recognition': recognition_time,
            'parsing': parsing_time,
        },
        'average_score': average_score*100
    })
