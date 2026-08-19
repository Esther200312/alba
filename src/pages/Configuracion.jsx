import { useState } from "react";
import { Menu, Minus, Plus, Trash2 } from "lucide-react";
import Sidebar from "../components/Sidebar";
import { useProductos } from "../context/ProductosContext";

function Configuracion() {
  const { productos, editarProducto } = useProductos();
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [seleccionadoId, setSeleccionadoId] = useState(productos[0]?.id || null);

  const producto = productos.find((p) => p.id === seleccionadoId);

  const cambiarPrecio = (delta) => {
    if (!producto) return;
    editarProducto(producto.id, { ...producto, precio: Math.max(0, producto.precio + delta) });
  };

  const cambiarColorVariante = (i, nuevoColor) => {
    const variantes = producto.variantes.map((v, idx) => (idx === i ? { ...v, color: nuevoColor } : v));
    editarProducto(producto.id, { ...producto, variantes });
  };

  const quitarVariante = (i) => {
    const variantes = producto.variantes.filter((_, idx) => idx !== i);
    editarProducto(producto.id, { ...producto, variantes });
  };

  return (
    <div className="min-h-screen bg-alba-bg text-alba-text flex">
      <Sidebar abierto={menuAbierto} onCerrar={() => setMenuAbierto(false)} />

      <div className="flex-1 min-w-0">
        <div className="flex items-center px-5 md:px-8 py-4 border-b border-alba-border md:hidden">
          <button onClick={() => setMenuAbierto(true)}><Menu size={22} /></button>
        </div>

        <main className="p-5 md:p-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-1">Configuración</h2>
          <p className="text-alba-muted text-sm mb-6">Ajusta precios y colores de tus productos.</p>

          <select
            value={seleccionadoId || ""}
            onChange={(e) => setSeleccionadoId(Number(e.target.value))}
            className="w-full max-w-xs px-3 py-2 rounded-lg border border-alba-border text-sm outline-none mb-6"
          >
            {productos.map((p) => <option key={p.id} value={p.id}>{p.nombre}</option>)}
          </select>

          {producto && (
            <div className="border border-alba-border rounded-xl p-4 max-w-md">
              <p className="font-medium mb-3">{producto.nombre}</p>

              <p className="text-xs text-alba-muted mb-1">Precio</p>
              <div className="flex items-center gap-3 mb-5">
                <button onClick={() => cambiarPrecio(-5)} className="w-8 h-8 rounded-full border border-alba-border flex items-center justify-center hover:bg-alba-border">
                  <Minus size={14} />
                </button>
                <span className="text-xl font-bold w-24 text-center">S/ {producto.precio.toFixed(2)}</span>
                <button onClick={() => cambiarPrecio(5)} className="w-8 h-8 rounded-full border border-alba-border flex items-center justify-center hover:bg-alba-border">
                  <Plus size={14} />
                </button>
              </div>

              <p className="text-xs text-alba-muted mb-2">Colores disponibles</p>
              <div className="space-y-2">
                {producto.variantes.map((v, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <input
                      value={v.color}
                      onChange={(e) => cambiarColorVariante(i, e.target.value)}
                      className="flex-1 px-3 py-1.5 rounded-lg border border-alba-border text-sm outline-none"
                    />
                    <span className="text-xs text-alba-muted w-16">Talla {v.talla}</span>
                    <button onClick={() => quitarVariante(i)} className="text-red-500">
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default Configuracion;