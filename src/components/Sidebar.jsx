import { useNavigate, useLocation } from "react-router-dom";
import { Home, LayoutGrid, Package, ShoppingCart, Heart, BarChart3, Users, Settings, LogOut } from "lucide-react";

const MENU = [
  { label: "Resumen", icon: Home, path: "/panel" },
  { label: "Catálogo", icon: LayoutGrid, path: "/panel/catalogo" },
  { label: "Ventas", icon: ShoppingCart, path: "/panel/ventas" },
  { label: "Favoritos", icon: Heart, path: "/panel/favoritos" },
  { label: "Reportes", icon: BarChart3, path: "/panel/reportes" },
  { label: "Usuarios", icon: Users, path: "/panel/usuarios" },
  { label: "Configuración", icon: Settings, path: "/panel/configuracion" },
];

export function SolAlba({ size = 20 }) {
  return (
    <svg width={size} height={size * 0.6} viewBox="0 0 32 20" fill="none">
      <path d="M16 2 V6 M9 3.5 L11 6.5 M23 3.5 L21 6.5 M4 9 L7.5 9.5 M28 9 L24.5 9.5"
        stroke="#B8842E" strokeWidth="1.3" strokeLinecap="round" />
      <path d="M6 15 C6 9.5 10.5 5.5 16 5.5 C21.5 5.5 26 9.5 26 15"
        stroke="#B8842E" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M2 17 C6 14.5 26 14.5 30 17" stroke="#B8842E" strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  );
}

export function LogoAlba() {
  return (
    <div className="flex flex-col items-center mb-8">
      <SolAlba size={28} />
      <span className="text-lg font-bold tracking-wide mt-1">ALBA</span>
      <span className="text-[10px] tracking-[0.2em] text-alba-muted">STORE</span>
    </div>
  );
}

function Sidebar({ abierto, onCerrar }) {
  const navigate = useNavigate();
  const location = useLocation();

  const ir = (path) => {
    navigate(path);
    onCerrar();
  };

  return (
    <>
      {abierto && (
        <div onClick={onCerrar} className="fixed inset-0 bg-black/30 z-20 md:hidden"></div>
      )}

      <aside
        className={`fixed md:static top-0 left-0 h-full w-60 bg-alba-bg border-r border-alba-border p-5 flex flex-col z-30 transition-transform duration-300 ${
          abierto ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div onClick={() => ir("/")} className="cursor-pointer">
          <LogoAlba />
        </div>

        <nav className="flex flex-col gap-1 flex-1">
          {MENU.map(({ label, icon: Icon, path }) => {
            const activo = location.pathname === path;
            return (
              <button
                key={label}
                onClick={() => ir(path)}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-left transition-colors ${
                  activo
                    ? "bg-alba-border font-medium text-alba-text"
                    : "text-alba-muted hover:bg-alba-border/60"
                }`}
              >
                <Icon size={17} />
                {label}
              </button>
            );
          })}
        </nav>

        <button className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-alba-muted hover:bg-alba-border/60">
          <LogOut size={17} />
          Cerrar sesión
        </button>
      </aside>
    </>
  );
}

export default Sidebar;