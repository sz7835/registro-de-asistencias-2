import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [tiposActividad, setTiposActividad] = useState([]);
  const [formData, setFormData] = useState({
    idTipoAct: "",
    personaId: "",
    fecha: "",
    hora: "",
    detalle: "",
    createUser: "",
  });
  const [mensaje, setMensaje] = useState("");
  const [mensajeColor, setMensajeColor] = useState("info");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios
      .get("http://localhost:5000/actividades/tipoActividad")
      .then((res) => setTiposActividad(res.data))
      .catch((err) => console.error("Error al cargar actividades", err));
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");
    setMensajeColor("info");

    const {
      idTipoAct,
      personaId,
      fecha,
      hora,
      detalle,
      createUser,
    } = formData;

    if (!idTipoAct || !personaId || !fecha || !hora || !createUser) {
      setMensaje("⚠️ Todos los campos obligatorios deben ser completados.");
      setMensajeColor("warning");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:5000/actividades/create",
        {
          id_tipo_actividad: parseInt(idTipoAct),
          id_persona: parseInt(personaId),
          fecha,
          hora,
          detalle: detalle.trim() === "" ? "Detalle no proporcionado" : detalle,
          createUser,
        }
      );

      setMensaje("✅ Registro exitoso.");
      setMensajeColor("success");
    } catch (err) {
      if (
        err.response?.data?.error === "Ya registrado en esta actividad"
      ) {
        setMensaje("⚠️ Ya registrado en esta actividad.");
        setMensajeColor("info");
      } else if (
        err.response?.data?.error
      ) {
        setMensaje(`❌ ${err.response.data.error}`);
        setMensajeColor("danger");
      } else {
        setMensaje("❌ Error de red al registrar.");
        setMensajeColor("danger");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center">Formulario de Registro de Asistencia</h2>

      <form onSubmit={handleSubmit}>
        {/* ID Persona */}
        <div className="mb-3">
          <label className="form-label">ID de Persona *</label>
          <input
            type="number"
            className="form-control"
            name="personaId"
            value={formData.personaId}
            onChange={handleChange}
            disabled={loading}
          />
        </div>

        {/* Tipo de Actividad */}
        <div className="mb-3">
          <label className="form-label">Tipo de Actividad *</label>
          <select
            className="form-select"
            name="idTipoAct"
            value={formData.idTipoAct}
            onChange={handleChange}
            disabled={loading}
          >
            <option value="">Seleccionar</option>
            {tiposActividad.map((tipo) => (
              <option key={tipo.id} value={tipo.id}>
                {tipo.nombre}
              </option>
            ))}
          </select>
        </div>

        {/* Fecha */}
        <div className="mb-3">
          <label className="form-label">Fecha *</label>
          <input
            type="date"
            className="form-control"
            name="fecha"
            value={formData.fecha}
            onChange={handleChange}
            disabled={loading}
          />
        </div>

        {/* Hora */}
        <div className="mb-3">
          <label className="form-label">Hora *</label>
          <input
            type="time"
            className="form-control"
            name="hora"
            value={formData.hora}
            onChange={handleChange}
            disabled={loading}
          />
        </div>

        {/* Detalle */}
        <div className="mb-3">
          <label className="form-label">Detalle (opcional)</label>
          <textarea
            className="form-control"
            name="detalle"
            rows="2"
            value={formData.detalle}
            onChange={handleChange}
            disabled={loading}
          />
        </div>

        {/* Usuario Creador */}
        <div className="mb-3">
          <label className="form-label">Usuario que registra *</label>
          <input
            type="text"
            className="form-control"
            name="createUser"
            value={formData.createUser}
            onChange={handleChange}
            disabled={loading}
          />
        </div>

        {/* Botón */}
        <div className="d-grid">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                />
                Registrando...
              </>
            ) : (
              "Registrar Actividad"
            )}
          </button>
        </div>
      </form>

      {/* Mensaje */}
      {mensaje && (
        <div className={`alert alert-${mensajeColor} mt-4`} role="alert">
          {mensaje}
        </div>
      )}
    </div>
  );
}

export default App;
