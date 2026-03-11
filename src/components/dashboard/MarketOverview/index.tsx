"use client";

import { Card, CardContent } from "@/components/common/Card";

interface MarketPair {
  pair: string;
  price: string;
  change: string;
  changePositive: boolean;
  volume: string;
}

const marketPairs: MarketPair[] = [
  { pair: "BTC/USD", price: "$67,234.50", change: "+2.34%", changePositive: true, volume: "$1.2B" },
  { pair: "ETH/USD", price: "$3,456.20", change: "+1.87%", changePositive: true, volume: "$890M" },
  { pair: "USDT/USD", price: "$1.0001", change: "+0.01%", changePositive: true, volume: "$45B" },
  { pair: "USDC/USD", price: "$0.9999", change: "-0.02%", changePositive: false, volume: "$12B" },
  { pair: "SOL/USD", price: "$178.90", change: "+5.43%", changePositive: true, volume: "$2.1B" },
  { pair: "BNB/USD", price: "$612.30", change: "-0.89%", changePositive: false, volume: "$1.5B" },
];

export function MarketOverview() {
  return (
    <Card className="bg-[#1a1b23] border border-white/5 rounded-2xl">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-white text-lg font-bold [font-family:'Inter',Helvetica]">
            Market Overview
          </h3>
          <button className="text-violet-400 text-sm font-medium [font-family:'Inter',Helvetica] bg-transparent border-none cursor-pointer hover:text-violet-300 transition-colors">
            See All
          </button>
        </div>

        <div className="space-y-3">
          {marketPairs.map((pair) => (
            <div
              key={pair.pair}
              className="flex items-center justify-between py-3 border-b border-white/5 last:border-none hover:bg-white/[0.02] -mx-2 px-2 rounded-lg transition-colors cursor-pointer"
            >
              <div>
                <p className="text-white text-sm font-semibold [font-family:'Inter',Helvetica]">
                  {pair.pair}
                </p>
                <p className="text-[#898ca9] text-xs [font-family:'Inter',Helvetica]">
                  Vol: {pair.volume}
                </p>
              </div>
              <div className="text-right">
                <p className="text-white text-sm font-medium [font-family:'Inter',Helvetica]">
                  {pair.price}
                </p>
                <p
                  className={`text-xs font-medium [font-family:'Inter',Helvetica] ${
                    pair.changePositive ? "text-[#1ecb4f]" : "text-[#f46d22]"
                  }`}
                >
                  {pair.change}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
