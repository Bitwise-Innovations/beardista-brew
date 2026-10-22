import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Lock, Mail, ShieldCheck } from "lucide-react";
import BaristaAnimation from "../components/BaristaAnimation";
import BrandMark from "../components/BrandMark";
import BrewingLoader from "../components/BrewingLoader";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// There is no backend yet, so signing in only waits a moment to show the loader.
const FAKE_SIGN_IN_MS = 900;

const inputClass =
  "h-12 w-full rounded-xl border border-gray-200 bg-gray-50 pl-11 text-sm text-gray-800 outline-none transition focus:border-[#E58422] focus:bg-white focus:ring-2 focus:ring-orange-100";

// Desktop: 60% brand panel + 40% login card. Phones: only the card, logo on top.
export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [signingIn, setSigningIn] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => () => clearTimeout(timerRef.current), []);

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
    setSigningIn(true);
    timerRef.current = setTimeout(() => navigate("/admin/dashboard"), FAKE_SIGN_IN_MS);
  };

  const handleForgotPassword = () => {
    setError("");
    setInfo("Ask the store owner to reset your password. Self-service reset is not available in this preview.");
  };

  return (
    <div className="min-h-screen bg-[#F8F6F3] lg:grid lg:grid-cols-[3fr_2fr]">
      <aside className="relative hidden overflow-hidden bg-[#19244E] px-12 py-10 text-white lg:flex lg:flex-col lg:justify-between">
        <span aria-hidden="true" className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#E58422]/15" />
        <span aria-hidden="true" className="absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-white/5" />

        <div className="relative flex items-center gap-3">
          <BrandMark />
          <div>
            <p className="text-sm font-extrabold tracking-wide">BEARDISTA BREW</p>
            <p className="mt-0.5 text-[10px] font-semibold tracking-[0.2em] text-white/50">ADMIN PANEL</p>
          </div>
        </div>

        <BaristaAnimation className="relative mx-auto w-full max-w-md" />

        <p className="relative text-xs text-white/50">Gentleman's Coffee · Caloocan City</p>
      </aside>

      <main className="flex min-h-screen items-center justify-center px-4 py-10 sm:px-8">
        <div className="w-full max-w-md">
          <div className="rounded-3xl border border-[#EAE5DF] bg-white p-6 shadow-sm sm:p-8">
            <div className="flex flex-col items-center text-center sm:flex-row sm:text-left lg:flex-col lg:items-start">
              <BrandMark size="lg" />
              <div className="mt-3 sm:ml-3 sm:mt-0 lg:ml-0 lg:mt-3">
                <p className="text-sm font-extrabold text-[#19244E]">BEARDISTA BREW</p>
                <p className="mt-0.5 text-[10px] font-semibold tracking-[0.2em] text-gray-400">ADMIN PANEL</p>
              </div>
            </div>

            <h1 className="mt-6 text-2xl font-bold tracking-tight text-[#19244E] sm:mt-8">
              Welcome back
            </h1>
            <p className="mt-1 text-sm text-gray-500">Log in to manage the Beardista Brew menu.</p>

            {error && (
              <p role="alert" className="mt-5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
                {error}
              </p>
            )}

            {info && (
              <p role="status" className="mt-5 rounded-xl border border-orange-200 bg-[#FFF3E7] px-4 py-3 text-sm font-semibold text-[#19244E]">
                {info}
              </p>
            )}

            <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-4">
              <div>
                <label htmlFor="admin-email" className="text-xs font-bold text-[#19244E]">Email</label>
                <div className="relative mt-1.5">
                  <Mail size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    id="admin-email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(event) => {
                      setEmail(event.target.value);
                      setError("");
                    }}
                    placeholder="you@beardistabrew.com"
                    aria-invalid={Boolean(error)}
                    className={`${inputClass} pr-4`}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label htmlFor="admin-password" className="text-xs font-bold text-[#19244E]">Password</label>
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="inline-flex min-h-11 items-center text-xs font-bold text-[#E58422] hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
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
                    className={`${inputClass} pr-12`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    aria-pressed={showPassword}
                    className="absolute right-0.5 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-xl text-gray-400 hover:text-[#19244E]"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={signingIn}
                className="flex min-h-12 w-full items-center justify-center rounded-xl bg-[#E58422] px-4 text-sm font-extrabold text-white shadow-sm transition hover:bg-[#cf7419] disabled:cursor-wait"
              >
                {signingIn ? <BrewingLoader tone="light" size={26} /> : "Log In"}
              </button>
            </form>

            <p className="mt-5 flex items-center justify-center gap-1.5 text-xs font-semibold text-gray-400">
              <ShieldCheck size={14} />
              Staff access only
            </p>
          </div>

          <p className="mt-4 text-center text-xs leading-5 text-gray-400">
            Design preview: any valid email and 8+ character password opens the dashboard.
          </p>
        </div>
      </main>
    </div>
  );
}
