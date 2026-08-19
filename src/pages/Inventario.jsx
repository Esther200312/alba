import { useState } from "react";
import { Menu, Search, Minus, Plus } from "lucide-react";
import Sidebar from "../components/Sidebar";
import { useProductos } from "../context/ProductosContext";

function estadoStock(stock) {
  if (stock === 0) return { texto: "Agotado", color: "#c0392b" };
  if (stock <= 5) return { texto: "Bajo", color: "#B8842E" };
  return { texto: "Disponible", color: "#4F7350" };
}

function Inventario() {
  const { productos, cambiarStockVariante } = useProductos();
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [busqueda, setBusqueda] = useState("");

  const filtrados = productos.filter((p) =>
    p.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-alba-bg text-alba-text flex">
      <Sidebar abierto={menuAbierto} onCerrar={() => setMenuAbierto(false)} />

      <div className="flex-1 min-w-0">
        <div className="flex items-center px-5 md:px-8 py-4 border-b border-alba-border md:hidden">
          <button onClick={() => setMenuAbierto(true)}><Menu size={22} /></button>
        </div>

        <main className="p-5 md:p-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-1">Inventario</h2>
          <p className="text-alba-muted text-sm mb-6">Ajusta el stock de cada talla y color.</p>

          <div className="relative max-w-xs mb-4">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-alba-muted" />
            <input
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar producto..."
              className="w-full pl-8 pr-3 py-2 rounded-lg border border-alba-border text-sm outline-none"
            />
          </div>

          <div className="space-y-3">
            {filtrados.map((p) => (
              <div key={p.id} className="border border-alba-border rounded-xl p-3">
                <div className="flex items-center gap-3 mb-2">
                  <img src={p.foto} className="w-10 h-10 rounded-lg object-cover shrink-0" />
                  <div>
                    <p className="font-medium text-sm">{p.nombre}</p>
                    <p className="text-xs text-alba-muted">{p.categoria}</p>
                  </div>
                </div>

                <div className="space-y-1.5 pl-1">
                  {p.variantes.map((v, i) => {
                    const estado = estadoStock(v.stock);
                    return (
                      <div key={i} className="flex items-center gap-3 text-sm py-1">
                        <span className="w-20 text-alba-muted">{v.color}</span>
                        <span className="w-16 text-alba-muted">Talla {v.talla}</span>
                        <span className="text-xs font-medium w-20" style={{ color: estado.color }}>
                          {estado.texto}
                        </span>
                        <div className="flex items-center gap-2 ml-auto">
                          <button
                            onClick={() => cambiarStockVariante(p.id, i, -1)}
                            className="w-6 h-6 rounded-full border border-alba-border flex items-center justify-center hover:bg-alba-border"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="w-6 text-center font-medium">{v.stock}</span>
                          <button
                            onClick={() => cambiarStockVariante(p.id, i, 1)}
                            className="w-6 h-6 rounded-full border border-alba-border flex items-center justify-center hover:bg-alba-border"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}

export default Inventario;