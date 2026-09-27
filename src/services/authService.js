import API_URL from "./api";

export const iniciarSesion = async (username, password) => {
  const respuesta = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
      password,
    }),
  });

  if (!respuesta.ok) {
    throw new Error("Usuario o contraseña incorrectos");
  }

  return await respuesta.json();
};