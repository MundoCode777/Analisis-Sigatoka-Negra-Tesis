import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Lock, Mail, User, ShieldCheck, Brain } from "lucide-react";
import { loginWithGoogle } from "../../services/authService";

// ⬇️ Pon tu imagen de fondo aquí (foto de cultivo de banano)
import bgImage from "../../assets/banner.png";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error al iniciar sesión");
      localStorage.setItem("token", data.access_token);
      navigate("/home");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError("");
    try {
      const { token } = await loginWithGoogle();
      localStorage.setItem("token", token);
      navigate("/home");
    } catch (err) {
      setError("Error al iniciar sesión con Google");
    }
  };

  return (
    <div className="min-h-screen bg-[#eef3eb] flex items-center justify-center p-4">
      <div className="w-full max-w-5xl bg-white rounded-3xl overflow-hidden shadow-xl flex min-h-[600px]">

        {/* ── LADO IZQUIERDO — imagen + info ── */}
        <div className="hidden md:flex md:w-1/2 relative flex-col">

          {/* Imagen de fondo */}
          <img
            src={bgImage}
            alt="Cultivo de banano"
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* Overlay oscuro */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/60" />

          {/* Contenido encima */}
          <div className="relative z-10 flex flex-col items-center justify-center flex-1 px-8 text-center">

            {/* Logo */}
            <div className="w-16 h-16 bg-white/15 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-4 border border-white/20">
              <LeafLogo />
            </div>

            <h1 className="text-3xl font-bold text-white mb-1">
              Sigatoka Negra
            </h1>
            <div className="w-10 h-0.5 bg-green-400 mx-auto mb-2" />
            <p className="text-white/80 text-sm font-medium mb-6">
              Hacienda San Luis
            </p>

            <p className="text-white/90 text-sm leading-relaxed max-w-xs">
              Aplicativo web y móvil para la detección temprana de la Sigatoka Negra en cultivos de banano.
            </p>
          </div>

          {/* Cards de características abajo */}
          <div className="relative z-10 grid grid-cols-2 gap-3 px-6 pb-7">
            <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-4 border border-white/10 flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-green-500/20 border border-green-400/30 flex items-center justify-center shrink-0">
                <ShieldCheck size={18} className="text-green-400" />
              </div>
              <p className="text-white/90 text-xs leading-snug">
                Protegemos tu cultivo, aseguramos tu producción.
              </p>
            </div>
            <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-4 border border-white/10 flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-green-500/20 border border-green-400/30 flex items-center justify-center shrink-0">
                <Brain size={18} className="text-green-400" />
              </div>
              <p className="text-white/90 text-xs leading-snug">
                Tecnología e inteligencia artificial al servicio del campo.
              </p>
            </div>
          </div>
        </div>

        {/* ── LADO DERECHO — formulario ── */}
        <div className="w-full md:w-1/2 flex flex-col justify-center px-8 sm:px-12 py-10">

          <h2 className="text-3xl font-bold text-[#1a3a1a] mb-1">
            Iniciar Sesión
          </h2>
          <p className="text-gray-500 text-sm mb-8">
            Accede a tu cuenta para continuar
          </p>

          {error && (
            <div className="bg-red-50 text-red-600 text-sm rounded-xl px-4 py-3 mb-4 border border-red-100">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Correo electrónico
              </label>
              <div className="relative">
                <Mail
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Ingresa tu correo electrónico"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200
                             text-gray-800 text-sm outline-none bg-white
                             focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all"
                />
              </div>
            </div>

            {/* Contraseña */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Contraseña
              </label>
              <div className="relative">
                <Lock
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Ingresa tu contraseña"
                  value={form.password}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-10 py-3 rounded-xl border border-gray-200
                             text-gray-800 text-sm outline-none bg-white
                             focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Recordarme + Olvidé contraseña */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="w-4 h-4 rounded accent-green-600 cursor-pointer"
                />
                <span className="text-sm text-gray-600">Recordarme</span>
              </label>
              <Link
                to="/forgot-password"
                className="text-sm text-green-700 font-medium hover:underline"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            {/* Botón iniciar sesión */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#1f5e1f] hover:bg-[#174d17] text-white
                         rounded-xl font-semibold text-sm transition-colors
                         disabled:opacity-60 flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Iniciando sesión...
                </>
              ) : (
                <>
                  <LeafIconSmall />
                  Iniciar Sesión
                </>
              )}
            </button>

          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400">o continúa con</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Acceso técnicos de campo (Google) */}
          <button
            onClick={handleGoogle}
            className="w-full py-3 border-2 border-gray-200 rounded-xl text-sm font-semibold
                       text-gray-700 hover:bg-gray-50 hover:border-green-300 transition-all
                       flex items-center justify-center gap-2"
          >
            <User size={16} className="text-green-700" />
            Acceso con Google
          </button>

          {/* Seguridad */}
          <div className="flex items-center justify-center gap-2 mt-6">
            <ShieldCheck size={14} className="text-green-600" />
            <p className="text-xs text-gray-400">
              Tu información está segura con nosotros
            </p>
          </div>

          {/* Registro */}
          <p className="text-center text-sm text-gray-500 mt-4">
            ¿No tienes cuenta?{" "}
            <Link to="/register" className="text-green-700 font-semibold hover:underline">
              Regístrate aquí
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}

function LeafLogo() {
  return (
    <svg width="36" height="36" viewBox="0 0 80 80" fill="none">
      <ellipse cx="30" cy="40" rx="14" ry="22" fill="white" opacity="0.9" transform="rotate(-15 30 40)" />
      <ellipse cx="50" cy="38" rx="14" ry="22" fill="white" opacity="0.75" transform="rotate(15 50 38)" />
      <line x1="40" y1="62" x2="40" y2="74" stroke="white" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

function LeafIconSmall() {
  return (
    <svg width="16" height="16" viewBox="0 0 80 80" fill="none">
      <ellipse cx="40" cy="35" rx="18" ry="26" fill="white" opacity="0.9" transform="rotate(-8 40 35)" />
      <line x1="40" y1="60" x2="40" y2="72" stroke="white" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}