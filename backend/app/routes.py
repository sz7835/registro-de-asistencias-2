from flask import Blueprint, jsonify
from .models import OUT_TipoActividad

main = Blueprint('main', __name__)

@main.route('/ping', methods=['GET'])
def ping():
    return jsonify({'message': 'pong'})

@main.route('/actividades/tipoActividad', methods=['GET'])
def get_tipo_actividad():
    try:
        tipos = OUT_TipoActividad.query.all()
        result = [t.to_dict() for t in tipos]
        return jsonify(result)
    except Exception as e:
        return jsonify({'error': str(e)}), 500
