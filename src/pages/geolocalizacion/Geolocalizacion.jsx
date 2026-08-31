import { useState } from "react";
import { useNavigate } from "react-router-dom";

// ── Datos simulados ────────────────────────────────────────────────
const LOTES_MAPA = [
  { id: 1, nombre: "Lote 1", area: "12.5 ha", severidad: "Sano",     color: "#22c55e", pin: "#22c55e", polygon: "40,15 250,10 245,140 55,150" },
  { id: 2, nombre: "Lote 2", area: "15.3 ha", severidad: "Leve",     color: "#eab308", pin: "#eab308", polygon: "250,10 430,60 380,180 245,140" },
  { id: 3, nombre: "Lote 3", area: "18.7 ha", severidad: "Moderado", color: "#f97316", pin: "#f97316", polygon: "380,180 430,60 560,90 540,240 400,260" },
  { id: 4, nombre: "Lote 4", area: "10.2 ha", severidad: "Severo",   color: "#ef4444", pin: "#ef4444", polygon: "245,140 380,180 400,260 250,300 200,220" },
  { id: 5, nombre: "Lote 5", area: "14.8 ha", severidad: "Sano",     color: "#22c55e", pin: "#22c55e", polygon: "400,260 540,240 600,320 470,380 380,340" },
];

const LOTES_TABLA = [
  { lote: "Lote 1", bloque: "Bloque A", area: 12.5, detecciones: 3, ultima: "24/07/2025", diagnostico: "Sano",           severidad: null },
  { lote: "Lote 2", bloque: "Bloque A", area: 15.3, detecciones: 5, ultima: "23/07/2025", diagnostico: "Sigatoka Negra", severidad: "Leve" },
  { lote: "Lote 3", bloque: "Bloque B", area: 18.7, detecciones: 7, ultima: "24/07/2025", diagnostico: "Sigatoka Negra", severidad: "Moderado" },
  { lote: "Lote 4", bloque: "Bloque B", area: 10.2, detecciones: 4, ultima: "22/07/2025", diagnostico: "Sigatoka Negra", severidad: "Severo" },
  { lote: "Lote 5", bloque: "Bloque C", area: 14.8, detecciones: 2, ultima: "21/07/2025", diagnostico: "Sano",           severidad: null },
];

const severidadConfig = {
  Leve:     { bg: "bg-yellow-100",  text: "text-yellow-700" },
  Moderado: { bg: "bg-orange-100",  text: "text-orange-700" },
  Severo:   { bg: "bg-red-100",     text: "text-red-600" },
};

const filtros = ["Todos los lotes", "Con detecciones", "Sigatoka Negra", "Sana", "Filtros"];

export default function Geolocalizacion() {
  const navigate = useNavigate();
  const [filtroActivo, setFiltroActivo] = useState("Todos los lotes");
  const [loteSeleccionado, setLoteSeleccionado] = useState(LOTES_MAPA[2]);

  const stats = [
    { icon: "🌾", bg: "bg-green-50",  val: "12",      label: "Lotes registrados",           sub: "En la hacienda" },
    { icon: "📍", bg: "bg-blue-50",   val: "28",      label: "Detecciones georreferenciadas", sub: "Este mes" },
    { icon: "🐛", bg: "bg-orange-50", val: "18",      label: "Lotes con diagnóstico",       sub: "Con afectación" },
    { icon: "🗺️", bg: "bg-teal-50",  val: "98.6 ha", label: "Área total monitoreada",      sub: "En producción" },
  ];

  return (
    <div className="min-h-screen bg-[#f4f6f4] p-4 sm:p-5 space-y-4">

      {/* STATS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-100 p-4 flex items-center gap-3">
            <div className={`${s.bg} w-14 h-14 rounded-xl flex items-center justify-center text-2xl shrink-0`}>
              {s.icon}
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 leading-tight">{s.val}</p>
              <p className="text-sm font-medium text-gray-700 leading-tight">{s.label}</p>
              <p className="text-xs text-gray-400">{s.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* MAPA + DETALLE */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Mapa */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-5">
          <h2 className="font-bold text-gray-800 mb-4">Mapa de Lotes y Detecciones</h2>

          <div className="flex gap-4">
            {/* Filtros laterales */}
            <div className="flex flex-col gap-2 w-36 shrink-0">
              {filtros.map(f => (
                <button
                  key={f}
                  onClick={() => setFiltroActivo(f)}
                  className={`text-left px-3 py-2.5 rounded-xl text-sm font-medium transition flex items-center gap-1.5 ${
                    filtroActivo === f
                      ? "bg-green-50 text-green-700 border border-green-200"
                      : "bg-gray-50 text-gray-600 hover:bg-gray-100 border border-transparent"
                  }`}
                >
                  {f === "Filtros" && <span>⚙️</span>} {f}
                </button>
              ))}
            </div>

            {/* Mapa satelital */}
            <div className="flex-1 relative rounded-2xl overflow-hidden" style={{ height: 400 }}>
              <img
                src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1200"
                alt="Vista satelital de lotes"
                className="w-full h-full object-cover"
              />

              {/* Overlay de polígonos */}
              <svg viewBox="0 0 620 400" className="absolute inset-0 w-full h-full">
                {LOTES_MAPA.map(l => (
                  <polygon
                    key={l.id}
                    points={l.polygon}
                    fill={l.color}
                    fillOpacity={loteSeleccionado.id === l.id ? 0.35 : 0.22}
                    stroke={l.color}
                    strokeWidth={loteSeleccionado.id === l.id ? 3 : 2}
                    className="cursor-pointer transition"
                    onClick={() => setLoteSeleccionado(l)}
                  />
                ))}
              </svg>

              {/* Pines + etiquetas */}
              {LOTES_MAPA.map(l => {
                const pts = l.polygon.split(" ").map(p => p.split(",").map(Number));
                const cx = pts.reduce((a, p) => a + p[0], 0) / pts.length;
                const cy = pts.reduce((a, p) => a + p[1], 0) / pts.length;
                return (
                  <div
                    key={l.id}
                    onClick={() => setLoteSeleccionado(l)}
                    className="absolute flex flex-col items-center cursor-pointer"
                    style={{ left: `${(cx / 620) * 100}%`, top: `${(cy / 400) * 100}%`, transform: "translate(-50%, -100%)" }}
                  >
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-white shadow-lg" style={{ backgroundColor: l.pin }}>
                      📍
                    </div>
                    <div className="bg-white/95 rounded-lg px-2 py-1 mt-1 shadow text-center">
                      <p className="text-[11px] font-bold text-gray-800 leading-tight">{l.nombre}</p>
                      <p className="text-[10px] text-gray-500 leading-tight">{l.area}</p>
                    </div>
                  </div>
                );
              })}

              {/* Controles zoom */}
              <div className="absolute top-3 right-3 flex flex-col gap-1.5">
                <button className="w-9 h-9 bg-white rounded-lg shadow flex items-center justify-center text-gray-700 font-bold hover:bg-gray-50">+</button>
                <button className="w-9 h-9 bg-white rounded-lg shadow flex items-center justify-center text-gray-700 font-bold hover:bg-gray-50">−</button>
                <button className="w-9 h-9 bg-white rounded-lg shadow flex items-center justify-center text-gray-700 hover:bg-gray-50">🗂️</button>
                <button className="w-9 h-9 bg-white rounded-lg shadow flex items-center justify-center text-gray-700 hover:bg-gray-50">🎯</button>
              </div>

              {/* Leyenda */}
              <div className="absolute bottom-3 left-3 bg-white/95 rounded-xl px-4 py-2 flex items-center gap-4 shadow">
                {[
                  { label: "Sano", color: "#22c55e" },
                  { label: "Leve", color: "#eab308" },
                  { label: "Moderado", color: "#f97316" },
                  { label: "Severo", color: "#ef4444" },
                ].map(item => (
                  <div key={item.label} className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-xs text-gray-600">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Detalle de la detección */}
        <div className="flex flex-col gap-4">
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <h2 className="font-bold text-gray-800 mb-3">Detalle de la Detección</h2>

            <span className="inline-block text-xs font-semibold px-3 py-1 rounded-full bg-green-100 text-green-700 mb-3">
              Lote 3 - Bloque B
            </span>

            <div className="rounded-2xl overflow-hidden mb-4" style={{ height: 130 }}>
              <img
                src="https://images.unsplash.com/photo-1591857177580-dc82b9ac4e1e?q=80&w=400"
                alt="Hoja detectada"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-400">Diagnóstico</p>
                <p className="text-sm font-bold text-red-500">Sigatoka Negra</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-1">Severidad</p>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-orange-100 text-orange-700">
                  Moderado
                </span>
              </div>
              <div className="h-px bg-gray-100" />
              <div className="flex items-start gap-2">
                <span className="text-green-600 shrink-0">📅</span>
                <div>
                  <p className="text-[11px] text-gray-400">Fecha</p>
                  <p className="text-xs font-semibold text-gray-800">24/07/2025 09:15 a.m.</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-600 shrink-0">📍</span>
                <div>
                  <p className="text-[11px] text-gray-400">Coordenadas (GPS)</p>
                  <p className="text-xs font-semibold text-gray-800">Latitud: -2.137456</p>
                  <p className="text-xs font-semibold text-gray-800">Longitud: -79.547821</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-600 shrink-0">📐</span>
                <div>
                  <p className="text-[11px] text-gray-400">Área del Lote</p>
                  <p className="text-xs font-semibold text-gray-800">18.7 ha</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-600 shrink-0">👤</span>
                <div>
                  <p className="text-[11px] text-gray-400">Registrado por</p>
                  <p className="text-xs font-semibold text-gray-800">Carlos Mendoza</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => navigate(`/deteccion/${loteSeleccionado.id}`)}
              className="w-full mt-4 py-3 bg-green-700 hover:bg-green-800 text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition"
            >
              👁️ Ver más detalles
            </button>
          </div>

          {/* Acciones rápidas */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <h2 className="font-bold text-gray-800 mb-3">Acciones Rápidas</h2>
            <div className="space-y-2">
              <button
                onClick={() => navigate("/lotes/registrar")}
                className="w-full py-3 bg-green-700 hover:bg-green-800 text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition"
              >
                ➕ Registrar nuevo lote
              </button>
              <button
                onClick={() => navigate("/deteccion")}
                className="w-full py-3 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition"
              >
                📍 Nueva detección GPS
              </button>
              <button
                onClick={() => navigate("/mapa-completo")}
                className="w-full py-3 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition"
              >
                🗺️ Ver mapa completo
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* TABLA LOTES REGISTRADOS */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="px-5 py-4">
          <h2 className="font-bold text-gray-800">Lotes Registrados</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-gray-400 text-xs">
                <th className="text-left px-5 py-3 font-medium">Lote</th>
                <th className="text-left px-3 py-3 font-medium">Bloque</th>
                <th className="text-left px-3 py-3 font-medium">Área (ha)</th>
                <th className="text-left px-3 py-3 font-medium">Detecciones</th>
                <th className="text-left px-3 py-3 font-medium">Última detección</th>
                <th className="text-left px-3 py-3 font-medium">Diagnóstico</th>
                <th className="text-left px-3 py-3 font-medium">Severidad</th>
                <th className="text-center px-3 py-3 font-medium">Acción</th>
              </tr>
            </thead>
            <tbody>
              {LOTES_TABLA.map((l, i) => {
                const sev = severidadConfig[l.severidad];
                return (
                  <tr key={i} className="border-t border-gray-50 hover:bg-gray-50 transition">
                    <td className="px-5 py-3 font-medium text-gray-800">{l.lote}</td>
                    <td className="px-3 py-3 text-gray-600">{l.bloque}</td>
                    <td className="px-3 py-3 text-gray-600">{l.area}</td>
                    <td className="px-3 py-3 text-gray-600">{l.detecciones}</td>
                    <td className="px-3 py-3 text-gray-600">{l.ultima}</td>
                    <td className={`px-3 py-3 font-semibold ${l.diagnostico === "Sigatoka Negra" ? "text-red-500" : "text-emerald-600"}`}>
                      {l.diagnostico}
                    </td>
                    <td className="px-3 py-3">
                      {l.severidad ? (
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${sev.bg} ${sev.text}`}>
                          {l.severidad}
                        </span>
                      ) : (
                        <span className="text-gray-300">–</span>
                      )}
                    </td>
                    <td className="px-3 py-3 text-center">
                      <button
                        onClick={() => navigate(`/lotes/${l.lote.replace(" ", "-").toLowerCase()}`)}
                        className="w-8 h-8 rounded-full bg-green-50 text-green-600 flex items-center justify-center mx-auto hover:bg-green-100 transition"
                      >
                        👁️
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-center gap-2 py-2 border-t border-gray-200 mt-4">
        <span className="text-green-600 text-sm">🛡️</span>
        <p className="text-xs text-gray-500 text-center">
          Sistema inteligente para la detección y monitoreo de Sigatoka Negra en cultivos de banano
        </p>
      </div>
    </div>
  );
}