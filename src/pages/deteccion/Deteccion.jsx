import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Sidebar from "../../components/layout/Sidebar";
import Topbar from "../../components/layout/Topbar";
import Swal from "sweetalert2";

const DETECCIONES_RECIENTES = [
  { id: 1, fecha: "24/07/2025", hora: "08:45 a.m.", imagen: "https://images.unsplash.com/photo-1524593166156-312f362cada0?q=80&w=100", diagnostico: "Sigatoka Negra", severidad: "Moderado", lote: "Lote 6 - Bloque A", usuario: "Carlos Mendoza" },
  { id: 2, fecha: "23/07/2025", hora: "04:30 p.m.", imagen: "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?q=80&w=100", diagnostico: "Sigatoka Negra", severidad: "Severo",   lote: "Lote 5 - Bloque D", usuario: "Carlos Mendoza" },
  { id: 3, fecha: "23/07/2025", hora: "11:20 a.m.", imagen: "https://images.unsplash.com/photo-1471193945509-9ad0617afabf?q=80&w=100", diagnostico: "Sana",           severidad: "Leve",     lote: "Lote 4 - Bloque B", usuario: "Carlos Mendoza" },
];

const severidadConfig = {
  Moderado: { bg: "bg-orange-100", text: "text-orange-600", border: "border-orange-200" },
  Severo:   { bg: "bg-red-100",    text: "text-red-600",    border: "border-red-200"    },
  Leve:     { bg: "bg-green-100",  text: "text-green-700",  border: "border-green-200"  },
};

const MOCK_RESULTADO = {
  diagnostico: "Sigatoka Negra",
  severidad: "Severo",
  confianza: 94.6,
  caracteristicas: [
    "Manchas necróticas grandes",
    "Presencia de halo amarillo",
    "Afectación avanzada del tejido foliar",
  ],
  nota: "El modelo de IA ha identificado signos de Sigatoka Negra con un alto nivel de confianza.",
};

export default function Deteccion() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [image, setImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [resultado, setResultado] = useState(null);
  const [lote, setLote] = useState("Lote 7 - Bloque B");
  const [tipoHoja, setTipoHoja] = useState("Hoja 3 (Madura)");
  const [observaciones, setObservaciones] = useState("");

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const streamRef = useRef(null);

  const fullName = user?.displayName || user?.email?.split("@")[0] || "Usuario";
  const storageKey = `scans_${user?.uid || user?.email || "guest"}`;

  const openCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      streamRef.current = stream;
      setCameraOpen(true);
      setTimeout(() => { if (videoRef.current) videoRef.current.srcObject = stream; }, 100);
    } catch {
      Swal.fire({ title: "Sin acceso a la cámara", text: "Verifica los permisos.", icon: "error", confirmButtonColor: "#1f5e1f" });
    }
  };

  const closeCamera = () => {
    streamRef.current?.getTracks().forEach(t => t.stop());
    setCameraOpen(false);
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0);
    canvas.toBlob(blob => {
      const file = new File([blob], "captura.jpg", { type: "image/jpeg" });
      setImageFile(file);
      setImage(URL.createObjectURL(blob));
      closeCamera();
      setResultado(null);
    }, "image/jpeg");
  };

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith("image/")) return;
    setImageFile(file);
    setImage(URL.createObjectURL(file));
    setResultado(null);
  };

  const toBase64 = (file) => new Promise((res, rej) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => res(reader.result);
    reader.onerror = rej;
  });

  const analizar = async () => {
    if (!imageFile) {
      Swal.fire({ title: "Sin imagen", text: "Primero carga o captura una imagen.", icon: "warning", confirmButtonColor: "#1f5e1f" });
      return;
    }
    setAnalyzing(true);
    await new Promise(r => setTimeout(r, 2500));

    const base64 = await toBase64(imageFile);
    const newScan = {
      id: Date.now(),
      enfermedad: MOCK_RESULTADO.diagnostico,
      nivel_riesgo: "Alto",
      confianza: MOCK_RESULTADO.confianza,
      planta: "Banano",
      lote,
      tipoHoja,
      observaciones,
      fecha: new Date().toLocaleDateString("es-EC", { day: "2-digit", month: "short", year: "numeric" }),
      imageUrl: base64,
      badge: "bg-red-50 text-red-600",
    };

    const prev = JSON.parse(localStorage.getItem(storageKey) || "[]");
    prev.unshift(newScan);
    localStorage.setItem(storageKey, JSON.stringify(prev.slice(0, 20)));

    setResultado(MOCK_RESULTADO);
    setAnalyzing(false);
  };

  const guardarResultado = () => {
    Swal.fire({
      title: "✅ Resultado guardado",
      text: "El diagnóstico ha sido registrado correctamente en el sistema.",
      icon: "success",
      confirmButtonColor: "#1f5e1f",
      background: "#f5f2ec",
      customClass: { popup: "rounded-3xl" },
    });
  };

  const nuevaDeteccion = () => {
    setImage(null);
    setImageFile(null);
    setResultado(null);
    setObservaciones("");
  };

  const pasoActual = resultado ? 4 : analyzing ? 3 : image ? 2 : 1;

  return (
    <div className="min-h-screen bg-[#f4f6f4]">
      <Sidebar />

      {/* CÁMARA */}
      {cameraOpen && (
        <div className="fixed inset-0 bg-black z-[60] flex flex-col">
          <div className="flex items-center gap-3 px-4 py-3 bg-black/60">
            <button onClick={closeCamera} className="w-9 h-9 rounded-full bg-white/20 text-white flex items-center justify-center">✕</button>
            <span className="text-white text-sm font-medium">Enfoca la hoja de banano</span>
          </div>
          <video ref={videoRef} autoPlay playsInline className="flex-1 w-full object-cover" />
          <canvas ref={canvasRef} className="hidden" />
          <div className="bg-black/70 p-6 flex items-center justify-center gap-10">
            <button onClick={closeCamera} className="w-12 h-12 rounded-full bg-white/20 text-white flex items-center justify-center text-xl">←</button>
            <button onClick={capturePhoto} className="rounded-full bg-white border-4 border-white/40 shadow-lg" style={{ width: 72, height: 72 }} />
            <div className="w-12 h-12" />
          </div>
        </div>
      )}

      <Topbar
        titulo="Detección de Sigatoka Negra"
        subtitulo="Captura y analiza imágenes de hojas de banano para identificar la presencia de Sigatoka Negra."
      />

      <main className="p-4 sm:p-6 space-y-5">

        {/* PASOS */}
        <div className="bg-white rounded-2xl border border-gray-100 px-5 py-4">
          <div className="flex items-center gap-2 overflow-x-auto">
            {[
              { num: 1, icon: "📷", title: "Captura de Imagen",    desc: "Toma o selecciona una imagen" },
              { num: 2, icon: "🧠", title: "Procesamiento IA",     desc: "La imagen se procesa con el modelo CNN" },
              { num: 3, icon: "📊", title: "Diagnóstico",          desc: "Se determina el resultado y nivel de severidad" },
              { num: 4, icon: "📋", title: "Registro",             desc: "Se almacena el resultado en el sistema" },
            ].map((paso, i) => (
              <div key={i} className="flex items-center gap-2 shrink-0">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 transition-colors ${pasoActual >= paso.num ? "bg-green-700" : "bg-gray-200 text-gray-500"}`}>
                  {pasoActual > paso.num ? "✓" : paso.num}
                </div>
                <div>
                  <p className={`text-xs font-semibold leading-tight ${pasoActual >= paso.num ? "text-gray-800" : "text-gray-400"}`}>
                    {paso.icon} {paso.title}
                  </p>
                  <p className="text-[10px] text-gray-400 hidden sm:block">{paso.desc}</p>
                </div>
                {i < 3 && <span className="text-gray-200 text-lg mx-1">→</span>}
              </div>
            ))}
          </div>
        </div>

        {/* GRID PRINCIPAL */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* COLUMNA 1 — Captura */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-col gap-4">
            <h2 className="font-bold text-gray-800 text-sm flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-green-700 text-white text-xs flex items-center justify-center font-bold">1</span>
              Captura de Imagen
            </h2>

            {/* Tabs */}
            <div className="flex gap-2">
              <button
                onClick={openCamera}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold bg-green-700 text-white hover:bg-green-800 transition"
              >
                📷 Cámara
              </button>
              <button
                onClick={() => fileInputRef.current.click()}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold bg-gray-100 text-gray-600 hover:bg-gray-200 transition"
              >
                🖼️ Galería
              </button>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
            </div>

            {/* Preview */}
            <div className="rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 relative" style={{ height: 210 }}>
              {image ? (
                <>
                  <img src={image} alt="Captura" className="w-full h-full object-cover" />
                  <button
                    onClick={nuevaDeteccion}
                    className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition text-sm"
                  >✕</button>
                  {resultado && (
                    <div className="absolute bottom-2 left-2 bg-green-700 text-white text-[11px] px-3 py-1 rounded-full font-semibold">
                      ✓ Analizada
                    </div>
                  )}
                </>
              ) : (
                <div
                  className="h-full flex flex-col items-center justify-center gap-2 text-gray-300 cursor-pointer hover:bg-gray-100 transition"
                  onClick={() => fileInputRef.current.click()}
                >
                  <span className="text-4xl">📷</span>
                  <p className="text-xs">Haz clic o arrastra una imagen</p>
                </div>
              )}
            </div>

            {/* Consejos */}
            <div className="bg-green-50 rounded-xl p-3">
              <p className="text-xs font-semibold text-green-800 mb-2">💡 Consejos para una mejor captura</p>
              {["Usa buena iluminación natural", "Enfoca únicamente la hoja", "Evita sombras y desenfoques", "Asegúrate de que la hoja esté completa"].map((tip, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-green-700 mb-1">
                  <span>✓</span> {tip}
                </div>
              ))}
            </div>

            {/* Botón analizar */}
            <button
              onClick={analizar}
              disabled={analyzing || !image}
              className="w-full py-3 bg-green-700 hover:bg-green-800 text-white rounded-xl font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-50 transition"
            >
              {analyzing ? (
                <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Analizando imagen...</>
              ) : (
                <><span>🔍</span> {image ? "Analizar imagen" : "Capturar imagen"}</>
              )}
            </button>
          </div>

          {/* COLUMNA 2 — Resultado */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-col gap-4">
            <h2 className="font-bold text-gray-800 text-sm flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-green-700 text-white text-xs flex items-center justify-center font-bold">2</span>
              Resultado del Análisis
            </h2>

            {resultado ? (
              <div className="space-y-4 flex-1">

                {/* Diagnóstico */}
                <div className="bg-red-50 border border-red-100 rounded-2xl p-4 text-center">
                  <p className="text-xs text-gray-400 mb-2">Diagnóstico</p>
                  <div className="flex items-center justify-center gap-3 mb-1">
                    <div className="w-11 h-11 rounded-full bg-red-100 flex items-center justify-center text-2xl">🍃</div>
                    <p className="text-xl font-bold text-red-500">{resultado.diagnostico}</p>
                  </div>
                </div>

                {/* Severidad */}
                <div className="bg-gray-50 rounded-2xl p-4">
                  <p className="text-xs text-gray-400 mb-2">Nivel de Severidad</p>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-white text-xs font-bold shrink-0">!</div>
                    <span className="bg-red-100 text-red-600 border border-red-200 px-4 py-1.5 rounded-full text-sm font-semibold">
                      {resultado.severidad}
                    </span>
                  </div>
                </div>

                {/* Confianza */}
                <div>
                  <p className="text-xs text-gray-500 font-medium mb-1">Confianza del modelo (Accuracy)</p>
                  <p className="text-3xl font-bold text-green-700 mb-2">{resultado.confianza}%</p>
                  <div className="relative w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-700 rounded-full transition-all duration-1000"
                      style={{ width: `${resultado.confianza}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                    <span>0%</span><span>50%</span><span>100%</span>
                  </div>
                </div>

                {/* Nota IA */}
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 flex items-start gap-2">
                  <span className="text-blue-500 shrink-0 text-sm">ℹ️</span>
                  <p className="text-xs text-blue-700">{resultado.nota}</p>
                </div>

                {/* Características */}
                <div>
                  <p className="text-xs font-semibold text-gray-800 mb-2">Características detectadas</p>
                  {resultado.caracteristicas.map((c, i) => (
                    <div key={i} className="flex items-center gap-2 mb-1.5">
                      <span className="w-5 h-5 rounded-full bg-green-600 text-white flex items-center justify-center text-xs shrink-0">✓</span>
                      <p className="text-xs text-gray-700">{c}</p>
                    </div>
                  ))}
                </div>

              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center py-12 gap-3 text-gray-300">
                {analyzing ? (
                  <>
                    <span className="w-12 h-12 border-4 border-green-200 border-t-green-700 rounded-full animate-spin" />
                    <p className="text-sm text-gray-400 font-medium">Procesando imagen con IA...</p>
                    <p className="text-xs text-gray-300">Esto puede tomar unos segundos</p>
                  </>
                ) : (
                  <>
                    <span className="text-5xl">🔬</span>
                    <p className="text-sm text-center text-gray-400">El resultado aparecerá aquí después de analizar la imagen</p>
                  </>
                )}
              </div>
            )}
          </div>

          {/* COLUMNA 3 — Registro + Acciones */}
          <div className="flex flex-col gap-4">

            <div className="bg-white rounded-2xl border border-gray-100 p-5 flex-1">
              <h2 className="font-bold text-gray-800 text-sm flex items-center gap-2 mb-4">
                <span className="w-6 h-6 rounded-full bg-green-700 text-white text-xs flex items-center justify-center font-bold">3</span>
                Información del Registro
              </h2>

              <div className="space-y-3">

                {/* Lote */}
                <div className="flex items-start gap-3 pb-3 border-b border-gray-100">
                  <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center text-base shrink-0">🌿</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] text-gray-400 mb-0.5">Lote</p>
                    <select value={lote} onChange={e => setLote(e.target.value)} className="text-xs font-semibold text-gray-800 bg-transparent outline-none w-full cursor-pointer">
                      {["Lote 7 - Bloque B", "Lote 6 - Bloque A", "Lote 5 - Bloque D", "Lote 4 - Bloque B", "Lote 3 - Bloque C"].map(l => <option key={l}>{l}</option>)}
                    </select>
                  </div>
                </div>

                {/* Fecha */}
                <div className="flex items-start gap-3 pb-3 border-b border-gray-100">
                  <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center text-base shrink-0">📅</div>
                  <div>
                    <p className="text-[11px] text-gray-400 mb-0.5">Fecha y Hora</p>
                    <p className="text-xs font-semibold text-gray-800">
                      {new Date().toLocaleDateString("es-EC", { day: "2-digit", month: "2-digit", year: "numeric" })} — {new Date().toLocaleTimeString("es-EC", { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </div>

                {/* Tipo de hoja */}
                <div className="flex items-start gap-3 pb-3 border-b border-gray-100">
                  <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center text-base shrink-0">🍃</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] text-gray-400 mb-0.5">Tipo de Hoja</p>
                    <select value={tipoHoja} onChange={e => setTipoHoja(e.target.value)} className="text-xs font-semibold text-gray-800 bg-transparent outline-none w-full cursor-pointer">
                      {["Hoja 1 (Joven)", "Hoja 2 (Intermedia)", "Hoja 3 (Madura)", "Hoja 4 (Vieja)"].map(h => <option key={h}>{h}</option>)}
                    </select>
                  </div>
                </div>

                {/* GPS */}
                <div className="flex items-start gap-3 pb-3 border-b border-gray-100">
                  <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center text-base shrink-0">📍</div>
                  <div>
                    <p className="text-[11px] text-gray-400 mb-0.5">Ubicación (GPS)</p>
                    <p className="text-xs font-semibold text-gray-800">Latitud: -2.137456</p>
                    <p className="text-xs font-semibold text-gray-800">Longitud: -79.547821</p>
                  </div>
                </div>

                {/* Observaciones */}
                <div className="flex items-start gap-3 pb-3 border-b border-gray-100">
                  <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center text-base shrink-0">📝</div>
                  <div className="flex-1">
                    <p className="text-[11px] text-gray-400 mb-0.5">Observaciones</p>
                    <textarea
                      value={observaciones}
                      onChange={e => setObservaciones(e.target.value)}
                      placeholder="Escribe observaciones adicionales..."
                      rows={2}
                      className="w-full text-xs text-gray-700 bg-gray-50 rounded-lg p-2 outline-none border border-gray-100 focus:border-green-300 resize-none"
                    />
                  </div>
                </div>

                {/* Registrado por */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center text-base shrink-0">👤</div>
                  <div>
                    <p className="text-[11px] text-gray-400 mb-0.5">Registrado por</p>
                    <p className="text-xs font-semibold text-gray-800">{fullName}</p>
                  </div>
                </div>

              </div>
            </div>

            {/* Acciones */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <h2 className="font-bold text-gray-800 text-sm mb-3">Acciones</h2>
              <div className="space-y-2">
                <button
                  onClick={guardarResultado}
                  disabled={!resultado}
                  className="w-full py-3 bg-green-700 hover:bg-green-800 text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-40 transition"
                >
                  💾 Guardar Resultado
                </button>
                <button
                  onClick={nuevaDeteccion}
                  className="w-full py-3 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition"
                >
                  📷 Nueva Detección
                </button>
                <button
                  onClick={() => navigate("/informes")}
                  className="w-full py-3 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition"
                >
                  📋 Ver Historial
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* DETECCIONES RECIENTES */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h2 className="font-bold text-gray-800 text-sm">Detecciones Recientes</h2>
            <button onClick={() => navigate("/informes")} className="text-green-700 text-xs font-medium hover:underline">
              Ver todas
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-gray-50 text-gray-400">
                  <th className="text-left px-5 py-3 font-medium">Fecha</th>
                  <th className="text-left px-3 py-3 font-medium">Imagen</th>
                  <th className="text-left px-3 py-3 font-medium">Diagnóstico</th>
                  <th className="text-left px-3 py-3 font-medium">Severidad</th>
                  <th className="text-left px-3 py-3 font-medium">Lote</th>
                  <th className="text-left px-3 py-3 font-medium">Usuario</th>
                  <th className="text-center px-3 py-3 font-medium">Acción</th>
                </tr>
              </thead>
              <tbody>
                {DETECCIONES_RECIENTES.map(d => {
                  const sev = severidadConfig[d.severidad] || severidadConfig.Leve;
                  return (
                    <tr key={d.id} className="border-t border-gray-50 hover:bg-gray-50 transition">
                      <td className="px-5 py-3">
                        <p className="font-medium text-gray-800">{d.fecha}</p>
                        <p className="text-gray-400 text-[11px]">{d.hora}</p>
                      </td>
                      <td className="px-3 py-3">
                        <img src={d.imagen} alt="" className="w-10 h-10 rounded-xl object-cover" />
                      </td>
                      <td className={`px-3 py-3 font-semibold ${d.diagnostico === "Sigatoka Negra" ? "text-red-500" : "text-green-600"}`}>
                        {d.diagnostico}
                      </td>
                      <td className="px-3 py-3">
                        <span className={`font-semibold px-2.5 py-1 rounded-full border text-[11px] ${sev.bg} ${sev.text} ${sev.border}`}>
                          {d.severidad}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-gray-600">{d.lote}</td>
                      <td className="px-3 py-3 text-gray-600">{d.usuario}</td>
                      <td className="px-3 py-3 text-center">
                        <button
                          onClick={() => navigate(`/resultado/${d.id}`)}
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

      </main>
    </div>
  );
}