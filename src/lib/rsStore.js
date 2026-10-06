// localStorage persistence for the Share RS (Nepali Rupees) flow.
//
// The rupee flow is record only: there is no wallet, no contract and no
// transfer, so entries live in the browser and are scoped per logged in user.

const STORAGE_PREFIX = "expenseapp:rs-records:";

const storageKey = (user) => `${STORAGE_PREFIX}${user?.email || "guest"}`;

const canStore = () => {
  try {
    return typeof window !== "undefined" && !!window.localStorage;
  } catch {
    return false;
  }
};

/**
 * Read every rupee record for a user. Corrupt data is discarded rather than
 * crashing the page.
 */
export function loadRsRecords(user) {
  if (!canStore()) return [];
  try {
    const raw = window.localStorage.getItem(storageKey(user));
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((record) => record && typeof record === "object");
  } catch (error) {
    console.error("Failed to read rupee records:", error);
    return [];
  }
}

/**
 * Overwrite the stored records for a user.
 */
export function saveRsRecords(user, records) {
  if (!canStore()) return;
  try {
    window.localStorage.setItem(storageKey(user), JSON.stringify(records));
  } catch (error) {
    console.error("Failed to save rupee records:", error);
  }
}