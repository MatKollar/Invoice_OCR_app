from flask import Blueprint, request, jsonify
from PIL import Image
import io 
import numpy as np
import cv2
import base64

preprocessing = Blueprint('grayscale', __name__)


def load_image():
    file = request.files['file'].read()
    npimg = np.fromstring(file, np.uint8)
    img = cv2.imdecode(npimg,cv2.IMREAD_COLOR)
    img = cv2.cvtColor(img , cv2.COLOR_BGR2RGB)
    return img


def convert_to_base64(img):
    img = Image.fromarray(img.astype("uint8"))
    raw_bytes = io.BytesIO()
    img.save(raw_bytes, "JPEG")
    raw_bytes.seek(0)
    img_base64 = base64.b64encode(raw_bytes.read())
    return str(img_base64)


@preprocessing.route('/grayscale', methods=['POST'])
def grayscale():
    img = load_image()
    gray = cv2.cvtColor(img, cv2.COLOR_RGB2GRAY)
    return jsonify({'status': convert_to_base64(gray)})


@preprocessing.route('/binarization', methods=['POST'])
def binarization():
    img = load_image()
    gray = cv2.cvtColor(img, cv2.COLOR_RGB2GRAY)
    ret,thresh = cv2.threshold(gray,127,255,cv2.THRESH_BINARY)
    return jsonify({'status':convert_to_base64(thresh)})


@preprocessing.route('/noise_reduction', methods=['POST'])
def noise_reduction():
    img = load_image()
    img = cv2.fastNlMeansDenoisingColored(img,None,10,10,7,21)
    return jsonify({'status':convert_to_base64(img)})


@preprocessing.route('/skew_correction', methods=['POST'])
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

    return jsonify({'status':convert_to_base64(img)})