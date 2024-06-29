from flask import Blueprint, jsonify, session, request
from app.services.data_service import (
    get_invoices, get_organizations, get_users,
    get_organization_invoices, save_time_other, get_performance_data
)

getData_bp = Blueprint('getdata', __name__)


@getData_bp.route('/get-invoices')
def get_invoices_route():
    user_id = session.get("user_id")
    if not user_id:
        return jsonify({"error": "User not logged in."}), 401
    invoices = get_invoices(user_id)
    return jsonify({'invoices': invoices})


@getData_bp.route('/get-organizations')
def get_organizations_route():
    user_id = session.get("user_id")
    if not user_id:
        return jsonify({"error": "User not logged in."}), 401
    organizations, active_organization = get_organizations(user_id)
    return jsonify({'organizations': organizations, 'active_organization': active_organization})


@getData_bp.route('/get-users')
def get_users_route():
    users = get_users()
    return jsonify({'users': users})


@getData_bp.route('/get-organization-invoices', methods=['POST'])
def get_organization_invoices_route():
    organization_id = request.json['organization_id']
    invoices = get_organization_invoices(organization_id)
    return jsonify({'invoices': invoices})


@getData_bp.route('/save-time-other', methods=['POST'])
def save_time_other_route():
    invoice_id = request.json['invoice_id']
    time_other = request.json['time_other']
    success = save_time_other(invoice_id, time_other)
    if success:
        return jsonify({'success': True})
    else:
        return jsonify({'error': 'No performance data found for the given invoice_id.'}), 404


@getData_bp.route('/get-performance-data', methods=['POST'])
def get_performance_data_route():
    invoice_id = request.json['invoice_id']
    performance_data = get_performance_data(invoice_id)
    if performance_data:
        return jsonify(performance_data)
    else:
        return jsonify({'error': 'No performance data found for the given invoice_id.'}), 404
