import { useEffect, useState } from "react"
import {
    obtenerClientes,
    crearCliente,
    actualizarCliente,
    eliminarCliente,
} from "../services/clienteService"

function Clientes() {

    const [clientes, setClientes] = useState([])
    const [cargando, setCargando] = useState(true)
    const [error, setError] = useState("")

    const [nombre, setNombre] = useState("")
    const [apellido, setApellido] = useState("")
    const [cedula, setCedula] = useState("")
    const [telefono, setTelefono] = useState("")
    const [clienteEditando, setClienteEditando] = useState(null)

    useEffect(() => {

        const cargarClientes = async () => {
            try {
                const datos = await obtenerClientes()
                setClientes(datos)
            } catch (error) {
                setError("No se pudieron cargar los clientes")
            } finally {
                setCargando(false)
            }
        }

        cargarClientes()

    }, [])

    const manejarEditar = (cliente) => {
        setNombre(cliente.nombre)
        setApellido(cliente.apellido)
        setCedula(cliente.cedula)
        setTelefono(cliente.telefono)
        setClienteEditando(cliente.id)
    }

    const manejarEliminar = async (id) => {

        const confirmar = window.confirm(
            "¿Estás seguro de eliminar este cliente?"
        )

        if (!confirmar) return

        try {
            await eliminarCliente(id)

            setClientes((clientesActuales) =>
                clientesActuales.filter(
                    (cliente) => cliente.id !== id
                )
            )

        } catch (error) {
            setError("No se pudo eliminar el cliente")
        }

    }

    const manejarGuardar = async (e) => {
        e.preventDefault()

        try {

            const cliente = {
                nombre,
                apellido,
                cedula: parseInt(cedula),
                telefono,
            }

            if (clienteEditando) {

                const clienteActualizado = await actualizarCliente(
                    clienteEditando,
                    cliente
                )

                setClientes(
                    clientes.map((item) =>
                        item.id === clienteEditando
                            ? clienteActualizado
                            : item
                    )
                )

            } else {

                const clienteGuardado = await crearCliente(cliente)

                setClientes([...clientes, clienteGuardado])
            }

            setNombre("")
            setApellido("")
            setCedula("")
            setTelefono("")
            setClienteEditando(null)

        } catch (error) {
            setError("No se pudo guardar el cliente")
        }
    }

    if (cargando) {
        return <p>Cargando clientes...</p>
    }

    if (error && clientes.length === 0) {
        return <p>{error}</p>
    }

    return (
        <div>

            <h1>Clientes</h1>

            <p>Gestión de clientes de SmartPyme</p>

            <form onSubmit={manejarGuardar}>

                <div>
                    <label>Nombre</label>

                    <input
                        type="text"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label>Apellido</label>

                    <input
                        type="text"
                        value={apellido}
                        onChange={(e) => setApellido(e.target.value)}
                    />
                </div>

                <div>
                    <label>Cédula</label>

                    <input
                        type="number"
                        value={cedula}
                        onChange={(e) => setCedula(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label>Teléfono</label>

                    <input
                        type="text"
                        value={telefono}
                        onChange={(e) => setTelefono(e.target.value)}
                    />
                </div>

                <button type="submit">
                    Guardar cliente
                </button>

            </form>



            <h2>Lista de clientes</h2>

            <table>

                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Apellido</th>
                        <th>Cédula</th>
                        <th>Teléfono</th>
                        <th>Acciones</th>
                    </tr>
                </thead>

                <tbody>

                    {clientes.map((cliente) => (
                        <tr key={cliente.id}>
                            <td>{cliente.id}</td>
                            <td>{cliente.nombre}</td>
                            <td>{cliente.apellido}</td>
                            <td>{cliente.cedula}</td>
                            <td>{cliente.telefono}</td>
                            <td>
                                <button onClick={() => manejarEditar(cliente)}>
                                    Editar
                                </button>

                                <button onClick={() => manejarEliminar(cliente.id)}>
                                    Eliminar
                                </button>
                            </td>
                        </tr>

                    ))}

                </tbody>

            </table>

        </div>
    )
}

export default Clientes