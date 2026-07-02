"use client";

import { useEffect } from "react";
import { Card, CardContent } from "@/components/common/Card";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchWalletPrices } from "@/redux/thunk/walletPricesThunk";

export function PriceWallet() {
  const dispatch = useAppDispatch();
  const { loading, error, prices, updatedAt } = useAppSelector((state) => state.walletPrices);

  useEffect(() => {
    dispatch(fetchWalletPrices());

    const intervalId = window.setInterval(() => {
      dispatch(fetchWalletPrices());
    }, 30_000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [dispatch]);

  const priceEntries = Object.entries(prices) as Array<[
    string,
    {
      coin: string;
      coingecko_id: string;
      name: string;
      symbol: string;
      price_usd: number;
      price_change_percentage_24h: number;
      market_cap_usd: number | null;
      last_updated: string;
    }
  ]>;

  const hasPrices = priceEntries.length > 0;

  return (
    <Card className="bg-[#1a1b23] border border-white/5 rounded-2xl">
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div>
            <p className="text-[#6b7280] text-sm [font-family:'Inter',Helvetica] font-medium">
              Live wallet prices
            </p>
            <h3 className="text-white text-xl font-bold [font-family:'Inter',Helvetica]">
              Market prices
            </h3>
          </div>
          <p className="text-[#6b7280] text-xs [font-family:'Inter',Helvetica]">
            {updatedAt ? new Date(updatedAt).toLocaleString() : "-"}
          </p>
        </div>

        {loading && !hasPrices ? (
          <div className="text-white/70 text-sm">Loading prices…</div>
        ) : error && !hasPrices ? (
          <div className="text-rose-400 text-sm">{error}</div>
        ) : (
          <div className="space-y-3">
            <div className="grid grid-cols-[1.5fr_1fr_1fr] gap-4 px-3 pb-2 text-[11px] text-[#6b7280] uppercase tracking-[0.08em] [font-family:'Inter',Helvetica]">
              <span>Asset</span>
              <span className="text-right">Price (USD)</span>
              <span className="text-right">24h Change</span>
            </div>
            {priceEntries.map(([key, item]) => {
              const priceUsd = Number(item.price_usd);
              const priceChange = Number(item.price_change_percentage_24h);
              const formattedPrice = Number.isFinite(priceUsd)
                ? `$${priceUsd.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}`
                : "--";
              const formattedChange = Number.isFinite(priceChange)
                ? `${priceChange >= 0 ? "+" : ""}${priceChange.toFixed(2)}%`
                : "--";

              return (
                <div
                  key={key}
                  className="grid grid-cols-[1.5fr_1fr_1fr] gap-4 items-center rounded-3xl border border-white/5 bg-white/5 px-3 py-3"
                >
                  <div>
                    <p className="text-white font-semibold [font-family:'Inter',Helvetica]">
                      {item.name}
                    </p>
                    <p className="text-[#9ca3af] text-xs [font-family:'Inter',Helvetica]">
                      {item.symbol}
                    </p>
                  </div>
                  <div className="text-right text-white font-semibold [font-family:'Inter',Helvetica]">
                    {formattedPrice}
                  </div>
                  <div
                    className={`text-right text-sm font-medium [font-family:'Inter',Helvetica] ${
                      Number.isFinite(priceChange)
                        ? priceChange >= 0
                          ? "text-emerald-400"
                          : "text-rose-400"
                        : "text-[#9ca3af]"
                    }`}
                  >
                    {formattedChange}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
