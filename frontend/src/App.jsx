import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [idPersona, setIdPersona] = useState('');
  const [idActividad, setIdActividad] = useState('');
  const [activityTypes, setActivityTypes] = useState([]);
  const [mensaje, setMensaje] = useState('');
  const [registros, setRegistros] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/actividades/tipoActividad')
      .then(response => setActivityTypes(response.data))
      .catch(error => console.error('Error al cargar actividades', error));
  }, []);

  const handleRegistrar = async () => {
    try {
      const res = await axios.post('http://localhost:5000/actividades/create', {
        id_persona: parseInt(idPersona),
        id_tipo_actividad: parseInt(idActividad),
        fecha: "2025-07-17",
        hora: "13:30",
        detalle: "",
        createUser: "szavala"
      });
      setMensaje(res.data.message || 'Registro exitoso');
    } catch (err) {
      if (err.response?.data?.error) {
        setMensaje(err.response.data.error);
      } else {
        setMensaje('Error inesperado');
      }
    }
  };

  const handleBuscar = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/actividades/filter?id_persona=${idPersona}`);
      setRegistros(res.data);
      setMensaje('');
    } catch (err) {
      setMensaje('Error al buscar registros');
      setRegistros([]);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Registro de Asistencia</h2>

      <div className="mb-3">
        <label className="form-label">ID Persona</label>
        <input
          type="number"
          className="form-control"
          value={idPersona}
          onChange={(e) => setIdPersona(e.target.value)}
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Tipo de Actividad</label>
        <select
          className="form-select"
          value={idActividad}
          onChange={(e) => setIdActividad(e.target.value)}
        >
          <option value="">Seleccionar una actividad</option>

          {/* ✅ Show only unique activity names */}
          {[...new Map(activityTypes.map(tipo => [tipo.nombre, tipo])).values()].map((tipo) => (
            <option key={tipo.id} value={tipo.id}>
              {tipo.nombre}
            </option>
          ))}
        </select>
      </div>

      <div className="d-flex gap-2 mb-4">
        <button className="btn btn-primary" onClick={handleRegistrar}>
          Registrar
        </button>
        <button className="btn btn-secondary" onClick={handleBuscar}>
          Buscar
        </button>
      </div>

      {mensaje && <div className="alert alert-info">{mensaje}</div>}

      {registros.length > 0 && (
        <table className="table table-bordered mt-4">
          <thead className="table-light">
            <tr>
              <th>ID Persona</th>
              <th>ID Tipo Actividad</th>
            </tr>
          </thead>
          <tbody>
            {registros.map((r, index) => (
              <tr key={index}>
                <td>{r.id_persona}</td>
                <td>{r.id_tipo_actividad}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default App;

