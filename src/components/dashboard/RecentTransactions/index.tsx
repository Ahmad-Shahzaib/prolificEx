"use client";

import { Card, CardContent } from "@/components/common/Card";

interface Transaction {
  id: string;
  type: "buy" | "sell";
  coin: string;
  amount: string;
  price: string;
  total: string;
  status: "completed" | "pending" | "failed";
  date: string;
}

const transactions: Transaction[] = [
  {
    id: "1",
    type: "buy",
    coin: "BTC",
    amount: "0.0523",
    price: "$67,234.50",
    total: "$3,516.36",
    status: "completed",
    date: "Today, 2:30 PM",
  },
  {
    id: "2",
    type: "sell",
    coin: "USDT",
    amount: "1,200.00",
    price: "$1.00",
    total: "$1,200.00",
    status: "completed",
    date: "Today, 11:15 AM",
  },
  {
    id: "3",
    type: "buy",
    coin: "USDC",
    amount: "850.00",
    price: "$1.00",
    total: "$850.00",
    status: "pending",
    date: "Yesterday, 4:45 PM",
  },
  {
    id: "4",
    type: "buy",
    coin: "BTC",
    amount: "0.0150",
    price: "$66,890.00",
    total: "$1,003.35",
    status: "completed",
    date: "Yesterday, 9:20 AM",
  },
  {
    id: "5",
    type: "sell",
    coin: "BTC",
    amount: "0.0080",
    price: "$67,100.00",
    total: "$536.80",
    status: "failed",
    date: "Mar 8, 3:10 PM",
  },
];

const statusStyles = {
  completed: "bg-[#1ecb4f]/10 text-[#1ecb4f]",
  pending: "bg-[#f0b90b]/10 text-[#f0b90b]",
  failed: "bg-[#f46d22]/10 text-[#f46d22]",
};

export function RecentTransactions() {
  return (
    <Card className="bg-[#1a1b23] border border-white/5 rounded-2xl">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-white text-lg font-bold [font-family:'Inter',Helvetica]">
            Recent Transactions
          </h3>
          <button className="text-violet-400 text-sm font-medium [font-family:'Inter',Helvetica] bg-transparent border-none cursor-pointer hover:text-violet-300 transition-colors">
            View All
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left text-[#898ca9] text-xs font-medium [font-family:'Inter',Helvetica] pb-3 pr-4">
                  Type
                </th>
                <th className="text-left text-[#898ca9] text-xs font-medium [font-family:'Inter',Helvetica] pb-3 pr-4">
                  Coin
                </th>
                <th className="text-left text-[#898ca9] text-xs font-medium [font-family:'Inter',Helvetica] pb-3 pr-4">
                  Amount
                </th>
                <th className="text-left text-[#898ca9] text-xs font-medium [font-family:'Inter',Helvetica] pb-3 pr-4 hidden sm:table-cell">
                  Price
                </th>
                <th className="text-left text-[#898ca9] text-xs font-medium [font-family:'Inter',Helvetica] pb-3 pr-4 hidden md:table-cell">
                  Total
                </th>
                <th className="text-left text-[#898ca9] text-xs font-medium [font-family:'Inter',Helvetica] pb-3 pr-4">
                  Status
                </th>
                <th className="text-right text-[#898ca9] text-xs font-medium [font-family:'Inter',Helvetica] pb-3 hidden lg:table-cell">
                  Date
                </th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr
                  key={tx.id}
                  className="border-b border-white/5 last:border-none hover:bg-white/[0.02] transition-colors"
                >
                  <td className="py-4 pr-4">
                    <span
                      className={`inline-flex items-center justify-center w-16 py-1 rounded-md text-xs font-semibold [font-family:'Inter',Helvetica] ${
                        tx.type === "buy"
                          ? "bg-[#1ecb4f]/10 text-[#1ecb4f]"
                          : "bg-[#f46d22]/10 text-[#f46d22]"
                      }`}
                    >
                      {tx.type === "buy" ? "Buy" : "Sell"}
                    </span>
                  </td>
                  <td className="py-4 pr-4">
                    <span className="text-white text-sm font-medium [font-family:'Inter',Helvetica]">
                      {tx.coin}
                    </span>
                  </td>
                  <td className="py-4 pr-4">
                    <span className="text-white text-sm [font-family:'Inter',Helvetica]">
                      {tx.amount}
                    </span>
                  </td>
                  <td className="py-4 pr-4 hidden sm:table-cell">
                    <span className="text-[#898ca9] text-sm [font-family:'Inter',Helvetica]">
                      {tx.price}
                    </span>
                  </td>
                  <td className="py-4 pr-4 hidden md:table-cell">
                    <span className="text-white text-sm font-medium [font-family:'Inter',Helvetica]">
                      {tx.total}
                    </span>
                  </td>
                  <td className="py-4 pr-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium [font-family:'Inter',Helvetica] capitalize ${statusStyles[tx.status]}`}
                    >
                      {tx.status}
                    </span>
                  </td>
                  <td className="py-4 text-right hidden lg:table-cell">
                    <span className="text-[#898ca9] text-xs [font-family:'Inter',Helvetica]">
                      {tx.date}
                    </span>
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
