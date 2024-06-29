from dotenv import load_dotenv
import os

load_dotenv()

INVOICE_LANG = "slk"
BACKEND_URL = "http://localhost:5000"


class ApplicationConfig:
    SECRET_KEY = os.environ["SECRET_KEY"]
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ECHO = True
    SQLALCHEMY_DATABASE_URI = os.environ["SQLALCHEMY_DATABASE_URI"]
    SESSION_TYPE = "sqlalchemy"
    SESSION_PERMEMNAT = True
