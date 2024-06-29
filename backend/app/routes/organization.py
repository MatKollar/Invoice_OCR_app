from flask import Blueprint, request, jsonify, session
from app.services.organization_service import (
    get_logged_in_user, create_organization_service, join_organization_service,
    activate_organization_service, deactivate_organization_service
)

organizations_bp = Blueprint('organizations', __name__)


def get_request_data(*args):
    return {arg: request.json.get(arg) for arg in args}


@organizations_bp.route('/create_organization', methods=['POST'])
def create_organization():
    user_id = session.get("user_id")
    user = get_logged_in_user(user_id)
    if not user:
        return jsonify({"error": "User not logged in."}), 401

    data = get_request_data('name', 'description')
    if not data['name']:
        return jsonify({"error": "Name is required."}), 400

    organization = create_organization_service(user, data['name'], data['description'])
    return jsonify({"message": "Organization created successfully!"}), 201


@organizations_bp.route('/join_organization', methods=['POST'])
def join_organization():
    user_id = session.get("user_id")
    user = get_logged_in_user(user_id)
    if not user:
        return jsonify({"error": "User not logged in."}), 401

    invite_code = get_request_data('code')['code']
    organization = join_organization_service(user, invite_code)
    if organization:
        return jsonify({"message": "Organization joined successfully!"}), 201
    else:
        return jsonify({"message": "Invalid invite code"}), 400


@organizations_bp.route('/activate-organization', methods=['POST'])
def activate_organization():
    user_id = session.get("user_id")
    user = get_logged_in_user(user_id)
    if not user:
        return jsonify({"error": "User not logged in."}), 401

    organization_id = get_request_data('organization_id')['organization_id']
    activate_organization_service(user, organization_id)
    return jsonify({"message": "Organization activated successfully!"}), 201


@organizations_bp.route('/deactivate-organization', methods=['POST'])
def deactivate_organization():
    user_id = session.get("user_id")
    user = get_logged_in_user(user_id)
    if not user:
        return jsonify({"error": "User not logged in."}), 401

    deactivate_organization_service(user)
    return jsonify({"message": "Organization deactivated successfully!"}), 201
