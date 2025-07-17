from flask import Blueprint, request, jsonify
from sqlalchemy import text
from app.models import db

main = Blueprint('main', __name__)

# ✅ Ping route
@main.route('/ping')
def ping():
    return jsonify({"message": "pong"})


# ✅ POST /actividades/create — Insert a validated record
@main.route('/actividades/create', methods=['POST'])
def create_registro():
    data = request.get_json()

    id_persona = data.get('id_persona')
    id_tipo_actividad = data.get('id_tipo_actividad')

    if id_persona is None or id_tipo_actividad is None:
        return jsonify({"error": "Faltan campos obligatorios"}), 400

    try:
        # 1. Validate that the activity type exists
        query_check_tipo = text("SELECT COUNT(*) FROM out_tipo_actividad WHERE id = :id")
        result = db.session.execute(query_check_tipo, {"id": id_tipo_actividad}).scalar()
        if result == 0:
            return jsonify({"error": "Tipo de actividad no existe"}), 404

        # 2. Check for duplicate registration
        query_check_duplicate = text("""
            SELECT COUNT(*) FROM out_registro_actividad 
            WHERE id_persona = :id_persona AND id_tipo_actividad = :id_tipo
        """)
        duplicate = db.session.execute(query_check_duplicate, {
            "id_persona": id_persona,
            "id_tipo": id_tipo_actividad
        }).scalar()
        if duplicate > 0:
            return jsonify({"error": "Ya registrado en esta actividad"}), 409

        # 3. Insert record
        insert_query = text("""
            INSERT INTO out_registro_actividad (id_persona, id_tipo_actividad, id_usuario, fecha_hora, id_tipo_registro)
            VALUES (:id_persona, :id_tipo, 1, NOW(), 1)
        """)
        db.session.execute(insert_query, {
            "id_persona": id_persona,
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


# ✅ GET /actividades/tipoActividad — List all available activity types
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


# ✅ NEW: GET /actividades/filter — Filter registros optionally by id_persona or id_tipo_actividad
@main.route('/actividades/filter', methods=['GET'])
def filter_registros():
    try:
        id_persona = request.args.get('id_persona')
        id_tipo_actividad = request.args.get('id_tipo_actividad')

        # Build SQL dynamically
        query = """
            SELECT r.id, r.id_persona, a.nombre AS actividad, r.fecha_hora
            FROM out_registro_actividad r
            JOIN out_tipo_actividad a ON r.id_tipo_actividad = a.id
            WHERE 1 = 1
        """
        params = {}

        if id_persona:
            query += " AND r.id_persona = :id_persona"
            params['id_persona'] = id_persona

        if id_tipo_actividad:
            query += " AND r.id_tipo_actividad = :id_tipo_actividad"
            params['id_tipo_actividad'] = id_tipo_actividad

        query += " ORDER BY r.fecha_hora DESC"

        result = db.session.execute(text(query), params).fetchall()

        registros = [
            {
                "id": row[0],
                "id_persona": row[1],
                "actividad": row[2],
                "fecha_hora": row[3].strftime("%Y-%m-%d %H:%M:%S")
            }
            for row in result
        ]

        return jsonify(registros), 200

    except Exception as e:
        return jsonify({
            "error": "Error al filtrar registros",
            "detail": str(e)
        }), 500
