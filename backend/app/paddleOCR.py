from flask import Blueprint, request, jsonify
from paddleocr import PaddleOCR
from app.parserOCR import parse_text
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
    result = ocr.ocr(img, cls=True)
    text = ""
    for res in result:
        for line in res:
            text += line[1][0] + "\n"
    parsed_data = parse_text(text)
    pdf_file = None
    image_file = None
    if request.files.get('pdf'):
        pdf_file = request.files['pdf'].read()
    elif request.files.get('image'):
        image_file = request.files['image'].read()
    add_invoice_to_db(parsed_data, text, pdf_file, image_file)
    return jsonify({'text': text, 'parsed_data': parsed_data})

    return jsonify({'text': text})
