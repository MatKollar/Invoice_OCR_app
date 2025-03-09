from flask import Blueprint, jsonify, request
import time
import logging
from paddleocr import PaddleOCR
from app.utils.operations import add_invoice_to_db, check_if_invoice, process_paddleocr_text
from app.utils.utils import load_image, get_files_from_request
from app.deepseek.deepseekOCR import categorize_text

paddleocr_bp = Blueprint('paddleocr', __name__)
logger = logging.getLogger(__name__)

# Nastavenie logovania
logging.basicConfig(level=logging.INFO)

# Funkcia na inicializáciu PaddleOCR s retry logikou
def initialize_ocr_with_retry(max_attempts=3, delay=2):
    for attempt in range(max_attempts):
        try:
            ocr = PaddleOCR(
                det_model_dir='paddle_models/en_PP-OCRv3_det_infer',
                rec_model_dir='paddle_models/en_PP-OCRv3_rec_infer',
                cls_model_dir='paddle_models/ch_ppocr_mobile_v2.0_cls_infer',
                use_angle_cls=True,
                lang='en',  # Skúste 'sk' ak je text v slovenčine
                use_gpu=False,  # Beží na CPU, GPU je použité v Ollama
                enable_mkldnn=True,  # Zapneme MKL-DNN pre lepší výkon na CPU
                cpu_threads=10
            )
            logger.info("PaddleOCR initialized successfully.")
            return ocr
        except Exception as e:
            logger.warning(f"Attempt {attempt + 1}/{max_attempts} failed: {str(e)}")
            if attempt < max_attempts - 1:
                time.sleep(delay)
            else:
                raise Exception("Failed to initialize PaddleOCR after retries")

# Inicializácia PaddleOCR pri štarte modulu
try:
    ocr = initialize_ocr_with_retry()
except Exception as e:
    logger.error(f"Failed to initialize PaddleOCR: {str(e)}")
    raise e

@paddleocr_bp.route('/paddleOCR', methods=['POST'])
def process_paddleocr():
    img = load_image()
    if img is None:
        logger.error("No valid image provided")
        return jsonify({"error": "No valid image provided"}), 400

    ocr_method = 'PaddleOCR'

    # Meranie času rozpoznávania
    start_time_recognition = time.time()
    try:
        result = ocr.ocr(img, cls=True)
    except Exception as e:
        logger.error(f"PaddleOCR recognition failed: {str(e)}")
        return jsonify({"error": f"PaddleOCR recognition failed: {str(e)}"}), 500
    recognition_time = time.time() - start_time_recognition

    if not result or result[0] is None:
        logger.error("PaddleOCR failed to detect text")
        return jsonify({"error": "PaddleOCR failed to detect text"}), 500

    average_confidence, text = process_paddleocr_text(result)
    logger.debug(f"Extracted OCR text: '{text}'")
    if not text.strip():
        logger.error("PaddleOCR extracted no usable text")
        return jsonify({"error": "PaddleOCR extracted no usable text"}), 500

    # Meranie času kategorizácie
    start_time_categorization = time.time()
    try:
        categorized_result = categorize_text(text)
    except Exception as e:
        logger.error(f"Categorization failed: {str(e)}")
        return jsonify({"error": f"Categorization failed: {str(e)}"}), 500
    categorization_time = time.time() - start_time_categorization

    if "error" in categorized_result:
        logger.error(f"Categorization failed: {categorized_result['error']}")
        return jsonify({"error": categorized_result["error"]}), 500

    parsed_data = categorized_result.get("parsed_data", {})
    categorized_data = categorized_result.get("categorized_data", {})

    # Vytvorenie odpovede
    response = {
        'text': text,
        'parsed_data': parsed_data,
        'categorized_data': categorized_data,
        'time': {
            'recognition': recognition_time,
            'categorization': categorization_time,
        },
        'average_confidence': average_confidence * 100
    }

    # Pridanie do databázy, ak je to faktúra
    if check_if_invoice(parsed_data):
        pdf_file, image_file = get_files_from_request()
        try:
            invoice_id = add_invoice_to_db(
                parsed_data,
                text,
                pdf_file,
                image_file,
                average_confidence * 100,
                recognition_time,
                categorization_time,
                ocr_method
            )
            response['invoice_id'] = invoice_id
        except Exception as e:
            logger.error(f"Failed to add invoice to database: {str(e)}")
            return jsonify({"error": f"Failed to add invoice to database: {str(e)}"}), 500

    return jsonify(response)