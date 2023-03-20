from flask import Blueprint, request, jsonify
from paddleocr import PaddleOCR
import numpy as np
import cv2

paddleocr_bp = Blueprint('paddleocr', __name__)


def load_image():
    file = request.files['file'].read()
    npimg = np.fromstring(file, np.uint8)
    img = cv2.imdecode(npimg, cv2.IMREAD_COLOR)
    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    return img


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
    text = ''
    result = ocr.ocr(img, cls=True)
    text = ""
    for res in result:
        for line in res:
            text += line[1][0] + "\n"
    return jsonify({'text': text})
