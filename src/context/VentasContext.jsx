import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../supabase";

const VentasContext = createContext(null);

export function VentasProvider({ children }) {
  const [ventas, setVentas] = useState([]);

  const cargarVentas = async () => {
    const { data, error } = await supabase.from("ventas").select("*").order("id");
    if (!error) setVentas(data);
  };

  useEffect(() => {
    cargarVentas();
    const canal = supabase
      .channel("ventas-cambios")
      .on("postgres_changes", { event: "*", schema: "public", table: "ventas" }, () => {
        cargarVentas();
      })
      .subscribe();
    return () => supabase.removeChannel(canal);
  }, []);

  const registrarVenta = async (venta) => {
  const { error } = await supabase.from("ventas").insert([venta]);
  if (error) {
    console.error("Error al registrar venta:", error);
    throw error;
  }
  await cargarVentas();
};

  return (
    <VentasContext.Provider value={{ ventas, registrarVenta }}>
      {children}
    </VentasContext.Provider>
  );
}

export function useVentas() {
  return useContext(VentasContext);
}