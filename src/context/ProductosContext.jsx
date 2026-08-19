import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../supabase";

const ProductosContext = createContext(null);

export function ProductosProvider({ children }) {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);

  const cargarProductos = async () => {
    const { data, error } = await supabase.from("productos").select("*").order("id");
    if (!error) setProductos(data);
    setCargando(false);
  };

  useEffect(() => {
    cargarProductos();

    // Escucha cambios en tiempo real
    const canal = supabase
      .channel("productos-cambios")
      .on("postgres_changes", { event: "*", schema: "public", table: "productos" }, () => {
        cargarProductos();
      })
      .subscribe();

    return () => supabase.removeChannel(canal);
  }, []);

  const subirFotoReal = async (archivo) => {
    const nombreArchivo = `${Date.now()}-${archivo.name}`;
    const { error } = await supabase.storage.from("fotos-productos").upload(nombreArchivo, archivo);
    if (error) {
      console.error("Error subiendo foto:", error);
      return null;
    }
    const { data } = supabase.storage.from("fotos-productos").getPublicUrl(nombreArchivo);
    return data.publicUrl;
  };

  const agregarProducto = async (nuevo) => {
    await supabase.from("productos").insert([nuevo]);
  };

  const editarProducto = async (id, datos) => {
    await supabase.from("productos").update(datos).eq("id", id);
  };

  const eliminarProducto = async (id) => {
    await supabase.from("productos").delete().eq("id", id);
  };

  const cambiarStockVariante = async (productoId, indiceVariante, delta) => {
    const producto = productos.find((p) => p.id === productoId);
    if (!producto) return;
    const variantes = producto.variantes.map((v, i) =>
      i === indiceVariante ? { ...v, stock: Math.max(0, v.stock + delta) } : v
    );
    await supabase.from("productos").update({ variantes }).eq("id", productoId);
  };

  const alternarFavorito = async (id) => {
    const producto = productos.find((p) => p.id === id);
    if (!producto) return;
    await supabase.from("productos").update({ favorito: !producto.favorito }).eq("id", id);
  };

  return (
    <ProductosContext.Provider
      value={{
        productos, cargando, agregarProducto, editarProducto, eliminarProducto,
        cambiarStockVariante, alternarFavorito, subirFotoReal,
      }}
    >
      {children}
    </ProductosContext.Provider>
  );
}

export function useProductos() {
  return useContext(ProductosContext);
}