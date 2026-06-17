import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, Lock } from "lucide-react";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }
    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword: password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error al restablecer la contraseña");
      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#d8e4d0] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="bg-[#f5f2ec] rounded-3xl p-6 sm:p-8 w-full max-w-xs sm:max-w-sm shadow-sm">

        <div className="flex justify-center mb-5">
          <LeafIcon />
        </div>

        {!success ? (
          <>
            <h1 className="text-xl sm:text-2xl font-medium text-center text-[#2c3e2d] mb-1">
              Nueva contraseña
            </h1>
            <p className="text-xs sm:text-sm text-center text-[#7a8c7b] mb-6">
              Crea una nueva contraseña para tu cuenta
            </p>

            {error && (
              <div className="bg-red-50 text-red-600 text-xs sm:text-sm rounded-xl px-4 py-2 mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3">

              <div className="relative">
                <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6b8f5e] opacity-60" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Nueva contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-10 py-2.5 sm:py-3 rounded-xl border border-[#c8d4c2]
                             bg-white text-[#2c3e2d] text-sm outline-none focus:border-[#6b8f5e]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6b8f5e] opacity-50"
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>

              <div className="relative">
                <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6b8f5e] opacity-60" />
                <input
                  type={showConfirm ? "text" : "password"}
                  placeholder="Confirmar contraseña"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-10 py-2.5 sm:py-3 rounded-xl border border-[#c8d4c2]
                             bg-white text-[#2c3e2d] text-sm outline-none focus:border-[#6b8f5e]"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6b8f5e] opacity-50"
                >
                  {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 sm:py-3 bg-[#6b8f5e] hover:bg-[#5a7a4e] text-white
                           rounded-xl font-medium text-sm transition-colors disabled:opacity-60"
              >
                {loading ? "Guardando..." : "Restablecer contraseña"}
              </button>
            </form>
          </>
        ) : (
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-14 h-14 rounded-full bg-[#e8f0e4] flex items-center justify-center text-2xl">
                ✅
              </div>
            </div>
            <h1 className="text-xl font-medium text-[#2c3e2d] mb-2">
              ¡Contraseña actualizada!
            </h1>
            <p className="text-sm text-[#7a8c7b] mb-6">
              Ya puedes iniciar sesión con tu nueva contraseña.
            </p>
            <Link
              to="/login"
              className="block w-full py-2.5 sm:py-3 bg-[#6b8f5e] hover:bg-[#5a7a4e]
                         text-white rounded-xl text-sm font-medium transition-colors"
            >
              Ir a Iniciar Sesión
            </Link>
          </div>
        )}

      </div>
    </div>
  );
}

function LeafIcon() {
  return (
    <svg width="72" height="72" viewBox="0 0 80 80" fill="none">
      <ellipse cx="40" cy="35" rx="18" ry="26" fill="#8aad7a" opacity="0.85" transform="rotate(-8 40 35)" />
      <ellipse cx="42" cy="33" rx="14" ry="22" fill="#6b8f5e" opacity="0.7" transform="rotate(6 42 33)" />
      <line x1="40" y1="60" x2="40" y2="72" stroke="#6b8f5e" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}