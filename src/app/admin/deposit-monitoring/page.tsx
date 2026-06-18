"use client";

import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { CheckCircle2, ChevronDown, ChevronLeft, ChevronRight, Clock3, Filter, Search } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchAdminDepositMonitoring } from "@/redux/thunk/adminDepositMonitoringThunk";

const coinOptions = ["BTC", "ETH", "USDT", "BNB", "SOL", "USDC"];
const statusOptions = ["completed", "pending", "failed"];

const coinMeta: Record<string, { name: string; color: string; bg: string; letter: string }> = {
  ETH: { name: "Ethereum", color: "#627EEA", bg: "#627EEA22", letter: "E" },
  BTC: { name: "Bitcoin", color: "#F7931A", bg: "#F7931A22", letter: "B" },
  USDT: { name: "Tether", color: "#26A17B", bg: "#26A17B22", letter: "T" },
  BNB: { name: "Binance Coin", color: "#F3BA2F", bg: "#F3BA2F22", letter: "B" },
  SOL: { name: "Solana", color: "#14F195", bg: "#14F19522", letter: "S" },
  USDC: { name: "USD Coin", color: "#2775CA", bg: "#2775CA22", letter: "U" },
};

const titleCase = (value: string) =>
  value ? value.charAt(0).toUpperCase() + value.slice(1).toLowerCase() : "-";

const formatDate = (value: string | null) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

function CoinIcon({ coin }: { coin: string }) {
  const meta = coinMeta[coin.toUpperCase()] ?? {
    name: coin,
    color: "#9ca3af",
    bg: "#37415122",
    letter: coin.charAt(0).toUpperCase() || "C",
  };

  return (
    <span
      className="inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold"
      style={{ background: meta.bg, color: meta.color, border: `1.5px solid ${meta.color}44` }}
    >
      {meta.letter}
    </span>
  );
}

function StatusBadge({ status }: { status: string }) {
  const normalized = status.toLowerCase();
  const tone =
    normalized === "completed"
      ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
      : normalized === "pending"
        ? "border-amber-400/20 bg-amber-400/10 text-amber-300"
        : "border-rose-400/20 bg-rose-400/10 text-rose-300";

  return (
    <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${tone}`}>
      {titleCase(status)}
    </span>
  );
}

function SummaryCard({ label, value, tone }: { label: string; value: number; tone: string }) {
  return (
    <div className="rounded-2xl border border-[#272a40] bg-[#181a27] px-5 py-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      <p className={`mt-2 text-2xl font-semibold ${tone}`}>{value}</p>
    </div>
  );
}

export default function AdminDepositMonitoringPage() {
  const dispatch = useAppDispatch();
  const { rows, summary, loading, error, currentPage, perPage, total } = useAppSelector(
    (state) => state.adminDepositMonitoring
  );

  const [search, setSearch] = useState("");
  const [coin, setCoin] = useState("");
  const [status, setStatus] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [page, setPage] = useState(1);

  const queryParams = useMemo(
    () => ({
      search: search.trim(),
      coin,
      status,
      date_from: dateFrom,
      date_to: dateTo,
      per_page: 20,
      page,
    }),
    [coin, dateFrom, dateTo, page, search, status]
  );

  useEffect(() => {
    const timer = window.setTimeout(() => {
      dispatch(fetchAdminDepositMonitoring(queryParams));
    }, 250);

    return () => window.clearTimeout(timer);
  }, [dispatch, queryParams]);

  const updateFilter = (setter: (value: string) => void, value: string) => {
    setter(value);
    setPage(1);
  };

  const resetFilters = () => {
    setSearch("");
    setCoin("");
    setStatus("");
    setDateFrom("");
    setDateTo("");
    setPage(1);
  };

  const from = rows.length ? (currentPage - 1) * perPage + 1 : 0;
  const to = rows.length ? from + rows.length - 1 : 0;
  const canGoBack = currentPage > 1;
  const canGoForward = to < total;

  return (
    <div className="min-h-screen bg-[#10111a] px-4 py-6 font-sans text-white sm:px-6 sm:py-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Deposit Monitoring</h1>
            <p className="mt-1 text-sm text-slate-400">Backend-backed overview of wallet deposits.</p>
          </div>
          <div className="flex items-center gap-2 rounded-xl bg-emerald-500/10 px-3 py-1.5 text-sm text-emerald-300">
            {loading ? <Clock3 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
            <span>{loading ? "Refreshing..." : " "}</span>
          </div>
        </div>

        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <SummaryCard label="Total Deposits" value={summary.total_count} tone="text-white" />
          <SummaryCard label="Completed" value={summary.completed_count} tone="text-emerald-300" />
          <SummaryCard label="Pending" value={summary.pending_count} tone="text-amber-300" />
        </div>

        <div className="mb-6 rounded-2xl border border-[#272a40] bg-[#181a27] p-4">
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-[minmax(220px,1fr)_150px_160px_150px_150px_auto]">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="Search user, email, reference, or tx hash..."
                value={search}
                onChange={(event) => updateFilter(setSearch, event.target.value)}
                className="h-11 w-full rounded-xl border border-[#2a2d45] bg-[#0f1017] pl-11 pr-4 text-sm text-white outline-none placeholder:text-slate-600 focus:border-violet-500/60"
              />
            </div>

            <SelectFilter value={coin} onChange={(value) => updateFilter(setCoin, value)}>
              <option value="">All Coins</option>
              {coinOptions.map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </SelectFilter>

            <SelectFilter value={status} onChange={(value) => updateFilter(setStatus, value)}>
              <option value="">All Status</option>
              {statusOptions.map((item) => (
                <option key={item} value={item}>{titleCase(item)}</option>
              ))}
            </SelectFilter>

            <input
              type="date"
              value={dateFrom}
              onChange={(event) => updateFilter(setDateFrom, event.target.value)}
              className="h-11 rounded-xl border border-[#2a2d45] bg-[#202337] px-3 text-sm text-slate-200 outline-none focus:border-violet-500/60"
            />

            <input
              type="date"
              value={dateTo}
              onChange={(event) => updateFilter(setDateTo, event.target.value)}
              className="h-11 rounded-xl border border-[#2a2d45] bg-[#202337] px-3 text-sm text-slate-200 outline-none focus:border-violet-500/60"
            />

            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-[#2a2d45] bg-[#202337] px-4 text-sm font-semibold text-slate-200 transition hover:border-[#3b3f60] hover:bg-[#252941]"
            >
              <Filter className="h-4 w-4" />
              Reset
            </button>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-[#272a40] bg-[#181a27] shadow-2xl shadow-black/20">
          <div className="hidden grid-cols-[90px_minmax(180px,1.2fr)_minmax(190px,1.3fr)_150px_130px_minmax(180px,1.4fr)_110px_130px_150px] gap-4 border-b border-[#272a40] bg-[#151724] px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-slate-500 xl:grid">
            <span>Ref</span>
            <span>Name</span>
            <span>Email</span>
            <span>Coin</span>
            <span>Amount</span>
            <span>TX Hash</span>
            <span className="text-center">Conf.</span>
            <span className="text-center">Status</span>
            <span className="text-right">Created</span>
          </div>

          <div className="divide-y divide-[#272a40]">
            {loading ? (
              <div className="p-8 text-center text-slate-300">Loading deposit monitoring data...</div>
            ) : error ? (
              <div className="p-8 text-center text-rose-300">{error}</div>
            ) : rows.length === 0 ? (
              <div className="p-12 text-center text-slate-400">No deposits found for the selected filters.</div>
            ) : (
              rows.map((row) => (
                <div
                  key={row.id}
                  className="grid grid-cols-1 gap-4 px-5 py-5 transition hover:bg-[#1e2133]/70 xl:grid-cols-[90px_minmax(180px,1.2fr)_minmax(190px,1.3fr)_150px_130px_minmax(180px,1.4fr)_110px_130px_150px] xl:items-center xl:py-4"
                >
                  <div>
                    <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-500 xl:hidden">Reference</span>
                    <span className="font-mono text-sm text-slate-300">{row.reference || `#${row.id}`}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-white/5 bg-[#25283d]">
                      <span className="text-sm font-bold text-white">{row.user?.name?.charAt(0)?.toUpperCase() || "U"}</span>
                    </div>
                    <div className="min-w-0">
                      <span className="block truncate text-sm font-semibold text-white">{row.user?.name || "-"}</span>
                      <span className="mt-0.5 block truncate text-xs text-slate-500 xl:hidden">{row.user?.email || "-"}</span>
                    </div>
                  </div>

                  <span className="hidden truncate text-sm text-slate-400 xl:block">{row.user?.email || "-"}</span>

                  <div className="flex items-center gap-2">
                    <CoinIcon coin={row.coin} />
                    <div>
                      <p className="text-sm font-semibold text-white">{row.coin_label || coinMeta[row.coin]?.name || row.coin}</p>
                      <p className="text-xs text-slate-500">{row.network || row.coin}</p>
                    </div>
                  </div>

                  <div>
                    <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-500 xl:hidden">Amount</span>
                    <span className="font-mono text-sm font-semibold text-white">{row.amount}</span>
                    {row.fee ? <span className="mt-1 block text-xs text-slate-500">Fee {row.fee}</span> : null}
                  </div>

                  <div className="min-w-0 rounded-xl border border-[#25283d] bg-[#11131d] px-3 py-2 xl:border-0 xl:bg-transparent xl:px-0 xl:py-0">
                    <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-500 xl:hidden">TX Hash</span>
                    <span className="block truncate font-mono text-sm text-slate-400">{row.tx_hash || "-"}</span>
                  </div>

                  <div className="xl:text-center">
                    <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-500 xl:hidden">Confirmations</span>
                    <span className="font-mono text-sm text-slate-300">{row.confirmations ?? 0}</span>
                  </div>

                  <div className="xl:text-center">
                    <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-500 xl:hidden">Status</span>
                    <StatusBadge status={row.status} />
                  </div>

                  <div className="xl:text-right">
                    <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-500 xl:hidden">Created</span>
                    <span className="text-xs text-slate-400">{formatDate(row.created_at)}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="mt-6 flex flex-col items-center justify-between gap-4 text-sm text-slate-400 sm:flex-row">
          <p>Showing {from}-{to} of {total} deposits</p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={!canGoBack || loading}
              onClick={() => setPage((value) => Math.max(1, value - 1))}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#272a40] transition hover:bg-[#1e2133] disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Previous page"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="px-2 text-xs text-slate-500">Page {currentPage}</span>
            <button
              type="button"
              disabled={!canGoForward || loading}
              onClick={() => setPage((value) => value + 1)}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#272a40] transition hover:bg-[#1e2133] disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Next page"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function SelectFilter({
  value,
  onChange,
  children,
}: {
  value: string;
  onChange: (value: string) => void;
  children: ReactNode;
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 w-full appearance-none rounded-xl border border-[#2a2d45] bg-[#202337] px-3 pr-9 text-sm text-slate-200 outline-none focus:border-violet-500/60"
      >
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
    </div>
  );
}
