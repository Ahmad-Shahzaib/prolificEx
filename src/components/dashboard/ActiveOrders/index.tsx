"use client";

import { useEffect } from "react";
import { Card, CardContent } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchMyOrders } from "@/redux/thunk/p2pOrdersThunk";
import { useRouter } from "next/navigation";

const statusColor: Record<string, string> = {
  pending: "text-[#1ecb4f]",
  locked: "text-[#6b7280]",
  completed: "text-[#3b82f6]",
  cancelled: "text-[#ef4444]",
  disputed: "text-[#f59e0b]",
  expired: "text-[#ef4444]",
};

const coinColors: Record<string, string> = {
  BTC: "bg-[#f7931a]",
  ETH: "bg-[#627eea]",
  LTC: "bg-[#bfbbbb]",
  SOL: "bg-[#9945ff]",
  BNB: "bg-[#f3ba2f]",
  USDT: "bg-[#26a17b]",
  USDC: "bg-[#2775ca]",
};

export function ActiveOrders() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { orders, loading, loadedAt } = useAppSelector((state) => state.p2pOrders);

  useEffect(() => {
    dispatch(fetchMyOrders({ page: 1, per_page: 5 }));
  }, [dispatch]);

  const latestFive = orders.slice(0, 5);
  const showSkeleton = loading && loadedAt === null && latestFive.length === 0;

  return (
    <Card className="bg-[#1a1b23] border border-white/5 rounded-2xl">
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-white text-sm sm:text-base font-bold [font-family:'Inter',Helvetica]">
            Active Orders
          </h3>
          <Button
            variant="secondary"
            size="sm"
            data-testid="button-view-more-orders"
            className="text-[#6b7280] text-xs bg-[#252630] border-white/10 px-3 py-1"
            onClick={() => router.push("/dashboard/my-orders")}
          >
            View More
          </Button>
        </div>

        {showSkeleton && (
          <div className="space-y-3 py-2 animate-pulse" aria-label="Loading orders">
            <div className="grid grid-cols-4 gap-4 border-b border-white/5 pb-3">
              {[0, 1, 2, 3].map((item) => (
                <div key={item} className="h-3 rounded bg-white/10" />
              ))}
            </div>
            {[0, 1].map((row) => (
              <div key={row} className="grid grid-cols-4 gap-4 py-2">
                {[0, 1, 2, 3].map((item) => (
                  <div key={item} className="h-8 rounded-lg bg-white/10" />
                ))}
              </div>
            ))}
          </div>
        )}

        {!showSkeleton && latestFive.length === 0 && (
          <p className="text-[#6b7280] text-sm [font-family:'Inter',Helvetica] py-4">No orders found.</p>
        )}

        {!showSkeleton && latestFive.length > 0 && (
          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <table className="w-full min-w-[400px]">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left text-[#6b7280] text-xs font-medium [font-family:'Inter',Helvetica] pb-3 pl-4 sm:pl-0">Coin</th>
                  <th className="text-left text-[#6b7280] text-xs font-medium [font-family:'Inter',Helvetica] pb-3">Price</th>
                  <th className="text-left text-[#6b7280] text-xs font-medium [font-family:'Inter',Helvetica] pb-3 hidden sm:table-cell">Payment</th>
                  <th className="text-left text-[#6b7280] text-xs font-medium [font-family:'Inter',Helvetica] pb-3">Status</th>
                  <th className="text-right text-[#6b7280] text-xs font-medium [font-family:'Inter',Helvetica] pb-3 pr-4 sm:pr-0"></th>
                </tr>
              </thead>
              <tbody>
                {latestFive.map((order) => {
                  const coinKey = order.coin?.toUpperCase() || "";
                  const iconBg = coinColors[coinKey] || "bg-[#6b7280]";
                  const statusKey = order.status?.toLowerCase() || "";
                  const statusClass = statusColor[statusKey] || "text-[#6b7280]";
                  const displayStatus = order.status
                    ? order.status
                        .split("_")
                        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                        .join(" ")
                    : "-";
                  const priceDisplay = order.fiat_currency
                    ? `${order.fiat_currency} ${parseFloat(order.fiat_amount).toLocaleString()}`
                    : order.fiat_amount;

                  return (
                    <tr key={order.id} className="border-b border-white/5 last:border-none">
                      <td className="py-3 sm:py-4 pl-4 sm:pl-0">
                        <div className="flex items-center gap-2">
                          <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full ${iconBg} flex items-center justify-center text-white text-xs sm:text-sm font-bold flex-shrink-0`}>
                            {coinKey.slice(0, 1)}
                          </div>
                          <span className="text-white text-sm font-medium [font-family:'Inter',Helvetica]">{coinKey}</span>
                        </div>
                      </td>
                      <td className="py-3 sm:py-4 text-white text-sm [font-family:'Inter',Helvetica]">{priceDisplay}</td>
                      <td className="py-3 sm:py-4 text-[#6b7280] text-sm [font-family:'Inter',Helvetica] hidden sm:table-cell">{order.payment_method}</td>
                      <td className="py-3 sm:py-4">
                        <span className={`text-sm font-medium [font-family:'Inter',Helvetica] ${statusClass}`}>
                          {displayStatus}
                        </span>
                      </td>
                      {/* <td className="py-3 sm:py-4 text-right pr-4 sm:pr-0">
                        <button
                          className="text-[#6b7280] bg-transparent border-none cursor-pointer hover:text-white transition-colors"
                          onClick={() => router.push(`/dashboard/p2p/${order.id}`)}
                        >
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <circle cx="4" cy="8" r="1" fill="currentColor" />
                            <circle cx="8" cy="8" r="1" fill="currentColor" />
                            <circle cx="12" cy="8" r="1" fill="currentColor" />
                          </svg>
                        </button>
                      </td> */}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
