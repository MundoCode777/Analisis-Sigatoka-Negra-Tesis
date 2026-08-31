import bannerImg from "../../assets/image.png";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Swal from "sweetalert2";
import Sidebar from "../../components/layout/Sidebar";
import Topbar from "../../components/layout/Topbar";


// ── Configuración de colores para la UI (Ya no tiene datos, solo estilos) ──
const severidadConfig = {
  Moderado: { bg: "bg-amber-100", text: "text-amber-700", border: "border-amber-200" },
  Severo:   { bg: "bg-red-100",   text: "text-red-600",  border: "border-red-200" },
  Leve:     { bg: "bg-emerald-100", text: "text-emerald-700", border: "border-emerald-200" },
};

const resultadoColor = {
  "Sigatoka Negra": "text-red-500",
  "Sana":           "text-emerald-600",
};

// ── Componente principal ───────────────────────────────────────────
export default function HomePage() {
  const navigate = useNavigate();
  const { user, handleLogout } = useAuth();
  const [activePage, setActivePage] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const canvasRef = useRef(null);

  // 🔥 ESTADOS VACÍOS (Sin datos falsos)
  const [loading, setLoading] = useState(true);
  const [detecciones, setDetecciones] = useState([]);
  const [lotes, setLotes] = useState([]);
  const [evolucion, setEvolucion] = useState([]);
  
  // Métricas Generales
  const [metrics, setMetrics] = useState({
    totalScans: 0,
    sigatokaNegra: 0,
    moderadoSevero: 0,
    estaSemana: 0
  });

  const fullName = user?.displayName || user?.email?.split("@")[0] || "Luis. A Rodríguez V";
  const initials = fullName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);

  // 🔥 SIMULACIÓN DE CARGA DE DATOS (Reemplaza esto con tu API real)
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      // Simula un tiempo de espera de red
      await new Promise(resolve => setTimeout(resolve, 800));

      // Aquí iría: const response = await fetch('/api/dashboard'); const data = await response.json();
      
      // Datos de ejemplo que vendrían de tu base de datos
      const fakeApiResponse = {
        metrics: { totalScans: 128, sigatokaNegra: 68, moderadoSevero: 42, estaSemana: 24 },
        detecciones: [
          { id: 1, fecha: "24/07/2025", hora: "09:15 a.m.", lote: "Lote 7", bloque: "Bloque E", resultado: "Sigatoka Negra", severidad: "Moderado" },
          { id: 2, fecha: "24/07/2025", hora: "08:45 a.m.", lote: "Lote 6", bloque: "Bloque A", resultado: "Sigatoka Negra", severidad: "Severo" },
          { id: 3, fecha: "24/07/2025", hora: "04:30 p.m.", lote: "Lote 5", bloque: "Bloque D", resultado: "Sigatoka Negra", severidad: "Leve" },
        ],
        lotes: [
          { nombre: "Lote 7 - Bloque B", cantidad: 28 },
          { nombre: "Lote 6 - Bloque A", cantidad: 24 },
          { nombre: "Lote 5 - Bloque D", cantidad: 20 },
        ],
        evolucion: [
          { dia: "18 Jul", val: 22 }, { dia: "19 Jul", val: 38 }, { dia: "20 Jul", val: 45 },
          { dia: "21 Jul", val: 30 }, { dia: "22 Jul", val: 52 }, { dia: "23 Jul", val: 48 }, { dia: "24 Jul", val: 68 }
        ]
      };

      setMetrics(fakeApiResponse.metrics);
      setDetecciones(fakeApiResponse.detecciones);
      setLotes(fakeApiResponse.lotes);
      setEvolucion(fakeApiResponse.evolucion);
      
      setLoading(false);
    };

    fetchData();
  }, []);

  // Dibujar gráfica cuando los datos de evolución cambien
  useEffect(() => {
    if (evolucion.length > 0) {
      dibujarGrafica();
    }
  }, [evolucion]);

  const dibujarGrafica = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W = canvas.width, H = canvas.height;
    const pad = { top: 20, right: 20, bottom: 30, left: 40 };
    
    const vals = evolucion.map(e => e.val);
    if (vals.length === 0) return;

    const maxVal = Math.max(...vals);

    ctx.clearRect(0, 0, W, H);

    // Grid
    for (let i = 0; i <= 4; i++) {
      const y = pad.top + ((H - pad.top - pad.bottom) / 4) * i;
      ctx.strokeStyle = "#f0f0f0";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(pad.left, y);
      ctx.lineTo(W - pad.right, y);
      ctx.stroke();
      const label = Math.round(maxVal - (maxVal / 4) * i);
      ctx.fillStyle = "#9ca3af";
      ctx.font = "10px Arial, sans-serif";
      ctx.textAlign = "right";
      ctx.fillText(label, pad.left - 6, y + 4);
    }

    const pts = evolucion.map((e, i) => ({
      x: pad.left + (i / (evolucion.length - 1)) * (W - pad.left - pad.right),
      y: pad.top + (1 - (e.val / maxVal)) * (H - pad.top - pad.bottom),
    }));

    // Área
    const grad = ctx.createLinearGradient(0, pad.top, 0, H - pad.bottom);
    grad.addColorStop(0, "rgba(34, 107, 34, 0.2)");
    grad.addColorStop(1, "rgba(34, 107, 34, 0)");
    ctx.beginPath();
    ctx.moveTo(pts[0].x, H - pad.bottom);
    pts.forEach(p => ctx.lineTo(p.x, p.y));
    ctx.lineTo(pts[pts.length - 1].x, H - pad.bottom);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();

    // Línea
    ctx.beginPath();
    ctx.strokeStyle = "#226b22";
    ctx.lineWidth = 2.5;
    ctx.lineJoin = "round";
    pts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
    ctx.stroke();

    // Puntos
    pts.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
      ctx.fillStyle = "#226b22";
      ctx.fill();
      ctx.strokeStyle = "white";
      ctx.lineWidth = 2;
      ctx.stroke();
    });

    // Labels
    evolucion.forEach((e, i) => {
      const x = pad.left + (i / (evolucion.length - 1)) * (W - pad.left - pad.right);
      ctx.fillStyle = "#6b7280";
      ctx.font = "10px Arial, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(e.dia, x, H - 4);
    });
  };

  const confirmLogout = () => {
    Swal.fire({
      title: "¿Cerrar sesión?",
      text: "Tendrás que iniciar sesión de nuevo.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#226b22",
      cancelButtonColor: "#9ca3af",
      confirmButtonText: "Sí, cerrar sesión",
      cancelButtonText: "Cancelar",
    }).then(result => {
      if (result.isConfirmed) {
        handleLogout();
        navigate("/login");
      }
    });
  };

  const navItems = [
    { key: "dashboard",  label: "Dashboard",                  icon: "📊" },
    { key: "usuarios",   label: "Usuarios",                   icon: "👥" },
    { key: "deteccion",  label: "Detección de Enfermedades",  icon: "🔬" },
    { key: "seguimiento",label: "Recomendación y Seguimiento",icon: "🌿" },
    { key: "geolocal",   label: "Geolocalización y Registro",icon: "📍" },
    { key: "informes",   label: "Visualización e Informes",   icon: "📈" },
  ];

  const handleNav = (key) => {
    setActivePage(key);
    setSidebarOpen(false);

    if (key === "deteccion") navigate("/deteccion");
    else if (key === "geolocal") navigate("/map");
    else if (key === "dashboard") navigate("/home");
    else if (key === "usuarios") navigate("/usuarios");
    else if (key === "seguimiento") navigate("/seguimiento");
    else if (key === "informes") navigate("/informes");
  };

  return (
    <div className="min-h-screen bg-white flex">

      {/* Overlay móvil */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/40 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* ── SIDEBAR ── */}
      <aside className={`fixed lg:sticky top-0 left-0 h-screen w-[220px] bg-[#1a3a1a] flex flex-col z-40 transition-transform duration-300
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      >
        <div className="flex items-center gap-3 px-4 py-5 border-b border-white/10">
          <div className="w-10 h-10 rounded-xl bg-green-600 flex items-center justify-center shrink-0">
            <svg width="22" height="22" viewBox="0 0 80 80" fill="none">
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

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map(item => (
            <button
              key={item.key}
              onClick={() => handleNav(item.key)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition text-left
                ${activePage === item.key
                  ? "bg-green-600 text-white font-semibold"
                  : "text-green-100/70 hover:bg-white/10 hover:text-white"
                }`}
            >
              <span className="text-base shrink-0">{item.icon}</span>
              <span className="leading-snug">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="px-3 pb-4 space-y-2 border-t border-white/10 pt-3">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/10">
            <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="text-white text-xs font-semibold truncate">{fullName}</p>
              <p className="text-green-300 text-[11px] truncate">Técnico de Campo</p>
            </div>
            <span className="text-white/40 text-xs ml-auto shrink-0">▾</span>
          </div>
          <button
            onClick={confirmLogout}
            className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-green-100/70 hover:bg-white/10 hover:text-white transition text-sm"
          >
            <span>🚪</span> Cerrar sesión
          </button>
        </div>
      </aside>

      {/* ── CONTENIDO PRINCIPAL ── */}
      <div className="flex-1 min-h-screen flex flex-col">

        <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden w-9 h-9 rounded-lg flex items-center justify-center hover:bg-gray-100"
            >
              ☰
            </button>
            <div>
              <h1 className="font-bold text-lg text-gray-900 leading-tight">
                Panel de Control - Dashboard
              </h1>
              <p className="text-xs text-gray-500">
                Resumen general de las operaciones de Sigatoka Negra
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => window.location.reload()}
              className="text-sm font-medium text-green-700 hover:underline hidden sm:block"
            >
              ↻ Recargar datos
            </button>
            <button className="relative w-10 h-10 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition">
              🔔
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-green-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">3</span>
            </button>

            <div className="flex items-center gap-2.5 cursor-pointer">
              <div className="w-9 h-9 rounded-full bg-green-700 flex items-center justify-center text-white text-sm font-bold">
                {initials}
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-semibold text-gray-800 leading-tight">{fullName}</p>
                <p className="text-xs text-gray-500">Técnico de Campo</p>
              </div>
              <span className="text-gray-400 text-xs">▾</span>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 space-y-5 overflow-auto bg-white">

          {/* 🔄 LOADING STATE */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-500">
              <div className="w-12 h-12 border-4 border-green-200 border-t-green-700 rounded-full animate-spin mb-4"></div>
              <p className="font-medium">Cargando datos del panel...</p>
              <p className="text-sm text-gray-400">Consultando métricas y detecciones recientes</p>
            </div>
          ) : (
            <>
              {/* STATS - 4 tarjetas */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { icon: "📋", bg: "bg-green-50",  iconBg: "bg-green-100",  val: metrics.totalScans,     label: "Detecciones Totales",    sub: "↑ +15 esta semana" },
                  { icon: "🍃", bg: "bg-red-50",    iconBg: "bg-red-100",    val: metrics.sigatokaNegra,  label: "Sigatoka Negra",         sub: "53.1% del total" },
                  { icon: "🛡️", bg: "bg-orange-50", iconBg: "bg-orange-100", val: metrics.moderadoSevero, label: "Nivel Moderado - Severo", sub: "32.8% del total" },
                  { icon: "📅", bg: "bg-blue-50",   iconBg: "bg-blue-100",   val: metrics.estaSemana,     label: "Detecciones esta semana", sub: "+6 resp. semana pasada" },
                ].map((s, i) => (
                  <div key={i} className={`${s.bg} rounded-2xl p-4 border border-gray-100`}>
                    <div className="flex items-start gap-3">
                      <div className={`${s.iconBg} w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0`}>
                        {s.icon}
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-gray-900">{s.val}</p>
                        <p className="text-xs text-gray-500 leading-tight mt-0.5">{s.label}</p>
                        <p className="text-xs font-medium mt-1 text-gray-600">{s.sub}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* TABLA + DONUT */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

                {/* Detecciones Recientes */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 overflow-hidden">
                  <div className="flex items-center justify-between px-5 py-3 border-b border-gray-200">
                    <h2 className="font-bold text-gray-800">Detecciones Recientes</h2>
                    <button
                      onClick={() => navigate("/deteccion")}
                      className="text-green-700 text-sm font-medium hover:underline"
                    >
                      Ver todas
                    </button>
                  </div>
                  
                  {detecciones.length === 0 ? (
                    <div className="p-8 text-center text-gray-400 text-sm">No hay detecciones recientes registradas.</div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-gray-50 text-gray-500 text-xs">
                            <th className="text-left px-5 py-3 font-medium">Fecha</th>
                            <th className="text-left px-3 py-3 font-medium">Lote</th>
                            <th className="text-left px-3 py-3 font-medium">Resultado</th>
                            <th className="text-left px-3 py-3 font-medium">Severidad</th>
                            <th className="text-center px-3 py-3 font-medium">Estado</th>
                          </tr>
                        </thead>
                        <tbody>
                          {detecciones.map((d) => {
                            const sev = severidadConfig[d.severidad] || severidadConfig.Leve;
                            return (
                              <tr
                                key={d.id}
                                className="border-t border-gray-100 hover:bg-gray-50 transition cursor-pointer"
                                onClick={() => navigate("/deteccion")}
                              >
                                <td className="px-5 py-3">
                                  <div>
                                    <p className="font-medium text-gray-800 text-xs">{d.fecha}</p>
                                    <p className="text-gray-400 text-[11px]">{d.hora}</p>
                                  </div>
                                </td>
                                <td className="px-3 py-3">
                                  <p className="text-xs font-medium text-gray-800">{d.lote}</p>
                                  <p className="text-[11px] text-gray-400">{d.bloque}</p>
                                </td>
                                <td className={`px-3 py-3 text-xs font-semibold ${resultadoColor[d.resultado] || "text-gray-600"}`}>
                                  {d.resultado}
                                </td>
                                <td className="px-3 py-3">
                                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${sev.bg} ${sev.text} ${sev.border}`}>
                                    {d.severidad}
                                  </span>
                                </td>
                                <td className="px-3 py-3 text-center">
                                  <span className="text-green-600 text-lg">👁️</span>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {/* Donut */}
                <div className="bg-white rounded-2xl border border-gray-200 p-5">
                  <h2 className="font-bold text-gray-800 mb-4 text-center">Detecciones por Nivel de Sigatoka Negra</h2>
                  <div className="flex flex-col items-center">
                    <DonutChart />
                    <div className="space-y-2 w-full mt-4">
                      {[
                        { label: "Leve", val: 44, pct: "34.4%", color: "bg-emerald-500" },
                        { label: "Moderado", val: 42, pct: "32.8%", color: "bg-amber-400" },
                        { label: "Severo", val: 24, pct: "18.8%", color: "bg-red-500" },
                        { label: "Sana", val: 18, pct: "14.1%", color: "bg-green-900" },
                      ].map((item, i) => (
                        <div key={i} className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <span className={`w-3 h-3 rounded-sm shrink-0 ${item.color}`} />
                            <span className="text-gray-600">{item.label}</span>
                          </div>
                          <span className="text-gray-800 font-medium">{item.val} ({item.pct})</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* GRÁFICA + LOTES + RESUMEN */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

                {/* Evolución */}
                <div className="bg-white rounded-2xl border border-gray-200 p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-bold text-gray-800">Evolución de Casos de Sigatoka Negra</h2>
                    <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">Últimos 7 días ▾</span>
                  </div>
                  <canvas ref={canvasRef} width={480} height={180} className="w-full" />
                </div>

                {/* Lotes + Resumen */}
                <div className="flex flex-col gap-4">

                  {/* Lotes */}
                  <div className="bg-white rounded-2xl border border-gray-200 p-5">
                    <div className="flex items-center justify-between mb-3">
                      <h2 className="font-bold text-gray-800 text-sm">Lotes con Presencia de Sigatoka Negra</h2>
                      <button
                        onClick={() => navigate("/map")}
                        className="text-green-700 text-xs font-medium hover:underline"
                      >
                        Ver mapa
                      </button>
                    </div>
                    
                    {lotes.length === 0 ? (
                      <div className="text-center text-gray-400 text-xs py-2">No hay datos de lotes disponibles.</div>
                    ) : (
                      <div className="space-y-2.5">
                        {lotes.map((lote, i) => (
                          <div key={i} className="flex items-center gap-3 text-xs">
                            <span className="text-gray-600 w-32 shrink-0 truncate">{lote.nombre}</span>
                            <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-green-700 rounded-full"
                                style={{ width: `${(lote.cantidad / 28) * 100}%` }}
                              />
                            </div>
                            <span className="text-gray-800 font-semibold w-5 text-right shrink-0">{lote.cantidad}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Resumen */}
                  <div className="bg-white rounded-2xl border border-gray-200 p-5">
                    <h2 className="font-bold text-gray-800 text-sm mb-3 text-center">Resumen de Casos de Sigatoka Negra</h2>
                    <div className="grid grid-cols-4 gap-2">
                      {[
                        { icon: "✅", val: 18, label: "Sanas", pct: "14.1%" },
                        { icon: "🍂", val: 68, label: "Sigatoka Negra", pct: "53.1%" },
                        { icon: "⚠️", val: 42, label: "Moderado - Severo", pct: "32.8%" },
                        { icon: "📊", val: 128, label: "Total", pct: "" },
                      ].map((item, i) => (
                        <div key={i} className="text-center">
                          <div className="text-2xl mb-1">{item.icon}</div>
                          <p className={`font-bold text-lg ${i === 0 ? 'text-emerald-600' : i === 1 ? 'text-red-500' : i === 2 ? 'text-amber-600' : 'text-blue-600'}`}>
                            {item.val}
                          </p>
                          <p className="text-[10px] text-gray-500 leading-tight">{item.label}</p>
                          {item.pct && <p className={`text-[10px] font-semibold ${i === 0 ? 'text-emerald-600' : i === 1 ? 'text-red-500' : i === 2 ? 'text-amber-600' : 'text-blue-600'}`}>
                            {item.pct}
                          </p>}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Footer */}
          <div className="flex items-center justify-center gap-2 py-2 border-t border-gray-200 mt-4">
            <span className="text-green-600 text-sm">🛡️</span>
            <p className="text-xs text-gray-500 text-center">
              Sistema Inteligente para la detección y monitoreo de Sigatoka Negra en cultivos de banano - Versión 2.1
            </p>
          </div>

        </main>
      </div>
    </div>
  );
}

// ── DonutChart ──
function DonutChart() {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W = canvas.width, H = canvas.height;
    const cx = W / 2, cy = H / 2;
    const r = Math.min(W, H) / 2 - 8;

    const datos = [
      { val: 44, color: "#10b981" },
      { val: 42, color: "#f59e0b" },
      { val: 24, color: "#ef4444" },
      { val: 18, color: "#14532d" },
    ];
    const total = datos.reduce((a, b) => a + b.val, 0);
    let startAngle = -Math.PI / 2;

    ctx.clearRect(0, 0, W, H);

    datos.forEach(d => {
      const slice = (d.val / total) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, r, startAngle, startAngle + slice);
      ctx.closePath();
      ctx.fillStyle = d.color;
      ctx.fill();
      startAngle += slice;
    });

    // Hueco
    ctx.beginPath();
    ctx.arc(cx, cy, r * 0.55, 0, Math.PI * 2);
    ctx.fillStyle = "white";
    ctx.fill();

    // Texto
    ctx.fillStyle = "#1f2937";
    ctx.font = "bold 18px Arial, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("128", cx, cy - 4);
    ctx.fillStyle = "#6b7280";
    ctx.font = "10px Arial, sans-serif";
    ctx.fillText("Total", cx, cy + 12);
  }, []);

  return <canvas ref={ref} width={140} height={140} />;
}