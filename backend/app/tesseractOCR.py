from flask import Blueprint, request, jsonify
import time
from app.tesseractParser import parse_text
from app.operations import load_image, add_invoice_to_db
import pytesseract

tesseract_bp = Blueprint('tesseract', __name__)


@tesseract_bp.route('/tesseract', methods=['POST'])
def tesseract():
    img = load_image()

    start_time_recognition = time.time()
    data = pytesseract.image_to_data(img, lang='slk', output_type='dict')
    recognition_time = time.time() - start_time_recognition

    text = ""
    total_confidence = 0
    num_confident_words = 0
    num_words = len(data['text'])
    for i in range(num_words):
        if int(data['conf'][i]) > 0:
            text += data['text'][i] + " "
            total_confidence += int(data['conf'][i])
            num_confident_words += 1

            print(int(data['conf'][i]))
    if num_confident_words > 0:
        average_score = total_confidence / num_confident_words
    else:
        average_score = 0

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
                                   average_score, recognition_time, parsing_time)

    return jsonify({
        'invoice_id': invoice_id,
        'text': text,
        'parsed_data': parsed_data,
        'time': {
            'recognition': recognition_time,
            'parsing': parsing_time,
        },
        'average_score': average_score
    })
