import { useState } from "react";
import { Link } from "react-router-dom";

/**
 * Layout shared by the sign in and sign up screens: an animated brand panel
 * on the left and the form on the right.
 */
const HIGHLIGHTS = [
  {
    icon: "fa-money-bill-wave",
    tone: "emerald",
    title: "Share RS",
    copy: "Split Nepali Rupees. Amounts live in paisa, the paisa to the rupee as wei is to ETH.",
  },
  {
    icon: "fab fa-ethereum",
    tone: "orange",
    title: "Share Crypto",
    copy: "Split ETH on Sepolia with real on-chain settlements between friends.",
  },
  {
    icon: "fa-bolt",
    tone: "violet",
    title: "Instant split preview",
    copy: "See every share the moment you type the total, down to the paisa.",
  },
];

const TONE = {
  emerald: "bg-emerald-400/15 text-emerald-300 ring-emerald-400/30",
  orange: "bg-orange-400/15 text-orange-300 ring-orange-400/30",
  violet: "bg-violet-400/15 text-violet-300 ring-violet-400/30",
};

export default function AuthLayout({
  eyebrow,
  title,
  subtitle,
  children,
  footer,
}) {
  return (
    <div className="aurora-bg flex min-h-screen items-center justify-center p-4 sm:p-6">
      {/* Ambient blobs, decorative only */}
      <div
        className="aurora-blob left-[-12%] top-[-10%] h-[28rem] w-[28rem] bg-emerald-500/30"
        aria-hidden="true"
      />
      <div
        className="aurora-blob right-[-10%] top-[15%] h-[24rem] w-[24rem] bg-violet-600/25 animate-floatSlower"
        aria-hidden="true"
      />
      <div
        className="aurora-blob bottom-[-15%] left-[25%] h-[26rem] w-[26rem] bg-orange-500/20"
        style={{ animationDelay: "-6s" }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 grid-lines opacity-60"
        aria-hidden="true"
      />

      <div className="relative w-full max-w-6xl">
        <div className="grid overflow-hidden rounded-3xl border border-white/10 bg-slate-900/70 shadow-2xl backdrop-blur-xl lg:grid-cols-2">
          {/* Brand panel */}
          <section className="relative hidden flex-col justify-between overflow-hidden p-10 lg:flex">
            <div
              className="pointer-events-none absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-violet-500/10"
              aria-hidden="true"
            />
            <div className="relative">
              <Link to="/" className="inline-flex items-center gap-2">
                <span className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 text-xl shadow-glow">
                  💸
                </span>
                <span className="text-lg font-bold text-white">SplitEasy</span>
              </Link>

              <h2 className="mt-10 text-4xl font-bold leading-tight text-white">
                Split any bill,
                <br />
                <span className="text-gradient bg-gradient-to-r from-emerald-300 via-sky-300 to-violet-300">
                  in the smallest unit.
                </span>
              </h2>
              <p className="mt-4 max-w-sm text-slate-400">
                Rupees in paisa, ETH in wei. Same splitting maths, two very
                different settlement rails.
              </p>

              <ul className="mt-10 space-y-4">
                {HIGHLIGHTS.map((item, i) => (
                  <li
                    key={item.title}
                    className="flex animate-rise gap-3"
                    style={{ animationDelay: `${120 + i * 110}ms` }}
                  >
                    <span
                      className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ring-1 ${TONE[item.tone]}`}
                    >
                      <i className={`fas ${item.icon}`}></i>
                    </span>
                    <span>
                      <span className="block font-semibold text-slate-100">
                        {item.title}
                      </span>
                      <span className="block text-sm text-slate-400">
                        {item.copy}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <p className="relative text-xs text-slate-500">
              Rupee records stay on this device. Crypto records settle on
              Sepolia.
            </p>
          </section>

          {/* Form panel */}
          <section className="relative p-6 sm:p-10">
            <div className="mx-auto w-full max-w-sm">
              <div className="lg:hidden">
                <Link to="/" className="inline-flex items-center gap-2">
                  <span className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 text-lg shadow-glow">
                    💸
                  </span>
                  <span className="text-lg font-bold text-white">SplitEasy</span>
                </Link>
              </div>

              <div className="mt-8 lg:mt-0">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-400">
                  {eyebrow}
                </p>
                <h1 className="mt-2 text-3xl font-bold text-white">{title}</h1>
                <p className="mt-2 text-sm text-slate-400">{subtitle}</p>
              </div>

              <div className="mt-8">{children}</div>

              {footer && (
                <div className="mt-8 border-t border-white/10 pt-6 text-center text-sm text-slate-400">
                  {footer}
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export function PasswordField({ id, value, onChange, placeholder, autoComplete }) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <input
        id={id}
        type={visible ? "text" : "password"}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required
        className="field pr-12"
      />
      <button
        type="button"
        onClick={() => setVisible((prev) => !prev)}
        aria-label={visible ? "Hide password" : "Show password"}
        className="absolute right-2 top-1/2 grid h-9 w-9 -translate-y-1/2 cursor-pointer place-items-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-700 dark:hover:text-slate-100"
      >
        <i className={`fas ${visible ? "fa-eye-slash" : "fa-eye"}`}></i>
      </button>
    </div>
  );
}

export function FormAlert({ tone = "error", children }) {
  if (!children) return null;
  const tones = {
    error:
      "bg-red-500/10 text-red-200 ring-1 ring-red-400/30 border border-red-400/30",
    success:
      "bg-emerald-500/10 text-emerald-200 ring-1 ring-emerald-400/30 border border-emerald-400/30",
    info: "bg-sky-500/10 text-sky-200 ring-1 ring-sky-400/30 border border-sky-400/30",
  };
  const icons = {
    error: "fa-circle-exclamation",
    success: "fa-circle-check",
    info: "fa-circle-info",
  };

  return (
    <div
      role="alert"
      className={`mb-5 flex animate-rise items-start gap-2.5 rounded-xl px-4 py-3 text-sm ${tones[tone]}`}
    >
      <i className={`fas ${icons[tone]} mt-0.5`}></i>
      <span>{children}</span>
    </div>
  );
}

export function SubmitButton({ loading, idleLabel, busyLabel }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="btn-primary w-full shadow-glow"
    >
      {loading ? (
        <>
          <i className="fas fa-circle-notch fa-spin"></i>
          {busyLabel}
        </>
      ) : (
        <>
          <i className="fas fa-arrow-right-to-bracket"></i>
          {idleLabel}
        </>
      )}
    </button>
  );
}