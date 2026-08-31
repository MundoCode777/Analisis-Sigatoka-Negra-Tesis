import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Swal from "sweetalert2";

const navItems = [
  { key: "dashboard",      label: "Dashboard",                    icon: "🏠", path: "/home",            section: null },
  { key: "usuarios",       label: "Usuarios",                     icon: "👥", path: "/usuarios",        section: null },
  { key: "deteccion",      label: "Detección de Sigatoka Negra",  icon: "🔬", path: "/deteccion",       section: "MÓDULOS" },
  { key: "recomendaciones",label: "Recomendación y Seguimiento",  icon: "🌿", path: "/recomendaciones", section: null },
  { key: "geolocalizacion",label: "Geolocalización y Registro",   icon: "📍", path: "/geolocalizacion", section: null },
  { key: "informes",       label: "Visualización e Informes",     icon: "📊", path: "/informes",        section: null },
];

export default function Sidebar() {
  const navigate   = useNavigate();
  const location   = useLocation();
  const { user, handleLogout } = useAuth();
  const [open, setOpen] = useState(false);

  const fullName = user?.displayName || user?.email?.split("@")[0] || "Usuario";
  const initials = fullName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);

  const isActive = (path) => location.pathname === path;

  const confirmLogout = () => {
    Swal.fire({
      title: "¿Cerrar sesión?",
      text: "Tendrás que iniciar sesión de nuevo.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#1f5e1f",
      cancelButtonColor: "#9ca3af",
      confirmButtonText: "Sí, cerrar sesión",
      cancelButtonText: "Cancelar",
      background: "#f5f2ec",
      customClass: { popup: "rounded-3xl" },
    }).then(r => {
      if (r.isConfirmed) {
        handleLogout();
        navigate("/login");
      }
    });
  };

  return (
    <>
      {/* ── Botón hamburguesa — visible cuando sidebar está cerrado ── */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed top-4 left-4 z-50 w-10 h-10 bg-[#1a3a1a] text-white rounded-xl flex items-center justify-center shadow-lg hover:bg-[#2a5a2a] transition"
          aria-label="Abrir menú"
        >
          <span className="text-lg">☰</span>
        </button>
      )}

      {/* ── Overlay oscuro ── */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40 transition-opacity"
          onClick={() => setOpen(false)}
        />
      )}

      {/* ── Sidebar ── */}
      <aside
        className={`fixed top-0 left-0 h-screen w-60 bg-[#1a3a1a] flex flex-col z-50 transition-transform duration-300 shadow-2xl
          ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Logo + cerrar */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-green-600 flex items-center justify-center shrink-0">
              <svg width="20" height="20" viewBox="0 0 80 80" fill="none">
                <ellipse cx="30" cy="40" rx="13" ry="20" fill="white" opacity="0.9" transform="rotate(-15 30 40)" />
                <ellipse cx="50" cy="38" rx="13" ry="20" fill="white" opacity="0.75" transform="rotate(15 50 38)" />
                <line x1="40" y1="60" x2="40" y2="72" stroke="white" strokeWidth="3" strokeLinecap="round" />
              </svg>
            </div>
            <div>
              <p className="text-white font-bold text-sm leading-tight">Sigatoka Negra</p>
              <p className="text-green-300 text-xs">Hacienda San Luis</p>
            </div>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="w-8 h-8 rounded-lg text-white/50 hover:text-white hover:bg-white/10 flex items-center justify-center transition shrink-0"
            aria-label="Cerrar menú"
          >
            ✕
          </button>
        </div>

        {/* Usuario */}
        <div className="flex items-center gap-2.5 px-4 py-3 border-b border-white/10">
          {user?.photoURL ? (
            <img
              src={user.photoURL}
              referrerPolicy="no-referrer"
              alt=""
              className="w-9 h-9 rounded-full object-cover shrink-0 border-2 border-green-400"
            />
          ) : (
            <div className="w-9 h-9 rounded-full bg-green-600 flex items-center justify-center text-white text-sm font-bold shrink-0">
              {initials}
            </div>
          )}
          <div className="min-w-0">
            <p className="text-white text-sm font-semibold truncate">{fullName}</p>
            <p className="text-green-300 text-xs">Técnico de Campo</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => (
            <div key={item.key}>
              {item.section && (
                <p className="text-green-400/60 text-[10px] font-semibold uppercase tracking-wider px-3 pt-3 pb-1">
                  {item.section}
                </p>
              )}
              <button
                onClick={() => { navigate(item.path); setOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs transition text-left
                  ${isActive(item.path)
                    ? "bg-green-600 text-white font-semibold"
                    : "text-green-100/70 hover:bg-white/10 hover:text-white"
                  }`}
              >
                <span className="text-base shrink-0">{item.icon}</span>
                <span className="leading-snug">{item.label}</span>
              </button>
            </div>
          ))}
        </nav>

        {/* Cerrar sesión */}
        <div className="px-3 pb-4 pt-3 border-t border-white/10">
          <button
            onClick={confirmLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-green-100/70 hover:bg-white/10 hover:text-white transition text-xs"
          >
            <span className="text-base">🚪</span>
            <span>Cerrar sesión</span>
          </button>
        </div>
      </aside>
    </>
  );
}