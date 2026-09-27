import Navbar from "./Navbar"
import Sidebar from "./Sidebar"
import { Outlet } from "react-router-dom"

function Layout() {
  return (
    <>
      <Navbar nombre="SmartPyme" />

      <Sidebar
        items={[
          "Dashboard",
          "Productos",
          "Ventas",
          "Clientes",
          "Inventario"
        ]}
      />

      <main>
        <Outlet />
      </main>
    </>
  )
}

export default Layout