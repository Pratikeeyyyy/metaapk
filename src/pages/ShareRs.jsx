import { useCallback, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  NPR,
  formatRupees,
  fromPaisa,
  splitPaisa,
  sumPaisa,
  toPaisa,
} from "../lib/currency";
import { loadRsRecords, saveRsRecords } from "../lib/rsStore";

const STATUS = {
  PENDING: 0,
  SETTLED: 1,
  REJECTED: 2,
  BAD_DEBT: 3,
};

const STATUS_TEXT = {
  [STATUS.PENDING]: "⏳ Pending",
  [STATUS.SETTLED]: "✅ Settled",
  [STATUS.REJECTED]: "❌ Rejected",
  [STATUS.BAD_DEBT]: "⚠️ Bad Debt",
};

const STATUS_BADGE = {
  [STATUS.PENDING]:
    "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-300",
  [STATUS.SETTLED]:
    "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-300",
  [STATUS.REJECTED]:
    "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300",
  [STATUS.BAD_DEBT]:
    "bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-300",
};

const emptyParticipants = () => [
  { name: "", settled: false },
  { name: "", settled: false },
];

function StatusBadge({ status }) {
  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold ${
        STATUS_BADGE[status] || STATUS_BADGE[STATUS.PENDING]
      }`}
    >
      {STATUS_TEXT[status] || STATUS_TEXT[STATUS.PENDING]}
    </span>
  );
}

function ShareRs() {
  const { user } = useAuth();

  // stored records (paisa amounts are kept as strings so they survive JSON)
  const [records, setRecords] = useState(() => loadRsRecords(user));
  const [error, setError] = useState("");

  // form state
  const [expenseName, setExpenseName] = useState("");
  const [paidBy, setPaidBy] = useState(user?.name || "");
  const [location, setLocation] = useState("");
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState(String(STATUS.PENDING));
  const [participants, setParticipants] = useState(emptyParticipants);
  const [showBadDebt, setShowBadDebt] = useState(false);
  const [badDebtPerson, setBadDebtPerson] = useState("");

  const [detailView, setDetailView] = useState(null);

  const persist = useCallback(
    (next) => {
      setRecords(next);
      if (user) saveRsRecords(user, next);
    },
    [user],
  );

  const namedParticipants = useMemo(
    () =>
      participants
        .map((p, index) => ({ ...p, index }))
        .filter((p) => p.name.trim().length > 0),
    [participants],
  );

  // amount stored as integer paisa, split the same way wei would be split
  const amountPaisa = useMemo(() => toPaisa(amount), [amount]);
  const splitParts = useMemo(
    () => splitPaisa(amountPaisa, namedParticipants.length + 1),
    [amountPaisa, namedParticipants.length],
  );
  const sharePaisa = splitParts.length > 0 ? splitParts[1] : 0n;

  const summary = useMemo(() => {
    let pending = 0;
    let settled = 0;
    let received = 0;
    let owing = 0;

    records.forEach((record) => {
      if (record.status === STATUS.PENDING) pending += 1;
      if (record.status === STATUS.SETTLED) settled += 1;

      const people = [record.paidBy, ...record.participants.map((p) => p.name)];
      const parts = splitPaisa(BigInt(record.amountPaisa), people.length);
      const myName = (user?.name || "").trim().toLowerCase();

      if (record.paidBy?.trim().toLowerCase() === myName) {
        received += sumPaisa(parts.slice(1));
      }

      record.participants.forEach((participant, i) => {
        if (participant.name.trim().toLowerCase() !== myName) return;
        if (record.status === STATUS.PENDING && !participant.settled) {
          owing += parts[i + 1];
        }
      });
    });

    return {
      pending,
      settled,
      received,
      owing,
      total: sumPaisa(records.map((record) => BigInt(record.amountPaisa))),
    };
  }, [records, user]);

  const handleParticipantChange = (index, value) => {
    setParticipants((prev) =>
      prev.map((participant, i) =>
        i === index ? { ...participant, name: value } : participant,
      ),
    );
  };

  const addParticipant = () => {
    if (participants.length < 10) {
      setParticipants((prev) => [...prev, { name: "", settled: false }]);
    } else {
      setError("Maximum 10 participants allowed");
    }
  };

  const removeParticipant = (index) => {
    if (participants.length > 1) {
      setParticipants((prev) => prev.filter((_, i) => i !== index));
    } else {
      setError("At least 1 participant required");
    }
  };

  const handleStatusChange = (event) => {
    const value = event.target.value;
    setStatus(value);
    setShowBadDebt(value === String(STATUS.BAD_DEBT));
    if (value !== String(STATUS.BAD_DEBT)) setBadDebtPerson("");
  };

  const addRecord = (event) => {
    event.preventDefault();
    setError("");

    if (!expenseName.trim()) return setError("Please enter an expense name");
    if (!paidBy.trim()) return setError("Please enter who paid");
    if (amountPaisa <= 0n) return setError("Amount must be greater than 0");
    if (namedParticipants.length === 0)
      return setError("Please add at least one participant with a name");

    const statusValue = Number(status);
    let storedParticipants = namedParticipants.map((p) => ({
      name: p.name.trim(),
      settled: false,
    }));

    if (statusValue === STATUS.BAD_DEBT && badDebtPerson) {
      const index = Number(badDebtPerson.replace("participant", ""));
      if (Number.isInteger(index) && storedParticipants[index]) {
        storedParticipants[index] = {
          ...storedParticipants[index],
          settled: false,
          badDebt: true,
        };
      }
    }

    const record = {
      id: `rs-${Date.now()}`,
      expname: expenseName.trim(),
      paidBy: paidBy.trim(),
      location: location.trim() || "Unknown",
      amountPaisa: amountPaisa.toString(),
      unit: NPR.symbol,
      subUnit: NPR.subUnit,
      participants: storedParticipants,
      status: statusValue,
      createdAt: new Date().toISOString(),
    };

    persist([record, ...records]);

    setExpenseName("");
    setLocation("");
    setAmount("");
    setStatus(String(STATUS.PENDING));
    setParticipants(emptyParticipants());
    setShowBadDebt(false);
    setBadDebtPerson("");
    alert("Rupee expense recorded!");
  };

  // record only: no money moves, the settlement is just noted down
  const toggleSettled = (recordId, participantIndex) => {
    persist(
      records.map((record) => {
        if (record.id !== recordId) return record;
        const updated = {
          ...record,
          participants: record.participants.map((participant, i) =>
            i === participantIndex
              ? { ...participant, settled: !participant.settled }
              : participant,
          ),
        };
        const allSettled =
          updated.status !== STATUS.REJECTED &&
          updated.participants.every((participant) => participant.settled);
        return { ...updated, status: allSettled ? STATUS.SETTLED : updated.status };
      }),
    );
  };

  const deleteRecord = (recordId) => {
    if (!window.confirm("Delete this record?")) return;
    persist(records.filter((record) => record.id !== recordId));
  };

  const resetRecords = () => {
    if (!window.confirm("This will delete every rupee record. Continue?")) {
      return;
    }
    persist([]);
  };

  const filteredRecords = useMemo(() => {
    if (!detailView) return records;
    if (detailView === "pending") {
      return records.filter((record) => record.status === STATUS.PENDING);
    }
    if (detailView === "settled") {
      return records.filter((record) => record.status === STATUS.SETTLED);
    }
    if (detailView === "received") {
      const myName = (user?.name || "").trim().toLowerCase();
      return records.filter(
        (record) => record.paidBy.trim().toLowerCase() === myName,
      );
    }
    if (detailView === "owing") {
      const myName = (user?.name || "").trim().toLowerCase();
      return records.filter((record) =>
        record.participants.some(
          (participant) =>
            participant.name.trim().toLowerCase() === myName &&
            record.status !== STATUS.SETTLED &&
            !participant.settled,
        ),
      );
    }
    return records;
  }, [records, detailView, user]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:via-slate-900 dark:to-slate-950 p-6 transition-colors duration-500">
      <div className="w-full max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white dark:bg-slate-800 dark:border dark:border-slate-700 rounded-2xl shadow-xl p-8 mb-6 animate-slideUp">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">
              🇳🇵 Share RS
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">
              Split {NPR.name} in {NPR.symbol} and {NPR.subUnit} — records only,
              no wallet needed
            </p>
            <div className="mt-3 flex items-center justify-center gap-2 text-xs">
              <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-300">
                1 {NPR.symbol} = 100 {NPR.subUnit}
              </span>
              <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                Amounts are stored in {NPR.subUnit}, like ETH in wei
              </span>
            </div>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
            <Link
              to="/app"
              className="inline-flex items-center gap-2 text-sm font-semibold text-green-700 dark:text-green-400 hover:underline"
            >
              <i className="fas fa-arrow-left"></i> Back to sharing options
            </Link>
            <span className="text-sm text-slate-500 dark:text-slate-400">
              Records are saved on this device for{" "}
              <span className="font-semibold">{user?.email}</span>
            </span>
          </div>

          {error && (
            <div className="mt-4 p-3 bg-red-100 dark:bg-red-500/20 border border-red-400 dark:border-red-500/50 text-red-700 dark:text-red-300 rounded-lg">
              <i className="fas fa-exclamation-triangle mr-2"></i>
              {error}
            </div>
          )}
        </div>

        {detailView ? (
          <div className="bg-white dark:bg-slate-800 dark:border dark:border-slate-700 rounded-2xl shadow-xl p-6 mb-6 animate-pop">
            <button
              onClick={() => setDetailView(null)}
              className="mb-4 flex items-center gap-2 text-sm font-semibold text-green-700 hover:text-green-800 dark:text-green-400"
            >
              <i className="fas fa-arrow-left"></i> Back to Dashboard
            </button>

            <h2 className="text-2xl font-bold text-slate-700 dark:text-slate-100 mb-4">
              {detailView === "pending" && "⏳ Pending Records"}
              {detailView === "settled" && "✅ Settled Records"}
              {detailView === "received" && "💰 Records You Paid For"}
              {detailView === "owing" && "⚠️ What You Owe"}
            </h2>

            {filteredRecords.length === 0 ? (
              <p className="text-gray-500 dark:text-slate-400 text-center py-8">
                Nothing here yet.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredRecords.map((record, idx) => (
                  <RecordCard
                    key={record.id}
                    record={record}
                    index={idx}
                    onToggleSettled={toggleSettled}
                    onDelete={deleteRecord}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          <>
            {/* Totals */}
            <div className="mb-6 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl shadow-xl p-6 text-white animate-slideUp">
              <div className="flex justify-between items-center flex-wrap gap-4">
                <div>
                  <p className="text-green-100 text-sm">Total Recorded</p>
                  <p className="text-3xl font-bold">
                    {formatRupees(summary.total)}
                  </p>
                  <p className="text-xs text-green-100 mt-1">
                    {fromPaisa(summary.total)} {NPR.subUnit}
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full bg-white/20 text-xs">
                  {records.length} record{records.length === 1 ? "" : "s"}
                </span>
              </div>
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                <div className="bg-white/20 rounded-lg p-2">
                  <p className="text-2xl font-bold">{summary.pending}</p>
                  <p className="text-xs text-green-100">Pending</p>
                </div>
                <div className="bg-white/20 rounded-lg p-2">
                  <p className="text-2xl font-bold">{summary.settled}</p>
                  <p className="text-xs text-green-100">Settled</p>
                </div>
                <div className="bg-white/20 rounded-lg p-2">
                  <p className="text-2xl font-bold">
                    {formatRupees(summary.owing, { withSymbol: false })}
                  </p>
                  <p className="text-xs text-green-100">You Owe</p>
                </div>
                <div className="bg-white/20 rounded-lg p-2">
                  <p className="text-2xl font-bold">
                    {formatRupees(summary.received, { withSymbol: false })}
                  </p>
                  <p className="text-xs text-green-100">Lent To You</p>
                </div>
              </div>
            </div>

            {/* State cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6 mb-6">
              {[
                {
                  key: "pending",
                  icon: "fa-clock",
                  iconBg: "bg-yellow-100 dark:bg-yellow-500/20",
                  iconText: "text-yellow-600 dark:text-yellow-400",
                  label: "⏳ Pending",
                  value: summary.pending,
                  text: "text-yellow-700 dark:text-yellow-300",
                  ring: "border-yellow-200 dark:border-yellow-500/30",
                  cardBg: "bg-yellow-50 dark:bg-slate-700",
                },
                {
                  key: "settled",
                  icon: "fa-check-circle",
                  iconBg: "bg-green-100 dark:bg-green-500/20",
                  iconText: "text-green-600 dark:text-green-400",
                  label: "✅ Settled",
                  value: summary.settled,
                  text: "text-green-700 dark:text-green-300",
                  ring: "border-green-200 dark:border-green-500/30",
                  cardBg: "bg-green-50 dark:bg-slate-700",
                },
                {
                  key: "received",
                  icon: "fa-hand-holding-heart",
                  iconBg: "bg-blue-100 dark:bg-blue-500/20",
                  iconText: "text-blue-600 dark:text-blue-400",
                  label: "💰 Lent To You",
                  value: summary.received,
                  text: "text-blue-700 dark:text-blue-300",
                  ring: "border-blue-200 dark:border-blue-500/30",
                  cardBg: "bg-blue-50 dark:bg-slate-700",
                },
                {
                  key: "owing",
                  icon: "fa-exclamation-circle",
                  iconBg: "bg-orange-100 dark:bg-orange-500/20",
                  iconText: "text-orange-600 dark:text-orange-400",
                  label: "⚠️ You Owe",
                  value: summary.owing,
                  text: "text-orange-700 dark:text-orange-300",
                  ring: "border-orange-200 dark:border-orange-500/30",
                  cardBg: "bg-orange-50 dark:bg-slate-700",
                },
              ].map((card, i) => (
                <button
                  key={card.key}
                  onClick={() => setDetailView(card.key)}
                  className={`group ${card.cardBg} border-2 ${card.ring} rounded-2xl p-5 text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300 animate-pop cursor-pointer`}
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  <div
                    className={`w-12 h-12 mx-auto mb-2 ${card.iconBg} rounded-full flex items-center justify-center group-hover:scale-110 transition-transform`}
                  >
                    <i className={`fas ${card.icon} ${card.iconText} text-xl`}></i>
                  </div>
                  <p className={`text-sm font-medium ${card.text}`}>
                    {card.label}
                  </p>
                  <p className={`text-2xl font-bold ${card.text}`}>
                    {typeof card.value === "bigint"
                      ? formatRupees(card.value)
                      : card.value}
                  </p>
                  <p className={`text-xs ${card.text} mt-1 group-hover:underline`}>
                    View details →
                  </p>
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Add record form */}
              <div className="bg-white dark:bg-slate-800 dark:border dark:border-slate-700 rounded-2xl shadow-xl p-6 animate-slideUp">
                <h2 className="text-xl font-bold text-slate-700 dark:text-slate-100 mb-4">
                  <i className="fas fa-plus-circle text-green-600"></i> Record a
                  Rupee Expense
                </h2>

                <form onSubmit={addRecord} className="space-y-3">
                  <input
                    type="text"
                    placeholder="Expense name (e.g. Trip to Pokhara)"
                    className="w-full border dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                    value={expenseName}
                    onChange={(e) => setExpenseName(e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Paid by"
                    className="w-full border dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                    value={paidBy}
                    onChange={(e) => setPaidBy(e.target.value)}
                  />

                  {/* Participants */}
                  <div className="border border-blue-200 dark:border-blue-500/30 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-semibold text-gray-600 dark:text-slate-300">
                        Participants
                      </label>
                      <button
                        type="button"
                        onClick={addParticipant}
                        disabled={participants.length >= 10}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-xs disabled:opacity-50"
                      >
                        <i className="fas fa-plus"></i> Add
                      </button>
                    </div>

                    {participants.map((participant, index) => (
                      <div
                        key={index}
                        className="mt-2 p-2 bg-white dark:bg-slate-800 rounded border border-blue-200 dark:border-blue-500/30"
                      >
                        <div className="flex justify-between items-start">
                          <input
                            type="text"
                            placeholder={`Participant ${index + 1} name`}
                            className="flex-1 border dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={participant.name}
                            onChange={(e) =>
                              handleParticipantChange(index, e.target.value)
                            }
                          />
                          {participants.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeParticipant(index)}
                              className="text-red-500 hover:text-red-700 ml-2"
                            >
                              <i className="fas fa-times"></i>
                            </button>
                          )}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          Share: {formatRupees(sharePaisa)} (
                          {fromPaisa(sharePaisa)} {NPR.subUnit})
                        </div>
                      </div>
                    ))}
                  </div>

                  <input
                    type="text"
                    placeholder="Location of expense"
                    className="w-full border dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    placeholder={`Total Amount (${NPR.symbol})`}
                    className="w-full border dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />

                  {/* Split preview */}
                  <div className="bg-green-50 dark:bg-slate-700 p-3 rounded-lg">
                    <p className="font-semibold text-green-700 dark:text-green-400">
                      💰 Split Preview:
                    </p>
                    <p className="text-xl font-bold text-green-600 dark:text-green-400">
                      {formatRupees(sharePaisa)} per person
                    </p>
                    <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">
                      Total: {amount || "0"} {NPR.symbol} ={" "}
                      {fromPaisa(amountPaisa)} {NPR.subUnit}, split equally
                      between payer + {namedParticipants.length} participant
                      {namedParticipants.length === 1 ? "" : "s"} ={" "}
                      {namedParticipants.length + 1} people
                    </p>
                    {splitParts.length > 1 && (
                      <ul className="mt-2 space-y-0.5">
                        {splitParts.map((part, i) => (
                          <li
                            key={i}
                            className="text-xs text-gray-600 dark:text-slate-300"
                          >
                            {i === 0
                              ? paidBy || "Payer"
                              : namedParticipants[i - 1]?.name || `Participant ${i}`}{" "}
                            → <span className="font-mono">{formatRupees(part)}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <select
                    className="w-full border dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                    value={status}
                    onChange={handleStatusChange}
                  >
                    <option value={String(STATUS.PENDING)}>⏳ Pending</option>
                    <option value={String(STATUS.SETTLED)}>✅ Settled</option>
                    <option value={String(STATUS.REJECTED)}>
                      ❌ Rejected
                    </option>
                    <option value={String(STATUS.BAD_DEBT)}>⚠️ Bad Debt</option>
                  </select>

                  {showBadDebt && (
                    <div className="bg-red-50 dark:bg-slate-700 p-3 rounded-lg border-2 border-red-300 dark:border-red-500/30 animate-fadeIn">
                      <label className="text-sm font-semibold text-red-700 flex items-center gap-2">
                        <i className="fas fa-exclamation-triangle"></i> Mark as
                        Bad Debt
                      </label>
                      <select
                        className="w-full border dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 rounded-lg p-2 mt-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                        value={badDebtPerson}
                        onChange={(e) => setBadDebtPerson(e.target.value)}
                      >
                        <option value="">Select who has bad debt</option>
                        {namedParticipants.map((participant) => (
                          <option
                            key={participant.index}
                            value={`participant${participant.index}`}
                          >
                            {participant.name}
                          </option>
                        ))}
                      </select>
                      <p className="text-xs text-red-600 mt-2">
                        ⚠️ This person will be flagged as having bad debt.
                      </p>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 transition-all"
                  >
                    <i className="fas fa-save"></i> Save Record
                  </button>
                </form>
              </div>

              {/* Records list */}
              <div className="bg-white dark:bg-slate-800 dark:border dark:border-slate-700 rounded-2xl shadow-xl p-6 flex flex-col animate-slideUp">
                <h2 className="text-xl font-bold text-slate-700 dark:text-slate-100 mb-4">
                  <i className="fas fa-list text-blue-600"></i> Records
                </h2>

                {records.length === 0 ? (
                  <div className="text-center py-8 text-gray-500 dark:text-slate-400">
                    <i className="fas fa-receipt text-4xl mb-3 text-gray-300"></i>
                    <p>No records yet. Add your first rupee expense!</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                    {records.map((record, idx) => (
                      <RecordCard
                        key={record.id}
                        record={record}
                        index={idx}
                        onToggleSettled={toggleSettled}
                        onDelete={deleteRecord}
                      />
                    ))}
                  </div>
                )}

                <div className="mt-auto pt-4 border-t dark:border-slate-600">
                  <button
                    onClick={resetRecords}
                    disabled={records.length === 0}
                    className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-xl transition-all flex items-center justify-center gap-3"
                  >
                    <i className="fas fa-trash-alt"></i> ⚠️ RESET ALL RECORDS ⚠️
                  </button>
                  <p className="text-sm text-red-500 mt-2 text-center">
                    Warning: this permanently deletes every rupee record on this
                    device.
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function RecordCard({ record, index, onToggleSettled, onDelete }) {
  const total = BigInt(record.amountPaisa);
  const people = [record.paidBy, ...record.participants.map((p) => p.name)];
  const parts = splitPaisa(total, people.length);

  return (
    <div
      className="border dark:border-slate-600 rounded-xl p-4 hover:shadow-md transition-shadow animate-slideUp"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="font-bold text-slate-800 dark:text-slate-100">
            {record.expname}
          </h3>
          <p className="text-sm text-gray-500 dark:text-slate-400">
            Paid by: {record.paidBy}
          </p>
          <p className="text-sm text-gray-500 dark:text-slate-400">
            Location: {record.location}
          </p>
          <p className="text-xs text-gray-400 dark:text-slate-500">
            {new Date(record.createdAt).toLocaleString()}
          </p>
        </div>
        <StatusBadge status={record.status} />
      </div>

      <div className="mt-3">
        <span className="text-lg font-bold text-slate-800 dark:text-slate-100">
          {formatRupees(total)}
        </span>
        <span className="text-sm text-gray-500 dark:text-slate-400 ml-2">
          ({record.participants.length} participants,{" "}
          {formatRupees(parts[1] || 0n)} each)
        </span>
        <p className="text-xs text-gray-400 dark:text-slate-500">
          {fromPaisa(total)} {NPR.subUnit} stored
        </p>
      </div>

      {record.participants.length > 0 && (
        <div className="mt-3 border-t dark:border-slate-600 pt-3">
          <p className="text-xs font-semibold text-gray-500 dark:text-slate-400 mb-1">
            PARTICIPANTS:
          </p>
          <div className="space-y-1">
            {record.participants.map((participant, i) => (
              <div
                key={i}
                className="flex justify-between items-center text-sm bg-gray-50 dark:bg-slate-700 p-1.5 rounded"
              >
                <span className="font-medium dark:text-slate-200">
                  {participant.name}
                  <span className="text-gray-400 dark:text-slate-500 ml-2 text-xs">
                    {formatRupees(parts[i + 1] || 0n)}
                  </span>
                  {participant.badDebt && (
                    <span className="ml-2 bg-orange-100 text-orange-600 dark:bg-orange-500/20 dark:text-orange-300 text-xs px-1.5 py-0.5 rounded">
                      Bad debt
                    </span>
                  )}
                  {participant.settled && (
                    <span className="ml-2 bg-green-100 text-green-600 dark:bg-green-500/20 dark:text-green-300 text-xs px-1.5 py-0.5 rounded">
                      ✅ Settled
                    </span>
                  )}
                </span>
                <div className="flex gap-2">
                  {record.status !== STATUS.REJECTED && (
                    <button
                      onClick={() => onToggleSettled(record.id, i)}
                      className={`px-2 py-1 rounded text-xs text-white ${
                        participant.settled
                          ? "bg-gray-500 hover:bg-gray-600"
                          : "bg-green-500 hover:bg-green-600"
                      }`}
                    >
                      {participant.settled ? "Unsettle" : "Mark Settled"}
                    </button>
                  )}
                  <button
                    onClick={() => onDelete(record.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs"
                  >
                    <i className="fas fa-trash-alt"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ShareRs;