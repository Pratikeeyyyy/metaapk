// Currency unit registry.
//
// Every currency follows the same model: a main unit and a smallest unit that
// amounts are stored in (ETH -> wei, NPR -> paisa). This keeps the crypto and
// the rupee flows symmetrical: parse a human amount into the smallest integer
// unit, split it, then format it back for display.

export const CURRENCIES = {
  crypto: {
    id: "crypto",
    name: "Crypto (Ethereum)",
    symbol: "ETH",
    subUnit: "wei",
    subUnitPlural: "wei",
    decimals: 18,
    decimalsLabel: 2,
    isCrypto: true,
  },
  npr: {
    id: "npr",
    name: "Nepalese Rupees",
    symbol: "Rs",
    subUnit: "paisa",
    subUnitPlural: "paisa",
    decimals: 2,
    decimalsLabel: 2,
    isCrypto: false,
  },
};

export const NPR = CURRENCIES.npr;
export const CRYPTO = CURRENCIES.crypto;

// 1 Rs = 100 paisa
export const PAISA_PER_RUPEE = 100n;

const PAISA_SCALE = 10n ** BigInt(NPR.decimals);

/**
 * Parse a human readable rupee amount ("1,250.5", "12") into integer paisa.
 * Mirrors ethers.utils.parseEther: everything is stored as the smallest unit.
 * Invalid or empty input becomes 0n.
 */
export function toPaisa(amount) {
  if (amount === null || amount === undefined || amount === "") return 0n;
  const raw = String(amount).trim().replace(/,/g, "");
  if (!raw) return 0n;

  const match = /^([+-]?)(\d*)(?:\.(\d*))?$/.exec(raw);
  if (!match) return 0n;

  const [, sign, wholePart, fracPart = ""] = match;
  if (!wholePart && !fracPart) return 0n;

  const whole = wholePart || "0";
  // keep only the sub-unit precision, extra digits are truncated like wei does
  const frac = fracPart.slice(0, NPR.decimals).padEnd(NPR.decimals, "0");

  const value =
    BigInt(whole) * PAISA_SCALE + BigInt(frac === "" ? "0" : frac);
  return sign === "-" ? -value : value;
}

/**
 * Format integer paisa back into a rupee string ("1250.50").
 */
export function fromPaisa(paisa) {
  let value = typeof paisa === "bigint" ? paisa : BigInt(paisa ?? 0);
  const negative = value < 0n;
  if (negative) value = -value;

  const whole = value / PAISA_SCALE;
  const frac = (value % PAISA_SCALE).toString().padStart(NPR.decimals, "0");

  return `${negative ? "-" : ""}${whole}.${frac}`;
}

/**
 * Display helper: paisa -> "Rs 1,250.50" with thousand separators.
 */
export function formatRupees(paisa, { withSymbol = true } = {}) {
  const [whole, frac] = fromPaisa(paisa).split(".");
  const grouped = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  const body = `${grouped}.${frac}`;
  return withSymbol ? `Rs ${body}` : body;
}

/**
 * Short display helper for cards and badges: paisa -> "Rs 1,250.50".
 * Kept separate from formatRupees so callers can pass a precision hint later.
 */
export function paisaToFloat(paisa) {
  return Number(fromPaisa(paisa));
}

/**
 * Split an integer amount into `people` equal parts, distributing the remainder
 * one paisa at a time so the parts always add back up to the total exactly.
 * This is the paisa equivalent of splitting wei on-chain.
 */
export function splitPaisa(totalPaisa, people) {
  const total = typeof totalPaisa === "bigint" ? totalPaisa : BigInt(totalPaisa ?? 0);
  if (!people || people < 1) return [];

  const negative = total < 0n;
  const abs = negative ? -total : total;

  const base = abs / BigInt(people);
  let remainder = abs % BigInt(people);

  const parts = [];
  for (let i = 0; i < people; i += 1) {
    const extra = remainder > 0n ? 1n : 0n;
    remainder -= extra;
    parts.push(negative ? -(base + extra) : base + extra);
  }
  return parts;
}

/**
 * Sum a list of paisa values (BigInt safe).
 */
export function sumPaisa(values) {
  return values.reduce((total, value) => total + BigInt(value ?? 0), 0n);
}