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