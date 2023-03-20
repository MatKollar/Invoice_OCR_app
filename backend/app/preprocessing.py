from flask import Blueprint, request, jsonify
from app.operations import load_image
from PIL import Image
import io
import numpy as np
import cv2
import base64
import imutils

preprocessing_bp = Blueprint('preprocessing', __name__)


def convert_to_base64(img):
    img = Image.fromarray(img.astype("uint8"))
    raw_bytes = io.BytesIO()
    img.save(raw_bytes, "JPEG")
    raw_bytes.seek(0)
    img_base64 = base64.b64encode(raw_bytes.read())
    return str(img_base64)


@preprocessing_bp.route('/grayscale', methods=['POST'])
def grayscale():
    img = load_image()
    gray = cv2.cvtColor(img, cv2.COLOR_RGB2GRAY)
    return jsonify({'image': convert_to_base64(gray), 'filename': request.files['file'].filename})


@preprocessing_bp.route('/binarization', methods=['POST'])
def binarization():
    img = load_image()
    gray = cv2.cvtColor(img, cv2.COLOR_RGB2GRAY)
    thresh_value, thresh = cv2.threshold(
        gray, 0, 255, cv2.THRESH_BINARY+cv2.THRESH_OTSU)
    return jsonify({'image': convert_to_base64(thresh), 'filename': request.files['file'].filename})


@preprocessing_bp.route('/noise_reduction', methods=['POST'])
def noise_reduction():
    img = load_image()
    img = cv2.fastNlMeansDenoisingColored(img, None, 10, 10, 7, 21)
    return jsonify({'image': convert_to_base64(img), 'filename': request.files['file'].filename})


@preprocessing_bp.route('/skew_correction', methods=['POST'])
def skew_correction():
    img = load_image()
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    gray = cv2.bitwise_not(gray)
    thresh = cv2.threshold(gray, 0, 255,
                           cv2.THRESH_BINARY | cv2.THRESH_OTSU)[1]
    coords = np.column_stack(np.where(thresh > 0))
    angle = cv2.minAreaRect(coords)[-1]
    if angle < -45:
        angle = -(90 + angle)
    elif angle > 45:
        angle = 90 - angle
    (h, w) = img.shape[:2]
    center = (w // 2, h // 2)
    M = cv2.getRotationMatrix2D(center, angle, 1.0)
    img = cv2.warpAffine(img, M, (w, h),
                         flags=cv2.INTER_CUBIC, borderMode=cv2.BORDER_REPLICATE)

    return jsonify({'image': convert_to_base64(img), 'filename': request.files['file'].filename})

@preprocessing_bp.route('/remove_barcodes', methods=['POST'])
def remove_barcodes():
    img = load_image()
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    ddepth = cv2.cv.CV_32F if imutils.is_cv2() else cv2.CV_32F
    gradX = cv2.Sobel(gray, ddepth=ddepth, dx=1, dy=0, ksize=-1)
    gradY = cv2.Sobel(gray, ddepth=ddepth, dx=0, dy=1, ksize=-1)

    gradient = cv2.subtract(gradX, gradY)
    gradient = cv2.convertScaleAbs(gradient)

    blurred = cv2.blur(gradient, (9, 9))
    (_, thresh) = cv2.threshold(blurred, 225, 255, cv2.THRESH_BINARY)

    kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (21, 7))
    closed = cv2.morphologyEx(thresh, cv2.MORPH_CLOSE, kernel)

    closed = cv2.erode(closed, None, iterations = 4)
    closed = cv2.dilate(closed, None, iterations = 4)

    cnts = cv2.findContours(closed.copy(), cv2.RETR_EXTERNAL,
        cv2.CHAIN_APPROX_SIMPLE)
    cnts = imutils.grab_contours(cnts)
    c = sorted(cnts, key = cv2.contourArea, reverse = True)[0]

    mask = np.zeros(img.shape[:2], dtype=np.uint8)
    cv2.drawContours(mask, [c], -1, 255, -1)
    mask = cv2.dilate(mask, None, iterations=10)

    img[mask == 255] = [255, 255, 255]

    return jsonify({'image': convert_to_base64(img), 'filename': request.files['file'].filename})
