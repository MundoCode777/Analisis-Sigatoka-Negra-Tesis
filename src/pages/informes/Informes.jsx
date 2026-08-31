import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

// ── Datos simulados ────────────────────────────────────────────────
const EVOLUCION = [
  { mes: "Ene", sana: 20, leve: 12, moderado: 8,  severo: 3 },
  { mes: "Feb", sana: 25, leve: 18, moderado: 10, severo: 4 },
  { mes: "Mar", sana: 30, leve: 22, moderado: 14, severo: 5 },
  { mes: "Abr", sana: 48, leve: 30, moderado: 16, severo: 6 },
  { mes: "May", sana: 45, leve: 25, moderado: 20, severo: 7 },
  { mes: "Jun", sana: 50, leve: 33, moderado: 25, severo: 9 },
  { mes: "Jul", sana: 55, leve: 38, moderado: 22, severo: 11 },
];

const DISTRIBUCION = [
  { label: "Severo",   val: 18, pct: "14.1%", color: "#ef4444" },
  { label: "Moderado", val: 32, pct: "25.0%", color: "#f97316" },
  { label: "Leve",     val: 45, pct: "35.2%", color: "#eab308" },
  { label: "Sano",     val: 33, pct: "25.7%", color: "#22c55e" },
];

const LOTES_BARRAS = [
  { lote: "Lote 3", val: 28 },
  { lote: "Lote 2", val: 25 },
  { lote: "Lote 1", val: 22 },
  { lote: "Lote 5", val: 20 },
  { lote: "Lote 4", val: 18 },
];

const TOP_LOTES_SEVEROS = [
  { lote: "Lote 3 - Bloque B", casos: 9 },
  { lote: "Lote 2 - Bloque A", casos: 7 },
  { lote: "Lote 4 - Bloque B", casos: 6 },
  { lote: "Lote 1 - Bloque A", casos: 4 },
  { lote: "Lote 5 - Bloque C", casos: 3 },
];

const HISTORIAL = [
  { id: 1, fecha: "24/07/2025", hora: "09:15 a.m.", imagen: "https://images.unsplash.com/photo-1524593166156-312f362cada0?q=80&w=100", lote: "Lote 3", bloque: "Bloque B", diagnostico: "Sigatoka Negra", severidad: "Severo",   gps: "-2.137456, -79.547821", tecnico: "Carlos Mendoza" },
  { id: 2, fecha: "24/07/2025", hora: "08:45 a.m.", imagen: "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?q=80&w=100", lote: "Lote 2", bloque: "Bloque A", diagnostico: "Sigatoka Negra", severidad: "Moderado", gps: "-2.136987, -79.548276", tecnico: "Carlos Mendoza" },
  { id: 3, fecha: "23/07/2025", hora: "02:30 p.m.", imagen: "https://images.unsplash.com/photo-1471193945509-9ad0617afabf?q=80&w=100", lote: "Lote 1", bloque: "Bloque A", diagnostico: "Sana",           severidad: "Sano",     gps: "-2.136120, -79.549102", tecnico: "Luis Pérez" },
  { id: 4, fecha: "23/07/2025", hora: "11:20 a.m.", imagen: "https://images.unsplash.com/photo-1524593166156-312f362cada0?q=80&w=100", lote: "Lote 5", bloque: "Bloque C", diagnostico: "Sigatoka Negra", severidad: "Leve",     gps: "-2.138001, -79.546912", tecnico: "Carlos Mendoza" },
  { id: 5, fecha: "22/07/2025", hora: "04:10 p.m.", imagen: "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?q=80&w=100", lote: "Lote 4", bloque: "Bloque B", diagnostico: "Sigatoka Negra", severidad: "Severo",   gps: "-2.135610, -79.547000", tecnico: "Luis Pérez" },
];

const severidadConfig = {
  Sano:     { bg: "bg-emerald-100", text: "text-emerald-700" },
  Leve:     { bg: "bg-yellow-100",  text: "text-yellow-700" },
  Moderado: { bg: "bg-orange-100",  text: "text-orange-700" },
  Severo:   { bg: "bg-red-100",     text: "text-red-600" },
};

export default function Informes() {
  const navigate = useNavigate();
  const lineCanvasRef = useRef(null);
  const donutCanvasRef = useRef(null);
  const barCanvasRef = useRef(null);

  const [periodo, setPeriodo] = useState("01/01/2025 - 24/07/2025");
  const [lote, setLote] = useState("Todos los lotes");
  const [bloque, setBloque] = useState("Todos los bloques");
  const [severidad, setSeveridad] = useState("Todos");

  useEffect(() => {
    dibujarLineChart();
    dibujarDonut();
    dibujarBarras();
  }, []);

  // ── Gráfica de evolución (líneas múltiples) ──
  const dibujarLineChart = () => {
    const canvas = lineCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W = canvas.width, H = canvas.height;
    const pad = { top: 10, right: 20, bottom: 26, left: 34 };

    ctx.clearRect(0, 0, W, H);

    const maxVal = 60;
    const series = [
      { key: "sana",     color: "#22c55e" },
      { key: "leve",     color: "#eab308" },
      { key: "moderado", color: "#f97316" },
      { key: "severo",   color: "#ef4444" },
    ];

    // Grid
    for (let i = 0; i <= 6; i++) {
      const y = pad.top + ((H - pad.top - pad.bottom) / 6) * i;
      ctx.strokeStyle = "#f0f0f0";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(pad.left, y);
      ctx.lineTo(W - pad.right, y);
      ctx.stroke();
      const label = Math.round(maxVal - (maxVal / 6) * i);
      ctx.fillStyle = "#9ca3af";
      ctx.font = "9px Arial, sans-serif";
      ctx.textAlign = "right";
      ctx.fillText(label, pad.left - 6, y + 3);
    }

    const xFor = (i) => pad.left + (i / (EVOLUCION.length - 1)) * (W - pad.left - pad.right);
    const yFor = (v) => pad.top + (1 - v / maxVal) * (H - pad.top - pad.bottom);

    // Área bajo "sana" para dar profundidad
    const grad = ctx.createLinearGradient(0, pad.top, 0, H - pad.bottom);
    grad.addColorStop(0, "rgba(34, 197, 94, 0.15)");
    grad.addColorStop(1, "rgba(34, 197, 94, 0)");
    ctx.beginPath();
    ctx.moveTo(xFor(0), H - pad.bottom);
    EVOLUCION.forEach((e, i) => ctx.lineTo(xFor(i), yFor(e.sana)));
    ctx.lineTo(xFor(EVOLUCION.length - 1), H - pad.bottom);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();

    // Líneas
    series.forEach(s => {
      ctx.beginPath();
      ctx.strokeStyle = s.color;
      ctx.lineWidth = 2.2;
      ctx.lineJoin = "round";
      EVOLUCION.forEach((e, i) => {
        const x = xFor(i), y = yFor(e[s.key]);
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      });
      ctx.stroke();

      EVOLUCION.forEach((e, i) => {
        ctx.beginPath();
        ctx.arc(xFor(i), yFor(e[s.key]), 3.5, 0, Math.PI * 2);
        ctx.fillStyle = s.color;
        ctx.fill();
        ctx.strokeStyle = "white";
        ctx.lineWidth = 1.5;
        ctx.stroke();
      });
    });

    // Labels eje X
    EVOLUCION.forEach((e, i) => {
      ctx.fillStyle = "#6b7280";
      ctx.font = "10px Arial, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(e.mes, xFor(i), H - 8);
    });
  };

  // ── Donut de distribución ──
  const dibujarDonut = () => {
    const canvas = donutCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W = canvas.width, H = canvas.height;
    const cx = W / 2, cy = H / 2;
    const r = Math.min(W, H) / 2 - 6;

    const total = DISTRIBUCION.reduce((a, b) => a + b.val, 0);
    let startAngle = -Math.PI / 2;

    ctx.clearRect(0, 0, W, H);

    DISTRIBUCION.forEach(d => {
      const slice = (d.val / total) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, r, startAngle, startAngle + slice);
      ctx.closePath();
      ctx.fillStyle = d.color;
      ctx.fill();
      startAngle += slice;
    });

    ctx.beginPath();
    ctx.arc(cx, cy, r * 0.6, 0, Math.PI * 2);
    ctx.fillStyle = "white";
    ctx.fill();

    ctx.fillStyle = "#1f2937";
    ctx.font = "bold 24px Arial, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(String(total), cx, cy - 4);
    ctx.fillStyle = "#6b7280";
    ctx.font = "11px Arial, sans-serif";
    ctx.fillText("Total", cx, cy + 16);
  };

  // ── Barras horizontales por lote ──
  const dibujarBarras = () => {
    const canvas = barCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W = canvas.width, H = canvas.height;
    const pad = { top: 6, right: 30, bottom: 26, left: 52 };
    const maxVal = 30;
    const barH = 18;
    const gap = (H - pad.top - pad.bottom - barH * LOTES_BARRAS.length) / (LOTES_BARRAS.length - 1);

    ctx.clearRect(0, 0, W, H);

    // Grid vertical
    for (let i = 0; i <= 6; i++) {
      const x = pad.left + ((W - pad.left - pad.right) / 6) * i;
      ctx.strokeStyle = "#f0f0f0";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x, pad.top);
      ctx.lineTo(x, H - pad.bottom);
      ctx.stroke();
      ctx.fillStyle = "#9ca3af";
      ctx.font = "9px Arial, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(i * 5, x, H - pad.bottom + 14);
    }

    LOTES_BARRAS.forEach((l, i) => {
      const y = pad.top + i * (barH + gap);
      const w = (l.val / maxVal) * (W - pad.left - pad.right);

      ctx.fillStyle = "#166534";
      ctx.beginPath();
      ctx.roundRect(pad.left, y, w, barH, 4);
      ctx.fill();

      ctx.fillStyle = "#374151";
      ctx.font = "11px Arial, sans-serif";
      ctx.textAlign = "right";
      ctx.fillText(l.lote, pad.left - 8, y + barH / 2 + 4);

      ctx.fillStyle = "#111827";
      ctx.font = "bold 11px Arial, sans-serif";
      ctx.textAlign = "left";
      ctx.fillText(l.val, pad.left + w + 6, y + barH / 2 + 4);
    });
  };

  const stats = [
    { icon: "🌿", bg: "bg-green-50",  val: "128", label: "Detecciones totales",       sub: "En el periodo seleccionado" },
    { icon: "🍂", bg: "bg-red-50",    val: "85",  label: "Sigatoka Negra",             sub: "66.4% del total" },
    { icon: "⚠️", bg: "bg-orange-50", val: "32",  label: "Casos moderados/severos",    sub: "Requieren atención" },
    { icon: "🗺️", bg: "bg-teal-50",  val: "18",  label: "Lotes monitoreados",         sub: "En toda la hacienda" },
    { icon: "📋", bg: "bg-blue-50",   val: "7",   label: "Reportes generados",         sub: "Este mes" },
  ];

  return (
    <div className="min-h-screen bg-[#f4f6f4] p-4 sm:p-5 space-y-4">

      {/* STATS */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {stats.map((s, i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-100 p-4 flex items-center gap-3">
            <div className={`${s.bg} w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0`}>
              {s.icon}
            </div>
            <div>
              <p className="text-xl font-bold text-gray-900 leading-tight">{s.val}</p>
              <p className="text-xs font-medium text-gray-700 leading-tight">{s.label}</p>
              <p className="text-[11px] text-gray-400">{s.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* EVOLUCIÓN + DONUT + FILTROS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Evolución de detecciones */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-1">
            <h2 className="font-bold text-gray-800">Evolución de Detecciones</h2>
          </div>
          <div className="flex items-center gap-4 mb-2 flex-wrap">
            {[
              { label: "Sana", color: "#22c55e" },
              { label: "Leve", color: "#eab308" },
              { label: "Moderado", color: "#f97316" },
              { label: "Severo", color: "#ef4444" },
            ].map(s => (
              <div key={s.label} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }} />
                <span className="text-xs text-gray-500">{s.label}</span>
              </div>
            ))}
          </div>
          <p className="text-[10px] text-gray-400 mb-1">Número de detecciones</p>
          <canvas ref={lineCanvasRef} width={480} height={220} className="w-full" />
        </div>

        {/* Distribución por severidad */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h2 className="font-bold text-gray-800 mb-4">Distribución por Nivel de Severidad</h2>
          <div className="flex items-center gap-6">
            <canvas ref={donutCanvasRef} width={150} height={150} />
            <div className="space-y-3">
              {DISTRIBUCION.map(d => (
                <div key={d.label} className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
                  <div>
                    <p className="text-sm font-semibold text-gray-800 leading-tight">{d.label}</p>
                    <p className="text-xs text-gray-400">{d.val} ({d.pct})</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h2 className="font-bold text-gray-800 mb-4">Filtros</h2>
          <div className="space-y-3">
            <div>
              <p className="text-xs text-gray-500 mb-1">Periodo</p>
              <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2.5">
                <span className="text-gray-400">📅</span>
                <input
                  value={periodo}
                  onChange={e => setPeriodo(e.target.value)}
                  className="flex-1 text-sm text-gray-700 outline-none bg-transparent"
                />
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Lote</p>
              <select
                value={lote}
                onChange={e => setLote(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 outline-none cursor-pointer"
              >
                {["Todos los lotes", "Lote 1", "Lote 2", "Lote 3", "Lote 4", "Lote 5"].map(l => (
                  <option key={l}>{l}</option>
                ))}
              </select>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Bloque</p>
              <select
                value={bloque}
                onChange={e => setBloque(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 outline-none cursor-pointer"
              >
                {["Todos los bloques", "Bloque A", "Bloque B", "Bloque C", "Bloque D", "Bloque E"].map(b => (
                  <option key={b}>{b}</option>
                ))}
              </select>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Nivel de Severidad</p>
              <select
                value={severidad}
                onChange={e => setSeveridad(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 outline-none cursor-pointer"
              >
                {["Todos", "Sano", "Leve", "Moderado", "Severo"].map(s => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>
            <button className="w-full py-3 bg-green-700 hover:bg-green-800 text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition mt-1">
              🔎 Aplicar filtros
            </button>
          </div>
        </div>
      </div>

      {/* BARRAS + MAPA + TOP 5 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Detecciones por lote */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h2 className="font-bold text-gray-800 mb-3">Detecciones por Lote</h2>
          <canvas ref={barCanvasRef} width={340} height={220} className="w-full" />
          <p className="text-[10px] text-gray-400 text-center mt-1">N° de detecciones</p>
        </div>

        {/* Mapa de detecciones */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h2 className="font-bold text-gray-800 mb-3">Mapa de Detecciones</h2>
          <div className="flex gap-3">
            <div className="flex flex-col gap-2 text-xs text-gray-600 shrink-0">
              {[
                { label: "Sana", color: "#22c55e" },
                { label: "Leve", color: "#eab308" },
                { label: "Moderado", color: "#f97316" },
                { label: "Severo", color: "#ef4444" },
              ].map(s => (
                <div key={s.label} className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }} />
                  {s.label}
                </div>
              ))}
            </div>
            <div className="relative flex-1 rounded-xl overflow-hidden" style={{ height: 180 }}>
              <img
                src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=600"
                alt="Mapa de detecciones"
                className="w-full h-full object-cover"
              />
              {[
                { top: "18%", left: "22%", color: "#22c55e" },
                { top: "30%", left: "55%", color: "#f97316" },
                { top: "45%", left: "68%", color: "#22c55e" },
                { top: "38%", left: "40%", color: "#f97316" },
                { top: "60%", left: "50%", color: "#ef4444" },
                { top: "70%", left: "30%", color: "#22c55e" },
                { top: "58%", left: "72%", color: "#eab308" },
              ].map((p, i) => (
                <span
                  key={i}
                  className="absolute w-4 h-4 rounded-full border-2 border-white shadow"
                  style={{ top: p.top, left: p.left, backgroundColor: p.color, transform: "translate(-50%, -50%)" }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Top 5 lotes con más casos severos */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h2 className="font-bold text-gray-800 mb-3">Top 5 Lotes con más Casos Severos</h2>
          <div className="space-y-2.5">
            {TOP_LOTES_SEVEROS.map((l, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-xs font-bold shrink-0">
                  {i + 1}
                </span>
                <span className="flex-1 text-sm text-gray-700">{l.lote}</span>
                <span className="text-sm font-semibold text-gray-800">{l.casos} casos</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* HISTORIAL + GENERAR INFORME */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Historial de detecciones */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4">
            <h2 className="font-bold text-gray-800">Historial de Detecciones</h2>
            <button onClick={() => navigate("/deteccion")} className="text-green-700 text-sm font-medium hover:underline">
              Ver todas las detecciones
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-gray-50 text-gray-400">
                  <th className="text-left px-5 py-3 font-medium">Fecha</th>
                  <th className="text-left px-3 py-3 font-medium">Lote</th>
                  <th className="text-left px-3 py-3 font-medium">Bloque</th>
                  <th className="text-left px-3 py-3 font-medium">Diagnóstico</th>
                  <th className="text-left px-3 py-3 font-medium">Severidad</th>
                  <th className="text-left px-3 py-3 font-medium">Ubicación (GPS)</th>
                  <th className="text-left px-3 py-3 font-medium">Técnico</th>
                  <th className="text-center px-3 py-3 font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {HISTORIAL.map(d => {
                  const sev = severidadConfig[d.severidad] || severidadConfig.Sano;
                  return (
                    <tr key={d.id} className="border-t border-gray-50 hover:bg-gray-50 transition">
                      <td className="px-5 py-3">
                        <p className="font-medium text-gray-800">{d.fecha}</p>
                        <p className="text-gray-400">{d.hora}</p>
                      </td>
                      <td className="px-3 py-3 text-gray-700">{d.lote}</td>
                      <td className="px-3 py-3 text-gray-700">{d.bloque}</td>
                      <td className={`px-3 py-3 font-semibold ${d.diagnostico === "Sigatoka Negra" ? "text-red-500" : "text-emerald-600"}`}>
                        {d.diagnostico}
                      </td>
                      <td className="px-3 py-3">
                        <span className={`font-semibold px-2.5 py-1 rounded-full ${sev.bg} ${sev.text}`}>
                          {d.severidad}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-gray-500">{d.gps}</td>
                      <td className="px-3 py-3 text-gray-700">{d.tecnico}</td>
                      <td className="px-3 py-3 text-center">
                        <button
                          onClick={() => navigate(`/result/${d.id}`)}
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

        {/* Generar informe */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h2 className="font-bold text-gray-800 mb-1">Generar Informe</h2>
          <p className="text-xs text-gray-400 mb-4">Selecciona el tipo de informe que deseas generar.</p>

          <div className="space-y-2.5">
            <button className="w-full flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:bg-gray-50 transition text-left">
              <span className="w-9 h-9 rounded-lg bg-red-50 flex items-center justify-center text-lg shrink-0">📄</span>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-800">Informe General</p>
                <p className="text-xs text-gray-400">Resumen de detecciones y severidad</p>
              </div>
              <span className="text-gray-300">›</span>
            </button>

            <button className="w-full flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:bg-gray-50 transition text-left">
              <span className="w-9 h-9 rounded-lg bg-green-50 flex items-center justify-center text-lg shrink-0">📊</span>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-800">Informe por Lote</p>
                <p className="text-xs text-gray-400">Detalle por lote y bloque</p>
              </div>
              <span className="text-gray-300">›</span>
            </button>

            <button className="w-full flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:bg-gray-50 transition text-left">
              <span className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center text-lg shrink-0">🗺️</span>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-800">Informe de Mapa</p>
                <p className="text-xs text-gray-400">Mapa de calor de detecciones</p>
              </div>
              <span className="text-gray-300">›</span>
            </button>
          </div>

          <button className="w-full mt-4 py-3 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition">
            📆 Programar informe automático
          </button>
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