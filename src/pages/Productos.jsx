import { useState, useEffect } from "react"
import {
  obtenerProductos,
  obtenerProductosInactivos,
  crearProducto,
  actualizarProducto,
  desactivarProducto as desactivarProductoAPI,
  activarProducto as activarProductoAPI,
} from "../services/productoService"
import "./Productos.css"


function Productos() {
  const [productos, setProductos] = useState([
    {
      id: 1,
      codigo: "P001",
      nombre: "Coca-Cola 400ml",
      precioVenta: 3000,
      stock: 25,
      stockMinimo: 5,
      activo: true,
    },
    {
      id: 2,
      codigo: "P002",
      nombre: "Pan",
      precioVenta: 2000,
      stock: 8,
      stockMinimo: 5,
      activo: true,
    },
    {
      id: 3,
      codigo: "P003",
      nombre: "Leche",
      precioVenta: 4500,
      stock: 0,
      stockMinimo: 5,
      activo: true,
    },
  ])

  const [productosInactivos, setProductosInactivos] = useState([])

  const [busqueda, setBusqueda] = useState("")
  const [filtroEstado, setFiltroEstado] = useState("todos")
  const [mostrarModal, setMostrarModal] = useState(false)
  const [productoEditando, setProductoEditando] = useState(null)

  const [formulario, setFormulario] = useState({
    codigo: "",
    nombre: "",
    precioVenta: "",
    stock: "",
    stockMinimo: "",
  })

useEffect(() => {

  console.log("🔥 PRODUCTOS.JSX SE EJECUTÓ");

  obtenerProductos()
    .then((datos) => {

      console.log("PRODUCTOS DEL BACKEND:", datos);

      setProductos(datos);

    })
    .catch((error) => {

      console.error("Error al cargar productos:", error);

    });

  obtenerProductosInactivos()
    .then((datos) => {

      console.log("PRODUCTOS INACTIVOS DEL BACKEND:", datos);

      setProductosInactivos(datos);

    })
    .catch((error) => {

      console.error("Error al cargar productos inactivos:", error);

    });

}, []);

  const obtenerEstadoStock = (producto) => {
    if (!producto.activo) {
      return "Inactivo"
    }

    if (producto.stock === 0) {
      return "Agotado"
    }

    if (producto.stock <= producto.stockMinimo) {
      return "Stock bajo"
    }

    return "Disponible"
  }

  const listaFiltrada =
    filtroEstado === "inactivos"
      ? productosInactivos
      : productos

  const productosFiltrados = listaFiltrada.filter((producto) => {
    const coincideBusqueda =
      producto.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      producto.codigo.toLowerCase().includes(busqueda.toLowerCase())

    const estado = obtenerEstadoStock(producto)

    const coincideEstado =
      filtroEstado === "todos" ||
      (filtroEstado === "disponibles" && estado === "Disponible") ||
      (filtroEstado === "stock-bajo" && estado === "Stock bajo") ||
      (filtroEstado === "agotados" && estado === "Agotado") ||
      (filtroEstado === "inactivos" && estado === "Inactivo")

    return coincideBusqueda && coincideEstado
  })

  const abrirNuevoProducto = () => {
    setFormulario({
      codigo: "",
      nombre: "",
      precioVenta: "",
      stock: "",
      stockMinimo: "",
    })

    setProductoEditando(null)
    setMostrarModal(true)
  }

  const abrirEditarProducto = (producto) => {
    setFormulario({
      codigo: producto.codigo,
      nombre: producto.nombre,
      precioVenta: producto.precioVenta,
      stock: producto.stock,
      stockMinimo: producto.stockMinimo,
    })

    setProductoEditando(producto)
    setMostrarModal(true)
  }

  const cerrarModal = () => {
    setMostrarModal(false)
  }

  const manejarCambio = (e) => {
    const { name, value } = e.target

    setFormulario({
      ...formulario,
      [name]: value,
    })
  }

  const guardarProducto = async (e) => {
    e.preventDefault()

    const todosLosProductos = [
      ...productos,
      ...productosInactivos,
    ]

    const codigoExiste = todosLosProductos.some(
      (producto) =>
        producto.codigo.toLowerCase() === formulario.codigo.trim().toLowerCase() &&
        producto.id !== productoEditando?.id
    )

    const nombreExiste = todosLosProductos.some(
      (producto) =>
        producto.nombre.toLowerCase() === formulario.nombre.trim().toLowerCase() &&
        producto.id !== productoEditando?.id
    )

    if (!formulario.codigo.trim()) {
      alert("El código del producto es obligatorio.")
      return
    }

    if (!formulario.nombre.trim()) {
      alert("El nombre del producto es obligatorio.")
      return
    }

    if (codigoExiste) {
      alert("El código del producto ya existe.")
      return
    }

    if (nombreExiste) {
      alert("El nombre del producto ya existe.")
      return
    }

    if (Number(formulario.precioVenta) <= 0) {
      alert("El precio de venta debe ser mayor que 0.")
      return
    }

    if (String(formulario.stock).trim() === "") {
      alert("El stock inicial es obligatorio.")
      return
    }

    if (Number(formulario.stock) < 0) {
      alert("El stock inicial no puede ser negativo.")
      return
    }

    if (String(formulario.stockMinimo).trim() === "") {
      alert("El stock mínimo es obligatorio.")
      return
    }

    if (Number(formulario.stockMinimo) < 0) {
      alert("El stock mínimo no puede ser negativo.")
      return
    }

    if (Number(formulario.stockMinimo) > Number(formulario.stock)) {
      alert("El stock mínimo no puede ser mayor que el stock inicial.")
      return
    }
  
  if (productoEditando) {
  try {
    const productoActualizado = {
      codigo: formulario.codigo.trim(),
      nombre: formulario.nombre.trim(),
      precioVenta: Number(formulario.precioVenta),
      stock: Number(formulario.stock),
      stockMinimo: Number(formulario.stockMinimo),
    }

    const productoGuardado = await actualizarProducto(
      productoEditando.id,
      productoActualizado
    )

    if (productoEditando.activo) {
      setProductos(
        productos.map((producto) =>
          producto.id === productoEditando.id
            ? productoGuardado
            : producto
        )
      )
    } else {
      setProductosInactivos(
        productosInactivos.map((producto) =>
          producto.id === productoEditando.id
            ? productoGuardado
            : producto
        )
      )
    }

    alert("Producto actualizado correctamente")

  } catch (error) {
    console.error("Error al actualizar producto:", error)
    alert("No se pudo actualizar el producto")
    return
  }

} else {
  try {
    const nuevoProducto = {
      codigo: formulario.codigo.trim(),
      nombre: formulario.nombre.trim(),
      precioVenta: Number(formulario.precioVenta),
      stock: Number(formulario.stock),
      stockMinimo: Number(formulario.stockMinimo),
    }

    const productoCreado = await crearProducto(nuevoProducto)

    setProductos([
      ...productos,
      productoCreado,
    ])

    alert("Producto creado correctamente")

  } catch (error) {
    console.error("Error al crear producto:", error)
    alert("No se pudo crear el producto")
  }
}

    setMostrarModal(false)
    setProductoEditando(null)
  }


 const desactivarProducto = async (id) => {
  const producto = productos.find(
    (producto) => producto.id === id
  )

  if (!producto) {
    return
  }

  try {
    await desactivarProductoAPI(id)

    const productoInactivo = {
      ...producto,
      activo: false,
    }

    setProductos(
      productos.filter(
        (producto) => producto.id !== id
      )
    )

    setProductosInactivos([
      ...productosInactivos,
      productoInactivo,
    ])

    console.log("PRODUCTOS INACTIVOS:", [
  ...productosInactivos,
  productoInactivo,
])

    alert("Producto desactivado correctamente")

  } catch (error) {
    console.error("Error al desactivar producto:", error)
    alert("No se pudo desactivar el producto")
  }
}
  const activarProducto = async (id) => {
  const producto = productosInactivos.find(
    (producto) => producto.id === id
  )

  if (!producto) {
    return
  }

  try {
    await activarProductoAPI(id)

    const productoActivo = {
      ...producto,
      activo: true,
    }

    setProductos([
      ...productos,
      productoActivo,
    ])

    setProductosInactivos(
      productosInactivos.filter(
        (producto) => producto.id !== id
      )
    )

    alert("Producto activado correctamente")

  } catch (error) {
    console.error("Error al activar producto:", error)
    alert("No se pudo activar el producto")
  }
}



  const formatearPrecio = (precio) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
    }).format(precio)
  }

  return (
    <div className="productos-page">

      <div className="productos-header">
        <div>
          <h1>Productos</h1>
          <p>Administra el catálogo e inventario de SmartPyme.</p>
        </div>

        <button
          className="btn-nuevo-producto"
          onClick={abrirNuevoProducto}
        >
          + Nuevo producto
        </button>
      </div>

      <div className="productos-toolbar">

        <input
          type="text"
          placeholder="Buscar por código o nombre..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="buscador-productos"
        />

        <select
          value={filtroEstado}
          onChange={(e) => setFiltroEstado(e.target.value)}
          className="filtro-productos"
        >
          <option value="todos">Todos</option>
          <option value="disponibles">Disponibles</option>
          <option value="stock-bajo">Stock bajo</option>
          <option value="agotados">Agotados</option>
          <option value="inactivos">Inactivos</option>
        </select>

        <span className="contador-productos">
          {productosFiltrados.length} productos
        </span>

      </div>

      <div className="tabla-container">

        <table className="tabla-productos">

          <thead>
            <tr>
              <th>Código</th>
              <th>Producto</th>
              <th>Precio venta</th>
              <th>Stock</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>

            {productosFiltrados.length === 0 ? (

              <tr>
                <td colSpan="6" className="sin-productos">
                  No se encontraron productos.
                </td>
              </tr>

            ) : (

              productosFiltrados.map((producto) => (

                <tr key={producto.id}>

                  <td>
                    <strong>{producto.codigo}</strong>
                  </td>

                  <td>{producto.nombre}</td>

                  <td>
                    {formatearPrecio(producto.precioVenta)}
                  </td>

                  <td>{producto.stock}</td>

                  <td>
                    <span
                      className={`estado-stock estado-${obtenerEstadoStock(producto)
                        .toLowerCase()
                        .replace(" ", "-")}`}
                    >
                      {obtenerEstadoStock(producto)}
                    </span>
                  </td>

                  <td>

                    <button
                      className="btn-accion btn-editar"
                      onClick={() => abrirEditarProducto(producto)}
                    >
                      Editar
                    </button>

                    {producto.activo ? (
                      <button
                        className="btn-accion btn-desactivar"
                        onClick={() => desactivarProducto(producto.id)}
                      >
                        Desactivar
                      </button>
                    )
                      : (
                        <button
                          className="btn-accion btn-activar"
                          onClick={() => activarProducto(producto.id)}
                        >
                          Activar
                        </button>
                      )}

                  </td>

                </tr>

              ))

            )}

          </tbody>

        </table>

      </div>

      {mostrarModal && (

        <div className="modal-overlay">

          <div className="modal-producto">

            <div className="modal-header">

              <h2>
                {productoEditando ? "Editar producto" : "Nuevo producto"}
              </h2>

              <button
                className="btn-cerrar"
                onClick={cerrarModal}
              >
                ×
              </button>

            </div>

            <form onSubmit={guardarProducto}>

              <div className="form-grid">

                <div className="campo">

                  <label>Código</label>

                  <input
                    type="text"
                    name="codigo"
                    value={formulario.codigo}
                    onChange={manejarCambio}
                  />

                </div>

                <div className="campo">

                  <label>Nombre</label>

                  <input
                    type="text"
                    name="nombre"
                    value={formulario.nombre}
                    onChange={manejarCambio}
                  />

                </div>

                <div className="campo">

                  <label>Precio de venta</label>

                  <input
                    type="number"
                    name="precioVenta"
                    value={formulario.precioVenta}
                    onChange={manejarCambio}
                    min="0"
                    required
                  />

                </div>

                <div className="campo">

                  <label>Stock inicial</label>

                  <input
                    type="number"
                    name="stock"
                    value={formulario.stock}
                    onChange={manejarCambio}
                  />

                </div>

                <div className="campo">

                  <label>Stock mínimo</label>

                  <input
                    type="number"
                    name="stockMinimo"
                    value={formulario.stockMinimo}
                    onChange={manejarCambio}
                  />

                </div>

              </div>

              <div className="modal-footer">

                <button
                  type="button"
                  className="btn-cancelar"
                  onClick={cerrarModal}
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="btn-guardar"
                >
                  {productoEditando ? "Actualizar producto" : "Guardar producto"}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  )

}

export default Productos

