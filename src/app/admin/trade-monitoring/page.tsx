"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowDown, ArrowUp, ChevronLeft, ChevronRight, Filter, Search, TrendingUp } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchAdminTradeMonitoring } from "@/redux/thunk/adminTradeMonitoringThunk";

const coinOptions = ["BTC", "ETH", "USDT", "BNB", "SOL"];
const statusOptions = ["completed", "pending", "disputed", "cancelled", "failed"];

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

const titleCase = (value: string) =>
  value ? value.charAt(0).toUpperCase() + value.slice(1).toLowerCase() : "-";

function SummaryCard({ label, value, tone }: { label: string; value: number; tone: string }) {
  return (
    <div className="rounded-2xl border border-[#272a40] bg-[#181a27] px-5 py-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      <p className={`mt-2 text-2xl font-semibold ${tone}`}>{value}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const normalized = status.toLowerCase();
  const tone =
    normalized === "completed"
      ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
      : normalized === "disputed"
        ? "border-violet-400/20 bg-violet-400/10 text-violet-300"
        : normalized === "pending"
          ? "border-amber-400/20 bg-amber-400/10 text-amber-300"
          : "border-rose-400/20 bg-rose-400/10 text-rose-300";

  return (
    <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${tone}`}>
      {titleCase(status)}
    </span>
  );
}

function TypeBadge({ type }: { type: string }) {
  const isBuy = type.toLowerCase() === "buy";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
        isBuy ? "bg-emerald-500/10 text-emerald-300" : "bg-rose-500/10 text-rose-300"
      }`}
    >
      {isBuy ? <ArrowUp className="h-3.5 w-3.5" /> : <ArrowDown className="h-3.5 w-3.5" />}
      {titleCase(type)}
    </span>
  );
}

export default function AdminTradeMonitoringPage() {
  const dispatch = useAppDispatch();
  const { rows, summary, loading, error, currentPage, perPage, total } = useAppSelector(
    (state) => state.adminTradeMonitoring
  );

  const [search, setSearch] = useState("");
  const [coin, setCoin] = useState("");
  const [status, setStatus] = useState("");
  const [type, setType] = useState<"buy" | "sell" | "">("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [page, setPage] = useState(1);

  const queryParams = useMemo(
    () => ({
      search: search.trim(),
      coin,
      status,
      type,
      date_from: dateFrom,
      date_to: dateTo,
      per_page: 20,
      page,
    }),
    [coin, dateFrom, dateTo, page, search, status, type]
  );

  useEffect(() => {
    const timer = window.setTimeout(() => {
      dispatch(fetchAdminTradeMonitoring(queryParams));
    }, 250);

    return () => window.clearTimeout(timer);
  }, [dispatch, queryParams]);

  const resetFilters = () => {
    setSearch("");
    setCoin("");
    setStatus("");
    setType("");
    setDateFrom("");
    setDateTo("");
    setPage(1);
  };

  const updateFilter = (setter: (value: string) => void, value: string) => {
    setter(value);
    setPage(1);
  };

  const from = rows.length ? (currentPage - 1) * perPage + 1 : 0;
  const to = rows.length ? from + rows.length - 1 : 0;
  const canGoBack = currentPage > 1;
  const canGoForward = to < total;

  return (
    <div className="min-h-screen bg-[#10111a] p-4 font-sans text-white sm:p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Trade Monitoring</h1>
            <p className="mt-1 text-sm text-slate-400">Backend-backed overview of user P2P trades.</p>
          </div>

          {/* <div className="flex items-center gap-2 rounded-xl bg-emerald-500/10 px-3 py-1.5 text-sm text-emerald-300">
            <TrendingUp className="h-4 w-4" />
            <span>{loading ? "Refreshing..." : "API Connected"}</span>
          </div> */}
        </div>

        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <SummaryCard label="Total Trades" value={summary.total_count} tone="text-white" />
          <SummaryCard label="Completed" value={summary.completed_count} tone="text-emerald-300" />
          <SummaryCard label="Pending" value={summary.pending_count} tone="text-amber-300" />
          <SummaryCard label="Disputed" value={summary.disputed_count} tone="text-violet-300" />
        </div>

        <div className="mb-6 rounded-2xl border border-[#272a40] bg-[#181a27] p-4">
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-[minmax(220px,1fr)_150px_160px_140px_150px_150px_auto]">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="Search user, email, pair, or trade ID..."
                value={search}
                onChange={(event) => updateFilter(setSearch, event.target.value)}
                className="h-11 w-full rounded-xl border border-[#2a2d45] bg-[#0f1017] pl-11 pr-4 text-sm text-white outline-none placeholder:text-slate-600 focus:border-violet-500/60"
              />
            </div>

            <select
              value={coin}
              onChange={(event) => updateFilter(setCoin, event.target.value)}
              className="h-11 rounded-xl border border-[#2a2d45] bg-[#202337] px-3 text-sm text-slate-200 outline-none focus:border-violet-500/60"
            >
              <option value="">All Coins</option>
              {coinOptions.map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>

            <select
              value={status}
              onChange={(event) => updateFilter(setStatus, event.target.value)}
              className="h-11 rounded-xl border border-[#2a2d45] bg-[#202337] px-3 text-sm text-slate-200 outline-none focus:border-violet-500/60"
            >
              <option value="">All Status</option>
              {statusOptions.map((item) => (
                <option key={item} value={item}>{titleCase(item)}</option>
              ))}
            </select>

            <select
              value={type}
              onChange={(event) => updateFilter((value) => setType(value as "buy" | "sell" | ""), event.target.value)}
              className="h-11 rounded-xl border border-[#2a2d45] bg-[#202337] px-3 text-sm text-slate-200 outline-none focus:border-violet-500/60"
            >
              <option value="">All Types</option>
              <option value="buy">Buy</option>
              <option value="sell">Sell</option>
            </select>

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
              onClick={resetFilters}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-[#2a2d45] bg-[#202337] px-4 text-sm font-semibold text-slate-200 transition hover:border-[#3b3f60] hover:bg-[#252941]"
            >
              <Filter className="h-4 w-4" />
              Reset
            </button>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-[#272a40] bg-[#181a27] shadow-2xl shadow-black/20">
          <div className="hidden grid-cols-[minmax(130px,1fr)_minmax(230px,1.5fr)_110px_95px_120px_120px_120px_120px_150px] gap-4 border-b border-[#272a40] bg-[#151724] px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-slate-500 xl:grid">
            <div>Trade ID</div>
            <div>Buyer / Seller</div>
            <div>Pair</div>
            <div>Type</div>
            <div className="text-right">Amount</div>
            <div className="text-right">Price</div>
            <div className="text-right">Total</div>
            <div className="text-center">Status</div>
            <div className="text-right">Created</div>
          </div>

          <div className="divide-y divide-[#272a40]">
            {loading ? (
              <div className="p-8 text-center text-slate-300">Loading trade monitoring data...</div>
            ) : error ? (
              <div className="p-8 text-center text-rose-300">{error}</div>
            ) : rows.length === 0 ? (
              <div className="p-12 text-center text-slate-400">No trades found for the selected filters.</div>
            ) : (
              rows.map((trade) => (
                <div
                  key={trade.id}
                  className="grid grid-cols-1 gap-4 px-5 py-5 transition hover:bg-[#1e2133]/70 xl:grid-cols-[minmax(130px,1fr)_minmax(230px,1.5fr)_110px_95px_120px_120px_120px_120px_150px] xl:items-center xl:py-4"
                >
                  <div>
                    <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-500 xl:hidden">Trade ID</span>
                    <span className="font-mono text-sm text-slate-300">{trade.trade_id}</span>
                  </div>

                  <div className="min-w-0">
                    <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-500 xl:hidden">Buyer / Seller</span>
                    <div className="space-y-1">
                      <p className="truncate text-sm font-semibold text-white">
                        Buyer: {trade.user?.buyer_name || "-"}
                      </p>
                      <p className="truncate text-xs text-slate-500">{trade.user?.buyer_email || "-"}</p>
                      <p className="truncate text-sm font-semibold text-slate-200">
                        Seller: {trade.user?.seller_name || "-"}
                      </p>
                      <p className="truncate text-xs text-slate-500">{trade.user?.seller_email || "-"}</p>
                    </div>
                  </div>

                  <div>
                    <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-500 xl:hidden">Pair</span>
                    <span className="text-sm font-semibold text-white">{trade.pair}</span>
                    <span className="mt-1 block text-xs text-slate-500">{trade.network}</span>
                  </div>

                  <div>
                    <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-500 xl:hidden">Type</span>
                    <TypeBadge type={trade.type} />
                  </div>

                  <div className="xl:text-right">
                    <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-500 xl:hidden">Amount</span>
                    <span className="font-mono text-sm text-slate-100">{trade.amount}</span>
                  </div>

                  <div className="xl:text-right">
                    <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-500 xl:hidden">Price</span>
                    <span className="font-mono text-sm text-slate-300">{trade.price}</span>
                  </div>

                  <div className="xl:text-right">
                    <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-500 xl:hidden">Total</span>
                    <span className="font-mono text-sm font-semibold text-white">{trade.total}</span>
                  </div>

                  <div className="xl:text-center">
                    <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-500 xl:hidden">Status</span>
                    <StatusBadge status={trade.status} />
                  </div>

                  <div className="xl:text-right">
                    <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-500 xl:hidden">Created</span>
                    <span className="text-xs text-slate-400">{formatDate(trade.created_at)}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="mt-6 flex flex-col items-center justify-between gap-4 text-sm text-slate-400 sm:flex-row">
          <p>Showing {from}-{to} of {total} trades</p>
          <div className="flex items-center gap-2">
            <button
              disabled={!canGoBack || loading}
              onClick={() => setPage((value) => Math.max(1, value - 1))}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#272a40] transition hover:bg-[#1e2133] disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Previous page"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="px-2 text-xs text-slate-500">Page {currentPage}</span>
            <button
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
