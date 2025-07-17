import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";

function App() {
  const [idPersona, setIdPersona] = useState("");
  const [idTipoActividad, setIdTipoActividad] = useState("");
  const [actividades, setActividades] = useState([]);
  const [registros, setRegistros] = useState([]);
  const [mensaje, setMensaje] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    axios
      .get("http://localhost:5000/actividades/tipoActividad")
      .then((res) => {
        setActividades(res.data);
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsRegistering(true);
    setMensaje("");

    try {
      await axios.post("http://localhost:5000/actividades/create", {
        id_tipo_actividad: Number(idTipoActividad),
        id_persona: Number(idPersona),
      });
      setMensaje("✅ Registro exitoso");
    } catch (err) {
      if (err.response?.status === 409) {
        setMensaje("⚠️ Ya registrado en esta actividad");
      } else {
        setMensaje("❌ Error al registrar");
      }
    } finally {
      setIsRegistering(false);
    }
  };

  const handleSearch = async () => {
    if (!idPersona) {
      setMensaje("⚠️ Por favor ingrese un ID de persona");
      return;
    }

    setIsSearching(true);
    setMensaje("");
    try {
      const res = await axios.get("http://localhost:5000/actividades/filter", {
        params: { id_persona: idPersona },
      });
      setRegistros(res.data);
    } catch {
      setMensaje("❌ Error al buscar registros");
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Registro de Asistencia</h1>
      <form onSubmit={handleSubmit}>
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
            {actividades.map((a) => (
              <option key={a.id} value={a.id}>
                {a.nombre}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" className="btn btn-primary me-2" disabled={isRegistering}>
          {isRegistering ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" />
              Registrando...
            </>
          ) : (
            "Registrar"
          )}
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={handleSearch}
          disabled={isSearching}
        >
          {isSearching ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" />
              Buscando...
            </>
          ) : (
            "Buscar"
          )}
        </button>
      </form>

      {mensaje && (
        <div className="alert alert-info mt-4 text-center" role="alert">
          {mensaje}
        </div>
      )}

      {registros.length > 0 && (
        <table className="table table-bordered mt-4">
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
