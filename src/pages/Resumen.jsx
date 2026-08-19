import { useState, useRef, useEffect } from "react";
import { Menu, Bell, Package, Boxes, AlertTriangle, TrendingUp } from "lucide-react";
import Sidebar, { SolAlba } from "../components/Sidebar";
import { useNavigate } from "react-router-dom";
import { useProductos } from "../context/ProductosContext";
import { useVentas } from "../context/VentasContext";


function saludo() {
  const hora = new Date().getHours();
  if (hora < 12) return "Buenos días";
  if (hora < 19) return "Buenas tardes";
  return "Buenas noches";
}

function temporadaActual() {
  const mes = new Date().getMonth() + 1; // 1-12
  if (mes === 12 || mes <= 2) return { nombre: "Verano", foto: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=900" };
  if (mes >= 3 && mes <= 5) return { nombre: "Otoño", foto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=900" };
  if (mes >= 6 && mes <= 8) return { nombre: "Invierno", foto: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=900" };
  return { nombre: "Primavera", foto: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=900" };
}

function Resumen() {
    const navigate = useNavigate();
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [notisAbiertas, setNotisAbiertas] = useState(false);
    const notisRef = useRef(null);

  useEffect(() => {
    const alTocarAfuera = (e) => {
      if (notisRef.current && !notisRef.current.contains(e.target)) {
        setNotisAbiertas(false);
      }
    };
    document.addEventListener("mousedown", alTocarAfuera);
    return () => document.removeEventListener("mousedown", alTocarAfuera);
  }, []);
  const { productos } = useProductos();
  const { ventas } = useVentas();
    const stockTotal = productos.reduce(
    (suma, p) => suma + p.variantes.reduce((s, v) => s + Number(v.stock), 0),
    0
  );

  const productosBajoStock = productos.filter((p) => {
    const total = p.variantes.reduce((s, v) => s + Number(v.stock), 0);
    return total > 0 && total <= 5;
  });

  const productosMasVendidos = Object.values(
    ventas.reduce((acc, v) => {
      if (!acc[v.producto]) acc[v.producto] = { nombre: v.producto, unidades: 0 };
      acc[v.producto].unidades += v.cantidad;
      return acc;
    }, {})
  )
    .filter((p) => p.unidades > 0)
    .sort((a, b) => b.unidades - a.unidades);
  const categorias = Object.values(
    productos.reduce((acc, p) => {
      const cat = p.categoria || "Sin categoría";
      if (!acc[cat]) acc[cat] = { nombre: cat, cantidad: 0, foto: p.foto };
      acc[cat].cantidad += 1;
      return acc;
    }, {})
  );
  const temporada = temporadaActual();

  return (
    <div className="min-h-screen bg-alba-bg text-alba-text flex">
      <Sidebar abierto={menuAbierto} onCerrar={() => setMenuAbierto(false)} />

      <div className="flex-1 min-w-0">
        {/* Barra superior */}
        <div className="flex items-center justify-between px-5 md:px-8 py-4 border-b border-alba-border">
          <button className="md:hidden" onClick={() => setMenuAbierto(true)}>
            <Menu size={22} />
          </button>
          <div className="flex items-center gap-3">
                        <div className="relative" ref={notisRef}>
              <button
                onClick={() => setNotisAbiertas(!notisAbiertas)}
                className="p-2 rounded-full hover:bg-alba-border transition-colors relative"
              >
                <Bell size={19} />
                <span className="absolute top-1 right-1 bg-alba-accent text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">2</span>
              </button>

              {notisAbiertas && (
                <div className="absolute right-0 mt-2 w-64 bg-alba-bg border border-alba-border rounded-xl shadow-lg p-3 z-40">
                  <p className="text-sm font-medium mb-2">Notificaciones</p>
                </div>
              )}
            </div>
            <div className="w-8 h-8 rounded-full bg-alba-border flex items-center justify-center text-xs font-medium">ER</div>
          </div>
        </div>

        <main className="p-5 md:p-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-1">
            <span className="inline-flex items-center gap-2">
  {saludo()}, equipo Alba <SolAlba size={26} />
</span>
          </h2>
          <p className="text-alba-muted mb-6">Aquí puedes ver el resumen de tu tienda.</p>

          {/* Tarjetas de números */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        {[
              { label: "Productos", valor: productos.length, sub: "Total en catálogo", icon: Package },
              { label: "Stock total", valor: stockTotal, sub: "Unidades disponibles", icon: Boxes },
              { label: "Bajo stock", valor: productosBajoStock.length, sub: "Productos", icon: AlertTriangle },
              { label: "Más vendidos", valor: productosMasVendidos.length, sub: "Productos con ventas", icon: TrendingUp },
            ].map(({ label, valor, sub, icon: Icon }) => (
              <div key={label} className="border border-alba-border rounded-xl p-4">
                <div className="flex items-center gap-2 text-alba-muted text-xs mb-2">
                  <Icon size={14} /> {label}
                </div>
                <p className="text-2xl font-bold">{valor}</p>
                <p className="text-xs text-alba-muted">{sub}</p>
              </div>
            ))}
          </div>

          {/* Categorías principales */}
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold">Categorías principales</h3>
            <span className="text-sm text-alba-muted cursor-pointer">Ver todas</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {categorias.map((c) => (
              <div key={c.nombre} className="text-center">
                <div className="aspect-square rounded-xl overflow-hidden mb-2">
                  <img src={c.foto} alt={c.nombre} className="w-full h-full object-cover" />
                </div>
                <p className="text-sm font-medium">{c.nombre}</p>
                <p className="text-xs text-alba-muted">{c.cantidad} productos</p>
              </div>
            ))}
          </div>

                    {/* Banner nueva colección */}
                   <div className="relative rounded-2xl overflow-hidden mb-8 h-48">
            <img
              src={temporada.foto}
              alt="Nueva colección"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/35 flex flex-col justify-center px-6 text-white">
              <p className="text-xs">Nueva colección</p>
              <p className="text-2xl font-bold mb-3">{temporada.nombre} 2026</p>
              <button
  onClick={() => navigate("/panel/catalogo")}
  className="bg-white text-alba-text px-4 py-2 rounded-lg text-sm font-medium w-fit"
>
  Ver catálogo
</button>
            </div>
          </div>

          {/* Stock bajo */}
          <h3 className="font-bold mb-3">Stock bajo</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[400px]">
              <thead>
                <tr className="text-left text-alba-muted border-b border-alba-border">
                  <th className="py-2 font-medium">Producto</th>
                  <th className="py-2 font-medium">Categoría</th>
                  <th className="py-2 font-medium">Talla</th>
                  <th className="py-2 font-medium">Color</th>
                  <th className="py-2 font-medium">Stock</th>
                </tr>
              </thead>
                            <tbody>
                {productosBajoStock.map((p) =>
                  p.variantes
                    .filter((v) => v.stock > 0 && v.stock <= 5)
                    .map((v, i) => (
                      <tr key={`${p.id}-${i}`} className="border-b border-alba-border">
                        <td className="py-2 flex items-center gap-2">
                          <img src={p.foto} className="w-8 h-8 rounded object-cover" />
                          {p.nombre}
                        </td>
                        <td className="text-alba-muted">{p.categoria}</td>
                        <td className="text-alba-muted">{v.talla}</td>
                        <td className="text-alba-muted">{v.color}</td>
                        <td className="text-red-500 font-medium">{v.stock} unidades</td>
                      </tr>
                    ))
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Resumen;