import { useState } from "react";
import { Menu, Search, Plus, Trash2, Pencil, X, Minus, Upload, Heart } from "lucide-react";
import Sidebar from "../components/Sidebar";
import { useProductos } from "../context/ProductosContext";

const COLOR_HEX = { negro: "#1c1c1c", azul: "#2f4f7a", beige: "#c9b79c", celeste: "#7fb3c9", blanco: "#e8e6e1" };

function totalStock(variantes) {
  return variantes.reduce((suma, v) => suma + Number(v.stock), 0);
}

function estadoProducto(variantes) {
  const total = totalStock(variantes);
  if (total === 0) return { texto: "Agotado", color: "#c0392b" };
  if (total <= 5) return { texto: "Poco stock", color: "#B8842E" };
  return { texto: "Disponible", color: "#4F7350" };
}

function Catalogo() {
  const { productos, agregarProducto, editarProducto, eliminarProducto, cambiarStockVariante, alternarFavorito } = useProductos();
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const [categoriaFiltro, setCategoriaFiltro] = useState("Todas");
  const [productoAbierto, setProductoAbierto] = useState(null);
  const [modalFormulario, setModalFormulario] = useState(false);
  const [productoEditar, setProductoEditar] = useState(null);

  const categorias = ["Todas", ...new Set(productos.map((p) => p.categoria).filter(Boolean))];

  const filtrados = productos.filter((p) => {
    const coincideNombre = p.nombre.toLowerCase().includes(busqueda.toLowerCase());
    const coincideCategoria = categoriaFiltro === "Todas" || p.categoria === categoriaFiltro;
    return coincideNombre && coincideCategoria;
  });

  const guardarProducto = (datos) => {
    if (productoEditar) {
      editarProducto(productoEditar.id, datos);
    } else {
      agregarProducto(datos);
    }
    setModalFormulario(false);
    setProductoEditar(null);
  };

  const confirmarEliminar = (id) => {
    if (confirm("¿Seguro que quieres eliminar este producto?")) {
      eliminarProducto(id);
      setProductoAbierto(null);
    }
  };

  const abrirEditar = (producto) => {
    setProductoEditar(producto);
    setModalFormulario(true);
    setProductoAbierto(null);
  };

  return (
    <div className="min-h-screen bg-alba-bg text-alba-text flex">
      <Sidebar abierto={menuAbierto} onCerrar={() => setMenuAbierto(false)} />

      <div className="flex-1 min-w-0">
        <div className="flex items-center px-5 md:px-8 py-4 border-b border-alba-border md:hidden">
          <button onClick={() => setMenuAbierto(true)}><Menu size={22} /></button>
        </div>

        <main className="p-5 md:p-8">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-1">Catálogo de productos</h2>
              <p className="text-alba-muted text-sm">Toca una prenda para ver todos los detalles.</p>
            </div>
            <button
              onClick={() => { setProductoEditar(null); setModalFormulario(true); }}
              className="flex items-center gap-1.5 bg-alba-text text-alba-bg px-4 py-2 rounded-lg text-sm font-medium"
            >
              <Plus size={16} /> Agregar producto
            </button>
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            <div className="relative flex-1 min-w-[200px]">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-alba-muted" />
              <input
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Buscar producto..."
                className="w-full pl-8 pr-3 py-2 rounded-lg border border-alba-border text-sm outline-none"
              />
            </div>
            <select
              value={categoriaFiltro}
              onChange={(e) => setCategoriaFiltro(e.target.value)}
              className="px-3 py-2 rounded-lg border border-alba-border text-sm outline-none text-alba-muted"
            >
              {categorias.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtrados.map((p) => {
              const estado = estadoProducto(p.variantes);
              return (
                <div
                  key={p.id}
                  className="text-left rounded-2xl overflow-hidden border border-alba-border hover:shadow-md transition-shadow relative"
                >
                  <button
                    onClick={(e) => { e.stopPropagation(); alternarFavorito(p.id); }}
                    className="absolute top-2 right-2 z-10 bg-alba-bg/90 rounded-full p-1.5"
                  >
                    <Heart size={16} fill={p.favorito ? "#c0392b" : "none"} color={p.favorito ? "#c0392b" : "#767268"} />
                  </button>
                  <button onClick={() => setProductoAbierto(p)} className="text-left w-full">
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
                  </button>
                </div>
              );
            })}
          </div>

          {filtrados.length === 0 && (
            <p className="text-center text-alba-muted py-16">No hay productos que coincidan.</p>
          )}
        </main>
      </div>

      {productoAbierto && (
        <DetalleProducto
          producto={productoAbierto}
          onClose={() => setProductoAbierto(null)}
          onEditar={() => abrirEditar(productoAbierto)}
          onEliminar={() => confirmarEliminar(productoAbierto.id)}
          onCambiarStock={(indiceVariante, delta) => {
            cambiarStockVariante(productoAbierto.id, indiceVariante, delta);
            setProductoAbierto((prev) => ({
              ...prev,
              variantes: prev.variantes.map((v, i) =>
                i === indiceVariante ? { ...v, stock: Math.max(0, v.stock + delta) } : v
              ),
            }));
          }}
        />
      )}

      {modalFormulario && (
        <ModalProducto
          producto={productoEditar}
          onClose={() => { setModalFormulario(false); setProductoEditar(null); }}
          onGuardar={guardarProducto}
        />
      )}
    </div>
  );
}

function DetalleProducto({ producto, onClose, onEditar, onEliminar, onCambiarStock }) {
  const estado = estadoProducto(producto.variantes);

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-alba-bg rounded-2xl w-full max-w-md max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="relative">
          <img src={producto.foto} alt={producto.nombre} className="w-full aspect-[4/3] object-cover" />
          <button onClick={onClose} className="absolute top-3 right-3 bg-alba-bg rounded-full p-1.5 shadow">
            <X size={18} />
          </button>
        </div>

        <div className="p-5">
          <div className="flex items-start justify-between mb-1">
            <h3 className="text-xl font-bold">{producto.nombre}</h3>
            <span className="text-sm font-medium shrink-0 ml-2" style={{ color: estado.color }}>
              {estado.texto}
            </span>
          </div>
          <p className="text-alba-muted text-sm mb-4">{producto.categoria}</p>
          <p className="text-2xl font-bold mb-5">S/ {producto.precio.toFixed(2)}</p>

          <p className="text-xs font-medium text-alba-muted mb-2">Tallas y colores</p>
          <div className="space-y-2 mb-5">
            {producto.variantes.map((v, i) => (
              <div key={i} className="flex items-center gap-3 bg-alba-border/30 rounded-lg px-3 py-2">
                <span className="w-3.5 h-3.5 rounded-full inline-block shrink-0" style={{ background: COLOR_HEX[v.color.toLowerCase()] || "#999" }} />
                <span className="text-sm flex-1">{v.color} · Talla {v.talla}</span>
                <div className="flex items-center gap-2">
                  <button onClick={() => onCambiarStock(i, -1)} className="w-7 h-7 rounded-full border border-alba-border flex items-center justify-center hover:bg-alba-bg">
                    <Minus size={13} />
                  </button>
                  <span className="w-6 text-center text-sm font-medium">{v.stock}</span>
                  <button onClick={() => onCambiarStock(i, 1)} className="w-7 h-7 rounded-full border border-alba-border flex items-center justify-center hover:bg-alba-bg">
                    <Plus size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <button onClick={onEditar} className="flex-1 flex items-center justify-center gap-1.5 border border-alba-border py-2.5 rounded-lg text-sm font-medium">
              <Pencil size={15} /> Editar
            </button>
            <button onClick={onEliminar} className="flex-1 flex items-center justify-center gap-1.5 border border-red-200 text-red-500 py-2.5 rounded-lg text-sm font-medium">
              <Trash2 size={15} /> Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ModalProducto({ producto, onClose, onGuardar }) {
  const esEdicion = !!producto;
  const [nombre, setNombre] = useState(producto?.nombre || "");
  const [categoria, setCategoria] = useState(producto?.categoria || "");
  const [precio, setPrecio] = useState(producto?.precio || "");
  const [foto, setFoto] = useState(producto?.foto || "");
  const [variantes, setVariantes] = useState(
    producto?.variantes?.length ? producto.variantes : [{ talla: "", color: "", stock: "" }]
  );

  const cambiarVariante = (i, campo, valor) => {
    setVariantes((prev) => prev.map((v, idx) => (idx === i ? { ...v, [campo]: valor } : v)));
  };
  const agregarFila = () => setVariantes((prev) => [...prev, { talla: "", color: "", stock: "" }]);
  const quitarFila = (i) => setVariantes((prev) => prev.filter((_, idx) => idx !== i));

  const [subiendoFoto, setSubiendoFoto] = useState(false);
  const { subirFotoReal } = useProductos();

  const subirFoto = async (e) => {
    const archivo = e.target.files[0];
    if (!archivo) return;
    setSubiendoFoto(true);
    const url = await subirFotoReal(archivo);
    setFoto(url);
    setSubiendoFoto(false);
  };

  const guardar = () => {
    if (!nombre.trim()) return;
    const variantesLimpias = variantes
      .filter((v) => v.color && v.talla)
      .map((v) => ({ ...v, stock: Number(v.stock) || 0 }));

    onGuardar({
      nombre, categoria, precio: Number(precio) || 0,
      foto: foto || "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=100",
      variantes: variantesLimpias,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-alba-bg rounded-2xl p-6 w-full max-w-md max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold">{esEdicion ? "Editar producto" : "Nuevo producto"}</h3>
          <button onClick={onClose}><X size={20} /></button>
        </div>

        <div className="space-y-3">
          <input placeholder="Nombre (ej. Pantalón YOU)" value={nombre} onChange={(e) => setNombre(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-alba-border text-sm outline-none" />
          <input placeholder="Categoría (ej. Pantalones)" value={categoria} onChange={(e) => setCategoria(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-alba-border text-sm outline-none" />
          <input placeholder="Precio (S/)" type="number" value={precio} onChange={(e) => setPrecio(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-alba-border text-sm outline-none" />

          <div>
            <label className="flex items-center gap-2 px-3 py-2 rounded-lg border border-dashed border-alba-border text-sm text-alba-muted cursor-pointer hover:bg-alba-border/30">
              <Upload size={15} />
              {subiendoFoto ? "Subiendo..." : foto ? "Cambiar foto" : "Subir foto"}
              <input type="file" accept="image/*" onChange={subirFoto} className="hidden" />
            </label>
            {foto && <img src={foto} className="w-16 h-16 rounded-lg object-cover mt-2" />}
          </div>

          <p className="text-xs font-medium text-alba-muted pt-1">Tallas y colores disponibles</p>

          {variantes.map((v, i) => (
            <div key={i} className="flex gap-2 items-center">
              <input placeholder="Talla" value={v.talla} onChange={(e) => cambiarVariante(i, "talla", e.target.value)}
                className="w-16 px-2 py-1.5 rounded-lg border border-alba-border text-sm outline-none" />
              <input placeholder="Color" value={v.color} onChange={(e) => cambiarVariante(i, "color", e.target.value)}
                className="flex-1 px-2 py-1.5 rounded-lg border border-alba-border text-sm outline-none" />
              <input placeholder="Stock" type="number" value={v.stock} onChange={(e) => cambiarVariante(i, "stock", e.target.value)}
                className="w-16 px-2 py-1.5 rounded-lg border border-alba-border text-sm outline-none" />
              {variantes.length > 1 && (
                <button onClick={() => quitarFila(i)} className="text-red-500 shrink-0">
                  <Trash2 size={15} />
                </button>
              )}
            </div>
          ))}

          <button onClick={agregarFila} className="text-sm font-medium text-alba-accent flex items-center gap-1">
            <Plus size={14} /> Otra talla/color
          </button>

          <button onClick={guardar} className="w-full bg-alba-text text-alba-bg py-2.5 rounded-lg font-medium mt-2">
            {esEdicion ? "Guardar cambios" : "Guardar producto"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Catalogo;