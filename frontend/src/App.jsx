import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

function App() {
  const [idPersona, setIdPersona] = useState("");
  const [idTipoActividad, setIdTipoActividad] = useState("");
  const [tiposActividad, setTiposActividad] = useState([]);
  const [registros, setRegistros] = useState([]);
  const [mensaje, setMensaje] = useState("");
  const [buscando, setBuscando] = useState(false);
  const [registrando, setRegistrando] = useState(false);

  // Cargar tipos de actividad al iniciar
  useEffect(() => {
    fetch("http://localhost:5000/actividades/tipoActividad")
      .then((response) => response.json())
      .then((data) => setTiposActividad(data));
  }, []);

  const registrar = async () => {
    if (!idPersona || !idTipoActividad) {
      setMensaje("Por favor completa todos los campos.");
      return;
    }

    setMensaje("");
    setRegistrando(true);

    try {
      const response = await fetch("http://localhost:5000/actividades/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_persona: parseInt(idPersona),
          id_tipo_actividad: parseInt(idTipoActividad),
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setMensaje("Registrado con éxito.");
      } else {
        setMensaje(data.error || "Error al registrar.");
      }
    } catch (error) {
      setMensaje("Error de red al registrar.");
    } finally {
      setRegistrando(false);
    }
  };

  const buscar = async () => {
    if (!idPersona) {
      setMensaje("Por favor ingresa el ID de persona.");
      return;
    }

    setMensaje("");
    setBuscando(true);

    try {
      const response = await fetch(
        `http://localhost:5000/actividades/filter?id_persona=${idPersona}`
      );
      const data = await response.json();

      if (response.ok) {
        setRegistros(data);
        if (data.length === 0) {
          setMensaje("No se encontraron registros.");
        }
      } else {
        setMensaje(data.error || "Error al buscar.");
      }
    } catch (error) {
      setMensaje("Error de red al buscar.");
    } finally {
      setBuscando(false);
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Registro de Asistencia</h1>

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
          value={idTipoActividad}
          onChange={(e) => setIdTipoActividad(e.target.value)}
        >
          <option value="">Seleccionar una actividad</option>
          {tiposActividad.map((tipo) => (
            <option key={tipo.id} value={tipo.id}>
              {tipo.nombre}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-3 d-flex gap-2">
        <button
          className="btn btn-primary"
          onClick={registrar}
          disabled={registrando}
        >
          {registrando ? "Registrando..." : "Registrar"}
        </button>
        <button
          className="btn btn-secondary"
          onClick={buscar}
          disabled={buscando}
        >
          {buscando ? "Buscando..." : "Buscar"}
        </button>
      </div>

      {mensaje && <div className="alert alert-info">{mensaje}</div>}

      {registros.length > 0 && (
        <table className="table mt-4">
          <thead>
            <tr>
              <th>ID Persona</th>
              <th>ID Tipo Actividad</th>
            </tr>
          </thead>
          <tbody>
            {registros.map((registro, index) => (
              <tr key={index}>
                <td>{registro.id_persona}</td>
                <td>{registro.id_tipo_actividad}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default App;
