from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class TipoActividad(db.Model):
    __tablename__ = 'out_tipo_actividad'

    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(100), nullable=False)

    def __repr__(self):
        return f'<TipoActividad {self.nombre}>'
