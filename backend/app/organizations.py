from flask import Blueprint, request, jsonify, session
from app.models import db, Organization, User

organizations_bp = Blueprint('organizations', __name__)


@organizations_bp.route('/create_organization', methods=['POST'])
def create_organization():
    user_id = session.get("user_id")

    if not user_id:
        return jsonify({"error": "User not logged in."}), 401

    name = request.json['name']
    description = request.json['description']

    if not name:
        return jsonify({"error": "Name is required."}), 400

    user = User.query.filter_by(id=user_id).first()

    if not user:
        return jsonify({"error": "User not found."}), 404

    organization = Organization(name=name, description=description)
    organization.users.append(user)

    db.session.add(organization)
    db.session.commit()

    return jsonify({"message": "Organization created successfully!"}), 201


@organizations_bp.route('/join_organization', methods=['POST'])
def join_organization():
    user_id = session.get("user_id")

    if not user_id:
        return jsonify({"error": "User not logged in."}), 401

    invite_code = request.json.get("code")

    organization = Organization.query.filter_by(
        invite_code=invite_code).first()
    if organization:
        user = User.query.get(user_id)
        user.organizations.append(organization)
        db.session.commit()
        return jsonify({"message": "Organization joined successfully!"}), 201
    else:
        return jsonify({"message": "Invalid invite code"}), 400
    

@organizations_bp.route('/activate-organization', methods=['POST'])
def activate_organization():
    user_id = session.get("user_id")
    organization_id = request.json['organization_id']

    if not user_id:
        return jsonify({"error": "User not logged in."}), 401

    user = User.query.get(user_id)
    user.active_organization_id = organization_id

    return jsonify({"message": "Organization activated successfully!"}), 201



@organizations_bp.route('/deactivate-organization', methods=['POST'])
def deactivate_organization():
    user_id = session.get("user_id")
    organization_id = request.json['organization_id']

    if not user_id:
        return jsonify({"error": "User not logged in."}), 401

    user = User.query.get(user_id)
    user.active_organization_id = None

    return jsonify({"message": "Organization deactivated successfully!"}), 201