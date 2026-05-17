import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, ArrowLeft } from "lucide-react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("http://localhost:8000/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Error al enviar el correo");
      setSent(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#d8e4d0] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="bg-[#f5f2ec] rounded-3xl p-6 sm:p-8 w-full max-w-xs sm:max-w-sm shadow-sm">

        {/* Botón volver */}
        <Link
          to="/login"
          className="flex items-center gap-1 text-[#7a8c7b] hover:text-[#6b8f5e] 
                     text-sm mb-5 transition-colors w-fit"
        >
          <ArrowLeft size={16} />
          Back
        </Link>

        {/* Ícono hoja */}
        <div className="flex justify-center mb-4 sm:mb-5">
          <LeafIcon />
        </div>

        {!sent ? (
          <>
            <h1 className="text-xl sm:text-2xl font-medium text-center text-[#2c3e2d] mb-1">
              Forgot Password
            </h1>
            <p className="text-xs sm:text-sm text-center text-[#7a8c7b] mb-5 sm:mb-7">
              Enter your email and we'll send you a link to reset your password.
            </p>

            {error && (
              <div className="bg-red-50 text-red-600 text-xs sm:text-sm rounded-xl px-4 py-2 mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Email */}
              <div className="relative">
                <Mail
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6b8f5e] opacity-60"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-2.5 sm:py-3 rounded-xl border border-[#c8d4c2]
                             bg-white text-[#2c3e2d] text-sm outline-none
                             focus:border-[#6b8f5e] transition-colors"
                />
              </div>

              {/* Botón enviar */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 sm:py-3 bg-[#6b8f5e] hover:bg-[#5a7a4e] text-white
                           rounded-xl font-medium text-sm transition-colors disabled:opacity-60"
              >
                {loading ? "Sending..." : "Send Reset Link"}
              </button>

            </form>

            <div className="text-center mt-4">
              <Link
                to="/login"
                className="text-xs sm:text-sm text-[#7a8c7b] hover:text-[#6b8f5e] transition-colors"
              >
                Back to Sign In
              </Link>
            </div>
          </>
        ) : (
          /* Pantalla de éxito */
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-14 h-14 rounded-full bg-[#e8f0e4] flex items-center justify-center">
                <Mail size={24} className="text-[#6b8f5e]" />
              </div>
            </div>

            <h1 className="text-xl sm:text-2xl font-medium text-[#2c3e2d] mb-2">
              Check your email
            </h1>
            <p className="text-xs sm:text-sm text-[#7a8c7b] mb-6">
              We sent a reset link to{" "}
              <span className="text-[#6b8f5e] font-medium">{email}</span>.
              Check your inbox.
            </p>

            <button
              onClick={() => setSent(false)}
              className="w-full py-2.5 sm:py-3 border border-[#c8d4c2] bg-white
                         hover:bg-[#f0ede6] text-[#2c3e2d] rounded-xl text-sm
                         font-medium transition-colors mb-3"
            >
              Try another email
            </button>

            <Link
              to="/login"
              className="block w-full py-2.5 sm:py-3 bg-[#6b8f5e] hover:bg-[#5a7a4e]
                         text-white rounded-xl text-sm font-medium transition-colors text-center"
            >
              Back to Sign In
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
      <ellipse
        cx="40" cy="35" rx="18" ry="26"
        fill="#8aad7a" opacity="0.85"
        transform="rotate(-8 40 35)"
      />
      <ellipse
        cx="42" cy="33" rx="14" ry="22"
        fill="#6b8f5e" opacity="0.7"
        transform="rotate(6 42 33)"
      />
      <line x1="40" y1="60" x2="40" y2="72" stroke="#6b8f5e" strokeWidth="2" strokeLinecap="round" />
      <line x1="40" y1="38" x2="33" y2="28" stroke="#8aad7a" strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
      <line x1="40" y1="44" x2="47" y2="34" stroke="#8aad7a" strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
    </svg>
  );
}