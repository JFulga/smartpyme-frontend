import { Routes, Route } from "react-router-dom"

import Layout from "./components/Layout"
import Login from "./pages/Login"
import Dashboard from "./pages/Dashboard"
import Productos from "./pages/Productos"
import Ventas from "./pages/Ventas"
import Clientes from "./pages/Clientes"
import Inventario from "./pages/Inventario"
import ProtectedRoute from "./components/ProtectedRoute"

function App() {
  return (
    <Routes>

      <Route path="/login" element={<Login />} />


     <Route element={<ProtectedRoute />}>
       <Route element={<Layout />}>
      
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/productos" element={<Productos />} />
        <Route path="/ventas" element={<Ventas />} />
        <Route path="/clientes" element={<Clientes />} />
        <Route path="/inventario" element={<Inventario />} />

      </Route>
      </Route>

    </Routes>
  )
}

export default App