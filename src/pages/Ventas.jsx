import { useState } from "react";
import { Menu, Plus, X } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import Sidebar from "../components/Sidebar";
import { useProductos } from "../context/ProductosContext";
import { useVentas } from "../context/VentasContext";

// Ventas de ejemplo — luego se van a ir sumando las que registres tú
const VENTAS_INICIALES = [
  {
    id: 1,
    fecha: "2026-08-05",
    producto: "Pantalón YOU",
    cantidad: 2,
    total: 179.8,
  },
  {
    id: 2,
    fecha: "2026-08-06",
    producto: "Polera básica",
    cantidad: 3,
    total: 119.7,
  },
  {
    id: 3,
    fecha: "2026-08-07",
    producto: "Pantalón YOU",
    cantidad: 1,
    total: 89.9,
  },
  {
    id: 4,
    fecha: "2026-08-08",
    producto: "Polera básica",
    cantidad: 5,
    total: 199.5,
  },
  {
    id: 5,
    fecha: "2026-08-09",
    producto: "Pantalón YOU",
    cantidad: 3,
    total: 269.7,
  },
];

function agruparPorFecha(ventas) {
  const mapa = {};
  ventas.forEach((v) => {
    const dia = v.fecha.slice(5); // "08-05" en vez de "2026-08-05"
    mapa[dia] = (mapa[dia] || 0) + v.total;
  });
  return Object.entries(mapa).map(([fecha, total]) => ({ fecha, total }));
}

function Ventas() {
  const { productos, cambiarStockVariante } = useProductos();
  const [menuAbierto, setMenuAbierto] = useState(false);
  const { ventas, registrarVenta } = useVentas();
  const [modalAbierto, setModalAbierto] = useState(false);

  const datosGrafica = agruparPorFecha(ventas);
  const totalVendido = ventas.reduce((s, v) => s + v.total, 0);
  const unidadesVendidas = ventas.reduce((s, v) => s + v.cantidad, 0);

  return (
    <div className="min-h-screen bg-alba-bg text-alba-text flex">
      <Sidebar abierto={menuAbierto} onCerrar={() => setMenuAbierto(false)} />

      <div className="flex-1 min-w-0">
        <div className="flex items-center px-5 md:px-8 py-4 border-b border-alba-border md:hidden">
          <button onClick={() => setMenuAbierto(true)}>
            <Menu size={22} />
          </button>
        </div>

        <main className="p-5 md:p-8">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-1">Ventas</h2>
              <p className="text-alba-muted text-sm">
                Registro y resumen de lo vendido.
              </p>
            </div>
            <button
              onClick={() => setModalAbierto(true)}
              className="flex items-center gap-1.5 bg-alba-text text-alba-bg px-4 py-2 rounded-lg text-sm font-medium"
            >
              <Plus size={16} /> Registrar venta
            </button>
          </div>

          {/* Tarjetas resumen */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="border border-alba-border rounded-xl p-4">
              <p className="text-xs text-alba-muted mb-1">Total vendido</p>
              <p className="text-2xl font-bold">S/ {totalVendido.toFixed(2)}</p>
            </div>
            <div className="border border-alba-border rounded-xl p-4">
              <p className="text-xs text-alba-muted mb-1">Unidades vendidas</p>
              <p className="text-2xl font-bold">{unidadesVendidas}</p>
            </div>
          </div>

          {/* Gráfica */}

          {/* Gráfica de línea */}
          <div className="border border-alba-border rounded-xl p-4 mb-6">
            <p className="text-sm font-medium mb-1">Evolución de ventas</p>
            <p className="text-xs text-alba-muted mb-3">
              Ingresos por día (S/)
            </p>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={datosGrafica}>
                <XAxis dataKey="fecha" stroke="#767268" fontSize={12} />
                <YAxis stroke="#767268" fontSize={12} />
                <Tooltip
                  formatter={(valor) => [`S/ ${valor.toFixed(2)}`, "Total"]}
                  contentStyle={{
                    borderRadius: 8,
                    border: "1px solid #E5E2D9",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="total"
                  stroke="#B8842E"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: "#B8842E" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Ventas por producto */}
          <p className="text-sm font-medium mb-2">Ventas por producto</p>
          <div className="border border-alba-border rounded-xl overflow-hidden mb-6">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-alba-muted border-b border-alba-border bg-alba-border/20">
                  <th className="py-2 px-3 font-medium">Producto</th>
                  <th className="py-2 px-3 font-medium">Unidades</th>
                  <th className="py-2 px-3 font-medium">Total</th>
                </tr>
              </thead>
              <tbody>
                {Object.values(
                  ventas.reduce((acc, v) => {
                    if (!acc[v.producto])
                      acc[v.producto] = {
                        producto: v.producto,
                        unidades: 0,
                        total: 0,
                      };
                    acc[v.producto].unidades += v.cantidad;
                    acc[v.producto].total += v.total;
                    return acc;
                  }, {}),
                )
                  .sort((a, b) => b.total - a.total)
                  .map((p) => (
                    <tr
                      key={p.producto}
                      className="border-b border-alba-border last:border-0"
                    >
                      <td className="py-2 px-3 font-medium">{p.producto}</td>
                      <td className="py-2 px-3 text-alba-muted">
                        {p.unidades}
                      </td>
                      <td className="py-2 px-3">S/ {p.total.toFixed(2)}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          {/* Tabla de ventas */}
          <p className="text-sm font-medium mb-2">Historial</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[400px]">
              <thead>
                <tr className="text-left text-alba-muted border-b border-alba-border">
                  <th className="py-2 font-medium">Fecha</th>
                  <th className="py-2 font-medium">Producto</th>
                  <th className="py-2 font-medium">Cantidad</th>
                  <th className="py-2 font-medium">Total</th>
                </tr>
              </thead>
              <tbody>
                {[...ventas].reverse().map((v) => (
                  <tr key={v.id} className="border-b border-alba-border">
                    <td className="py-2 text-alba-muted">{v.fecha}</td>
                    <td className="py-2 font-medium">{v.producto}</td>
                    <td className="py-2 text-alba-muted">{v.cantidad}</td>
                    <td className="py-2">S/ {v.total.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>

      {modalAbierto && (
        <ModalVenta
          productos={productos}
          onClose={() => setModalAbierto(false)}
          onRegistrar={registrarVenta}
          onCambiarStock={cambiarStockVariante}
        />
      )}
    </div>
  );
}

function ModalVenta({ productos, onClose, onRegistrar, onCambiarStock }) {
  const [productoId, setProductoId] = useState("");
  const [indiceVariante, setIndiceVariante] = useState("");
  const [cantidad, setCantidad] = useState(1);
  const [error, setError] = useState("");
  const [precioUnitario, setPrecioUnitario] = useState(0);

  const producto = productos.find((p) => p.id === Number(productoId));

  const guardar = () => {
    if (!producto) {
      setError("Falta seleccionar el producto");
      return;
    }
    if (indiceVariante === "") {
      setError("Falta seleccionar talla y color");
      return;
    }
    if (!precioUnitario || precioUnitario <= 0) {
      setError("Falta poner el precio");
      return;
    }
    if (!cantidad || cantidad <= 0) {
      setError("Falta poner la cantidad");
      return;
    }
    setError("");
    const variante = producto.variantes[indiceVariante];
    const total = precioUnitario * cantidad;

    onRegistrar({
      fecha: new Date().toISOString().slice(0, 10),
      producto: producto.nombre,
      cantidad: Number(cantidad),
      total,
    });

    onCambiarStock(producto.id, Number(indiceVariante), -cantidad);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-alba-bg rounded-2xl p-6 w-full max-w-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold">Registrar venta</h3>
          <button onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="space-y-3">
          <select
            value={productoId}
            onChange={(e) => {
              setProductoId(e.target.value);
              setIndiceVariante("");
              const p = productos.find((p) => p.id === Number(e.target.value));
              setPrecioUnitario(p ? p.precio : 0);
            }}
            className="w-full px-3 py-2 rounded-lg border border-alba-border text-sm outline-none"
          >
            <option value="">Selecciona un producto</option>
            {productos.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nombre} — S/ {p.precio.toFixed(2)}
              </option>
            ))}
          </select>

          {producto && (
            <select
              value={indiceVariante}
              onChange={(e) => setIndiceVariante(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-alba-border text-sm outline-none"
            >
              <option value="">Selecciona talla/color</option>
              {producto.variantes.map((v, i) => (
                <option key={i} value={i} disabled={v.stock === 0}>
                  {v.color} · Talla {v.talla}{" "}
                  {v.stock === 0 ? "(agotado)" : `(${v.stock} disp.)`}
                </option>
              ))}
            </select>
          )}

          {producto && (
            <div>
              <label className="text-xs text-alba-muted">
                Precio de venta (S/)
              </label>
             <input
                type="number"
                step="0.10"
                value={precioUnitario === 0 ? "" : precioUnitario}
                onFocus={(e) => e.target.select()}
                onChange={(e) => setPrecioUnitario(e.target.value === "" ? 0 : Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border border-alba-border text-sm outline-none"
              />
            </div>
          )}

          <input
            type="number"
            min="1"
            value={cantidad}
            onChange={(e) => setCantidad(e.target.value)}
            placeholder="Cantidad"
            className="w-full px-3 py-2 rounded-lg border border-alba-border text-sm outline-none"
          />

          {error && (
            <p className="text-red-500 text-xs font-medium">{error}</p>
          )}

          <button
            onClick={guardar}
            className="w-full bg-alba-text text-alba-bg py-2.5 rounded-lg font-medium mt-2"
          >
            Registrar venta
          </button>
        </div>
      </div>
    </div>
  );
}

export default Ventas;
