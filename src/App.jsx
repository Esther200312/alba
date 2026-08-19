import { Routes, Route } from "react-router-dom";
import { ProductosProvider } from "./context/ProductosContext";
import { UsuariosProvider } from "./context/UsuariosContext";
import { VentasProvider } from "./context/VentasContext";
import Home from "./pages/Home";
import Resumen from "./pages/Resumen";
import Catalogo from "./pages/Catalogo";
import Ventas from "./pages/Ventas";
import Favoritos from "./pages/Favoritos";
import Reportes from "./pages/Reportes";
import Usuarios from "./pages/Usuarios";
import Configuracion from "./pages/Configuracion";
import Proximamente from "./pages/Proximamente";

function App() {
  return (
    <ProductosProvider>
      <UsuariosProvider>
        <VentasProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/panel" element={<Resumen />} />
          <Route path="/panel/catalogo" element={<Catalogo />} />
          <Route path="/panel/inventario" element={<Proximamente titulo="Próximamente" />} />
          <Route path="/panel/ventas" element={<Ventas />} />
          <Route path="/panel/favoritos" element={<Favoritos />} />
          <Route path="/panel/reportes" element={<Reportes />} />
          <Route path="/panel/usuarios" element={<Usuarios />} />
          <Route path="/panel/configuracion" element={<Configuracion />} />
        </Routes>
        </VentasProvider>
      </UsuariosProvider>
    </ProductosProvider>
  );
}

export default App;