import "./Ventas.css"
import { useEffect, useState } from "react"
import { obtenerClientes } from "../services/clienteService"
import { crearVenta } from "../services/ventaService"
import { obtenerProductos } from "../services/productoService"

function Ventas() {

  const [clientes, setClientes] = useState([])
  const [productos, setProductos] = useState([])

  const [clienteId, setClienteId] = useState("")
  const [productoId, setProductoId] = useState("")
  const [cantidad, setCantidad] = useState("")

  const [carrito, setCarrito] = useState([])

  useEffect(() => {

    const cargarDatos = async () => {

      try {

        const clientesData = await obtenerClientes()
        const productosData = await obtenerProductos()

        setClientes(clientesData)

        setProductos(
          productosData.filter(
            (producto) => producto.activo
          )
        )

      } catch (error) {

        console.error(error)

      }
    }

    cargarDatos()

  }, [])

  const validarVenta = () => {
    if (!clienteId) {
      alert("Selecciona un cliente")
      return false
    }

    if (carrito.length === 0) {
      alert("Agrega al menos un producto")
      return false
    }

    return true
  }

  return (
  <div className="ventas-container">

    <div className="ventas-header">
      <div>
        <h1>Registrar venta</h1>
        <p>Gestiona tus ventas de forma rápida y sencilla.</p>
      </div>
    </div>

    <div className="ventas-grid">

      <section className="venta-card">

        <div className="card-header">
          <h2>Nueva venta</h2>
          <span>1</span>
        </div>

        <div className="form-group">
          <label>Cliente</label>

          <select
            value={clienteId}
            onChange={(e) => setClienteId(e.target.value)}
          >
            <option value="">Seleccionar cliente</option>

            {clientes.map((cliente) => (
              <option key={cliente.id} value={cliente.id}>
                {cliente.nombre} {cliente.apellido}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Producto</label>

          <select
            value={productoId}
            onChange={(e) => setProductoId(e.target.value)}
          >
            <option value="">Seleccionar producto</option>

            {productos.map((producto) => (
              <option key={producto.id} value={producto.id}>
                {producto.nombre} - ${producto.precioVenta}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Cantidad</label>

          <div className="cantidad-row">
            <input
              type="number"
              min="1"
              value={cantidad}
              onChange={(e) => setCantidad(e.target.value)}
              placeholder="Ej. 2"
            />

            <button
              className="btn-agregar"
              onClick={() => {
                const productoSeleccionado = productos.find(
                  (producto) => producto.id === Number(productoId)
                )

                const cantidadNumero = Number(cantidad)

                if (!productoSeleccionado) {
                  alert("Selecciona un producto")
                  return
                }

                if (cantidadNumero <= 0) {
                  alert("Ingresa una cantidad válida")
                  return
                }

                setCarrito((carritoActual) => {
                  const productoExistente = carritoActual.find(
                    (item) => item.productoId === productoSeleccionado.id
                  )

                  if (productoExistente) {
                    return carritoActual.map((item) =>
                      item.productoId === productoSeleccionado.id
                        ? {
                            ...item,
                            cantidad: item.cantidad + cantidadNumero
                          }
                        : item
                    )
                  }

                  return [
                    ...carritoActual,
                    {
                      productoId: productoSeleccionado.id,
                      productoNombre: productoSeleccionado.nombre,
                      cantidad: cantidadNumero,
                      precio: productoSeleccionado.precioVenta
                    }
                  ]
                })

                setProductoId("")
                setCantidad("")
              }}
            >
              Agregar producto
            </button>
          </div>
        </div>

      </section>

      <section className="carrito-card">

        <div className="card-header">
          <div>
            <h2>Carrito</h2>
            <p>{carrito.length} producto(s)</p>
          </div>
        </div>

        {carrito.length === 0 ? (
          <div className="carrito-vacio">
            <div className="carrito-icon">🛒</div>
            <h3>Tu carrito está vacío</h3>
            <p>Agrega productos para comenzar la venta.</p>
          </div>
        ) : (
          <div className="carrito-lista">

            {carrito.map((item) => (
              <div className="producto-carrito" key={item.productoId}>

                <div className="producto-info">
                  <h3>{item.productoNombre}</h3>
                  <p>
                    ${item.precio.toLocaleString()} × {item.cantidad}
                  </p>
                </div>

                <div className="producto-subtotal">
                  ${(item.precio * item.cantidad).toLocaleString()}
                </div>

                <div className="producto-acciones">

                  <button
                    className="btn-editar"
                    onClick={() => {
                      const nuevaCantidad = Number(
                        prompt("Nueva cantidad:", item.cantidad)
                      )

                      if (nuevaCantidad > 0) {
                        setCarrito((carritoActual) =>
                          carritoActual.map((producto) =>
                            producto.productoId === item.productoId
                              ? {
                                  ...producto,
                                  cantidad: nuevaCantidad
                                }
                              : producto
                          )
                        )
                      }
                    }}
                  >
                    Editar
                  </button>

                  <button
                    className="btn-eliminar"
                    onClick={() => {
                      setCarrito((carritoActual) =>
                        carritoActual.filter(
                          (producto) =>
                            producto.productoId !== item.productoId
                        )
                      )
                    }}
                  >
                    Eliminar
                  </button>

                </div>

              </div>
            ))}

          </div>
        )}

        <div className="venta-total">
          <span>Total</span>

          <strong>
            $
            {carrito
              .reduce(
                (total, item) =>
                  total + item.precio * item.cantidad,
                0
              )
              .toLocaleString()}
          </strong>
        </div>

        <button
          className="btn-registrar"
          onClick={async () => {
            if (!validarVenta()) {
              return
            }

            try {
              const venta = {
                clienteId: Number(clienteId),
                productos: carrito.map((item) => ({
                  productoId: item.productoId,
                  cantidad: item.cantidad
                }))
              }

              const resultado = await crearVenta(venta)

              alert(
                `Venta registrada correctamente. Factura #${resultado.id}`
              )

              setClienteId("")
              setProductoId("")
              setCantidad("")
              setCarrito([])

            } catch (error) {
              alert(error.message)
            }
          }}
        >
          Registrar venta
        </button>

      </section>

    </div>

  </div>
)
}

export default Ventas