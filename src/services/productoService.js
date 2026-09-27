import API_URL from "./api";

const obtenerToken = () => localStorage.getItem("token");

export const obtenerProductos = async () => {
  const respuesta = await fetch(`${API_URL}/api/productos`, {
    headers: {
      Authorization: `Bearer ${obtenerToken()}`,
    },
  });

  if (!respuesta.ok) {
    throw new Error("Error al obtener los productos");
  }

  return await respuesta.json();
};

export const obtenerProductosInactivos = async () => {
  const respuesta = await fetch(`${API_URL}/api/productos/inactivos`, {
    headers: {
      Authorization: `Bearer ${obtenerToken()}`,
    },
  });

  if (!respuesta.ok) {
    throw new Error("Error al obtener los productos inactivos");
  }

  return await respuesta.json();
};

export const crearProducto = async (producto) => {
  const respuesta = await fetch(`${API_URL}/api/productos`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${obtenerToken()}`,
    },
    body: JSON.stringify(producto),
  });

  if (!respuesta.ok) {
    throw new Error("Error al crear el producto");
  }

  return await respuesta.json();
};

export const actualizarProducto = async (id, producto) => {
  const respuesta = await fetch(`${API_URL}/api/productos/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${obtenerToken()}`,
    },
    body: JSON.stringify(producto),
  });

  if (!respuesta.ok) {
    throw new Error("Error al actualizar el producto");
  }

  return await respuesta.json();
};

export const desactivarProducto = async (id) => {
  const respuesta = await fetch(`${API_URL}/api/productos/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${obtenerToken()}`,
    },
  });

  if (!respuesta.ok) {
    throw new Error("Error al desactivar el producto");
  }

  return await respuesta.text();
};

export const activarProducto = async (id) => {
  const respuesta = await fetch(`${API_URL}/api/productos/restaurar/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${obtenerToken()}`,
    },
  });

  if (!respuesta.ok) {
    throw new Error("Error al activar el producto");
  }

  return await respuesta.text();
};