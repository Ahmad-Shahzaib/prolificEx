"use client";

import { useEffect, useState } from "react";
import { Check, ChevronDown, Search, SlidersHorizontal, X, XCircle } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  fetchAdminWithdrawals,
  approveAdminWithdrawal,
  rejectAdminWithdrawal,
} from "@/redux/thunk/adminWithdrawalsThunk";

const coins = [
  { name: "Ethereum", symbol: "ETH", color: "#627EEA", bg: "#627EEA22", letter: "E" },
  { name: "Bitcoin", symbol: "BTC", color: "#F7931A", bg: "#F7931A22", letter: "B" },
  { name: "Tether", symbol: "USDT", color: "#26A17B", bg: "#26A17B22", letter: "T" },
  { name: "Binance Coin", symbol: "BNB", color: "#F3BA2F", bg: "#F3BA2F22", letter: "B" },
];

const coinBySymbol = Object.fromEntries(coins.map((coin) => [coin.symbol, coin]));

function CoinIcon({ coin }: { coin: (typeof coins)[number] }) {
  return (
    <span
      className="inline-flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-[11px] font-bold"
      style={{ background: coin.bg, color: coin.color, border: `1.5px solid ${coin.color}44` }}
    >
      {coin.letter}
    </span>
  );
}

function StatusBadge({ status }: { status: string }) {
  const normalized = status.toLowerCase();
  const tone =
    normalized === "approved"
      ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
      : normalized === "failed" || normalized === "rejected"
        ? "border-rose-400/20 bg-rose-400/10 text-rose-300"
        : "border-amber-400/20 bg-amber-400/10 text-amber-300";

  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ${tone}`}>
      {status || "Pending"}
    </span>
  );
}

export default function AdminWithdrawalMonitoringPage() {
  const dispatch = useAppDispatch();
  const { entries, loading, error, actionLoading, actionError, actionMessage } = useAppSelector(
    (state) => state.adminWithdrawals
  );

  const [autoApproval, setAutoApproval] = useState(true);
  const [search, setSearch] = useState("");
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeAction, setActiveAction] = useState<"approve" | "reject" | null>(null);
  const [txid, setTxid] = useState("");
  const [notes, setNotes] = useState("");
  const [reason, setReason] = useState("");
  const [formError, setFormError] = useState("");

  useEffect(() => {
    dispatch(fetchAdminWithdrawals());
  }, [dispatch]);

  const closeActionModal = () => {
    setActiveId(null);
    setActiveAction(null);
    setTxid("");
    setNotes("");
    setReason("");
    setFormError("");
  };

  const openActionModal = (id: string, action: "approve" | "reject") => {
    setActiveId(id);
    setActiveAction(action);
    setTxid("");
    setNotes("");
    setReason("");
    setFormError("");
  };

  const handleApprove = async (id: string) => {
    if (!notes.trim()) {
      setFormError("Please enter notes before approving.");
      return;
    }

    const resultAction = await dispatch(approveAdminWithdrawal({ id, txid: txid.trim(), notes: notes.trim() }));
    if (approveAdminWithdrawal.fulfilled.match(resultAction)) {
      closeActionModal();
      dispatch(fetchAdminWithdrawals());
    }
  };

  const handleReject = async (id: string) => {
    if (!reason.trim()) {
      setFormError("Please provide a rejection reason.");
      return;
    }

    const resultAction = await dispatch(rejectAdminWithdrawal({ id, reason: reason.trim() }));
    if (rejectAdminWithdrawal.fulfilled.match(resultAction)) {
      closeActionModal();
      dispatch(fetchAdminWithdrawals());
    }
  };

  const visibleRows = entries.filter((entry) => {
    if (!search.trim()) return true;
    const term = search.toLowerCase();
    return (
      entry.id.toLowerCase().includes(term) ||
      entry.name.toLowerCase().includes(term) ||
      entry.email.toLowerCase().includes(term) ||
      entry.amount.toLowerCase().includes(term) ||
      entry.address.toLowerCase().includes(term)
    );
  });

  const getCoin = (symbol: string) =>
    coinBySymbol[symbol] ?? {
      name: symbol,
      symbol,
      color: "#9ca3af",
      bg: "#37415122",
      letter: symbol.charAt(0),
    };

  const activeRow = activeId ? entries.find((entry) => entry.id === activeId) : null;

  return (
    <div className="min-h-screen bg-[#10111a] px-4 py-6 font-sans text-white sm:px-6 sm:py-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <h1 className="text-[22px] font-semibold tracking-tight">Withdrawals Approval</h1>
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-slate-300">Auto-Approval Mode</span>
            <button
              onClick={() => setAutoApproval((value) => !value)}
              className={`relative h-6 w-12 rounded-full transition-colors duration-200 focus:outline-none ${
                autoApproval ? "bg-violet-500" : "bg-[#2a2d3f]"
              }`}
              aria-label="Toggle auto approval mode"
            >
              <span
                className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-200 ${
                  autoApproval ? "translate-x-6" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-[#272a40] bg-[#181a27] shadow-2xl shadow-black/20">
          <div className="flex flex-col items-stretch gap-3 border-b border-[#272a40] px-5 py-4 sm:flex-row sm:items-center">
            <div className="flex flex-1 items-center gap-3 rounded-xl border border-[#2a2d45] bg-[#0f1017] px-4 py-3 shadow-inner shadow-black/20 focus-within:border-violet-500/60">
              <Search className="h-4 w-4 flex-shrink-0 text-slate-500" />
              <input
                type="text"
                placeholder="Search withdrawals..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="w-full bg-transparent text-sm text-slate-200 outline-none placeholder:text-slate-600"
              />
            </div>

            <div className="flex flex-wrap gap-3">
              <button className="flex items-center gap-2 whitespace-nowrap rounded-xl border border-[#2a2d45] bg-[#202337] px-4 py-3 text-sm font-medium text-slate-200 transition-colors hover:border-[#3b3f60] hover:bg-[#252941]">
                Date
                <ChevronDown className="h-4 w-4 text-slate-400" />
              </button>

              <button className="flex items-center gap-2 whitespace-nowrap rounded-xl border border-[#2a2d45] bg-[#202337] px-4 py-3 text-sm font-medium text-slate-200 transition-colors hover:border-[#3b3f60] hover:bg-[#252941]">
                Coin
                <ChevronDown className="h-4 w-4 text-slate-400" />
              </button>

              <button className="flex items-center gap-2 whitespace-nowrap rounded-xl border border-[#2a2d45] bg-[#202337] px-4 py-3 text-sm font-medium text-slate-200 transition-colors hover:border-[#3b3f60] hover:bg-[#252941]">
                <SlidersHorizontal className="h-4 w-4 text-slate-400" />
                Filter
                <ChevronDown className="h-4 w-4 text-slate-400" />
              </button>
            </div>
          </div>

          <div className="hidden grid-cols-[70px_minmax(150px,1fr)_minmax(190px,1.2fr)_150px_130px_minmax(150px,1fr)_190px] border-b border-[#272a40] bg-[#151724] px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-slate-500 lg:grid">
            <span>ID</span>
            <span>Name</span>
            <span>Email</span>
            <span>Coin</span>
            <span>Amount</span>
            <span>Status</span>
            <span className="text-right">Action</span>
          </div>

          <div className="divide-y divide-[#272a40]">
            {loading ? (
              <div className="p-8 text-center text-slate-300">Loading withdrawals...</div>
            ) : error ? (
              <div className="p-8 text-center text-red-400">{error}</div>
            ) : visibleRows.length === 0 ? (
              <div className="p-8 text-center text-slate-300">No withdrawals found.</div>
            ) : (
              visibleRows.map((row) => {
                const coin = getCoin(row.coin);

                return (
                  <div
                    key={row.id}
                    className="grid grid-cols-1 gap-x-4 gap-y-4 px-5 py-5 transition-colors hover:bg-[#1e2133]/70 lg:grid-cols-[70px_minmax(150px,1fr)_minmax(190px,1.2fr)_150px_130px_minmax(150px,1fr)_190px] lg:items-center lg:py-4"
                  >
                    <div className="flex items-center justify-between gap-3 lg:block">
                      <span className="text-xs font-medium uppercase tracking-wide text-slate-500 lg:hidden">ID</span>
                      <span className="font-mono text-sm text-slate-300">#{row.id}</span>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-white/5 bg-[#25283d]">
                        <span className="text-sm font-bold text-white">{row.name?.charAt(0)?.toUpperCase() ?? "U"}</span>
                      </div>
                      <div className="min-w-0">
                        <span className="block truncate text-sm font-semibold text-white">{row.name}</span>
                        <span className="mt-0.5 block truncate text-xs text-slate-500 lg:hidden">{row.email}</span>
                      </div>
                    </div>

                    <span className="hidden truncate text-sm text-slate-400 lg:block">{row.email}</span>

                    <div className="flex items-center gap-2">
                      <CoinIcon coin={coin} />
                      <span className="text-sm font-semibold text-slate-100">{coin.name}</span>
                    </div>

                    <div className="flex items-center justify-between gap-3 lg:block">
                      <span className="text-xs font-medium uppercase tracking-wide text-slate-500 lg:hidden">Amount</span>
                      <span className="font-mono text-sm text-slate-100">{row.amount}</span>
                    </div>

                    <div className="flex items-center justify-between gap-3 lg:block">
                      <span className="text-xs font-medium uppercase tracking-wide text-slate-500 lg:hidden">Status</span>
                      <StatusBadge status={row.status} />
                    </div>

                    <div className="flex flex-col gap-3 lg:items-end">
                      <div className="flex w-full gap-2 sm:w-auto">
                        <button
                          onClick={() => openActionModal(row.id, "approve")}
                          className="inline-flex h-9 flex-1 items-center justify-center gap-1.5 rounded-lg bg-emerald-500 px-3 text-xs font-bold text-white shadow-lg shadow-emerald-950/20 transition hover:bg-emerald-400 active:scale-[0.98] sm:flex-none"
                        >
                          <Check className="h-3.5 w-3.5" />
                          Approve
                        </button>
                        <button
                          onClick={() => openActionModal(row.id, "reject")}
                          className="inline-flex h-9 flex-1 items-center justify-center gap-1.5 rounded-lg bg-rose-500 px-3 text-xs font-bold text-white shadow-lg shadow-rose-950/20 transition hover:bg-rose-400 active:scale-[0.98] sm:flex-none"
                        >
                          <XCircle className="h-3.5 w-3.5" />
                          Reject
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="mt-6 flex flex-col items-center justify-between gap-4 text-sm sm:flex-row">
          <span className="text-slate-500">Showing {visibleRows.length ? 1 : 0}-{visibleRows.length} of {entries.length}</span>
          <div className="flex items-center gap-2">
            <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#22253a] bg-[#181a27] text-slate-400 transition-colors hover:bg-[#1e2133]">
              <ChevronDown className="h-4 w-4 rotate-90" />
            </button>
            <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#22253a] bg-[#181a27] text-slate-400 transition-colors hover:bg-[#1e2133]">
              <ChevronDown className="h-4 w-4 -rotate-90" />
            </button>
          </div>
        </div>
      </div>

      {activeRow && activeAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-[#2a2d45] bg-[#181a27] shadow-2xl shadow-black/40">
            <div className="flex items-start justify-between gap-4 border-b border-[#272a40] px-6 py-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  {activeAction === "approve" ? "Approve Withdrawal" : "Reject Withdrawal"}
                </p>
                <h2 className="mt-1 text-xl font-semibold text-white">
                  {activeAction === "approve" ? "Confirm payment release" : "Confirm rejection"}
                </h2>
              </div>
              <button
                onClick={closeActionModal}
                className="rounded-full p-2 text-slate-400 transition hover:bg-[#22253a] hover:text-white"
                aria-label="Close dialog"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-5 px-6 py-5">
              <div className="grid grid-cols-1 gap-3 rounded-xl border border-[#25283d] bg-[#11131d] p-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs text-slate-500">User</p>
                  <p className="mt-1 truncate text-sm font-semibold text-white">{activeRow.name}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Amount</p>
                  <p className="mt-1 font-mono text-sm font-semibold text-white">{activeRow.amount}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Coin</p>
                  <p className="mt-1 text-sm font-semibold text-white">{getCoin(activeRow.coin).name}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Status</p>
                  <div className="mt-1">
                    <StatusBadge status={activeRow.status} />
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <p className="text-xs text-slate-500">Destination Address</p>
                  <p className="mt-1 break-all font-mono text-sm text-slate-300">{activeRow.address || "-"}</p>
                </div>
              </div>

              {activeAction === "approve" ? (
                <div className="space-y-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-300">Transaction ID</label>
                    <input
                      value={txid}
                      onChange={(event) => {
                        setTxid(event.target.value);
                        setFormError("");
                      }}
                      className="w-full rounded-xl border border-[#2a2d45] bg-[#0f1017] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-500/70"
                      placeholder="manual-chain-tx-123"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-300">Notes</label>
                    <textarea
                      value={notes}
                      onChange={(event) => {
                        setNotes(event.target.value);
                        setFormError("");
                      }}
                      className="h-24 w-full resize-none rounded-xl border border-[#2a2d45] bg-[#0f1017] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-500/70"
                      placeholder="Processed from treasury wallet."
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">Rejection Reason</label>
                  <textarea
                    value={reason}
                    onChange={(event) => {
                      setReason(event.target.value);
                      setFormError("");
                    }}
                    className="h-28 w-full resize-none rounded-xl border border-[#2a2d45] bg-[#0f1017] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-rose-500/70"
                    placeholder="Address verification failed."
                  />
                </div>
              )}

              {(formError || actionError || actionMessage) && (
                <div className={`rounded-xl border px-4 py-3 text-sm ${formError || actionError ? "border-rose-400/20 bg-rose-400/10 text-rose-200" : "border-emerald-400/20 bg-emerald-400/10 text-emerald-200"}`}>
                  {formError || actionError || actionMessage}
                </div>
              )}
            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-[#272a40] px-6 py-5 sm:flex-row sm:justify-end">
              <button
                onClick={closeActionModal}
                className="rounded-xl border border-[#2a2d45] px-5 py-3 text-sm font-semibold text-slate-200 transition hover:border-[#3b3f60] hover:bg-[#202337]"
              >
                Cancel
              </button>
              <button
                disabled={actionLoading}
                onClick={() => activeAction === "approve" ? handleApprove(activeRow.id) : handleReject(activeRow.id)}
                className={`inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-bold text-white transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 ${
                  activeAction === "approve" ? "bg-emerald-500 hover:bg-emerald-400" : "bg-rose-500 hover:bg-rose-400"
                }`}
              >
                {activeAction === "approve" ? <Check className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                {actionLoading ? "Processing..." : activeAction === "approve" ? "Confirm Approve" : "Confirm Reject"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
