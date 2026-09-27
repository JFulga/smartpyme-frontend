import { useNavigate } from "react-router-dom"

function Navbar({ nombre }) {
  const navigate = useNavigate()

  const cerrarSesion = () => {
    localStorage.removeItem("token")
    navigate("/login")
  }

  return (
    <nav>
      <h2>{nombre}</h2>

      <button onClick={cerrarSesion}>
        Cerrar sesión
      </button>
    </nav>
  )
}

export default Navbar