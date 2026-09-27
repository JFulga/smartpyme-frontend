import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { iniciarSesion } from "../services/authService";

function Login() {

  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const manejarLogin = async (e) => {
    e.preventDefault();

    try {
      const datos = await iniciarSesion(username, password);

      localStorage.setItem("token", datos.token);

      console.log("RESPUESTA DEL LOGIN:", datos);

      navigate("/dashboard");

    } catch (error) {
      console.error("ERROR EN LOGIN:", error);
    }
  };

  return (
    <div>
      <h1>Iniciar sesión</h1>

      <form onSubmit={manejarLogin}>

        <div>
          <label>Usuario</label>

          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div>
          <label>Contraseña</label>

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button type="submit">
          Iniciar sesión
        </button>

      </form>
    </div>
  );
}

export default Login;