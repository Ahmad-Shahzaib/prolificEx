'use client';

import { useEffect, useMemo, useState } from "react";
import { PageShell } from "@/components/dashboard/PageShell";
import { Card, CardContent } from "@/components/common/Card";
import { Search, ChevronDown, Filter, X } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchTransactions } from "@/redux/thunk/transactionsThunk";

export default function HistoryPage() {
  const dispatch = useAppDispatch();
  const { loading, error, transactions, pagination } = useAppSelector(
    (state) => state.transactions
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [dateFilter, setDateFilter] = useState("all");
  const [coinFilter, setCoinFilter] = useState("all");
  const [selectedTx, setSelectedTx] = useState<any>(null);

  useEffect(() => {
    dispatch(fetchTransactions({ page: currentPage, per_page: 20 }));
  }, [dispatch, currentPage]);

  const coinOptions = useMemo(() => {
    return Array.from(new Set(transactions.map((tx) => tx.coin))).filter(Boolean);
  }, [transactions]);

  const filteredTransactions = useMemo(() => {
  const normalized = searchTerm.trim().toLowerCase();
  const now = new Date();

  return transactions.filter((tx) => {
    const txDate = new Date(tx.created_at);

    const displayDate = txDate
      .toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })
      .toLowerCase();

    const displayTime = txDate
      .toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      })
      .toLowerCase();

    const fullDate = txDate.toLocaleString("en-US").toLowerCase();

    const matchesSearch =
      !normalized ||
      tx.id?.toString().toLowerCase().includes(normalized) ||
      tx.type?.toLowerCase().includes(normalized) ||
      tx.coin?.toLowerCase().includes(normalized) ||
      tx.status?.toLowerCase().includes(normalized) ||
      tx.amount?.toString().toLowerCase().includes(normalized) ||
      tx.fee?.toString().toLowerCase().includes(normalized) ||
      tx.to_address?.toLowerCase().includes(normalized) ||
      tx.txid?.toLowerCase().includes(normalized) ||
      displayDate.includes(normalized) ||
      displayTime.includes(normalized) ||
      fullDate.includes(normalized);

    const matchesCoin =
      coinFilter === "all" ||
      tx.coin?.toLowerCase() === coinFilter.toLowerCase();

    let matchesDate = true;

    if (dateFilter === "today") {
      matchesDate = txDate.toDateString() === now.toDateString();
    }

    if (dateFilter === "7days") {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(now.getDate() - 7);
      matchesDate = txDate >= sevenDaysAgo && txDate <= now;
    }

    if (dateFilter === "30days") {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(now.getDate() - 30);
      matchesDate = txDate >= thirtyDaysAgo && txDate <= now;
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
  };

  return (
    <PageShell title="Transaction History" description="View all your past transactions.">
      <Card className="bg-[#111218] border border-white/5 rounded-3xl overflow-hidden">
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6b7280]">
                <Search size={18} />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search transactions..."
                className="w-full bg-[#1a1b23] border border-white/10 rounded-2xl pl-11 py-3 text-sm text-white placeholder-[#6b7280] focus:outline-none focus:border-white/20"
              />
            </div>

            <div className="flex flex-wrap gap-3">
              <div className="relative">
                <select
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="appearance-none bg-[#1a1b23] border border-white/10 hover:border-white/20 px-5 py-3 pr-10 rounded-2xl text-sm text-white focus:outline-none"
                >
                  <option value="all">All Dates</option>
                  <option value="today">Today</option>
                  <option value="7days">Last 7 Days</option>
                  <option value="30days">Last 30 Days</option>
                </select>
                <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-white pointer-events-none" />
              </div>

              <div className="relative">
                <select
                  value={coinFilter}
                  onChange={(e) => setCoinFilter(e.target.value)}
                  className="appearance-none bg-[#1a1b23] border border-white/10 hover:border-white/20 px-5 py-3 pr-10 rounded-2xl text-sm text-white focus:outline-none"
                >
                  <option value="all">All Coins</option>
                  {coinOptions.map((coin) => (
                    <option key={coin} value={coin}>
                      {coin}
                    </option>
                  ))}
                </select>
                <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-white pointer-events-none" />
              </div>

              <button
                onClick={resetFilters}
                className="flex items-center gap-2 bg-[#1a1b23] border border-white/10 hover:border-white/20 px-5 py-3 rounded-2xl text-sm text-white whitespace-nowrap"
              >
                <Filter size={16} />
                Reset
              </button>
            </div>
          </div>

          {loading && (
            <div className="space-y-3 mb-4 animate-pulse">
              {[0, 1, 2, 3].map((row) => (
                <div key={row} className="grid grid-cols-2 md:grid-cols-7 gap-3">
                  {[0, 1, 2, 3, 4, 5, 6].map((cell) => (
                    <div key={cell} className="h-10 rounded-xl bg-white/5" />
                  ))}
                </div>
              ))}
            </div>
          )}

          {error && (
            <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-200 mb-4">
              {error}
            </div>
          )}

          <div className="hidden md:block overflow-x-auto">
            <table className="w-full min-w-[850px]">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left text-[#6b7280] text-xs font-medium pb-4">Date & Time</th>
                  <th className="text-left text-[#6b7280] text-xs font-medium pb-4">Type</th>
                  <th className="text-left text-[#6b7280] text-xs font-medium pb-4">Coin</th>
                  <th className="text-left text-[#6b7280] text-xs font-medium pb-4">Amount</th>
                  <th className="text-left text-[#6b7280] text-xs font-medium pb-4">Fee</th>
                  <th className="text-left text-[#6b7280] text-xs font-medium pb-4">Status</th>
                  <th className="text-right text-[#6b7280] text-xs font-medium pb-4 pr-4">View Details</th>
                </tr>
              </thead>

              <tbody>
                {filteredTransactions.map((tx, index) => (
                  <tr
                    key={tx.id}
                    className={`border-b border-white/5 hover:bg-white/5 transition-colors ${
                      index === filteredTransactions.length - 1 ? "border-none" : ""
                    }`}
                  >
                    <td className="py-5 text-white text-sm">
                      {new Date(tx.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                      <br />
                      <span className="text-[#6b7280] text-xs">
                        {new Date(tx.created_at).toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </td>
                    <td className="py-5">
                      <span className="text-[#1ecb4f] text-sm font-medium capitalize">
                        {tx.type.replace("_", " ")}
                      </span>
                    </td>
                    <td className="py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-[#627EEA] rounded-full flex items-center justify-center text-white font-bold text-lg">
                          {tx.coin.charAt(0)}
                        </div>
                        <span className="text-white text-sm font-medium">{tx.coin}</span>
                      </div>
                    </td>
                    <td className="py-5 text-white text-sm font-medium">{tx.amount}</td>
                    <td className="py-5 text-[#6b7280] text-sm">{tx.fee}</td>
                    <td className="py-5">
                      <span className="inline-block px-4 py-1 bg-[#1ecb4f]/10 text-[#1ecb4f] text-xs font-medium rounded-full capitalize">
                        {tx.status}
                      </span>
                    </td>
                    <td className="py-5 text-right">
                      <button
                        onClick={() => setSelectedTx(tx)}
                        className="text-[#8b5cf6] text-sm font-medium hover:underline"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="md:hidden space-y-4">
            {filteredTransactions.map((tx) => (
              <div
                key={tx.id}
                className="bg-[#1a1b23] border border-white/10 rounded-2xl p-5 hover:bg-white/5 transition-all"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-white text-sm">
                      {new Date(tx.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                    <p className="text-[#6b7280] text-xs">
                      {new Date(tx.created_at).toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  <span className="inline-block px-4 py-1 bg-[#1ecb4f]/10 text-[#1ecb4f] text-xs font-medium rounded-full capitalize">
                    {tx.status}
                  </span>
                </div>

                <div className="flex items-center gap-3 mb-4">
                  <div className="w-9 h-9 bg-[#627EEA] rounded-full flex items-center justify-center text-white font-bold text-xl">
                    {tx.coin.charAt(0)}
                  </div>
                  <div>
                    <p className="text-white font-medium">{tx.coin}</p>
                    <p className="text-[#1ecb4f] text-sm capitalize">
                      {tx.type.replace("_", " ")}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-[#6b7280] text-xs">Amount</p>
                    <p className="text-white font-medium">{tx.amount}</p>
                  </div>
                  <div>
                    <p className="text-[#6b7280] text-xs">Fee</p>
                    <p className="text-[#6b7280]">{tx.fee}</p>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-white/10 flex justify-end">
                  <button
                    onClick={() => setSelectedTx(tx)}
                    className="text-[#8b5cf6] text-sm font-medium hover:underline"
                  >
                    View Details →
                  </button>
                </div>
              </div>
            ))}
          </div>

          {!loading && filteredTransactions.length === 0 && (
            <div className="text-center text-[#6b7280] py-10 text-sm">
              No transactions found.
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 text-sm text-[#6b7280]">
            <div>
              Showing {startItem}-{endItem} of {filteredTransactions.length}
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage <= 1}
                className="w-10 h-10 flex items-center justify-center rounded-2xl border border-white/10 hover:bg-white/5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                ←
              </button>

              <button
                onClick={() =>
                  setCurrentPage((prev) =>
                    Math.min(prev + 1, pagination.lastPage || prev + 1)
                  )
                }
                disabled={currentPage >= (pagination.lastPage || 1)}
                className="w-10 h-10 flex items-center justify-center rounded-2xl border border-white/10 hover:bg-white/5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                →
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      {selectedTx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
          <div className="w-full max-w-lg rounded-3xl bg-[#111218] border border-white/10 p-6 text-white">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold">Transaction Details</h2>
              <button
                onClick={() => setSelectedTx(null)}
                className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3 text-sm">
              <DetailRow label="ID" value={selectedTx.id} />
              <DetailRow label="Date" value={new Date(selectedTx.created_at).toLocaleString()} />
              <DetailRow label="Type" value={selectedTx.type?.replace("_", " ")} />
              <DetailRow label="Coin" value={selectedTx.coin} />
              <DetailRow label="Amount" value={selectedTx.amount} />
              <DetailRow label="Fee" value={selectedTx.fee} />
              <DetailRow label="Status" value={selectedTx.status} />
              <DetailRow label="To Address" value={selectedTx.to_address || "-"} />
              <DetailRow label="TXID" value={selectedTx.txid || "-"} />
            </div>
          </div>
        </div>
      )}
    </PageShell>
  );
}

function DetailRow({ label, value }: { label: string; value: any }) {
  return (
    <div className="flex justify-between gap-4 border-b border-white/10 pb-3">
      <span className="text-[#6b7280]">{label}</span>
      <span className="text-right break-all capitalize">{value}</span>
    </div>
  );
}