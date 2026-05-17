import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import bannerImg from "../assets/banner.png";

export default function HomePage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const firstName = user?.displayName
    ? user.displayName.split(" ")[0]
    : user?.email
    ? user.email.split("@")[0]
    : "Usuario";

  const [activeNav, setActiveNav] = useState("inicio");

  const detections = [
    {
      title: "Sigatoka Negra",
      level: "Alto",
      time: "2h ago",
      color: "bg-red-100 text-red-600",
      image: "https://images.unsplash.com/photo-1524593166156-312f362cada0?q=80&w=800&auto=format&fit=crop",
    },
    {
      title: "Mancha Foliar",
      level: "Medio",
      time: "Jul 2, 2024",
      color: "bg-yellow-100 text-yellow-700",
      image: "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?q=80&w=800&auto=format&fit=crop",
    },
    {
      title: "Hoja Sana",
      level: "Sano",
      time: "Jun 15, 2024",
      color: "bg-green-100 text-green-700",
      image: "https://images.unsplash.com/photo-1471193945509-9ad0617afabf?q=80&w=800&auto=format&fit=crop",
    },
    {
      title: "Sigatoka Amarilla",
      level: "Medio",
      time: "Jun 10, 2024",
      color: "bg-yellow-100 text-yellow-700",
      image: "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?q=80&w=800&auto=format&fit=crop",
    },
  ];

  const sidebarItems = [
    "Inicio", "Escaneos", "Historial",
    "Enfermedades", "Recomendaciones", "Ajustes"
  ];

  return (
    <div className="min-h-screen bg-[#f4f7f1] text-gray-800">

      {/* NAVBAR */}
      <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between shadow-sm sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-green-700 flex items-center justify-center text-white text-2xl">
            🌿
          </div>
          <div>
            <h1 className="font-bold text-xl">Detección Sigatoka</h1>
            <p className="text-sm text-gray-500">Sistema Inteligente Agrícola</p>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-8 font-medium">
          {["Inicio", "Escanear", "Historial", "Perfil"].map((item) => (
            <button
              key={item}
              onClick={() => setActiveNav(item.toLowerCase())}
              className={`px-5 py-2 rounded-xl transition ${
                activeNav === item.toLowerCase()
                  ? "bg-green-100 text-green-700"
                  : "text-gray-600 hover:text-green-700"
              }`}
            >
              {item}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <button className="w-11 h-11 rounded-full bg-gray-100 flex items-center justify-center text-lg relative">
            🔔
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full" />
          </button>

          <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-2xl px-3 py-2 shadow-sm">
            {user?.photoURL ? (
              <img src={user.photoURL} alt="profile" className="w-10 h-10 rounded-full object-cover" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-green-700 flex items-center justify-center text-white font-medium">
                {firstName[0].toUpperCase()}
              </div>
            )}
            <div>
              <p className="text-sm text-gray-500">Hola,</p>
              <h2 className="font-semibold">{firstName} 👋</h2>
            </div>
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main className="p-8 grid grid-cols-1 xl:grid-cols-4 gap-6">

        {/* SIDEBAR */}
        <aside className="hidden xl:flex flex-col justify-between bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <div className="space-y-2">
            {sidebarItems.map((item, index) => (
              <button
                key={index}
                onClick={() => setActiveNav(item.toLowerCase())}
                className={`w-full text-left px-4 py-3 rounded-2xl transition ${
                  activeNav === item.toLowerCase()
                    ? "bg-green-100 text-green-700 font-semibold"
                    : "hover:bg-gray-100 text-gray-600"
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          <div className="bg-gradient-to-br from-green-100 to-green-50 rounded-3xl p-5 mt-8">
            <img
              src="https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?q=80&w=600&auto=format&fit=crop"
              className="rounded-2xl h-40 w-full object-cover mb-4"
              alt="ayuda"
            />
            <h3 className="font-bold text-lg mb-2">¿Necesitas ayuda?</h3>
            <p className="text-sm text-gray-600 mb-4">
              Consulta nuestras recomendaciones agrícolas inteligentes.
            </p>
            <button className="w-full bg-green-700 hover:bg-green-800 transition text-white py-3 rounded-2xl font-semibold">
              Ver guías
            </button>
          </div>
        </aside>

        {/* CONTENT */}
        <section className="xl:col-span-3 space-y-6">

          {/* HERO */}
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 relative overflow-hidden rounded-[32px] bg-gradient-to-r from-[#063b12] via-[#14532d] to-[#1b5e20] min-h-[380px] p-10 flex flex-col justify-center shadow-xl">
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,_#ffffff,_transparent_40%)]" />

              {/* TU IMAGEN */}
              <img
                src={bannerImg}
                alt="cultivos"
                className="absolute right-0 top-0 h-full w-1/2 object-cover opacity-80"
              />

              <div className="relative z-10 max-w-xl">
                <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 backdrop-blur-md px-5 py-3 rounded-2xl text-white mb-8">
                  🌱 Detección Inteligente
                </div>

                <h1 className="text-4xl md:text-5xl font-black leading-tight text-white mb-6">
                  Protege tus cultivos,
                  <span className="text-lime-300"> asegura tu futuro</span>
                </h1>

                <p className="text-lg text-green-100 leading-relaxed">
                  Detecta enfermedades de Sigatoka negra con Inteligencia Artificial en segundos.
                </p>
              </div>
            </div>

            {/* STATS */}
            <div className="space-y-5">
              <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-green-100 flex items-center justify-center text-2xl">📈</div>
                  <span className="text-green-600 font-bold text-3xl">12</span>
                </div>
                <p className="text-gray-500">Escaneos realizados</p>
              </div>

              <div className="bg-white rounded-3xl p-6 border border-blue-100 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center text-2xl">🛡️</div>
                  <span className="text-blue-600 font-bold text-3xl">3</span>
                </div>
                <p className="text-gray-500">Enfermedades detectadas</p>
              </div>

              <div className="bg-white rounded-3xl p-6 border border-red-100 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-red-100 flex items-center justify-center text-2xl">⚠️</div>
                  <span className="text-red-500 font-bold text-3xl">2</span>
                </div>
                <p className="text-gray-500">Casos de alto riesgo</p>
              </div>
            </div>
          </div>

          {/* SCAN CARD */}
          <button
            onClick={() => navigate("/scan")}
            className="w-full bg-white border-2 border-dashed border-green-200 rounded-[32px] p-8 flex items-center justify-between shadow-sm hover:shadow-md transition"
          >
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-3xl bg-green-100 flex items-center justify-center text-4xl">
                🌿
              </div>
              <div className="text-left">
                <h2 className="text-2xl font-bold mb-1">Escanear planta</h2>
                <p className="text-gray-500">
                  Toma o sube una foto para detectar enfermedades de Sigatoka.
                </p>
              </div>
            </div>
            <div className="w-14 h-14 rounded-full bg-green-700 text-white text-2xl flex items-center justify-center hover:scale-105 transition">
              →
            </div>
          </button>

          {/* DETECCIONES */}
          <div>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-2xl font-bold">Detecciones recientes</h2>
              <button
                onClick={() => navigate("/history")}
                className="text-green-700 font-semibold hover:underline"
              >
                Ver todo
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              {detections.map((item, index) => (
                <button
                  key={index}
                  onClick={() => navigate(`/result/${index + 1}`)}
                  className="bg-white rounded-3xl border border-gray-100 p-5 flex items-center justify-between shadow-sm hover:shadow-md transition text-left"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-20 h-20 rounded-2xl object-cover"
                    />
                    <div>
                      <h3 className="font-bold text-xl">{item.title}</h3>
                      <p className="text-gray-500">Banano</p>
                      <p className="text-xs text-gray-400 mt-1">{item.time}</p>
                    </div>
                  </div>
                  <span className={`px-4 py-2 rounded-full text-sm font-bold ${item.color}`}>
                    {item.level}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* ALERTA */}
          <div className="bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200 rounded-3xl p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 shadow-sm">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-2xl bg-yellow-100 flex items-center justify-center text-3xl">
                💡
              </div>
              <div>
                <h3 className="font-bold text-xl text-yellow-900 mb-1">
                  La detección temprana puede salvar tus cultivos.
                </h3>
                <p className="text-yellow-800">
                  Escanea tus plantas regularmente para mejorar la productividad agrícola.
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate("/recomendaciones")}
              className="bg-white hover:bg-yellow-100 transition text-yellow-700 border border-yellow-200 px-8 py-4 rounded-2xl font-bold whitespace-nowrap"
            >
              Ver recomendaciones
            </button>
          </div>

        </section>
      </main>

      {/* BOTTOM NAV móvil */}
      <div className="xl:hidden sticky bottom-0 bg-white border-t border-gray-200 px-6 py-3">
        <div className="flex items-center justify-around">
          {[
            { key: "inicio", label: "Inicio", emoji: "🏠" },
            { key: "escanear", label: "Scan", emoji: "📷" },
            { key: "perfil", label: "Perfil", emoji: "👤" },
          ].map((item) => (
            <button
              key={item.key}
              onClick={() => { setActiveNav(item.key); if (item.key !== "inicio") navigate(`/${item.key}`); }}
              className={`flex flex-col items-center gap-1 px-5 py-2 rounded-2xl transition ${
                activeNav === item.key ? "bg-green-100 text-green-700" : "text-gray-500"
              }`}
            >
              <span className="text-xl">{item.emoji}</span>
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          ))}
        </div>
      </div>

    </div>
  );
}