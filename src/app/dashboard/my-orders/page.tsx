"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Search, MessageCircle } from "lucide-react";
import { PageShell } from "@/components/dashboard/PageShell";
import { Card, CardContent } from "@/components/common/Card";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { confirmOrderPayment, fetchMyOrders } from "@/redux/thunk/p2pOrdersThunk";
import { setOrdersStatusFilter } from "@/redux/slices/p2pOrdersSlice";

const statusOptions = [
  { value: "all", label: "All" },
  { value: "pending_payment", label: "Pending Payment" },
  { value: "paid", label: "Paid" },
  { value: "released", label: "Released" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
  { value: "expired", label: "Expired" },
  { value: "disputed", label: "Disputed" },
];

export default function MyOrdersPage() {
  const dispatch = useAppDispatch();
  const { loading, error, orders, pagination, statusFilter, confirmLoading, confirmingOrderId, confirmError, confirmMessage } = useAppSelector((state) => state.p2pOrders);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    dispatch(fetchMyOrders({ page: currentPage, per_page: 20, status: statusFilter }));
  }, [dispatch, currentPage, statusFilter]);

  const filteredOrders = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    const normalizedStatusFilter = statusFilter.trim().toLowerCase();

    return orders.filter((order) => {
      const statusMatches =
        normalizedStatusFilter === "all" ||
        order.status.replaceAll(" ", "_").toLowerCase() === normalizedStatusFilter ||
        order.status.toLowerCase() === normalizedStatusFilter;

      if (!statusMatches) {
        return false;
      }

      if (!normalizedSearch) {
        return true;
      }

      return (
        order.order_number.toLowerCase().includes(normalizedSearch) ||
        order.coin.toLowerCase().includes(normalizedSearch) ||
        order.network.toLowerCase().includes(normalizedSearch) ||
        order.status.toLowerCase().includes(normalizedSearch) ||
        order.payment_method.toLowerCase().includes(normalizedSearch) ||
        order.buyer.full_name.toLowerCase().includes(normalizedSearch) ||
        order.seller.full_name.toLowerCase().includes(normalizedSearch)
      );
    });
  }, [orders, searchTerm, statusFilter]);

  const startItem = pagination.total === 0 ? 0 : (currentPage - 1) * pagination.perPage + 1;
  const endItem = Math.min(currentPage * pagination.perPage, pagination.total);

  return (
    <PageShell title="My Orders" description="View your active P2P orders and track order status.">
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
                placeholder="Search by order number, coin, status, buyer or seller..."
                className="w-full bg-[#1a1b23] border border-white/10 rounded-2xl pl-11 py-3 text-sm text-white placeholder-[#6b7280] focus:outline-none focus:border-white/20"
              />
            </div>

            <div className="flex flex-wrap gap-2 items-center">
              {statusOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    dispatch(setOrdersStatusFilter(option.value));
                    setCurrentPage(1);
                  }}
                  className={`rounded-2xl px-4 py-2 text-sm font-medium transition-all ${
                    statusFilter === option.value
                      ? "bg-violet-600 text-white"
                      : "bg-[#1a1b23] border border-white/10 text-[#d1d5db] hover:border-white/20 hover:text-white"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-200 mb-4">
              {error}
            </div>
          )}

          {confirmMessage && (
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3 text-sm text-emerald-200 mb-4">
              {confirmMessage}
            </div>
          )}

          {confirmError && (
            <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-200 mb-4">
              {confirmError}
            </div>
          )}

          {loading ? (
            <div className="space-y-3 mb-4 animate-pulse" aria-label="Loading orders">
              {[0, 1, 2, 3].map((row) => (
                <div key={row} className="grid grid-cols-2 md:grid-cols-8 gap-3">
                  {[0, 1, 2, 3, 4, 5, 6, 7].map((cell) => (
                    <div key={cell} className="h-10 rounded-xl bg-white/5" />
                  ))}
                </div>
              ))}
            </div>
          ) : (
            <>
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full min-w-[850px]">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left text-[#6b7280] text-xs font-medium pb-4">Order #</th>
                      <th className="text-left text-[#6b7280] text-xs font-medium pb-4">Coin</th>
                      <th className="text-left text-[#6b7280] text-xs font-medium pb-4">Amount</th>
                      <th className="text-left text-[#6b7280] text-xs font-medium pb-4">Payment</th>
                      <th className="text-left text-[#6b7280] text-xs font-medium pb-4">Status</th>
                      <th className="text-left text-[#6b7280] text-xs font-medium pb-4">Chat</th>
                      <th className="text-left text-[#6b7280] text-xs font-medium pb-4">Buyer / Seller</th>
                      <th className="text-right text-[#6b7280] text-xs font-medium pb-4 pr-4">Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map((order, index) => (
                      <tr
                        key={order.id}
                        className={`border-b border-white/5 hover:bg-white/5 transition-colors ${
                          index === filteredOrders.length - 1 ? "border-none" : ""
                        }`}
                      >
                        <td className="py-5 text-white text-sm">
                          <Link href={`/dashboard/p2p/order/${order.id}`} className="underline hover:text-violet-300">
                            {order.order_number}
                          </Link>
                        </td>
                        <td className="py-5 text-sm text-white">{order.coin}/{order.network}</td>
                        <td className="py-5 text-sm text-white">{order.fiat_amount} {order.fiat_currency}</td>
                        <td className="py-5 text-sm text-[#cbd5e1]">{order.payment_method}</td>
                        <td className="py-5">
                          <div className="space-y-2">
                            <span className="inline-block px-4 py-1 rounded-full text-xs font-medium bg-violet-600/10 text-violet-300 capitalize">
                              {order.status.replaceAll("_", " ")}
                            </span>
                          </div>
                        </td>
                        <td className="py-5 text-sm text-white">
                          <Link href={`/dashboard/p2p/order/${order.id}`} className="relative inline-flex items-center gap-2 rounded-full px-3 py-2 bg-[#11121c] hover:bg-[#1f1f2e] transition">
                            {Number((order as any).unread_messages ?? 0) > 0 && (
                              <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-rose-500 shadow-lg shadow-rose-500/30" />
                            )}
                            <MessageCircle size={16} />
                            {Number((order as any).unread_messages ?? 0) > 0 && (
                              <span className="inline-flex min-w-[20px] items-center justify-center rounded-full bg-rose-500 px-2 py-0.5 text-[11px] font-semibold text-white">
                                {(order as any).unread_messages}
                              </span>
                            )}
                          </Link>
                        </td>
                        <td className="py-5 text-sm text-white">
                          <div className="space-y-1">
                            <div>{order.buyer.full_name}</div>
                            <div className="text-[#6b7280] text-xs">{order.seller.full_name}</div>
                          </div>
                        </td>
                        <td className="py-5 text-right text-sm text-[#d1d5db] pr-4">
                          {new Date(order.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="md:hidden space-y-4">
                {filteredOrders.map((order) => (
                  <div key={order.id} className="bg-[#1a1b23] border border-white/10 rounded-2xl p-5 hover:bg-white/5 transition-all">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="text-white text-sm font-medium">
                          <Link href={`/dashboard/p2p/order/${order.id}`} className="underline hover:text-violet-300">
                            {order.order_number}
                          </Link>
                        </p>
                        <div className="mt-2 inline-flex items-center gap-2 text-xs text-[#9ca3af]">
                          {Number((order as any).unread_messages ?? 0) > 0 && (
                            <span className="h-2.5 w-2.5 rounded-full bg-rose-500" />
                          )}
                          <MessageCircle size={14} />
                          {Number((order as any).unread_messages ?? 0) > 0 ? (
                            <span className="rounded-full bg-rose-500 px-2 py-0.5 text-[11px] font-semibold text-white">
                              {(order as any).unread_messages}
                            </span>
                          ) : (
                            <span className="rounded-full bg-[#272b37] px-2 py-0.5 text-[11px] font-semibold text-white/70">
                              Chat
                            </span>
                          )}
                        </div>
                        <p className="text-[#6b7280] text-xs">{order.coin}/{order.network}</p>
                      </div>
                      <span className="inline-block px-3 py-1 bg-violet-600/10 text-violet-200 text-xs font-medium rounded-full capitalize">
                        {order.status.replaceAll("_", " ")}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm text-[#d1d5db]">
                      <div>
                        <p className="text-[#6b7280] text-xs">Amount</p>
                        <p className="text-white">{order.fiat_amount} {order.fiat_currency}</p>
                      </div>
                      <div>
                        <p className="text-[#6b7280] text-xs">Payment</p>
                        <p>{order.payment_method}</p>
                      </div>
                    </div>
                    <div className="mt-4 text-sm text-[#6b7280]">
                      <div>Buyer: <span className="text-white">{order.buyer.full_name}</span></div>
                      <div>Seller: <span className="text-white">{order.seller.full_name}</span></div>
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
                    disabled={currentPage >= pagination.lastPage}
                    className="w-10 h-10 flex items-center justify-center rounded-2xl border border-white/10 hover:bg-white/5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    →
                  </button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </PageShell>
  );
}
