import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import Sidebar from "../../components/layout/Sidebar";
import Topbar from "../../components/layout/Topbar";
import Swal from "sweetalert2";

const MOCK_RESULT = {
  enfermedad: "Sigatoka Negra",
  confianza: 94.5,
  nivel_riesgo: "Alto",
  severidad: "Severo",
  descripcion: "La Sigatoka negra es una enfermedad fúngica causada por Mycosphaerella fijiensis. Es considerada la enfermedad foliar más destructiva del banano y plátano a nivel mundial.",
  sintomas: [
    "Manchas pequeñas de color pardo amarillento en el haz de la hoja",
    "Las manchas evolucionan a rayas de color marrón oscuro",
    "Centro de las lesiones de color gris con bordes amarillos",
    "Necrosis foliar severa en etapas avanzadas",
    "Maduración prematura del fruto",
  ],
  tratamientos: [
    "Aplicar fungicidas sistémicos (triazoles o estrobilurinas) de forma preventiva",
    "Eliminar y destruir hojas infectadas para reducir el inóculo",
    "Mantener buena ventilación en la plantación espaciando plantas",
    "Uso de variedades resistentes como FHIA-01 o FHIA-21",
    "Monitoreo constante cada 7-14 días durante la época lluviosa",
  ],
};

export default function Resultado() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("info");

  const result = location.state?.result || MOCK_RESULT;
  const imageUrl = location.state?.imageUrl || null;
  const scanId = location.state?.scanId || null;

  const storageKey = `scans_${user?.uid || user?.email || "guest"}`;
  const savedScan = scanId
    ? JSON.parse(localStorage.getItem(storageKey) || "[]").find(s => s.id === scanId)
    : null;
  const finalImageUrl = imageUrl || savedScan?.imageUrl || null;

  const riskConfig = {
    Alto:   { badge: "bg-red-100 text-red-700 border-red-200",    bar: "bg-red-500",    width: "90%" },
    Medio:  { badge: "bg-amber-100 text-amber-700 border-amber-200", bar: "bg-amber-500", width: "55%" },
    Bajo:   { badge: "bg-green-100 text-green-700 border-green-200", bar: "bg-green-500", width: "20%" },
    Ninguno:{ badge: "bg-green-100 text-green-700 border-green-200", bar: "bg-green-500", width: "10%" },
  };

  const risk = riskConfig[result.nivel_riesgo] || riskConfig["Medio"];

  const handleShare = () => {
    Swal.fire({
      title: "Compartir resultado",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#1f5e1f",
      cancelButtonColor: "#9ca3af",
      confirmButtonText: "📋 Copiar al portapapeles",
      cancelButtonText: "Cancelar",
      background: "#f5f2ec",
      customClass: { popup: "rounded-3xl" },
    }).then(res => {
      if (res.isConfirmed) {
        navigator.clipboard.writeText(
          `Resultado: ${result.enfermedad}\nConfianza: ${result.confianza}%\nRiesgo: ${result.nivel_riesgo}`
        );
        Swal.fire({ title: "¡Copiado!", icon: "success", timer: 1500, showConfirmButton: false, background: "#f5f2ec", customClass: { popup: "rounded-3xl" } });
      }
    });
  };

  return (
    <div className="min-h-screen bg-[#f4f6f4]">
      <Sidebar />
      <Topbar
        titulo="Resultado del Análisis"
        subtitulo="Diagnóstico detallado de la detección realizada"
      />

      <main className="p-4 sm:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* COLUMNA IZQUIERDA */}
          <div className="flex flex-col gap-4">

            {/* Imagen */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              {finalImageUrl ? (
                <img src={finalImageUrl} alt="Hoja analizada" className="w-full h-56 object-cover" />
              ) : (
                <div className="w-full h-56 bg-green-50 flex items-center justify-center">
                  <span className="text-5xl">🍃</span>
                </div>
              )}
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="font-bold text-base text-gray-800">{result.enfermedad}</h2>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${risk.badge}`}>
                    {result.nivel_riesgo}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mb-3">Banano · Detectado ahora</p>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-xs text-gray-500">Precisión del modelo</span>
                    <span className="text-xs font-bold text-gray-800">{result.confianza}%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${risk.bar}`} style={{ width: `${result.confianza}%` }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Nivel de riesgo */}
            <div className="bg-white rounded-2xl border border-gray-100 p-4">
              <h3 className="font-semibold text-sm text-gray-800 mb-3">Nivel de riesgo</h3>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${risk.bar}`} style={{ width: risk.width }} />
                </div>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${risk.badge}`}>
                  {result.nivel_riesgo}
                </span>
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-[10px] text-gray-400">Bajo</span>
                <span className="text-[10px] text-gray-400">Alto</span>
              </div>
            </div>

            {/* Botones */}
            <div className="flex gap-3">
              <button
                onClick={() => navigate("/deteccion")}
                className="flex-1 bg-white border-2 border-green-200 hover:bg-green-50 text-green-700 py-3 rounded-2xl text-sm font-semibold flex items-center justify-center gap-2 transition"
              >
                🔄 Nuevo escaneo
              </button>
              <button
                onClick={handleShare}
                className="flex-1 bg-green-700 hover:bg-green-800 text-white py-3 rounded-2xl text-sm font-semibold flex items-center justify-center gap-2 transition"
              >
                📤 Compartir
              </button>
            </div>
          </div>

          {/* COLUMNA DERECHA */}
          <div className="lg:col-span-2 flex flex-col gap-4">

            {/* Tabs */}
            <div className="bg-white rounded-2xl border border-gray-100 p-1.5 flex gap-1">
              {[
                { key: "info",       label: "📋 Información" },
                { key: "sintomas",   label: "🔍 Síntomas"    },
                { key: "tratamiento",label: "💊 Tratamiento"  },
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition ${
                    activeTab === tab.key ? "bg-green-700 text-white" : "text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Contenido tabs */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 flex-1">

              {activeTab === "info" && (
                <div className="space-y-4">
                  <h3 className="font-bold text-base text-gray-800 flex items-center gap-2">
                    🦠 Sobre esta enfermedad
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{result.descripcion}</p>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-red-50 rounded-2xl p-3 text-center">
                      <p className="text-xl font-bold text-red-600">{result.confianza}%</p>
                      <p className="text-xs text-gray-500 mt-0.5">Precisión</p>
                    </div>
                    <div className={`rounded-2xl p-3 text-center border ${risk.badge}`}>
                      <p className="text-xl font-bold">{result.nivel_riesgo}</p>
                      <p className="text-xs mt-0.5 opacity-70">Nivel riesgo</p>
                    </div>
                    <div className="bg-green-50 rounded-2xl p-3 text-center">
                      <p className="text-xl font-bold text-green-700">CNN</p>
                      <p className="text-xs text-gray-500 mt-0.5">Modelo IA</p>
                    </div>
                  </div>
                  <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 flex items-start gap-3">
                    <span className="text-lg shrink-0">⚠️</span>
                    <p className="text-xs text-amber-800">
                      Este resultado es orientativo. Para decisiones críticas, consulta con un agrónomo especialista.
                    </p>
                  </div>
                </div>
              )}

              {activeTab === "sintomas" && (
                <div>
                  <h3 className="font-bold text-base text-gray-800 mb-4 flex items-center gap-2">
                    🔍 Síntomas identificados
                  </h3>
                  <div className="space-y-3">
                    {result.sintomas.map((s, i) => (
                      <div key={i} className="flex items-start gap-3 p-3 bg-red-50/50 rounded-2xl border border-red-100">
                        <div className="w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                          {i + 1}
                        </div>
                        <p className="text-sm text-gray-700">{s}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "tratamiento" && (
                <div>
                  <h3 className="font-bold text-base text-gray-800 mb-4 flex items-center gap-2">
                    💊 Recomendaciones de tratamiento
                  </h3>
                  <div className="space-y-3">
                    {result.tratamientos.map((t, i) => (
                      <div key={i} className="flex items-start gap-3 p-3 bg-green-50/50 rounded-2xl border border-green-100">
                        <div className="w-6 h-6 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                          {i + 1}
                        </div>
                        <p className="text-sm text-gray-700">{t}</p>
                      </div>
                    ))}
                  </div>
                  <div className="bg-green-50 border border-green-100 rounded-2xl p-4 mt-4 flex items-start gap-3">
                    <span className="text-lg shrink-0">💡</span>
                    <p className="text-xs text-green-800">
                      La detección temprana puede salvar hasta el 80% del cultivo. Actúa de inmediato.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Nota demo */}
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-3 flex items-start gap-2">
              <span className="text-base shrink-0">🤖</span>
              <p className="text-xs text-blue-700">
                <strong>Datos de demostración:</strong> Resultado simulado. Una vez entrenado el modelo CNN aparecerán los resultados reales.
              </p>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}