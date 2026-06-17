import bannerImg from "../assets/image.png";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function HomePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeNav, setActiveNav] = useState("inicio");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const firstName = user?.displayName
    ? user.displayName.split(" ")[0]
    : user?.email
    ? user.email.split("@")[0]
    : "Usuario";

  const detections = [
    {
      title: "Sigatoka Negra",
      level: "Alto",
      time: "2h ago",
      badge: "bg-red-50 text-red-600",
      image: "https://images.unsplash.com/photo-1524593166156-312f362cada0?q=80&w=200&auto=format&fit=crop",
    },
    {
      title: "Mancha Foliar",
      level: "Medio",
      time: "Jul 2, 2024",
      badge: "bg-amber-50 text-amber-700",
      image: "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?q=80&w=200&auto=format&fit=crop",
    },
    {
      title: "Hoja Sana",
      level: "Sano",
      time: "Jun 15, 2024",
      badge: "bg-green-50 text-green-700",
      image: "https://images.unsplash.com/photo-1471193945509-9ad0617afabf?q=80&w=200&auto=format&fit=crop",
    },
    {
      title: "Sigatoka Amarilla",
      level: "Medio",
      time: "Jun 10, 2024",
      badge: "bg-amber-50 text-amber-700",
      image: "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?q=80&w=200&auto=format&fit=crop",
    },
  ];

  const navItems = [
    { key: "inicio", label: "Inicio", icon: "🏠" },
    { key: "escaneos", label: "Escaneos", icon: "📷" },
    { key: "historial", label: "Historial", icon: "🕒" },
    { key: "enfermedades", label: "Enfermedades", icon: "🍃" },
    { key: "recomendaciones", label: "Recomendaciones", icon: "📋" },
    { key: "ajustes", label: "Ajustes", icon: "⚙️" },
  ];

  const handleNavClick = (key) => {
    setActiveNav(key);
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#f4f7f1] text-gray-800">

      {/* NAVBAR */}
      <header className="bg-white border-b border-gray-100 px-4 sm:px-6 py-3 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden w-9 h-9 rounded-lg flex items-center justify-center text-xl shrink-0 hover:bg-gray-100"
            aria-label="Abrir menú"
          >
            ☰
          </button>
          <div className="w-10 h-10 rounded-xl bg-green-700 flex items-center justify-center text-white text-lg shrink-0">
            🌿
          </div>
          <div className="hidden sm:block">
            <h1 className="font-bold text-base leading-tight">Detección Sigatoka</h1>
            <p className="text-xs text-gray-500">Sistema Inteligente Agrícola</p>
          </div>
        </div>

        <button className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-base relative shrink-0">
          🔔
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
        </button>
      </header>

      <div className="flex relative">

        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/40 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* SIDEBAR */}
        <aside
          className={`fixed lg:sticky top-0 left-0 h-screen lg:h-[calc(100vh-65px)] w-64 bg-white border-r border-gray-100 p-4 flex flex-col z-40 transition-transform duration-300
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
        >
          <div className="flex items-center gap-3 px-2 py-3 mb-3 border-b border-gray-100">
            <UserAvatar user={user} firstName={firstName} size={40} />
            <div className="min-w-0">
              <p className="text-xs text-gray-500 leading-none">Hola,</p>
              <h2 className="font-semibold text-sm truncate">{firstName} 👋</h2>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden ml-auto w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 shrink-0"
              aria-label="Cerrar menú"
            >
              ✕
            </button>
          </div>

          <nav className="space-y-1 flex-1 overflow-y-auto">
            {navItems.map((item) => (
              <button
                key={item.key}
                onClick={() => handleNavClick(item.key)}
                className={`w-full flex items-center gap-3 text-left px-3.5 py-2.5 rounded-xl transition text-sm ${
                  activeNav === item.key
                    ? "bg-green-50 text-green-700 font-semibold"
                    : "hover:bg-gray-50 text-gray-600"
                }`}
              >
                <span className="text-base shrink-0">{item.icon}</span>
                <span className="truncate">{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="bg-green-50 rounded-2xl p-4 mt-3 shrink-0">
            <h3 className="font-semibold text-sm mb-1">¿Necesitas ayuda?</h3>
            <p className="text-xs text-gray-600 mb-3">
              Consulta nuestras guías y recomendaciones.
            </p>
            <button className="w-full bg-green-700 hover:bg-green-800 transition text-white py-2 rounded-xl text-sm font-medium flex items-center justify-center gap-2">
              📖 Ver guías
            </button>
          </div>
        </aside>

        {/* CONTENT */}
        <main className="flex-1 p-4 sm:p-6 space-y-4 max-w-[1500px] mx-auto w-full min-w-0">

          {/* SCAN BAR */}
          <button
            onClick={() => navigate("/scan")}
            className="w-full bg-white rounded-3xl p-4 sm:p-5 flex items-center gap-4 hover:shadow-sm transition"
          >
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-green-50 flex items-center justify-center text-2xl shrink-0">
              🌿
            </div>
            <div className="text-left flex-1 min-w-0">
              <h2 className="text-base sm:text-lg font-bold">Escanear planta</h2>
              <p className="text-gray-500 text-xs sm:text-sm truncate">
                Toma o sube una foto para detectar enfermedades de Sigatoka.
              </p>
            </div>
            <span className="hidden sm:flex items-center gap-2 bg-green-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium shrink-0">
              📷 Escanear ahora
            </span>
          </button>

          {/* GRID PRINCIPAL */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.3fr_220px] gap-4">

            {/* DETECCIONES RECIENTES */}
            <div className="bg-white rounded-3xl p-4 sm:p-5">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-bold text-base">Detecciones recientes</h2>
                <button
                  onClick={() => navigate("/history")}
                  className="text-green-700 text-sm font-medium hover:underline shrink-0"
                >
                  Ver todo
                </button>
              </div>

              <div className="space-y-1">
                {detections.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => navigate(`/result/${index + 1}`)}
                    className="w-full grid grid-cols-[auto_1fr_auto] items-center gap-3 p-2 rounded-2xl hover:bg-gray-50 transition text-left"
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-11 h-11 sm:w-14 sm:h-14 rounded-xl object-cover shrink-0"
                    />
                    <div className="min-w-0 overflow-hidden">
                      <h3 className="font-semibold text-xs sm:text-sm truncate">{item.title}</h3>
                      <p className="text-[11px] sm:text-xs text-gray-500 truncate">Banano · {item.time}</p>
                    </div>
                    <span className={`text-[10px] sm:text-xs font-semibold px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full shrink-0 whitespace-nowrap ${item.badge}`}>
                      {item.level}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* BANNER — igual a la imagen de referencia */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white via-[#f3f8ef] to-[#e3f0d9] min-h-[300px] p-6 sm:p-8">
              <div className="relative z-10 max-w-[55%]">
                <span className="inline-flex items-center gap-1.5 bg-green-50 px-3 py-1.5 rounded-full text-green-700 text-xs font-medium mb-5">
                  🌱 Detección inteligente
                </span>

                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold leading-tight mb-3">
                  <span className="text-gray-900">Protege tus cultivos,</span><br />
                  <span className="text-green-700">asegura tu futuro</span>
                </h1>
                <p className="text-sm text-gray-500">
                  Detecta enfermedades de Sigatoka negra con IA en segundos.
                </p>
              </div>

              <img
                src={bannerImg}
                alt="hoja con sigatoka"
                className="absolute right-0 top-0 h-full w-[55%] object-cover"
                style={{ borderRadius: "0 24px 24px 0" }}
              />
            </div>

            {/* STATS */}
            <div className="grid grid-cols-3 lg:grid-cols-1 gap-3">
              <StatCard icon="📈" value="12" label="Escaneos realizados" color="green" />
              <StatCard icon="🛡️" value="3" label="Enfermedades detectadas" color="blue" />
              <StatCard icon="⚠️" value="2" label="Casos de alto riesgo" color="red" />
            </div>
          </div>

          {/* ALERTA */}
          <div className="bg-amber-50 border border-amber-100 rounded-3xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="w-10 h-10 rounded-2xl bg-amber-100 flex items-center justify-center text-lg shrink-0">
                💡
              </div>
              <div className="min-w-0">
                <h3 className="font-semibold text-sm text-amber-900">
                  La detección temprana puede salvar tus cultivos.
                </h3>
                <p className="text-amber-700 text-xs sm:text-sm">
                  Escanea tus plantas regularmente para mejorar la productividad agrícola.
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate("/recomendaciones")}
              className="bg-white hover:bg-amber-100 transition text-amber-700 px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap shrink-0 flex items-center gap-2"
            >
              Ver recomendaciones →
            </button>
          </div>

        </main>
      </div>

    </div>
  );
}

function StatCard({ icon, value, label, color }) {
  const colors = {
    green: { bg: "bg-green-50", text: "text-green-600" },
    blue: { bg: "bg-blue-50", text: "text-blue-600" },
    red: { bg: "bg-red-50", text: "text-red-500" },
  };
  const c = colors[color];

  return (
    <div className="bg-white rounded-2xl p-3 sm:p-4 flex lg:flex-col items-center lg:items-start gap-2 lg:gap-2 min-w-0">
      <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl ${c.bg} flex items-center justify-center text-base sm:text-lg shrink-0`}>
        {icon}
      </div>
      <div className="min-w-0">
        <span className={`font-bold text-lg sm:text-xl ${c.text} block`}>{value}</span>
        <p className="text-gray-500 text-[11px] sm:text-xs leading-tight">{label}</p>
      </div>
    </div>
  );
}

function UserAvatar({ user, firstName, size = 36 }) {
  const [imgError, setImgError] = useState(false);
  const style = { width: size, height: size };

  if (user?.photoURL && !imgError) {
    return (
      <img
        src={user.photoURL}
        alt="profile"
        referrerPolicy="no-referrer"
        onError={() => setImgError(true)}
        style={style}
        className="rounded-full object-cover shrink-0"
      />
    );
  }

  return (
    <div
      style={style}
      className="rounded-full bg-green-700 flex items-center justify-center text-white font-medium shrink-0"
    >
      {firstName[0].toUpperCase()}
    </div>
  );
}