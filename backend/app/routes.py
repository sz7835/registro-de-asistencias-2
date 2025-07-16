from flask import Blueprint, jsonify, request
from .models import db, OutTipoActividad, OutRegistroActividad
from datetime import datetime

main = Blueprint('main', __name__)

@main.route('/ping', methods=['GET'])
def ping():
    return jsonify({'message': 'pong'}), 200

@main.route('/actividades/tipoActividad', methods=['GET'])
def get_tipo_actividad():
    tipos = OutTipoActividad.query.all()
    data = [
        {
            'id': tipo.id,
            'descripcion': tipo.descripcion_tipo_actividad  # 🔧 This matches your model column
        }
        for tipo in tipos
    ]
    return jsonify(data), 200
