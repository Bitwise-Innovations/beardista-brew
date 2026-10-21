import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Coffee, Eye, EyeOff, Lock, Mail } from "lucide-react";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    setInfo("");

    if (!email.trim() || !password) {
      setError("Enter your email and password.");
      return;
    }
    if (!EMAIL_PATTERN.test(email.trim())) {
      setError("Enter a valid email address.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setError("");
    navigate("/admin/dashboard");
  };

  const handleForgotPassword = () => {
    setError("");
    setInfo("Password reset is not available in this preview. Ask the store owner to reset your password.");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#EEF2F7] px-4 py-10 font-['Plus_Jakarta_Sans',sans-serif]">
      <div className="w-full max-w-md">
        <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#E58422] text-white">
              <Coffee size={22} />
            </div>
            <div>
              <p className="text-sm font-extrabold text-[#19244E]">BEARDISTA BREW</p>
              <p className="mt-0.5 text-[10px] font-semibold tracking-[0.2em] text-gray-400">
                ADMIN PANEL
              </p>
            </div>
          </div>

          <h1 className="mt-6 text-2xl font-extrabold tracking-tight text-[#19244E] sm:mt-8">
            Welcome back
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Log in to manage the Beardista Brew menu.
          </p>

          {error && (
            <p
              role="alert"
              className="mt-5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700"
            >
              {error}
            </p>
          )}

          {info && (
            <p
              role="status"
              className="mt-5 rounded-xl border border-orange-200 bg-orange-50 px-4 py-3 text-sm font-semibold text-[#19244E]"
            >
              {info}
            </p>
          )}

          <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-4">
            <div>
              <label htmlFor="admin-email" className="text-xs font-bold text-[#19244E]">
                Email
              </label>
              <div className="relative mt-1.5">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  id="admin-email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    setError("");
                  }}
                  placeholder="you@example.com"
                  aria-invalid={Boolean(error)}
                  className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50 pl-11 pr-4 text-sm text-gray-800 outline-none transition focus:border-[#E58422] focus:bg-white focus:ring-2 focus:ring-orange-100"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="admin-password" className="text-xs font-bold text-[#19244E]">
                  Password
                </label>
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="inline-flex min-h-11 items-center text-xs font-bold text-[#E58422] hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  id="admin-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value);
                    setError("");
                  }}
                  placeholder="At least 8 characters"
                  aria-invalid={Boolean(error)}
                  className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50 pl-11 pr-12 text-sm text-gray-800 outline-none transition focus:border-[#E58422] focus:bg-white focus:ring-2 focus:ring-orange-100"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-0.5 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-xl text-gray-400 hover:text-[#19244E]"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="min-h-12 w-full rounded-xl bg-[#E58422] px-4 py-3 text-sm font-extrabold text-white shadow-sm transition hover:bg-[#cf7419]"
            >
              Log In
            </button>
          </form>
        </div>

        <p className="mt-4 text-center text-xs leading-5 text-gray-400">
          Design preview only. No real login: any valid email and 8+ character password opens the dashboard.
        </p>
      </div>
    </div>
  );
}
