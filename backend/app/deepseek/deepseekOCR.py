from flask import Blueprint, jsonify, request
import time
import os
import json
import requests
import logging
from app.utils.operations import add_invoice_to_db, check_if_invoice
from app.utils.utils import get_files_from_request

deepseek_bp = Blueprint('deepseek', __name__)

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

def categorize_text(ocr_text):
    deepseek_host = os.environ.get('DEEPSEEK_HOST', 'http://ollama:11434')
    model_name = os.environ.get('DEEPSEEK_MODEL', 'deepseek-r1:8b')
    logger.debug(f"Calling DeepSeek at {deepseek_host} with model {model_name}")

    prompt = f"""
    You are an expert in invoice data extraction. Given the following OCR text from an invoice, extract and structure the information into the specified JSON format. Return ONLY valid JSON without additional text or explanations.

    OCR TEXT:
    {ocr_text}

    Expected JSON format:
    {{
      "parsed_data": {{
        "bank": "",
        "buyer_data": {{"Name": "", "Street": "", "PSC": "", "City": "", "DIC": ""}},
        "buyer_ico": "",
        "date_of_issue": "",
        "delivery_date": "",
        "due_date": "",
        "iban": "",
        "invoice_number": "",
        "payment_method": "",
        "supplier_data": {{"Name": "", "Street": "", "PSC": "", "City": "", "DIC": ""}},
        "supplier_ico": "",
        "swift": "",
        "total_price": "",
        "var_symbol": ""
      }}
    }}

    Rules:
    1. Leave fields empty ("") if the information is not found.
    2. Use YYYY-MM-DD format for dates when possible.
    3. Populate buyer_data and supplier_data with name, address, and other relevant details if present.
    4. Extract as much relevant information as possible from the text.
    """

    try:
        response = requests.post(
            f"{deepseek_host}/api/chat",
            json={
                "model": model_name,
                "messages": [{"role": "user", "content": prompt}],
                "stream": True
            },
            stream=True,
            timeout=(10, 120)  # Connect timeout 10s, read timeout 120s
        )

        if response.status_code != 200:
            logger.error(f"Ollama API error: {response.status_code} - {response.text}")
            raise requests.RequestException(f"Ollama API returned {response.status_code}: {response.text}")

        full_response = ""
        for chunk in response.iter_lines():
            if chunk:
                data = json.loads(chunk.decode('utf-8'))
                if "message" in data and "content" in data["message"]:
                    full_response += data["message"]["content"]

        logger.debug(f"Raw response from Ollama: '{full_response}'")

        if not full_response.strip():
            logger.error("Empty response from Ollama")
            return {"parsed_data": {}, "error": "Empty response from DeepSeek"}

        json_start = full_response.find("```json")
        json_end = full_response.rfind("```")
        if json_start != -1 and json_end != -1 and json_start < json_end:
            json_str = full_response[json_start + 7:json_end].strip()
            logger.debug(f"Extracted JSON: '{json_str}'")
            result = json.loads(json_str)
        else:
            logger.error("No valid JSON block found in response")
            return {"parsed_data": {}, "error": "No valid JSON block in DeepSeek response"}

        # Zaistenie, že parsed_data má predvolené hodnoty
        result.setdefault("parsed_data", {
            "bank": "", "buyer_data": {"Name": "", "Street": "", "PSC": "", "City": "", "DIC": ""},
            "buyer_ico": "", "date_of_issue": "", "delivery_date": "", "due_date": "", "iban": "",
            "invoice_number": "", "payment_method": "", "supplier_data": {"Name": "", "Street": "", "PSC": "", "City": "", "DIC": ""},
            "supplier_ico": "", "swift": "", "total_price": "", "var_symbol": ""
        })

        return result

    except requests.Timeout:
        logger.error("DeepSeek API request timed out")
        return {"parsed_data": {}, "error": "DeepSeek API timeout"}
    except requests.RequestException as e:
        logger.error(f"DeepSeek API request failed: {str(e)}")
        return {"parsed_data": {}, "error": f"DeepSeek API error: {str(e)}"}
    except json.JSONDecodeError as e:
        logger.error(f"JSON parsing failed: {str(e)}. Raw response: '{full_response}'")
        return {"parsed_data": {}, "error": "Failed to parse JSON from DeepSeek response"}

@deepseek_bp.route('/deepseek', methods=['POST'])
def process_deepseek():
    data = request.json or {}
    ocr_text = data.get('text', '')

    if not ocr_text:
        return jsonify({"error": "No OCR text provided"}), 400

    ocr_method = data.get('ocr_method', 'Unknown')

    start_time_categorization = time.time()
    result = categorize_text(ocr_text)
    categorization_time = time.time() - start_time_categorization

    if "error" in result:
        return jsonify({"error": result["error"]}), 500

    parsed_data = result.get("parsed_data", {})
    is_invoice = check_if_invoice(parsed_data)

    response = {
        'text': ocr_text,
        'parsed_data': parsed_data,
        'time': {
            'recognition': data.get('recognition_time', 0),
            'parsing': 0.0,
            'categorization': categorization_time
        },
        'average_confidence': data.get('average_confidence', 0),
        'is_invoice': is_invoice
    }

    if is_invoice:
        pdf_file, image_file = get_files_from_request()
        try:
            invoice_id = add_invoice_to_db(
                parsed_data,
                ocr_text,
                pdf_file,
                image_file,
                data.get('average_confidence', 0),
                data.get('recognition_time', 0),
                categorization_time,
                ocr_method
            )
            response['invoice_id'] = invoice_id
        except Exception as e:
            logger.error(f"Failed to add invoice to database: {str(e)}")
            return jsonify({"error": f"Failed to add invoice to database: {str(e)}"}), 500

    return jsonify(response)