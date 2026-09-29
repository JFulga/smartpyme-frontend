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
    <div>

      <h1>Registrar Venta</h1>

      <p>Gestión de ventas de SmartPyme</p>

      <div>
        <label>Cliente</label>

        <select
          value={clienteId}
          onChange={(e) => setClienteId(e.target.value)}
        >
          <option value="">Seleccionar cliente</option>

          {clientes.map((cliente) => (
            <option
              key={cliente.id}
              value={cliente.id}
            >
              {cliente.nombre} {cliente.apellido}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label>Producto</label>

        <select
          value={productoId}
          onChange={(e) => setProductoId(e.target.value)}
        >
          <option value="">Seleccionar producto</option>

          {productos.map((producto) => (
            <option
              key={producto.id}
              value={producto.id}
            >
              {producto.nombre} - ${producto.precioVenta}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label>Cantidad</label>

        <input
          type="number"
          min="1"
          value={cantidad}
          onChange={(e) => setCantidad(e.target.value)}
        />
        <button
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
          Agregar
        </button>
        <h2>Carrito</h2>

        {carrito.length === 0 ? (
          <p>No hay productos agregados.</p>
        ) : (
          <ul>
            {carrito.map((item) => (
              <li key={item.productoId}>
                {item.productoNombre} -
                Precio unitario: ${item.precio} -
                Cantidad: {item.cantidad} -
                Subtotal: ${item.precio * item.cantidad}

                <button
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
              </li>
            ))}
          </ul>

        )}
        <h3>
          Total: $
          {carrito.reduce(
            (total, item) => total + item.precio * item.cantidad,
            0
          )}
        </h3>
        <button
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

              alert(`Venta registrada correctamente. Factura #${resultado.id}`)

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
      </div>

    </div>
  )
}

export default Ventas