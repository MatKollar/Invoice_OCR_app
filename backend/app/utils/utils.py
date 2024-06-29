import io
import base64
import cv2
import numpy as np
from flask import request
from uuid import uuid4
from PIL import Image


def get_uuid():
    return uuid4().hex


def convert_to_base64(img):
    img = Image.fromarray(img.astype("uint8"))
    raw_bytes = io.BytesIO()
    img.save(raw_bytes, "JPEG")
    raw_bytes.seek(0)
    img_base64 = base64.b64encode(raw_bytes.read())
    return str(img_base64)


def load_image():
    file = request.files['file'].read()
    npimg = np.fromstring(file, np.uint8)
    img = cv2.imdecode(npimg, cv2.IMREAD_COLOR)
    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    return img


def get_files_from_request():
    pdf_file = request.files['pdf'].read(
    ) if request.files.get('pdf') else None
    image_file = request.files['image'].read(
    ) if request.files.get('image') else None
    return pdf_file, image_file
