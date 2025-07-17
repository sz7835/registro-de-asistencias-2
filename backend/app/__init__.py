from flask import Flask
from flask_cors import CORS
from app.models import db
from app.routes import main as main_blueprint
import os
from dotenv import load_dotenv

load_dotenv()

def create_app():
    app = Flask(__name__)
    CORS(app)

    # ✅ Use remote MySQL from .env
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv("DATABASE_URL")
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    db.init_app(app)
    app.register_blueprint(main_blueprint)

    return app
