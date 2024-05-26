from flask import Blueprint, request, jsonify
import requests

companyAPI_bp = Blueprint('companyAPI', __name__)


@companyAPI_bp.route('/get_details', methods=['POST'])
def getCompanyDetails():
    ico = request.args.get('ico')

    url_get_id = f"https://www.registeruz.sk/cruz-public/api/uctovne-jednotky?zmenene-od=2000-01-01&ico={ico}"

    id_response = requests.get(url_get_id)

    if id_response.status_code == 200:
        data = id_response.json()
    else:
        return jsonify({'error': 'Failed to get company ID.'}), 500

    id = data['id'][0]
    url_get_details = f"https://www.registeruz.sk/cruz-public/api/uctovna-jednotka?id={id}"
    details_response = requests.get(url_get_details)

    if details_response.status_code == 200:
        data = details_response.json()
    else:
        return jsonify({'error': 'Failed to get company details.'}), 500

    data = {
        'Name': data['nazovUJ'],
        'PSC': data['psc'],
        'City': data['mesto'],
        'Street': data['ulica'],
        'DIC': data['dic'],
        'ICO': ico,
    }

    return jsonify({'data': data})
