"use client";

import { Card, CardContent } from "@/components/common/Card";
import { Button } from "@/components/common/Button";

interface Order {
  id: string;
  coin: string;
  coinIcon: string;
  price: string;
  payment: string;
  status: "Pending" | "Locked" | "Completed" | "Cancelled";
}

const orders: Order[] = [
  { id: "1", coin: "Bitcoin", coinIcon: "₿", price: "$48,032,32", payment: "Bank Transfer", status: "Pending" },
  { id: "2", coin: "Bitcoin", coinIcon: "₿", price: "$48,032,32", payment: "Bank Transfer", status: "Locked" },
];

const statusColor: Record<string, string> = {
  Pending: "text-[#1ecb4f]",
  Locked: "text-[#6b7280]",
  Completed: "text-[#3b82f6]",
  Cancelled: "text-[#ef4444]",
};

export function ActiveOrders() {
  return (
    <Card className="bg-[#1a1b23] border border-white/5 rounded-2xl">
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-white text-sm sm:text-base font-bold [font-family:'Inter',Helvetica]">
            Active Orders widget
          </h3>
          <Button
            variant="secondary"
            size="sm"
            data-testid="button-view-more-orders"
            className="text-[#6b7280] text-xs bg-[#252630] border-white/10 px-3 py-1"
          >
            View More
          </Button>
        </div>

        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <table className="w-full min-w-[400px]">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left text-[#6b7280] text-xs font-medium [font-family:'Inter',Helvetica] pb-3 pl-4 sm:pl-0">Coin</th>
                <th className="text-left text-[#6b7280] text-xs font-medium [font-family:'Inter',Helvetica] pb-3">Price</th>
                <th className="text-left text-[#6b7280] text-xs font-medium [font-family:'Inter',Helvetica] pb-3 hidden sm:table-cell">Pyament</th>
                <th className="text-left text-[#6b7280] text-xs font-medium [font-family:'Inter',Helvetica] pb-3">Status</th>
                <th className="text-right text-[#6b7280] text-xs font-medium [font-family:'Inter',Helvetica] pb-3 pr-4 sm:pr-0"></th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b border-white/5 last:border-none">
                  <td className="py-3 sm:py-4 pl-4 sm:pl-0">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#f7931a] flex items-center justify-center text-white text-xs sm:text-sm font-bold flex-shrink-0">
                        {order.coinIcon}
                      </div>
                      <span className="text-white text-sm font-medium [font-family:'Inter',Helvetica]">{order.coin}</span>
                    </div>
                  </td>
                  <td className="py-3 sm:py-4 text-white text-sm [font-family:'Inter',Helvetica]">{order.price}</td>
                  <td className="py-3 sm:py-4 text-[#6b7280] text-sm [font-family:'Inter',Helvetica] hidden sm:table-cell">{order.payment}</td>
                  <td className="py-3 sm:py-4">
                    <span className={`text-sm font-medium [font-family:'Inter',Helvetica] ${statusColor[order.status]}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="py-3 sm:py-4 text-right pr-4 sm:pr-0">
                    <button className="text-[#6b7280] bg-transparent border-none cursor-pointer hover:text-white transition-colors">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <circle cx="4" cy="8" r="1" fill="currentColor" />
                        <circle cx="8" cy="8" r="1" fill="currentColor" />
                        <circle cx="12" cy="8" r="1" fill="currentColor" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
