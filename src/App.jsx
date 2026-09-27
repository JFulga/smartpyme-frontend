import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import Productos from './pages/Productos'
import Ventas from './pages/Ventas'
import Clientes from './pages/Clientes'
import Inventario from './pages/Inventario'
import { Routes, Route } from 'react-router-dom'
import Login from './pages/Login'

function App() {
  return (
    <>
      <Navbar nombre="SmartPyme" />

      <Sidebar
        items={[
          'Dashboard',
          'Productos',
          'Ventas',
          'Clientes',
          'Inventario'
        ]}
      />

      <main>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/productos" element={<Productos />} />
          <Route path="/ventas" element={<Ventas />} />
          <Route path="/clientes" element={<Clientes />} />
          <Route path="/inventario" element={<Inventario />} />          
        </Routes>
      </main>
    </>
  )
}

export default App