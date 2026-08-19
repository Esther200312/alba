import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../supabase";

const UsuariosContext = createContext(null);

export function UsuariosProvider({ children }) {
  const [usuarios, setUsuarios] = useState([]);

  const cargarUsuarios = async () => {
    const { data, error } = await supabase.from("usuarios").select("*").order("created_at");
    if (error) {
      console.error("Error al cargar usuarios:", error);
      return;
    }
    const conIniciales = data.map((u) => ({
      ...u,
      rol: u.rollo,
      iniciales: u.nombre.slice(0, 2).toUpperCase(),
    }));
    setUsuarios(conIniciales);
  };

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const agregarUsuario = async (nombre, rol, estado = "Activo") => {
    const { error } = await supabase.from("usuarios").insert([{ nombre, rollo: rol, estado }]);
    if (error) {
      console.error("Error al agregar usuario:", error);
      throw error;
    }
    await cargarUsuarios();
  };

  const editarUsuario = async (id, datos) => {
    const cambios = { ...datos };
    if (cambios.rol) {
      cambios.rollo = cambios.rol;
      delete cambios.rol;
    }
    delete cambios.iniciales;

    const { error } = await supabase.from("usuarios").update(cambios).eq("id", id);
    if (error) {
      console.error("Error al editar usuario:", error);
      throw error;
    }
    await cargarUsuarios();
  };

  const eliminarUsuario = async (id) => {
    const { error } = await supabase.from("usuarios").delete().eq("id", id);
    if (error) {
      console.error("Error al eliminar usuario:", error);
      throw error;
    }
    await cargarUsuarios();
  };

  return (
    <UsuariosContext.Provider value={{ usuarios, agregarUsuario, editarUsuario, eliminarUsuario }}>
      {children}
    </UsuariosContext.Provider>
  );
}

export function useUsuarios() {
  return useContext(UsuariosContext);
}