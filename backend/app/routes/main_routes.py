from flask import Blueprint, jsonify, session, request
from app.services.main_service import (
    get_current_user_service, edit_role_service, update_user_service,
    delete_invoice_service, update_invoice_service
)

main_bp = Blueprint('main', __name__)


@main_bp.route("/@me")
def get_current_user():
    user_id = session.get("user_id")
    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401

    user = get_current_user_service(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    return jsonify(user)


@main_bp.route("/edit-role", methods=["POST"])
def edit_role():
    role = request.json["role"]
    user_id = request.json["user_id"]

    edit_role_service(user_id, role)
    return jsonify({"success": True}), 200


@main_bp.route("/update-user", methods=["POST"])
def update_user():
    user_id = session.get("user_id")
    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401

    name = request.json["name"]
    email = request.json["email"]
    update_user_service(user_id, name, email)

    return jsonify({"success": True}), 200


@main_bp.route('/delete-invoice', methods=['DELETE'])
def delete_invoice():
    invoice_id = request.args.get('id', type=int)
    if not invoice_id:
        return jsonify({"error": "ID parameter is missing"}), 400

    deleted_invoice_id = delete_invoice_service(invoice_id)
    if not deleted_invoice_id:
        return jsonify({"error": "Invoice not found"}), 404

    return jsonify({"message": f"Invoice {invoice_id} has been deleted"}), 200


@main_bp.route('/update-invoice', methods=['POST'])
def update_invoice():
    new_data = request.json["new_data"]
    invoice_id = new_data["id"]
    if not invoice_id:
        return jsonify({"error": "ID parameter is missing"}), 400

    updated_invoice_id = update_invoice_service(new_data)
    if not updated_invoice_id:
        return jsonify({"error": "Invoice not found"}), 404

    return jsonify({"message": "Invoice has been updated"}), 200
