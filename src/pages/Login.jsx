import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { iniciarSesion } from "../services/authService"
import "./Login.css"

function Login() {
  const navigate = useNavigate()

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [cargando, setCargando] = useState(false)

  const manejarLogin = async (e) => {
    e.preventDefault()

    setError("")

    if (!username || !password) {
      setError("Ingresa tu usuario y contraseña")
      return
    }

    try {
      setCargando(true)

      const datos = await iniciarSesion(username, password)

      localStorage.setItem("token", datos.token)

      navigate("/dashboard")
    } catch (error) {
      setError("Usuario o contraseña incorrectos")
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">

        <h1 className="login-title">
          SmartPyme
        </h1>

        <p className="login-subtitle">
          Inicia sesión para continuar
        </p>

        <form className="login-form" onSubmit={manejarLogin}>

          <div className="login-field">
            <label htmlFor="username">
              Usuario
            </label>

            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={cargando}
            />
          </div>

          <div className="login-field">
            <label htmlFor="password">
              Contraseña
            </label>

            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={cargando}
            />
          </div>

          {error && (
            <div className="login-error">
              {error}
            </div>
          )}

          <button
            className="login-button"
            type="submit"
            disabled={cargando}
          >
            {cargando ? "Iniciando sesión..." : "Iniciar sesión"}
          </button>

        </form>

      </div>
    </div>
  )
}

export default Login