"use client";

import { Card, CardContent } from "@/components/common/Card";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface Transaction {
  id: string;
  type: "Buy" | "Sell";
  coin: string;
  date: string;
  coinValue: string;
  coinLabel: string;
  amount: string;
}

const transactions: Transaction[] = [
  { id: "1", type: "Buy", coin: "BTC", date: "14 Mar, 2021", coinValue: "0.016 BTC", coinLabel: "Coin Value", amount: "$125.20" },
  { id: "2", type: "Sell", coin: "ETH", date: "15 Mar, 2021", coinValue: "0.56 ETH", coinLabel: "Coin Value", amount: "$112.34" },
  { id: "3", type: "Buy", coin: "LTC", date: "16 Mar, 2021", coinValue: "1.88 LTC", coinLabel: "Coin Value", amount: "$94.22" },
  { id: "4", type: "Buy", coin: "ETH", date: "17 Mar, 2021", coinValue: "0.42 ETH", coinLabel: "Coin Value", amount: "$84.32" },
  { id: "5", type: "Sell", coin: "BTC", date: "18 Mar, 2021", coinValue: "0.018 BTC", coinLabel: "Coin Value", amount: "$145.80" },
  { id: "6", type: "Buy", coin: "BTC", date: "19 Mar, 2021", coinValue: "0.016 BTC", coinLabel: "Coin Value", amount: "$125.20" },
];

const tabs = ["All", "Sell", "Buy"];

export function Transactions() {
  const [activeTab, setActiveTab] = useState("All");

  const filteredTransactions = activeTab === "All"
    ? transactions
    : transactions.filter((tx) => tx.type === activeTab);

  return (
    <Card className="bg-[#1a1b23] border border-white/5 rounded-2xl h-full">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-white text-base font-bold [font-family:'Inter',Helvetica]">
            Transactions
          </h3>
          <div className="flex items-center gap-0">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "px-3 py-1 text-xs font-medium [font-family:'Inter',Helvetica] transition-all cursor-pointer border-none rounded-md",
                  activeTab === tab
                    ? "text-[#f0b90b] border-b-2 border-[#f0b90b] bg-transparent"
                    : "text-[#6b7280] bg-transparent hover:text-white"
                )}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-0">
          {filteredTransactions.map((tx) => (
            <div key={tx.id} className="flex items-center justify-between py-3 border-b border-white/5 last:border-none">
              <div>
                <p className="text-white text-sm font-medium [font-family:'Inter',Helvetica] leading-4">
                  {tx.type} {tx.coin}
                </p>
                <p className="text-[#6b7280] text-[11px] [font-family:'Inter',Helvetica] mt-0.5">
                  {tx.date}
                </p>
              </div>
              <div className="text-center">
                <p className="text-white text-sm font-medium [font-family:'Inter',Helvetica] leading-4">
                  {tx.coinValue}
                </p>
                <p className="text-[#6b7280] text-[11px] [font-family:'Inter',Helvetica] mt-0.5">
                  {tx.coinLabel}
                </p>
              </div>
              <div className="text-right">
                <p className="text-white text-sm font-semibold [font-family:'Inter',Helvetica] leading-4">
                  {tx.amount}
                </p>
                <p className="text-[#6b7280] text-[11px] [font-family:'Inter',Helvetica] mt-0.5">
                  Amount
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
