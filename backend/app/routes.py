from flask import Blueprint, request, jsonify
from .models import db, TipoActividad, RegistroActividad

main = Blueprint('main', __name__)

# 🩺 Health check
@main.route('/ping', methods=['GET'])
def ping():
    return jsonify({"message": "pong"})

# 📄 GET: List all tipos de actividad
@main.route('/actividades/tipoActividad', methods=['GET'])
def get_tipo_actividad():
    tipos = TipoActividad.query.all()
    return jsonify([
        {
            "id": tipo.id_tipo_actividad,
            "nombre": tipo.nombre_tipo_actividad
        } for tipo in tipos
    ])

# 📝 POST: Register an actividad for a person (if not already registered)
@main.route('/actividades/create', methods=['POST'])
def create_actividad():
    data = request.get_json()
    id_tipo = data.get('id_tipo_actividad')
    id_persona = data.get('id_persona')

    if not id_tipo or not id_persona:
        return jsonify({"error": "Faltan campos obligatorios"}), 400

    # Check for duplicate
    existing = RegistroActividad.query.filter_by(
        id_tipo_actividad=id_tipo,
        id_persona=id_persona
    ).first()

    if existing:
        return jsonify({"error": "Ya se ha registrado esta actividad anteriormente."}), 409

    nuevo = RegistroActividad(
        id_tipo_actividad=id_tipo,
        id_persona=id_persona
    )
    db.session.add(nuevo)
    db.session.commit()

    return jsonify({"message": "Registro exitoso"}), 201

# 🔍 GET: Filter registros by id_persona
@main.route('/actividades/filter', methods=['GET'])
def filter_actividades():
    id_persona = request.args.get('id_persona')

    if not id_persona:
        return jsonify({"error": "Se requiere el parámetro id_persona"}), 400

    registros = RegistroActividad.query.filter_by(id_persona=id_persona).all()

    return jsonify([
        {
            "id_tipo_actividad": r.id_tipo_actividad,
            "id_persona": r.id_persona
        } for r in registros
    ])
