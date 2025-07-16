from flask import Flask
from flask_cors import CORS
from flask_migrate import Migrate
from .models import db
from .routes import main as main_blueprint

def create_app():
    app = Flask(__name__)
    CORS(app)

    # ✅ Conexión real a la base de datos remota (MySQL)
    app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://szavala:Szavala%401507@161.132.202.110:3306/freedb_registro'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    db.init_app(app)
    Migrate(app, db)
    app.register_blueprint(main_blueprint)

    return app
