import API_URL from "./api";

const obtenerToken = () => {
    return localStorage.getItem("token");
};

export const crearVenta = async (venta) => {
    const respuesta = await fetch(`${API_URL}/api/ventas`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${obtenerToken()}`,
        },
        body: JSON.stringify(venta),
    });

    if (!respuesta.ok) {
        const mensaje = await respuesta.text();
        throw new Error(mensaje || "Error al registrar la venta");
    }

    return await respuesta.json();
};

export const obtenerVentas = async () => {
    const respuesta = await fetch(`${API_URL}/api/ventas`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${obtenerToken()}`,
        },
    });

    if (!respuesta.ok) {
        throw new Error("Error al obtener ventas");
    }

    return await respuesta.json();
};