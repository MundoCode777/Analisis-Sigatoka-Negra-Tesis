import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

// ── Datos simulados ────────────────────────────────────────────────
const SEGUIMIENTO = [
  { dia: "Día 1",  fecha: "24/07/2025", estado: "Severo",     label: "Diagnóstico inicial",   icon: "🍂", color: "#dc2626" },
  { dia: "Día 7",  fecha: "31/07/2025", estado: "Moderado",   label: "Primera aplicación",    icon: "🍃", color: "#f59e0b" },
  { dia: "Día 14", fecha: "07/08/2025", estado: "Leve",       label: "Segunda aplicación",    icon: "🌿", color: "#eab308" },
  { dia: "Día 21", fecha: "21/08/2025", estado: "Mejorando",  label: "Seguimiento actual",    icon: "🌱", color: "#16a34a" },
];

const EVOLUCION_SEVERIDAD = [
  { fecha: "24/07/2025", diaLabel: "Día 1",  nivel: 3, color: "#dc2626" }, // Severo
  { fecha: "31/07/2025", diaLabel: "Día 7",  nivel: 2, color: "#f59e0b" }, // Moderado
  { fecha: "07/08/2025", diaLabel: "Día 14", nivel: 1, color: "#eab308" }, // Leve
  { fecha: "21/08/2025", diaLabel: "Día 21", nivel: 0, color: "#16a34a" }, // Sano
];

const TRATAMIENTOS = [
  { fecha: "31/07/2025", producto: "Azoxystrobin 250 SC", dosis: "1.0 L/ha", responsable: "Carlos Mendoza", estado: "Aplicado" },
  { fecha: "14/08/2025", producto: "Mancozeb 80 WP",       dosis: "2.0 kg/ha", responsable: "Carlos Mendoza", estado: "Aplicado" },
  { fecha: "-",          producto: "-",                     dosis: "-",         responsable: "-",              estado: "Pendiente" },
];

const estadoTratamientoConfig = {
  Aplicado:  { bg: "bg-emerald-100", text: "text-emerald-700" },
  Pendiente: { bg: "bg-amber-100",   text: "text-amber-700" },
};

export default function Recomendacion() {
  const navigate = useNavigate();
  const canvasRef = useRef(null);

  useEffect(() => {
    dibujarGrafica();
  }, []);

  const dibujarGrafica = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W = canvas.width, H = canvas.height;
    const pad = { top: 16, right: 16, bottom: 34, left: 62 };

    ctx.clearRect(0, 0, W, H);

    const niveles = ["Sano", "Leve", "Moderado", "Severo"];
    const nivelY = (n) => pad.top + (1 - n / 3) * (H - pad.top - pad.bottom);

    // Grid horizontal + labels de nivel
    niveles.forEach((label, i) => {
      const y = nivelY(i);
      ctx.strokeStyle = "#f0f0f0";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(pad.left, y);
      ctx.lineTo(W - pad.right, y);
      ctx.stroke();

      ctx.fillStyle = i === 3 ? "#dc2626" : i === 2 ? "#f59e0b" : i === 1 ? "#ca8a04" : "#16a34a";
      ctx.font = "bold 10px Arial, sans-serif";
      ctx.textAlign = "right";
      ctx.fillText(label, pad.left - 8, y + 3);
    });

    const pts = EVOLUCION_SEVERIDAD.map((e, i) => ({
      x: pad.left + (i / (EVOLUCION_SEVERIDAD.length - 1)) * (W - pad.left - pad.right),
      y: nivelY(e.nivel),
      color: e.color,
    }));

    // Área degradado
    const grad = ctx.createLinearGradient(0, pad.top, 0, H - pad.bottom);
    grad.addColorStop(0, "rgba(220, 38, 38, 0.12)");
    grad.addColorStop(1, "rgba(22, 163, 74, 0.05)");
    ctx.beginPath();
    ctx.moveTo(pts[0].x, H - pad.bottom);
    pts.forEach(p => ctx.lineTo(p.x, p.y));
    ctx.lineTo(pts[pts.length - 1].x, H - pad.bottom);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();

    // Línea de tendencia
    ctx.beginPath();
    ctx.strokeStyle = "#22c55e";
    ctx.lineWidth = 2.5;
    ctx.lineJoin = "round";
    pts.forEach((p, i) => (i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)));
    ctx.stroke();

    // Puntos coloreados por severidad
    pts.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 5, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();
      ctx.strokeStyle = "white";
      ctx.lineWidth = 2;
      ctx.stroke();
    });

    // Labels de fecha/día
    EVOLUCION_SEVERIDAD.forEach((e, i) => {
      const x = pad.left + (i / (EVOLUCION_SEVERIDAD.length - 1)) * (W - pad.left - pad.right);
      ctx.fillStyle = "#374151";
      ctx.font = "bold 10px Arial, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(e.fecha, x, H - 18);
      ctx.fillStyle = "#9ca3af";
      ctx.font = "9px Arial, sans-serif";
      ctx.fillText(`(${e.diaLabel})`, x, H - 6);
    });
  };

  return (
    <div className="min-h-screen bg-[#f4f6f4] p-4 sm:p-5 space-y-4 relative">

      {/* ── BOTÓN PARA VOLVER AL DASHBOARD ── */}
      <button
        onClick={() => navigate(-1)} // Navega a la página anterior (Dashboard)
        className="absolute top-6 left-6 flex items-center justify-center w-10 h-10 bg-white border border-gray-200 rounded-full shadow-sm text-gray-600 hover:bg-gray-50 hover:shadow-md transition-all group z-10"
        title="Volver al Dashboard"
      >
        <span className="text-lg font-medium group-hover:-translate-x-0.5 transition-transform">←</span>
      </button>

      {/* ── Estado actual + resumen (Desplazado para no chocar con el botón) ── */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 pl-12">
        <div className="flex flex-wrap items-center gap-x-10 gap-y-4">

          {/* Estado actual */}
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center text-2xl shrink-0">
              🌱
            </div>
            <div>
              <p className="text-xs text-gray-400">Estado actual de la planta</p>
              <p className="text-xl font-bold text-green-700 flex items-center gap-1.5">
                Mejorando <span className="text-base">📈</span>
              </p>
              <p className="text-xs text-gray-500">La planta muestra signos de recuperación.</p>
            </div>
          </div>

          <div className="hidden lg:block w-px h-12 bg-gray-100" />

          {/* Lote */}
          <div className="flex items-center gap-2">
            <span className="text-lg">👤</span>
            <div>
              <p className="text-xs text-gray-400">Lote</p>
              <p className="text-sm font-bold text-gray-800">Lote 7 - Bloque B</p>
            </div>
          </div>

          {/* Último diagnóstico */}
          <div className="flex items-center gap-2">
            <span className="text-lg">🍃</span>
            <div>
              <p className="text-xs text-gray-400">Último diagnóstico</p>
              <p className="text-sm font-bold text-red-500">Sigatoka Negra</p>
            </div>
          </div>

          {/* Fecha diagnóstico */}
          <div className="flex items-center gap-2">
            <span className="text-lg">📅</span>
            <div>
              <p className="text-xs text-gray-400">Fecha del diagnóstico</p>
              <p className="text-sm font-bold text-gray-800">24/07/2025</p>
            </div>
          </div>

          {/* Severidad inicial */}
          <div>
            <p className="text-xs text-gray-400 mb-1">Severidad inicial</p>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-red-100 text-red-600 border border-red-200">
              Severo
            </span>
          </div>

          {/* Severidad actual */}
          <div>
            <p className="text-xs text-gray-400 mb-1">Severidad actual</p>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200">
              Moderado
            </span>
          </div>
        </div>
      </div>

      {/* ── Tratamiento + Seguimiento + Detalle planta ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Recomendación de tratamiento */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h2 className="font-bold text-gray-800 mb-4">Recomendación de Tratamiento</h2>

          <div className="bg-gray-50 rounded-2xl p-4 flex flex-col items-center text-center mb-4">
            <div className="w-16 h-16 rounded-xl bg-green-50 flex items-center justify-center text-3xl mb-2">
              🧴
            </div>
            <p className="text-xs text-gray-400">Producto recomendado</p>
            <p className="text-base font-bold text-green-800 leading-tight">Fungicida Sistémico</p>
            <p className="text-xs text-gray-500">Azoxystrobin 250 SC</p>
          </div>

          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <span className="text-green-600 shrink-0">💉</span>
              <div>
                <p className="text-xs text-gray-400">Dosis recomendada</p>
                <p className="text-sm font-semibold text-gray-800">0.8 - 1.0 L/ha</p>
              </div>
            </div>
            <div className="h-px bg-gray-100" />
            <div className="flex items-start gap-3">
              <span className="text-green-600 shrink-0">📆</span>
              <div>
                <p className="text-xs text-gray-400">Frecuencia de aplicación</p>
                <p className="text-sm font-semibold text-gray-800">Cada 14 días</p>
              </div>
            </div>
            <div className="h-px bg-gray-100" />
            <div className="flex items-start gap-3">
              <span className="text-green-600 shrink-0">🎯</span>
              <div>
                <p className="text-xs text-gray-400">Método de aplicación</p>
                <p className="text-sm font-semibold text-gray-800">Aspersión foliar</p>
              </div>
            </div>
            <div className="h-px bg-gray-100" />
            <div className="flex items-start gap-3">
              <span className="text-green-600 shrink-0">ℹ️</span>
              <div>
                <p className="text-xs text-gray-400">Observaciones</p>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Aplicar en horas de la mañana o al atardecer. Asegurar cobertura en el envés de la hoja.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Seguimiento de la planta */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h2 className="font-bold text-gray-800 mb-5">Seguimiento de la Planta</h2>

          <div className="flex items-start justify-between mb-2">
            {SEGUIMIENTO.map((s, i) => (
              <div key={i} className="flex flex-col items-center flex-1 relative">
                <p className="text-xs font-semibold text-gray-700">{s.dia}</p>
                <p className="text-[10px] text-gray-400 mb-2">{s.fecha}</p>

                <div className="relative flex items-center w-full justify-center">
                  {i > 0 && (
                    <div className="absolute right-1/2 w-full h-0.5 bg-green-200" style={{ marginRight: "50%" }} />
                  )}
                  <div
                    className="w-11 h-11 rounded-full flex items-center justify-center text-lg text-white shrink-0 relative z-10"
                    style={{ backgroundColor: s.color }}
                  >
                    {s.icon}
                  </div>
                </div>

                <p className="text-xs font-bold mt-2" style={{ color: s.color }}>{s.estado}</p>
                <p className="text-[10px] text-gray-400 text-center leading-tight">{s.label}</p>
              </div>
            ))}
          </div>

          <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 flex items-start gap-2 mt-4">
            <span className="text-blue-500 shrink-0">ℹ️</span>
            <p className="text-xs text-blue-700 leading-relaxed">
              La evolución de la planta es positiva. Continúe con el plan de tratamiento y realice el próximo seguimiento en la fecha indicada.
            </p>
          </div>
        </div>

        {/* Detalle de la planta */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h2 className="font-bold text-gray-800 mb-4">Detalle de la Planta</h2>

          <div className="rounded-2xl overflow-hidden mb-4" style={{ height: 170 }}>
            <img
              src="https://images.unsplash.com/photo-1591857177580-dc82b9ac4e1e?q=80&w=600"
              alt="Hoja de banano"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="mb-4">
            <p className="text-xs text-gray-400 mb-1">Porcentaje de recuperación</p>
            <p className="text-3xl font-bold text-green-700 mb-2">78%</p>
            <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-green-600 rounded-full transition-all duration-700" style={{ width: "78%" }} />
            </div>
            <p className="text-[11px] text-gray-400 mt-1">Comparado con el diagnóstico inicial</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-start gap-2">
              <span className="text-green-600 shrink-0">📅</span>
              <div>
                <p className="text-[11px] text-gray-400">Próxima inspección</p>
                <p className="text-xs font-semibold text-gray-800">04/09/2025</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-600 shrink-0">⏱️</span>
              <div>
                <p className="text-[11px] text-gray-400">Días restantes</p>
                <p className="text-xs font-semibold text-gray-800">14 días</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Evolución de severidad + Registro de tratamientos ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Evolución de la severidad */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h2 className="font-bold text-gray-800 mb-3">Evolución de la Severidad</h2>
          <canvas ref={canvasRef} width={480} height={220} className="w-full" />
        </div>

        {/* Registro de tratamientos */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden flex flex-col">
          <div className="px-5 py-4">
            <h2 className="font-bold text-gray-800">Registro de Tratamientos Aplicados</h2>
          </div>
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-gray-50 text-gray-400">
                  <th className="text-left px-5 py-3 font-medium">Fecha</th>
                  <th className="text-left px-3 py-3 font-medium">Producto</th>
                  <th className="text-left px-3 py-3 font-medium">Dosis</th>
                  <th className="text-left px-3 py-3 font-medium">Responsable</th>
                  <th className="text-left px-3 py-3 font-medium">Estado</th>
                </tr>
              </thead>
              <tbody>
                {TRATAMIENTOS.map((t, i) => {
                  const est = estadoTratamientoConfig[t.estado] || estadoTratamientoConfig.Pendiente;
                  return (
                    <tr key={i} className="border-t border-gray-50">
                      <td className="px-5 py-3 text-gray-700 font-medium">{t.fecha}</td>
                      <td className="px-3 py-3 text-gray-700">{t.producto}</td>
                      <td className="px-3 py-3 text-gray-700">{t.dosis}</td>
                      <td className="px-3 py-3 text-gray-700">{t.responsable}</td>
                      <td className="px-3 py-3">
                        <span className={`font-semibold px-2.5 py-1 rounded-full ${est.bg} ${est.text}`}>
                          {t.estado}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="px-5 py-4">
            <button
              onClick={() => navigate("/seguimiento/tratamientos")}
              className="w-full py-3 bg-green-700 hover:bg-green-800 text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition"
            >
              📋 Ver todos los tratamientos
            </button>
          </div>
        </div>
      </div>

      {/* ── Acciones rápidas ── */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <h2 className="font-bold text-gray-800 mb-3">Acciones Rápidas</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <button
            onClick={() => navigate("/seguimiento/registrar-tratamiento")}
            className="w-full py-3 bg-green-700 hover:bg-green-800 text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition"
          >
            ➕ Registrar Tratamiento
          </button>
          <button
            onClick={() => navigate("/seguimiento/actualizar")}
            className="w-full py-3 bg-green-100 hover:bg-green-200 text-green-800 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition"
          >
            🌿 Actualizar Seguimiento
          </button>
          <button
            onClick={() => navigate("/seguimiento/historial")}
            className="w-full py-3 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition"
          >
            📋 Ver Historial de Seguimientos
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