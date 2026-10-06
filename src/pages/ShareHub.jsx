import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { CURRENCIES } from "../lib/currency";

const OPTIONS = [
  {
    id: "npr",
    to: "/app/share-rs",
    label: "Share RS",
    tagline: "Nepalese Rupees",
    currency: CURRENCIES.npr,
    route: "Records only",
    icon: "fa-money-bill-wave",
    blurb:
      "Track who owes whom in rupees. Amounts are stored in paisa, exactly the way ETH amounts are stored in wei.",
    points: [
      "1 Rs = 100 paisa, split down to the last paisa",
      "Equal split between the payer and participants",
      "Mark shares settled by hand, nothing moves money",
    ],
  },
  {
    id: "crypto",
    to: "/app/share-crypto",
    label: "Share Crypto",
    tagline: "Ethereum on Sepolia",
    currency: CURRENCIES.crypto,
    route: "On-chain payments",
    icon: "fab fa-ethereum",
    blurb:
      "Split ETH with friends and settle for real. Every expense and every payment lives on Sepolia.",
    points: [
      "1 ETH = 10^18 wei, settled by transaction",
      "Participants pay their share to the payer",
      "Mint an NFT receipt once an expense is settled",
    ],
  },
];

const TONES = {
  npr: {
    ring: "hover:border-emerald-400/70 hover:shadow-glow",
    chip: "bg-emerald-400/15 text-emerald-300 ring-emerald-400/30",
    bar: "bg-gradient-to-r from-emerald-400 to-teal-400",
    text: "text-emerald-300",
    soft: "text-emerald-400/80",
    panel:
      "from-emerald-500/10 via-emerald-500/5 to-transparent border-emerald-400/20",
  },
  crypto: {
    ring: "hover:border-orange-400/70 hover:shadow-glow-orange",
    chip: "bg-orange-400/15 text-orange-300 ring-orange-400/30",
    bar: "bg-gradient-to-r from-orange-400 to-amber-400",
    text: "text-orange-300",
    soft: "text-orange-400/80",
    panel:
      "from-orange-500/10 via-orange-500/5 to-transparent border-orange-400/20",
  },
};

function CoinMark({ option, size = "lg" }) {
  const tone = TONES[option.id];
  const box = size === "lg" ? "h-14 w-14 text-2xl" : "h-11 w-11 text-lg";

  return (
    <span className="relative inline-grid place-items-center">
      {/* pulsing ring, decorative */}
      <span
        className={`absolute inset-0 rounded-2xl ${tone.bar} opacity-30 animate-pulseRing`}
        aria-hidden="true"
      />
      <span
        className={`relative grid ${box} place-items-center rounded-2xl bg-slate-900 ring-1 ring-white/10 ${tone.text} shadow-lg`}
      >
        <i className={`fas ${option.icon}`}></i>
      </span>
    </span>
  );
}

function ShareHub() {
  const { user } = useAuth();
  const [activeId, setActiveId] = useState("npr");
  const [hoveredId, setHoveredId] = useState(null);

  const shownId = hoveredId ?? activeId;
  const shown = OPTIONS.find((option) => option.id === shownId) ?? OPTIONS[0];
  const shownTone = TONES[shown.id];
  const activeIndex = OPTIONS.findIndex((option) => option.id === activeId);

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950">
      <div className="aurora-blob left-[-8%] top-[-8%] h-[26rem] w-[26rem] bg-emerald-500/25" aria-hidden="true" />
      <div
        className="aurora-blob right-[-6%] top-[10%] h-[22rem] w-[22rem] bg-orange-500/20 animate-floatSlower"
        aria-hidden="true"
      />
      <div
        className="aurora-blob bottom-[-18%] left-[35%] h-[24rem] w-[24rem] bg-violet-600/20"
        style={{ animationDelay: "-7s" }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 grid-lines opacity-50"
        aria-hidden="true"
      />

      <div className="relative mx-auto w-full max-w-5xl px-5 py-10 sm:py-14">
        {/* Heading */}
        <header className="text-center">
          <p className="inline-flex animate-rise items-center gap-2 rounded-full bg-white/5 px-4 py-1.5 text-xs font-medium text-slate-300 ring-1 ring-white/10">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400"></span>
            </span>
            Signed in as {user?.name}
          </p>

          <h1 className="mt-6 animate-rise text-4xl font-bold leading-tight text-white sm:text-5xl">
            How do you want to{" "}
            <span className="text-gradient bg-gradient-to-r from-emerald-300 via-sky-300 to-orange-300">
              split it?
            </span>
          </h1>
          <p
            className="mx-auto mt-4 max-w-xl animate-rise text-slate-400"
            style={{ animationDelay: "80ms" }}
          >
            Same splitting maths either side. Pick rupees to keep a local record,
            or ETH to settle on chain.
          </p>
        </header>

        {/* Segmented switcher */}
        <div
          role="tablist"
          aria-label="Choose a currency to share with"
          className="relative mx-auto mt-10 grid max-w-md grid-cols-2 gap-1 rounded-2xl bg-white/5 p-1.5 ring-1 ring-white/10 backdrop-blur animate-rise"
          style={{ animationDelay: "140ms" }}
        >
          {/* sliding indicator, transform only so it stays on the compositor */}
          <span
            className={`absolute inset-y-1.5 left-1.5 w-[calc(50%-0.375rem)] rounded-xl ${TONES[activeId].bar} opacity-90 transition-transform duration-300 ease-out`}
            style={{
              transform: `translateX(${activeIndex * 100}%)`,
            }}
            aria-hidden="true"
          />
          {OPTIONS.map((option) => {
            const selected = option.id === activeId;
            return (
              <button
                key={option.id}
                role="tab"
                aria-selected={selected}
                onClick={() => setActiveId(option.id)}
                onMouseEnter={() => setHoveredId(option.id)}
                onMouseLeave={() => setHoveredId(null)}
                onFocus={() => setHoveredId(option.id)}
                onBlur={() => setHoveredId(null)}
                className={`relative z-10 cursor-pointer rounded-xl px-4 py-3 text-sm font-semibold transition-colors duration-200 ${
                  selected
                    ? "text-slate-900"
                    : "text-slate-300 hover:text-white"
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>

        {/* Detail panel for the selected option */}
        <div className="mt-8">
        <section
          key={shown.id}
          className="animate-rise rounded-3xl shadow-card"
          style={{ animationDelay: "200ms" }}
        >
          <div
            className={`sheen-card relative rounded-3xl border bg-gradient-to-br p-6 sm:p-8 ${shownTone.panel}`}
          >
            <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex items-start gap-4">
                <CoinMark option={shown} />
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-2xl font-bold text-white">
                      {shown.label}
                    </h2>
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${shownTone.chip}`}
                    >
                      {shown.route}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-slate-400">
                    {shown.tagline} · main unit{" "}
                    <span className={`font-semibold ${shownTone.text}`}>
                      {shown.currency.symbol}
                    </span>{" "}
                    · smallest unit{" "}
                    <span className="font-semibold text-slate-300">
                      {shown.currency.subUnit}
                    </span>{" "}
                    ({shown.currency.decimals} decimals)
                  </p>
                  <p className="mt-3 max-w-lg text-slate-300">{shown.blurb}</p>
                </div>
              </div>

              <Link
                to={shown.to}
                className="group btn-primary shrink-0 px-6 py-3 shadow-glow"
              >
                Open {shown.label}
                <i className="fas fa-arrow-right transition-transform duration-200 group-hover:translate-x-1"></i>
              </Link>
            </div>

            <ul className="mt-6 grid gap-3 sm:grid-cols-3">
              {shown.points.map((point, i) => (
                <li
                  key={point}
                  className="flex animate-rise items-start gap-2 rounded-2xl bg-white/5 p-3 text-sm text-slate-300 ring-1 ring-white/10"
                  style={{ animationDelay: `${260 + i * 80}ms` }}
                >
                  <i
                    className={`fas fa-circle-check mt-0.5 text-xs ${shownTone.text}`}
                  ></i>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Both options at a glance */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {OPTIONS.map((option, i) => {
            const tone = TONES[option.id];
            const selected = option.id === activeId;
            return (
              <Link
                key={option.id}
                to={option.to}
                onMouseEnter={() => setHoveredId(option.id)}
                onMouseLeave={() => setHoveredId(null)}
                onFocus={() => setHoveredId(option.id)}
                onBlur={() => setHoveredId(null)}
                className={`sheen-card group cursor-pointer rounded-2xl border bg-white/5 p-5 ring-1 ring-white/10 backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:bg-white/10 animate-rise ${
                  selected
                    ? `border-white/20 ${tone.ring}`
                    : "border-white/10 hover:border-white/30"
                }`}
                style={{ animationDelay: `${320 + i * 90}ms` }}
              >
                <div className="flex items-center gap-3">
                  <CoinMark option={option} size="sm" />
                  <div>
                    <p className="font-semibold text-white">{option.label}</p>
                    <p className="text-xs text-slate-400">{option.tagline}</p>
                  </div>
                  <i className="fas fa-arrow-right ml-auto text-slate-500 transition-transform duration-200 group-hover:translate-x-1 group-hover:text-white"></i>
                </div>
              </Link>
            );
          })}
        </div>

        <p className="mt-8 text-center text-xs text-slate-500">
          {OPTIONS[0].id === "npr"
            ? "Rupee records are stored in this browser only. Nothing is sent anywhere."
            : "Crypto expenses are written to the Sepolia test network."}
        </p>
        </div>
      </div>
    </div>
  );
}

export default ShareHub;