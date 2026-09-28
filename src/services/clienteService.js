import API_URL from "./api";

const obtenerToken = () => {
  return localStorage.getItem("token");
};

export const obtenerClientes = async () => {
  const respuesta = await fetch(`${API_URL}/api/clientes`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${obtenerToken()}`,
    },
  });

  if (!respuesta.ok) {
    throw new Error("Error al obtener clientes");
  }

  return await respuesta.json();
};

export const crearCliente = async (cliente) => {
  const respuesta = await fetch(`${API_URL}/api/clientes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${obtenerToken()}`,
    },
    body: JSON.stringify(cliente),
  });

  if (!respuesta.ok) {
    throw new Error("Error al crear cliente");
  }

  return await respuesta.json();
};

export const actualizarCliente = async (id, cliente) => {
  const respuesta = await fetch(`${API_URL}/api/clientes/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${obtenerToken()}`,
    },
    body: JSON.stringify(cliente),
  });

  if (!respuesta.ok) {
    throw new Error("Error al actualizar cliente");
  }

  return await respuesta.json();
};

export const eliminarCliente = async (id) => {
  const respuesta = await fetch(`${API_URL}/api/clientes/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${obtenerToken()}`,
    },
  });

  if (!respuesta.ok) {
    throw new Error("Error al eliminar cliente");
  }
};