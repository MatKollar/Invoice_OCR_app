from flask import Blueprint, request, jsonify
import cv2

preprocessing_bp = Blueprint('grayscale', __name__)

@preprocessing_bp.route('/grayscale', methods=['POST'])
def grayscale():
    image = request.files.get('image').read()
    image = np.fromstring(image, np.uint8)
    image = cv2.imdecode(image, cv2.IMREAD_COLOR)
    image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    image = cv2.imencode('.jpg', image)
    print("ahoj")
    response = jsonify({"image": encoded_string.decode("utf-8")})
    response.headers.add('Access-Control-Allow-Origin', 'http://localhost:3000')
    return response
