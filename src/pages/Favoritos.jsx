import { useState } from "react";
import { Menu, Heart } from "lucide-react";
import Sidebar from "../components/Sidebar";
import { useProductos } from "../context/ProductosContext";

function estadoProducto(variantes) {
  const total = variantes.reduce((s, v) => s + Number(v.stock), 0);
  if (total === 0) return { texto: "Agotado", color: "#c0392b" };
  if (total <= 5) return { texto: "Poco stock", color: "#B8842E" };
  return { texto: "Disponible", color: "#4F7350" };
}

function Favoritos() {
  const { productos, alternarFavorito } = useProductos();
  const [menuAbierto, setMenuAbierto] = useState(false);

  const favoritos = productos.filter((p) => p.favorito);

  return (
    <div className="min-h-screen bg-alba-bg text-alba-text flex">
      <Sidebar abierto={menuAbierto} onCerrar={() => setMenuAbierto(false)} />

      <div className="flex-1 min-w-0">
        <div className="flex items-center px-5 md:px-8 py-4 border-b border-alba-border md:hidden">
          <button onClick={() => setMenuAbierto(true)}><Menu size={22} /></button>
        </div>

        <main className="p-5 md:p-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-1">Favoritos</h2>
          <p className="text-alba-muted text-sm mb-6">
            Productos que marcaste para tener a la mano.
          </p>

          {favoritos.length === 0 ? (
            <div className="text-center py-16">
              <Heart size={32} className="mx-auto mb-3 text-alba-muted" />
              <p className="text-alba-muted">
                Todavía no marcaste ningún favorito. Toca el corazón en una prenda del catálogo.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {favoritos.map((p) => {
                const estado = estadoProducto(p.variantes);
                return (
                  <div key={p.id} className="rounded-2xl overflow-hidden border border-alba-border relative">
                    <button
                      onClick={() => alternarFavorito(p.id)}
                      className="absolute top-2 right-2 z-10 bg-alba-bg/90 rounded-full p-1.5"
                    >
                      <Heart size={16} fill="#c0392b" color="#c0392b" />
                    </button>
                    <div className="aspect-[3/4] w-full overflow-hidden bg-alba-border">
                      <img src={p.foto} alt={p.nombre} className="w-full h-full object-cover" />
                    </div>
                    <div className="p-3">
                      <p className="font-medium text-sm leading-tight">{p.nombre}</p>
                      <p className="text-xs text-alba-muted mt-0.5">S/ {p.precio.toFixed(2)}</p>
                      <span className="text-xs font-medium" style={{ color: estado.color }}>
                        {estado.texto}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default Favoritos;