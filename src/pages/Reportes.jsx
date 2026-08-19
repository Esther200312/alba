import { useState } from "react";
import { Menu } from "lucide-react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import Sidebar from "../components/Sidebar";
import { useProductos } from "../context/ProductosContext";

const COLORES = ["#B8842E", "#4F7350", "#2f4f7a", "#c0392b", "#7fb3c9", "#c9b79c"];

function totalStock(variantes) {
  return variantes.reduce((s, v) => s + Number(v.stock), 0);
}

function Reportes() {
  const { productos } = useProductos();
  const [menuAbierto, setMenuAbierto] = useState(false);

  const totalProductos = productos.length;
  const totalUnidades = productos.reduce((s, p) => s + totalStock(p.variantes), 0);
  const valorInventario = productos.reduce(
    (s, p) => s + p.precio * totalStock(p.variantes),
    0
  );
  const agotados = productos.filter((p) => totalStock(p.variantes) === 0).length;

  // Cuántas unidades hay por categoría, para la gráfica
  const porCategoria = Object.values(
    productos.reduce((acc, p) => {
      const cat = p.categoria || "Sin categoría";
      if (!acc[cat]) acc[cat] = { name: cat, value: 0 };
      acc[cat].value += totalStock(p.variantes);
      return acc;
    }, {})
  );

  return (
    <div className="min-h-screen bg-alba-bg text-alba-text flex">
      <Sidebar abierto={menuAbierto} onCerrar={() => setMenuAbierto(false)} />

      <div className="flex-1 min-w-0">
        <div className="flex items-center px-5 md:px-8 py-4 border-b border-alba-border md:hidden">
          <button onClick={() => setMenuAbierto(true)}><Menu size={22} /></button>
        </div>

        <main className="p-5 md:p-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-1">Reportes</h2>
          <p className="text-alba-muted text-sm mb-6">Resumen general de tu inventario.</p>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="border border-alba-border rounded-xl p-4">
              <p className="text-xs text-alba-muted mb-1">Productos distintos</p>
              <p className="text-2xl font-bold">{totalProductos}</p>
            </div>
            <div className="border border-alba-border rounded-xl p-4">
              <p className="text-xs text-alba-muted mb-1">Unidades en stock</p>
              <p className="text-2xl font-bold">{totalUnidades}</p>
            </div>
            <div className="border border-alba-border rounded-xl p-4">
              <p className="text-xs text-alba-muted mb-1">Valor del inventario</p>
              <p className="text-2xl font-bold">S/ {valorInventario.toFixed(2)}</p>
            </div>
            <div className="border border-alba-border rounded-xl p-4">
              <p className="text-xs text-alba-muted mb-1">Productos agotados</p>
              <p className="text-2xl font-bold" style={{ color: agotados > 0 ? "#c0392b" : undefined }}>
                {agotados}
              </p>
            </div>
          </div>

          <div className="border border-alba-border rounded-xl p-4">
            <p className="text-sm font-medium mb-3">Stock por categoría</p>
            {porCategoria.length === 0 ? (
              <p className="text-alba-muted text-sm">Todavía no hay productos registrados.</p>
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={porCategoria}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    label={(entrada) => `${entrada.name}: ${entrada.value}`}
                  >
                    {porCategoria.map((_, i) => (
                      <Cell key={i} fill={COLORES[i % COLORES.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default Reportes;