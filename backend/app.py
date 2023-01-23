from flask import Flask, Blueprint
from flask_cors import CORS, cross_origin
from preprocessing import preprocessing_bp

app = Flask(__name__)
app.register_blueprint(preprocessing_bp)
cors = CORS(app, resources={r"/grayscale": {"origins": "http://localhost:3000"}})
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

@app.route("/hello")
def hello():
    return "Hello, World!"