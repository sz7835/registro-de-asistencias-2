from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

# 🟦 Tabla: out_tipo_actividad
class TipoActividad(db.Model):
    __tablename__ = 'out_tipo_actividad'

    id_tipo_actividad = db.Column(db.Integer, primary_key=True)
    nombre_tipo_actividad = db.Column(db.String(100), nullable=False)


# 🟨 Tabla: out_registro_actividad
class RegistroActividad(db.Model):
    __tablename__ = 'out_registro_actividad'

    id_registro = db.Column(db.Integer, primary_key=True, autoincrement=True)
    id_tipo_actividad = db.Column(db.Integer, nullable=False)
    id_persona = db.Column(db.Integer, nullable=False)
    fecha = db.Column(db.DateTime, nullable=False)  # Fecha y hora combinadas
    detalle = db.Column(db.String(255), nullable=False)
    create_user = db.Column(db.String(50), nullable=False)
    fecha_creacion = db.Column(db.DateTime, default=datetime.utcnow)


# 🟥 Tabla: sis_parametros (ej: MILISEGUNDOS_REGISTRO_ACTIVIDAD)
class ParametroSistema(db.Model):
    __tablename__ = 'sis_parametros'

    id_parametro = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(100), nullable=False)
    valor = db.Column(db.String(100), nullable=False)
