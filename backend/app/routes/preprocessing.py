from flask import Blueprint, request, jsonify
from app.services.preprocessing_service import (
    apply_grayscale, apply_binarization, apply_noise_reduction,
    apply_skew_correction, apply_remove_barcodes
)

preprocessing_bp = Blueprint('preprocessing', __name__)


def process_image(transformation_function):
    try:
        transformed_img = transformation_function()
        return jsonify({
            'image': transformed_img,
            'filename': request.files['file'].filename
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@preprocessing_bp.route('/grayscale', methods=['POST'])
def grayscale():
    return process_image(apply_grayscale)


@preprocessing_bp.route('/binarization', methods=['POST'])
def binarization():
    return process_image(apply_binarization)


@preprocessing_bp.route('/noise_reduction', methods=['POST'])
def noise_reduction():
    return process_image(apply_noise_reduction)


@preprocessing_bp.route('/skew_correction', methods=['POST'])
def skew_correction():
    return process_image(apply_skew_correction)


@preprocessing_bp.route('/remove_barcodes', methods=['POST'])
def remove_barcodes():
    return process_image(apply_remove_barcodes)
