import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Lock, Mail, User } from "lucide-react";
import { loginWithGoogle } from "../../services/authService";

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",
    confirm_password: "",
    terms: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (form.password !== form.confirm_password) {
      setError("Las contraseñas no coinciden");
      return;
    }
    if (!form.terms) {
      setError("Debes aceptar los términos y condiciones");
      return;
    }
    setLoading(true);
    try {
      // ✅ Línea corregida
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: form.full_name,
          email: form.email,
          password: form.password,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Error al registrarse");
      navigate("/login");
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
      setError("Error al registrarse con Google");
    }
  };

  return (
    <div className="min-h-screen bg-[#d8e4d0] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="bg-[#f5f2ec] rounded-3xl p-6 sm:p-8 w-full max-w-xs sm:max-w-sm shadow-sm">

        <div className="flex justify-center mb-4 sm:mb-5">
          <LeafIcon />
        </div>

        <h1 className="text-xl sm:text-2xl font-medium text-center text-[#2c3e2d] mb-1">
          Create Account
        </h1>
        <p className="text-xs sm:text-sm text-center text-[#7a8c7b] mb-5 sm:mb-6">
          Join us to protect your crops
        </p>

        {error && (
          <div className="bg-red-50 text-red-600 text-xs sm:text-sm rounded-xl px-4 py-2 mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">

          <div className="relative">
            <User
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6b8f5e] opacity-60"
            />
            <input
              type="text"
              name="full_name"
              placeholder="Full Name"
              value={form.full_name}
              onChange={handleChange}
              required
              className="w-full pl-10 pr-4 py-2.5 sm:py-3 rounded-xl border border-[#c8d4c2]
                         bg-white text-[#2c3e2d] text-sm outline-none
                         focus:border-[#6b8f5e] transition-colors"
            />
          </div>

          <div className="relative">
            <Mail
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6b8f5e] opacity-60"
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full pl-10 pr-4 py-2.5 sm:py-3 rounded-xl border border-[#c8d4c2]
                         bg-white text-[#2c3e2d] text-sm outline-none
                         focus:border-[#6b8f5e] transition-colors"
            />
          </div>

          <div className="relative">
            <Lock
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6b8f5e] opacity-60"
            />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full pl-10 pr-10 py-2.5 sm:py-3 rounded-xl border border-[#c8d4c2]
                         bg-white text-[#2c3e2d] text-sm outline-none
                         focus:border-[#6b8f5e] transition-colors"
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
            <Lock
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6b8f5e] opacity-60"
            />
            <input
              type={showConfirm ? "text" : "password"}
              name="confirm_password"
              placeholder="Confirm Password"
              value={form.confirm_password}
              onChange={handleChange}
              required
              className="w-full pl-10 pr-10 py-2.5 sm:py-3 rounded-xl border border-[#c8d4c2]
                         bg-white text-[#2c3e2d] text-sm outline-none
                         focus:border-[#6b8f5e] transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6b8f5e] opacity-50"
            >
              {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="terms"
              checked={form.terms}
              onChange={handleChange}
              className="w-4 h-4 rounded accent-[#6b8f5e] cursor-pointer"
            />
            <span className="text-xs text-[#7a8c7b]">
              I agree to the{" "}
              <span className="text-[#6b8f5e] underline cursor-pointer">
                Terms and Conditions
              </span>
            </span>
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 sm:py-3 bg-[#6b8f5e] hover:bg-[#5a7a4e] text-white
                       rounded-xl font-medium text-sm transition-colors disabled:opacity-60"
          >
            {loading ? "Creating account..." : "Sign Up"}
          </button>

        </form>

        <div className="flex items-center gap-3 my-4">
          <div className="flex-1 h-px bg-[#c8d4c2]" />
          <span className="text-xs text-[#9aaa9b]">or continue with</span>
          <div className="flex-1 h-px bg-[#c8d4c2]" />
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleGoogle}
            className="flex-1 flex items-center justify-center gap-2 py-2 sm:py-2.5
                       border border-[#c8d4c2] rounded-xl bg-white text-xs sm:text-sm text-[#2c3e2d]
                       hover:bg-[#f0ede6] transition-colors"
          >
            <GoogleIcon /> Google
          </button>
          <button
            type="button"
            className="flex-1 flex items-center justify-center gap-2 py-2 sm:py-2.5
                       border border-[#c8d4c2] rounded-xl bg-white text-xs sm:text-sm text-[#2c3e2d]
                       hover:bg-[#f0ede6] transition-colors"
          >
            <AppleIcon /> Apple
          </button>
        </div>

        <p className="text-center text-xs sm:text-sm text-[#7a8c7b] mt-4 sm:mt-5">
          Already have an account?{" "}
          <Link to="/login" className="text-[#6b8f5e] font-medium hover:underline">
            Sign In
          </Link>
        </p>

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
      <line x1="40" y1="38" x2="33" y2="28" stroke="#8aad7a" strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
      <line x1="40" y1="44" x2="47" y2="34" stroke="#8aad7a" strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="#1a1a1a">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
    </svg>
  );
}