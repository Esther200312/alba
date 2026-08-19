import { useState } from "react";
import { Menu, Plus, X, Shield, Trash2, Pencil } from "lucide-react";
import Sidebar from "../components/Sidebar";
import { useUsuarios } from "../context/UsuariosContext";

const COLOR_ROL = { Administrador: "#B8842E", Vendedor: "#4F7350" };

function Usuarios() {
  const { usuarios, agregarUsuario, editarUsuario, eliminarUsuario } = useUsuarios();
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [usuarioEditar, setUsuarioEditar] = useState(null);

  const abrirNuevo = () => { setUsuarioEditar(null); setModalAbierto(true); };
  const abrirEditar = (u) => { setUsuarioEditar(u); setModalAbierto(true); };

  const guardar = async (datos) => {
    try {
      if (usuarioEditar) {
        await editarUsuario(usuarioEditar.id, datos);
      } else {
        await agregarUsuario(datos.nombre, datos.rol, datos.estado);
      }
      setModalAbierto(false);
    } catch (error) {
      alert("No se pudo guardar: " + error.message);
    }
  };
  const confirmarEliminar = (id) => {
    eliminarUsuario(id);
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
              <h2 className="text-2xl md:text-3xl font-bold mb-1">Usuarios</h2>
              <p className="text-alba-muted text-sm">Quién forma parte del equipo Alba.</p>
            </div>
            <button onClick={abrirNuevo} className="flex items-center gap-1.5 bg-alba-text text-alba-bg px-4 py-2 rounded-lg text-sm font-medium">
              <Plus size={16} /> Agregar persona
            </button>
          </div>

          <div className="space-y-2">
            {usuarios.map((u) => (
              <div key={u.id} className="flex items-center gap-3 border border-alba-border rounded-xl p-3">
                <div className="w-10 h-10 rounded-full bg-alba-border flex items-center justify-center text-sm font-medium shrink-0">
                  {u.iniciales}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">{u.nombre}</p>
                  <span className="inline-flex items-center gap-1 text-xs font-medium" style={{ color: COLOR_ROL[u.rol] || "#767268" }}>
                    <Shield size={12} /> {u.rol} · {u.estado}
                  </span>
                </div>
                <button onClick={() => abrirEditar(u)} className="p-1.5 rounded-lg hover:bg-alba-border text-alba-muted">
                  <Pencil size={15} />
                </button>
                <button onClick={() => confirmarEliminar(u.id)} className="p-1.5 rounded-lg hover:bg-alba-border text-red-500">
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
          </div>
        </main>
      </div>

      {modalAbierto && (
        <ModalUsuario usuario={usuarioEditar} onClose={() => setModalAbierto(false)} onGuardar={guardar} />
      )}
    </div>
  );
}

function ModalUsuario({ usuario, onClose, onGuardar }) {
  const esEdicion = !!usuario;
  const [nombre, setNombre] = useState(usuario?.nombre || "");
  const [rol, setRol] = useState(usuario?.rol || "Vendedor");
  const [estado, setEstado] = useState(usuario?.estado || "Activo");

  const guardar = () => {
    if (!nombre.trim()) return;
    onGuardar({ nombre, rol, estado });
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-alba-bg rounded-2xl p-6 w-full max-w-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold">{esEdicion ? "Editar persona" : "Agregar persona"}</h3>
          <button onClick={onClose}><X size={20} /></button>
        </div>

        <div className="space-y-3">
          <input placeholder="Nombre" value={nombre} onChange={(e) => setNombre(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-alba-border text-sm outline-none" />
          <select value={rol} onChange={(e) => setRol(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-alba-border text-sm outline-none">
            <option value="Administradora">Administradora</option>
            <option value="Administrador">Administrador</option>
            <option value="Vendedora">Vendedora</option>
            <option value="Vendedor">Vendedor</option>
          </select>
          <select value={estado} onChange={(e) => setEstado(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-alba-border text-sm outline-none">
            <option value="Activo">Activo</option>
            <option value="Inactivo">Inactivo</option>
          </select>

          <button onClick={guardar} className="w-full bg-alba-text text-alba-bg py-2.5 rounded-lg font-medium mt-2">
            {esEdicion ? "Guardar cambios" : "Guardar"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Usuarios;