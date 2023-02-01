from flask import Blueprint, request, jsonify
import numpy as np
import cv2
import pytesseract


tesseract_bp = Blueprint('tesseract', __name__)

def load_image():
    file = request.files['file'].read()
    npimg = np.fromstring(file, np.uint8)
    img = cv2.imdecode(npimg,cv2.IMREAD_COLOR)
    img = cv2.cvtColor(img , cv2.COLOR_BGR2RGB)
    return img

@tesseract_bp.route('/tesseract', methods=['POST'])
def tesseract():
    img = load_image()
    text = pytesseract.image_to_string(img)
    return jsonify({'status':text})