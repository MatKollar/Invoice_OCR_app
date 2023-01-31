from flask import Blueprint, request, jsonify, Response
from PIL import Image
import os , io , sys
import numpy as np
import cv2
import base64

preprocessing = Blueprint('grayscale', __name__)

@preprocessing.route('/grayscale', methods=['POST'])
def grayscale():
    file = request.files['file'].read()
    npimg = np.fromstring(file, np.uint8)
    img = cv2.imdecode(npimg,cv2.IMREAD_COLOR)
    
    gray = cv2.cvtColor(img, cv2.COLOR_RGB2GRAY)
    
    img = Image.fromarray(gray.astype("uint8"))
    rawBytes = io.BytesIO()
    img.save(rawBytes, "JPEG")
    rawBytes.seek(0)
    img_base64 = base64.b64encode(rawBytes.read())
    return jsonify({'status':str(img_base64)})