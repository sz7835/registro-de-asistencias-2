from flask import Blueprint, request, jsonify
from sqlalchemy import text
from app.models import db

main = Blueprint('main', __name__)

# ✅ Test route
@main.route('/ping')
def ping():
    return jsonify({"message": "pong"})


# ✅ POST /actividades/create — Insert validated attendance record
@main.route('/actividades/create', methods=['POST'])
def create_registro():
    data = request.get_json()

    numero_documento = data.get('numero_documento')
    id_tipo_actividad = data.get('id_tipo_actividad')

    # 1. Check for required fields
    if not numero_documento or not id_tipo_actividad:
        return jsonify({"error": "Faltan campos obligatorios"}), 400

    try:
        # 2. Validate activity ID exists
        query_check_tipo = text("""
            SELECT COUNT(*) FROM out_tipo_actividad 
            WHERE id = :id
        """)
        result = db.session.execute(query_check_tipo, {"id": id_tipo_actividad}).scalar()
        if result == 0:
            return jsonify({"error": "Tipo de actividad no existe"}), 404

        # 3. Prevent duplicate registration
        query_check_duplicate = text("""
            SELECT COUNT(*) FROM out_registro_actividad 
            WHERE numero_documento = :num_doc 
              AND id_tipo_actividad = :id_tipo
        """)
        duplicate = db.session.execute(query_check_duplicate, {
            "num_doc": numero_documento,
            "id_tipo": id_tipo_actividad
        }).scalar()
        if duplicate > 0:
            return jsonify({"error": "Ya registrado en esta actividad"}), 409

        # 4. Insert record
        insert_query = text("""
            INSERT INTO out_registro_actividad (numero_documento, id_tipo_actividad) 
            VALUES (:num_doc, :id_tipo)
        """)
        db.session.execute(insert_query, {
            "num_doc": numero_documento,
            "id_tipo": id_tipo_actividad
        })
        db.session.commit()

        return jsonify({"message": "Registro exitoso"}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({
            "error": "Error interno del servidor",
            "detail": str(e)
        }), 500


# ✅ GET /actividades/tipoActividad — List available activity types
@main.route('/actividades/tipoActividad', methods=['GET'])
def get_tipos_actividad():
    try:
        query = text("SELECT id, nombre FROM out_tipo_actividad")
        result = db.session.execute(query).fetchall()

        actividades = [
            {"id": row[0], "nombre": row[1]}
            for row in result
        ]

        return jsonify(actividades), 200

    except Exception as e:
        return jsonify({
            "error": "Error al obtener tipos de actividad",
            "detail": str(e)
        }), 500
