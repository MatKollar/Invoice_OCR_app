from flask import Blueprint, request, jsonify
from app.tesseractParser import parse_text
from app.operations import load_image, add_invoice_to_db
import pytesseract

tesseract_bp = Blueprint('tesseract', __name__)


@tesseract_bp.route('/tesseract', methods=['POST'])
def tesseract():
    img = load_image()
    text = pytesseract.image_to_string(img, lang='slk')
    parsed_data = parse_text(text)
    pdf_file = None
    image_file = None
    if request.files.get('pdf'):
        pdf_file = request.files['pdf'].read()
    elif request.files.get('image'):
        image_file = request.files['image'].read()
    add_invoice_to_db(parsed_data, text, pdf_file, image_file)
    return jsonify({'text': text, 'parsed_data': parsed_data})
