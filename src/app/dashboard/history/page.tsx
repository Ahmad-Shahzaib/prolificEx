'use client';

import { useEffect, useMemo, useState } from "react";
import { PageShell } from "@/components/dashboard/PageShell";
import { Card, CardContent } from "@/components/common/Card";
import { Search, ChevronDown, Filter } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchTransactions } from "@/redux/thunk/transactionsThunk";

export default function HistoryPage() {
  const dispatch = useAppDispatch();
  const { loading, error, transactions, pagination } = useAppSelector((state) => state.transactions);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    dispatch(fetchTransactions({ page: currentPage, per_page: 20 }));
  }, [dispatch, currentPage]);

  const filteredTransactions = useMemo(() => {
    if (!searchTerm.trim()) {
      return transactions;
    }

    const normalized = searchTerm.toLowerCase();
    return transactions.filter((tx) =>
      tx.id.toString().toLowerCase().includes(normalized) ||
      tx.type.toLowerCase().includes(normalized) ||
      tx.coin.toLowerCase().includes(normalized) ||
      tx.status.toLowerCase().includes(normalized) ||
      tx.to_address?.toLowerCase().includes(normalized) ||
      tx.txid?.toLowerCase().includes(normalized)
    );
  }, [searchTerm, transactions]);

  const startItem = pagination.total === 0 ? 0 : (currentPage - 1) * 20 + 1;
  const endItem = Math.min(currentPage * 20, pagination.total);

  return (
    <PageShell title="Transaction History" description="View all your past transactions.">
      <Card className="bg-[#111218] border border-white/5 rounded-3xl overflow-hidden">
        <CardContent className="p-4 sm:p-6">

          {/* Header with Search and Filters */}
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6b7280]">
                <Search size={18} />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search users or transactions..."
                className="w-full bg-[#1a1b23] border border-white/10 rounded-2xl pl-11 py-3 text-sm text-white placeholder-[#6b7280] focus:outline-none focus:border-white/20"
              />
            </div>

            <div className="flex flex-wrap gap-3">
              <button className="flex items-center gap-2 bg-[#1a1b23] border border-white/10 hover:border-white/20 px-5 py-3 rounded-2xl text-sm text-white whitespace-nowrap">
                Date
                <ChevronDown size={16} />
              </button>
              <button className="flex items-center gap-2 bg-[#1a1b23] border border-white/10 hover:border-white/20 px-5 py-3 rounded-2xl text-sm text-white whitespace-nowrap">
                Coin
                <ChevronDown size={16} />
              </button>
              <button className="flex items-center gap-2 bg-[#1a1b23] border border-white/10 hover:border-white/20 px-5 py-3 rounded-2xl text-sm text-white whitespace-nowrap">
                <Filter size={16} />
                Filter
              </button>
            </div>
          </div>

          {loading && (
            <div className="text-sm text-[#9ca3af] mb-4">Loading transactions…</div>
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
                    className={`border-b border-white/5 hover:bg-white/5 transition-colors ${index === filteredTransactions.length - 1 ? 'border-none' : ''}`}
                  >
                    <td className="py-5 text-white text-sm">
                      {new Date(tx.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}<br />
                      <span className="text-[#6b7280] text-xs">{new Date(tx.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
                    </td>
                    <td className="py-5">
                      <span className="text-[#1ecb4f] text-sm font-medium capitalize">{tx.type.replace('_', ' ')}</span>
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
                      <span className="text-[#8b5cf6] text-sm font-medium hover:underline cursor-pointer">
                        View Details
                      </span>
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
                    <p className="text-white text-sm">{new Date(tx.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                    <p className="text-[#6b7280] text-xs">{new Date(tx.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</p>
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
                    <p className="text-[#1ecb4f] text-sm capitalize">{tx.type.replace('_', ' ')}</p>
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
                  <span className="text-[#8b5cf6] text-sm font-medium hover:underline cursor-pointer">
                    View Details →
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 text-sm text-[#6b7280]">
            <div>Showing {startItem}-{endItem} of {pagination.total}</div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage <= 1}
                className="w-10 h-10 flex items-center justify-center rounded-2xl border border-white/10 hover:bg-white/5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                ←
              </button>
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, pagination.lastPage || prev + 1))}
                disabled={currentPage >= (pagination.lastPage || 1)}
                className="w-10 h-10 flex items-center justify-center rounded-2xl border border-white/10 hover:bg-white/5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                →
              </button>
            </div>
          </div>

        </CardContent>
      </Card>
    </PageShell>
  );
}
