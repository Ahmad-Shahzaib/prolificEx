"use client";

import { Card, CardContent } from "@/components/common/Card";
import { useAppSelector } from "@/redux/hooks";

const coinColors: Record<string, string> = {
  BTC: "bg-[#f7931a]",
  ETH: "bg-[#627eea]",
  LTC: "bg-[#bfbbbb]",
  SOL: "bg-[#9945ff]",
  BNB: "bg-[#f3ba2f]",
  USDT: "bg-[#26a17b]",
  USDC: "bg-[#2775ca]",
  XRP: "bg-[#346aa9]",
  ADA: "bg-[#0033ad]",
  DOT: "bg-[#e6007a]",
};

const getChangeColor = (change: number) =>
  change >= 0 ? "text-[#1ecb4f]" : "text-[#ef4444]";

export function MyPortfolio() {
  const wallets = useAppSelector((state) => state.wallet.wallets);
  const loading = useAppSelector((state) => state.wallet.loading);

  return (
    <Card className="bg-[#1a1b23] border border-white/5 rounded-2xl h-full">
      <CardContent className="p-4 sm:p-6">
        <h3 className="text-white text-base font-bold [font-family:'Inter',Helvetica] mb-5">
          Quick Alerts
        </h3>

        {loading && (
          <p className="text-[#6b7280] text-sm [font-family:'Inter',Helvetica]">Loading wallets...</p>
        )}

        {!loading && wallets.length === 0 && (
          <p className="text-[#6b7280] text-sm [font-family:'Inter',Helvetica]">No wallets found.</p>
        )}

        <div className="space-y-4">
          {wallets.map((wallet) => {
            const iconBg = coinColors[wallet.coin.toUpperCase()] || "bg-[#6b7280]";
            const iconLetter = wallet.coin.slice(0, 1).toUpperCase();
            const usdValue = `$${wallet.usd_value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
            const availableBalance = `${parseFloat(wallet.available_balance).toFixed(5)} ${wallet.coin.toUpperCase()}`;

            return (
              <div key={`${wallet.id}-${wallet.network}`} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full ${iconBg} flex items-center justify-center text-white text-sm font-bold`}>
                    {iconLetter}
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium [font-family:'Inter',Helvetica] leading-4">{wallet.coin.toUpperCase()}</p>
                    <p className="text-[#6b7280] text-xs [font-family:'Inter',Helvetica] leading-4 mt-0.5">{wallet.network}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white text-xs font-medium [font-family:'Inter',Helvetica] leading-4">
                    {usdValue}
                  </p>
                  <p className="text-[#6b7280] text-xs [font-family:'Inter',Helvetica] leading-4 mt-0.5">{availableBalance}</p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
