import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [idPersona, setIdPersona] = useState("");
  const [tipoActividad, setTipoActividad] = useState("");
  const [tiposActividad, setTiposActividad] = useState([]);
  const [mensaje, setMensaje] = useState("");
  const [mensajeColor, setMensajeColor] = useState("info");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios
      .get("http://localhost:5000/actividades/tipoActividad")
      .then((response) => {
        setTiposActividad(response.data);
      })
      .catch((error) => {
        console.error("Error al obtener tipos de actividad:", error);
      });
  }, []);

  const handleSubmit = async () => {
    if (!idPersona || !tipoActividad) {
      setMensaje("Por favor completa todos los campos.");
      setMensajeColor("danger");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:5000/actividades/create",
        {
          id_tipo_actividad: parseInt(tipoActividad),
          id_persona: parseInt(idPersona),
        }
      );
      setMensaje("✅ Registro exitoso.");
      setMensajeColor("success");
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.error === "Ya registrado en esta actividad"
      ) {
        setMensaje("⚠️ Ya registrado en esta actividad");
        setMensajeColor("info");
      } else {
        setMensaje("❌ Error al registrar actividad");
        setMensajeColor("danger");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBuscar = () => {
    // Placeholder: implement later if needed
    setMensaje("🔍 Buscar función aún no implementada");
    setMensajeColor("secondary");
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Registro de Asistencia</h1>

      <div className="mb-3">
        <label htmlFor="idPersona" className="form-label">
          ID Persona
        </label>
        <input
          type="number"
          className="form-control"
          id="idPersona"
          value={idPersona}
          onChange={(e) => setIdPersona(e.target.value)}
          disabled={loading}
        />
      </div>

      <div className="mb-3">
        <label htmlFor="tipoActividad" className="form-label">
          Tipo de Actividad
        </label>
        <select
          className="form-select"
          id="tipoActividad"
          value={tipoActividad}
          onChange={(e) => setTipoActividad(e.target.value)}
          disabled={loading}
        >
          <option value="">Seleccionar una actividad</option>
          {tiposActividad.map((actividad) => (
            <option key={actividad.id} value={actividad.id}>
              {actividad.nombre}
            </option>
          ))}
        </select>
      </div>

      <div className="d-flex gap-2 mb-4">
        <button
          className="btn btn-primary"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Registrando..." : "Registrar"}
        </button>

        <button
          className="btn btn-secondary"
          onClick={handleBuscar}
          disabled={loading}
        >
          Buscar
        </button>
      </div>

      {mensaje && (
        <div className={`alert alert-${mensajeColor}`} role="alert">
          {mensaje}
        </div>
      )}
    </div>
  );
}

export default App;
