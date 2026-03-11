"use client";

import { Card, CardContent } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function QuickTrade() {
  const [activeTab, setActiveTab] = useState<"buy" | "sell">("buy");
  const [amount, setAmount] = useState("");
  const [selectedCoin, setSelectedCoin] = useState("BTC");

  const coins = ["BTC", "USDT", "USDC"];

  return (
    <Card className="bg-[#1a1b23] border border-white/5 rounded-2xl">
      <CardContent className="p-6">
        <h3 className="text-white text-lg font-bold [font-family:'Inter',Helvetica] mb-4">
          Quick Trade
        </h3>

        <div className="flex items-center gap-1 bg-white/5 rounded-xl p-1 mb-6">
          <button
            onClick={() => setActiveTab("buy")}
            className={cn(
              "flex-1 py-2.5 rounded-lg text-sm font-semibold [font-family:'Inter',Helvetica] transition-all cursor-pointer border-none",
              activeTab === "buy"
                ? "bg-[#1ecb4f] text-white"
                : "bg-transparent text-[#898ca9] hover:text-white"
            )}
          >
            Buy
          </button>
          <button
            onClick={() => setActiveTab("sell")}
            className={cn(
              "flex-1 py-2.5 rounded-lg text-sm font-semibold [font-family:'Inter',Helvetica] transition-all cursor-pointer border-none",
              activeTab === "sell"
                ? "bg-[#f46d22] text-white"
                : "bg-transparent text-[#898ca9] hover:text-white"
            )}
          >
            Sell
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-[#898ca9] text-xs font-medium [font-family:'Inter',Helvetica] mb-2 block">
              Select Coin
            </label>
            <div className="flex gap-2">
              {coins.map((coin) => (
                <button
                  key={coin}
                  onClick={() => setSelectedCoin(coin)}
                  className={cn(
                    "flex-1 py-2.5 rounded-xl text-sm font-medium [font-family:'Inter',Helvetica] transition-all cursor-pointer border",
                    selectedCoin === coin
                      ? "bg-violet-600/20 text-violet-400 border-violet-500/30"
                      : "bg-white/5 text-[#898ca9] border-white/10 hover:border-white/20"
                  )}
                >
                  {coin}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[#898ca9] text-xs font-medium [font-family:'Inter',Helvetica] mb-2 block">
              Amount (USD)
            </label>
            <input
              type="text"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-white text-base [font-family:'Inter',Helvetica] placeholder:text-[#898ca9] focus:outline-none focus:border-violet-500/50 transition-colors"
            />
          </div>

          <div className="bg-white/5 rounded-xl p-4 space-y-2">
            <div className="flex items-center justify-between text-sm [font-family:'Inter',Helvetica]">
              <span className="text-[#898ca9]">Price</span>
              <span className="text-white font-medium">$67,234.50</span>
            </div>
            <div className="flex items-center justify-between text-sm [font-family:'Inter',Helvetica]">
              <span className="text-[#898ca9]">Fee</span>
              <span className="text-white font-medium">0.1%</span>
            </div>
            <div className="flex items-center justify-between text-sm [font-family:'Inter',Helvetica]">
              <span className="text-[#898ca9]">You receive</span>
              <span className="text-white font-semibold">
                {amount ? `≈ ${(parseFloat(amount) / 67234.5).toFixed(8)} ${selectedCoin}` : `0.00 ${selectedCoin}`}
              </span>
            </div>
          </div>

          <Button
            variant="primary"
            size="lg"
            className={cn(
              "w-full rounded-xl",
              activeTab === "buy"
                ? "bg-[#1ecb4f] hover:bg-[#19b545] shadow-none"
                : "bg-[#f46d22] hover:bg-[#e05e1a] shadow-none"
            )}
          >
            {activeTab === "buy" ? `Buy ${selectedCoin}` : `Sell ${selectedCoin}`}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
