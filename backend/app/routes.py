from flask import Blueprint, request, jsonify
from .models import db, TipoActividad, RegistroActividad, ParametroSistema
from sqlalchemy import desc, and_
from datetime import datetime, timedelta

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


# 📝 POST: Crear nueva actividad con validaciones avanzadas
@main.route('/actividades/create', methods=['POST'])
def create_actividad():
    data = request.get_json()

    id_tipo = data.get('id_tipo_actividad')
    id_persona = data.get('id_persona')
    fecha_str = data.get('fecha')        # 'yyyy-MM-dd'
    hora_str = data.get('hora')          # 'HH:mm'
    detalle = data.get('detalle', '').strip()
    create_user = data.get('createUser')

    # Validación de campos obligatorios
    if not all([id_tipo, id_persona, fecha_str, hora_str, create_user]):
        return jsonify({"error": "Faltan campos obligatorios"}), 400

    if not detalle:
        detalle = "Detalle no proporcionado"

    # Convertir fecha y hora a datetime
    try:
        fecha_hora_str = f"{fecha_str} {hora_str}"
        nueva_fecha_hora = datetime.strptime(fecha_hora_str, "%Y-%m-%d %H:%M")
    except ValueError:
        return jsonify({"error": "Formato inválido para fecha u hora"}), 400

    # Buscar el último registro de esa persona en esa fecha
    inicio_dia = datetime.strptime(fecha_str, "%Y-%m-%d")
    fin_dia = inicio_dia + timedelta(days=1)

    ultimo_registro = RegistroActividad.query.filter(
        and_(
            RegistroActividad.id_persona == id_persona,
            RegistroActividad.fecha >= inicio_dia,
            RegistroActividad.fecha < fin_dia
        )
    ).order_by(desc(RegistroActividad.fecha)).first()

    # Leer el parámetro de espera desde la tabla sis_parametros
    parametro = ParametroSistema.query.filter_by(nombre='MILISEGUNDOS_REGISTRO_ACTIVIDAD').first()
    min_millis = int(parametro.valor) if parametro else 0

    # Validación: No registrar mismo tipo de actividad seguido
    if ultimo_registro:
        if ultimo_registro.id_tipo_actividad == id_tipo:
            return jsonify({"error": "No se puede registrar el mismo tipo de actividad consecutivamente."}), 422

        diferencia = (nueva_fecha_hora - ultimo_registro.fecha).total_seconds() * 1000
        if diferencia < min_millis:
            return jsonify({"error": "Debe esperar más tiempo antes de registrar una nueva actividad."}), 422

    # Crear nuevo registro
    nuevo = RegistroActividad(
        id_tipo_actividad=id_tipo,
        id_persona=id_persona,
        fecha=nueva_fecha_hora,
        detalle=detalle,
        create_user=create_user,
        fecha_creacion=datetime.now()
    )

    db.session.add(nuevo)
    db.session.commit()

    return jsonify({
        "message": "Registro exitoso",
        "actividad": {
            "id_tipo_actividad": id_tipo,
            "id_persona": id_persona,
            "fecha": fecha_str,
            "hora": hora_str,
            "detalle": detalle
        }
    }), 200


# 🔍 GET: Filtrar registros por id_persona (básico por ahora)
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
