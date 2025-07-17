import React, { useEffect, useState } from 'react'
import axios from 'axios'

function App() {
  const [idPersona, setIdPersona] = useState('')
  const [idTipoActividad, setIdTipoActividad] = useState('')
  const [actividades, setActividades] = useState([])
  const [message, setMessage] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    axios.get('http://127.0.0.1:5000/actividades/tipoActividad')
      .then(res => {
        setActividades(res.data)
      })
      .catch(() => {
        setError('No se pudo cargar las actividades')
      })
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage(null)
    setError(null)

    try {
      const res = await axios.post('http://127.0.0.1:5000/actividades/create', {
        id_persona: parseInt(idPersona),
        id_tipo_actividad: parseInt(idTipoActividad)
      })

      setMessage(res.data.message)
      setIdPersona('')
      setIdTipoActividad('')
    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error)
      } else {
        setError('Error desconocido')
      }
    }
  }

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Registro de Asistencia</h2>

      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="id_persona" className="form-label">ID Persona</label>
          <input
            type="number"
            className="form-control"
            id="id_persona"
            value={idPersona}
            onChange={(e) => setIdPersona(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="id_tipo_actividad" className="form-label">Tipo de Actividad</label>
          <select
            className="form-select"
            id="id_tipo_actividad"
            value={idTipoActividad}
            onChange={(e) => setIdTipoActividad(e.target.value)}
            required
          >
            <option value="">Seleccionar una actividad</option>
            {actividades.map(act => (
              <option key={act.id} value={act.id}>
                {act.nombre}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" className="btn btn-primary">Registrar</button>
      </form>
    </div>
  )
}

export default App
