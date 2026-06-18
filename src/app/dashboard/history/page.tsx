"use client";

import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { PageShell } from "@/components/dashboard/PageShell";
import { Card, CardContent } from "@/components/common/Card";
import { ChevronDown, Filter, Search, X } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchTransactions, TransactionItem } from "@/redux/thunk/transactionsThunk";

const defaultCoinOptions = ["BTC", "ETH", "USDT", "BNB", "SOL", "USDC"];

const formatDate = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return { date: "-", time: "-" };

  return {
    date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    time: date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
  };
};

export default function HistoryPage() {
  const dispatch = useAppDispatch();
  const { loading, error, transactions, pagination } = useAppSelector(
    (state) => state.transactions
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [dateFilter, setDateFilter] = useState("all");
  const [coinFilter, setCoinFilter] = useState("all");
  const [selectedTx, setSelectedTx] = useState<TransactionItem | null>(null);

  useEffect(() => {
    dispatch(
      fetchTransactions({
        page: currentPage,
        per_page: 20,
        coin: coinFilter === "all" ? undefined : coinFilter,
      })
    );
  }, [coinFilter, currentPage, dispatch]);

  const coinOptions = useMemo(() => {
    return Array.from(new Set([...defaultCoinOptions, ...transactions.map((tx) => tx.coin)])).filter(Boolean);
  }, [transactions]);

  const filteredTransactions = useMemo(() => {
    const normalized = searchTerm.trim().toLowerCase();
    const now = new Date();

    return transactions.filter((tx) => {
      const txDate = new Date(tx.created_at);
      const hasValidDate = !Number.isNaN(txDate.getTime());
      const display = formatDate(tx.created_at);

      const searchableValues = [
        tx.id,
        tx.type,
        tx.coin,
        tx.network,
        tx.status,
        tx.amount,
        tx.fee,
        tx.from_address,
        tx.to_address,
        tx.txid,
        tx.nowpayments_id,
        display.date,
        display.time,
        hasValidDate ? txDate.toLocaleString("en-US") : "",
      ];

      const matchesSearch =
        !normalized ||
        searchableValues.some((value) => String(value ?? "").toLowerCase().includes(normalized));

      const matchesCoin =
        coinFilter === "all" ||
        String(tx.coin ?? "").toLowerCase() === coinFilter.toLowerCase();

      let matchesDate = true;

      if (dateFilter === "today") {
        matchesDate = hasValidDate && txDate.toDateString() === now.toDateString();
      }

      if (dateFilter === "7days") {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(now.getDate() - 7);
        matchesDate = hasValidDate && txDate >= sevenDaysAgo && txDate <= now;
      }

      if (dateFilter === "30days") {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(now.getDate() - 30);
        matchesDate = hasValidDate && txDate >= thirtyDaysAgo && txDate <= now;
      }

      return matchesSearch && matchesCoin && matchesDate;
    });
  }, [transactions, searchTerm, coinFilter, dateFilter]);

  const startItem = filteredTransactions.length === 0 ? 0 : 1;
  const endItem = filteredTransactions.length;

  const resetFilters = () => {
    setSearchTerm("");
    setDateFilter("all");
    setCoinFilter("all");
    setCurrentPage(1);
  };

  const handleCoinChange = (value: string) => {
    setCoinFilter(value);
    setCurrentPage(1);
  };

  return (
    <PageShell title="Transaction History" description="View all your past transactions.">
      <Card className="overflow-hidden rounded-3xl border border-white/5 bg-[#111218]">
        <CardContent className="p-4 sm:p-6">
          <div className="mb-6 flex flex-col gap-4 lg:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-[#6b7280]" />
              <input
                type="text"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search transactions..."
                className="w-full rounded-2xl border border-white/10 bg-[#1a1b23] py-3 pl-11 pr-4 text-sm text-white placeholder-[#6b7280] focus:border-white/20 focus:outline-none"
              />
            </div>

            <div className="flex flex-wrap gap-3">
              <SelectWrap>
                <select
                  value={dateFilter}
                  onChange={(event) => setDateFilter(event.target.value)}
                  className="appearance-none rounded-2xl border border-white/10 bg-[#1a1b23] px-5 py-3 pr-10 text-sm text-white hover:border-white/20 focus:outline-none"
                >
                  <option value="all">All Dates</option>
                  <option value="today">Today</option>
                  <option value="7days">Last 7 Days</option>
                  <option value="30days">Last 30 Days</option>
                </select>
              </SelectWrap>

              <SelectWrap>
                <select
                  value={coinFilter}
                  onChange={(event) => handleCoinChange(event.target.value)}
                  className="appearance-none rounded-2xl border border-white/10 bg-[#1a1b23] px-5 py-3 pr-10 text-sm text-white hover:border-white/20 focus:outline-none"
                >
                  <option value="all">All Coins</option>
                  {coinOptions.map((coin) => (
                    <option key={coin} value={coin}>
                      {coin}
                    </option>
                  ))}
                </select>
              </SelectWrap>

              <button
                type="button"
                onClick={resetFilters}
                className="flex items-center gap-2 whitespace-nowrap rounded-2xl border border-white/10 bg-[#1a1b23] px-5 py-3 text-sm text-white hover:border-white/20"
              >
                <Filter size={16} />
                Reset
              </button>
            </div>
          </div>

          {loading && (
            <div className="mb-4 space-y-3 animate-pulse">
              {[0, 1, 2, 3].map((row) => (
                <div key={row} className="grid grid-cols-2 gap-3 md:grid-cols-7">
                  {[0, 1, 2, 3, 4, 5, 6].map((cell) => (
                    <div key={cell} className="h-10 rounded-xl bg-white/5" />
                  ))}
                </div>
              ))}
            </div>
          )}

          {error && (
            <div className="mb-4 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-200">
              {error}
            </div>
          )}

          <div className="hidden overflow-x-auto md:block">
            <table className="w-full min-w-[850px]">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="pb-4 text-left text-xs font-medium text-[#6b7280]">Date & Time</th>
                  <th className="pb-4 text-left text-xs font-medium text-[#6b7280]">Type</th>
                  <th className="pb-4 text-left text-xs font-medium text-[#6b7280]">Coin</th>
                  <th className="pb-4 text-left text-xs font-medium text-[#6b7280]">Amount</th>
                  <th className="pb-4 text-left text-xs font-medium text-[#6b7280]">Fee</th>
                  <th className="pb-4 text-left text-xs font-medium text-[#6b7280]">Status</th>
                  <th className="pb-4 pr-4 text-right text-xs font-medium text-[#6b7280]">View Details</th>
                </tr>
              </thead>

              <tbody>
                {filteredTransactions.map((tx, index) => {
                  const display = formatDate(tx.created_at);

                  return (
                    <tr
                      key={tx.id}
                      className={`border-b border-white/5 transition-colors hover:bg-white/5 ${
                        index === filteredTransactions.length - 1 ? "border-none" : ""
                      }`}
                    >
                      <td className="py-5 text-sm text-white">
                        {display.date}
                        <br />
                        <span className="text-xs text-[#6b7280]">{display.time}</span>
                      </td>
                      <td className="py-5">
                        <span className="text-sm font-medium capitalize text-[#1ecb4f]">
                          {tx.type.replace("_", " ")}
                        </span>
                      </td>
                      <td className="py-5">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#627EEA] text-lg font-bold text-white">
                            {tx.coin.charAt(0)}
                          </div>
                          <span className="text-sm font-medium text-white">{tx.coin}</span>
                        </div>
                      </td>
                      <td className="py-5 text-sm font-medium text-white">{tx.amount}</td>
                      <td className="py-5 text-sm text-[#6b7280]">{tx.fee}</td>
                      <td className="py-5">
                        <span className="inline-block rounded-full bg-[#1ecb4f]/10 px-4 py-1 text-xs font-medium capitalize text-[#1ecb4f]">
                          {tx.status}
                        </span>
                      </td>
                      <td className="py-5 text-right">
                        <button
                          type="button"
                          onClick={() => setSelectedTx(tx)}
                          className="text-sm font-medium text-[#8b5cf6] hover:underline"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="space-y-4 md:hidden">
            {filteredTransactions.map((tx) => {
              const display = formatDate(tx.created_at);

              return (
                <div
                  key={tx.id}
                  className="rounded-2xl border border-white/10 bg-[#1a1b23] p-5 transition-all hover:bg-white/5"
                >
                  <div className="mb-4 flex items-start justify-between">
                    <div>
                      <p className="text-sm text-white">{display.date}</p>
                      <p className="text-xs text-[#6b7280]">{display.time}</p>
                    </div>
                    <span className="inline-block rounded-full bg-[#1ecb4f]/10 px-4 py-1 text-xs font-medium capitalize text-[#1ecb4f]">
                      {tx.status}
                    </span>
                  </div>

                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#627EEA] text-xl font-bold text-white">
                      {tx.coin.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-white">{tx.coin}</p>
                      <p className="text-sm capitalize text-[#1ecb4f]">{tx.type.replace("_", " ")}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-xs text-[#6b7280]">Amount</p>
                      <p className="font-medium text-white">{tx.amount}</p>
                    </div>
                    <div>
                      <p className="text-xs text-[#6b7280]">Fee</p>
                      <p className="text-[#6b7280]">{tx.fee}</p>
                    </div>
                  </div>

                  <div className="mt-5 flex justify-end border-t border-white/10 pt-4">
                    <button
                      type="button"
                      onClick={() => setSelectedTx(tx)}
                      className="text-sm font-medium text-[#8b5cf6] hover:underline"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {!loading && filteredTransactions.length === 0 && (
            <div className="py-10 text-center text-sm text-[#6b7280]">
              No transactions found.
            </div>
          )}

          <div className="mt-8 flex flex-col items-center justify-between gap-4 text-sm text-[#6b7280] sm:flex-row">
            <div>
              Showing {startItem}-{endItem} of {filteredTransactions.length}
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage <= 1}
                className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 transition-colors hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-40"
              >
                &lt;
              </button>

              <button
                type="button"
                onClick={() =>
                  setCurrentPage((prev) =>
                    Math.min(prev + 1, pagination.lastPage || prev + 1)
                  )
                }
                disabled={currentPage >= (pagination.lastPage || 1)}
                className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 transition-colors hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-40"
              >
                &gt;
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      {selectedTx && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-4"
          onClick={() => setSelectedTx(null)}
        >
          <div
            className="w-full max-w-lg rounded-3xl border border-white/10 bg-[#111218] p-6 text-white shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Transaction Details</h2>
              <button
                type="button"
                onClick={() => setSelectedTx(null)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 hover:bg-white/10"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3 text-sm">
              <DetailRow label="ID" value={selectedTx.id} />
              <DetailRow label="Date" value={new Date(selectedTx.created_at).toLocaleString()} />
              <DetailRow label="Type" value={selectedTx.type?.replace("_", " ")} />
              <DetailRow label="Coin" value={selectedTx.coin} />
              <DetailRow label="Network" value={selectedTx.network || "-"} />
              <DetailRow label="Amount" value={selectedTx.amount} />
              <DetailRow label="Fee" value={selectedTx.fee} />
              <DetailRow label="Status" value={selectedTx.status} />
              <DetailRow label="From Address" value={selectedTx.from_address || "-"} />
              <DetailRow label="To Address" value={selectedTx.to_address || "-"} />
              <DetailRow label="TXID" value={selectedTx.txid || "-"} />
              <DetailRow label="Confirmations" value={selectedTx.confirmations ?? "-"} />
            </div>
          </div>
        </div>
      )}
    </PageShell>
  );
}

function SelectWrap({ children }: { children: ReactNode }) {
  return (
    <div className="relative">
      {children}
      <ChevronDown size={16} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-white" />
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex justify-between gap-4 border-b border-white/10 pb-3">
      <span className="text-[#6b7280]">{label}</span>
      <span className="break-all text-right capitalize">{value}</span>
    </div>
  );
}
