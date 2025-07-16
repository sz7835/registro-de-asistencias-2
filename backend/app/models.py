from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class OUT_TipoActividad(db.Model):
    __tablename__ = 'out_tipo_actividad'
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(100), nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'nombre': self.nombre
        }
