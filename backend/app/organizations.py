from flask import Blueprint, request, jsonify, session
from app.models import db, Organization, User

organizations_bp = Blueprint('organizations', __name__)


def get_logged_in_user():
    user_id = session.get("user_id")

    if not user_id:
        return None

    return User.query.get(user_id)


def get_request_data(*args):
    return {arg: request.json.get(arg) for arg in args}


@organizations_bp.route('/create_organization', methods=['POST'])
def create_organization():
    user = get_logged_in_user()

    if not user:
        return jsonify({"error": "User not logged in."}), 401

    data = get_request_data('name', 'description')

    if not data['name']:
        return jsonify({"error": "Name is required."}), 400

    organization = Organization(
        name=data['name'], description=data['description'])
    organization.users.append(user)

    db.session.add(organization)
    db.session.commit()

    return jsonify({"message": "Organization created successfully!"}), 201


@organizations_bp.route('/join_organization', methods=['POST'])
def join_organization():
    user = get_logged_in_user()

    if not user:
        return jsonify({"error": "User not logged in."}), 401

    invite_code = get_request_data('code')['code']

    organization = Organization.query.filter_by(
        invite_code=invite_code).first()

    if organization:
        user.organizations.append(organization)
        db.session.commit()
        return jsonify({"message": "Organization joined successfully!"}), 201
    else:
        return jsonify({"message": "Invalid invite code"}), 400


@organizations_bp.route('/activate-organization', methods=['POST'])
def activate_organization():
    user = get_logged_in_user()

    if not user:
        return jsonify({"error": "User not logged in."}), 401

    user.active_organization_id = get_request_data('organization_id')[
        'organization_id']
    return jsonify({"message": "Organization activated successfully!"}), 201


@organizations_bp.route('/deactivate-organization', methods=['POST'])
def deactivate_organization():
    user = get_logged_in_user()

    if not user:
        return jsonify({"error": "User not logged in."}), 401

    user.active_organization_id = None
    return jsonify({"message": "Organization deactivated successfully!"}), 201
