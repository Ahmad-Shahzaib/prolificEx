"use client";

import { useEffect } from "react";
import { Card, CardContent } from "@/components/common/Card";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchDashboardOverview } from "@/redux/thunk/dashboardOverviewThunk";

export function DashboardOverview() {
  const dispatch = useAppDispatch();
  const { loading, error, data } = useAppSelector((state) => state.dashboardOverview);

  useEffect(() => {
    dispatch(fetchDashboardOverview());
  }, [dispatch]);

  const wallet = data?.wallet;
  const orders = data?.orders;
  const kyc = data?.kyc;
  const markets = wallet?.markets ?? {};

  const formatStatusLabel = (status?: string, fallback = "Unknown") => {
    if (!status) return fallback;
    return status
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  return (
    <Card className="bg-[#1a1b23] border border-white/5 rounded-2xl">
      <CardContent className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
          <div>
            <p className="text-[#6b7280] text-sm [font-family:'Inter',Helvetica] font-medium">
              Dashboard overview
            </p>
            <h3 className="text-white text-xl font-bold [font-family:'Inter',Helvetica]">
              Combined wallet, orders & KYC
            </h3>
          </div>
          <div className="text-right text-sm text-[#9ca3af] [font-family:'Inter',Helvetica]">
            {loading ? <div className="h-4 w-20 rounded bg-white/10 animate-pulse" /> : error ? error : "Live data"}
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-pulse" aria-label="Loading dashboard overview">
            {[0, 1, 2].map((item) => (
              <div key={item} className="h-28 rounded-3xl bg-white/5 border border-white/5" />
            ))}
          </div>
        ) : error ? (
          <div className="text-rose-400 text-sm">{error}</div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="rounded-3xl bg-white/5 border border-white/5 p-4">
                <p className="text-[#9ca3af] text-xs uppercase tracking-[0.16em] [font-family:'Inter',Helvetica]">
                  Total portfolio
                </p>
                <p className="text-white text-2xl font-semibold mt-3 [font-family:'Inter',Helvetica]">
                  ${wallet?.total_portfolio_usd?.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) ?? "0.00"}
                </p>
              </div>

              <div className="rounded-3xl bg-white/5 border border-white/5 p-4">
                <p className="text-[#9ca3af] text-xs uppercase tracking-[0.16em] [font-family:'Inter',Helvetica]">
                  Total orders
                </p>
                <p className="text-white text-2xl font-semibold mt-3 [font-family:'Inter',Helvetica]">
                  {orders?.total ?? 0}
                </p>
                <p className="text-[#9ca3af] text-sm mt-2 [font-family:'Inter',Helvetica]">
                  Active {orders?.active ?? 0} • Completed {orders?.completed ?? 0}
                </p>
              </div>

              <div className="rounded-3xl bg-white/5 border border-white/5 p-4">
                <p className="text-[#9ca3af] text-xs uppercase tracking-[0.16em] [font-family:'Inter',Helvetica]">
                  KYC status
                </p>
                <p className="text-white text-2xl font-semibold mt-3 [font-family:'Inter',Helvetica]">
                  {formatStatusLabel(kyc?.status, "Unknown")}
                </p>
                <p className="text-[#9ca3af] text-sm mt-2 [font-family:'Inter',Helvetica]">
                  Level {kyc?.kyc_level ?? 0}
                </p>
              </div>
            </div>

            <div className="rounded-3xl bg-white/5 border border-white/5 p-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-[#9ca3af] text-sm [font-family:'Inter',Helvetica] font-medium">
                    Wallet balances
                  </p>
                  <p className="text-[#6b7280] text-xs [font-family:'Inter',Helvetica]">
                    Amount and USD value per token
                  </p>
                </div>
                <p className="text-[#6b7280] text-xs [font-family:'Inter',Helvetica]">
                  {wallet?.wallets?.length ?? 0} tokens
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {wallet?.wallets?.map((entry) => (
                  <div key={`${entry.coin}-${entry.network}`} className="rounded-3xl bg-[#11121b] p-3 grid grid-cols-1 sm:grid-cols-[1.25fr_1fr_1fr] gap-3 items-center">
                    <div>
                      <p className="text-white font-semibold [font-family:'Inter',Helvetica]">{entry.coin}</p>
                      <p className="text-[#9ca3af] text-xs [font-family:'Inter',Helvetica]">{entry.network}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-semibold [font-family:'Inter',Helvetica]">{Number(entry.balance).toFixed(8)}</p>
                      <p className="text-[#6b7280] text-xs [font-family:'Inter',Helvetica]">Available {Number(entry.available_balance).toFixed(8)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-semibold [font-family:'Inter',Helvetica]">${entry.usd_value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                      <p className="text-[#6b7280] text-xs [font-family:'Inter',Helvetica]">Price ${entry.price_usd.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl bg-white/5 border border-white/5 p-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-[#9ca3af] text-sm [font-family:'Inter',Helvetica] font-medium">
                    Market prices
                  </p>
                  <p className="text-[#6b7280] text-xs [font-family:'Inter',Helvetica]">
                    USD and 24h change per token
                  </p>
                </div>
                <p className="text-[#6b7280] text-xs [font-family:'Inter',Helvetica]">
                  {Object.keys(markets).length} coins
                </p>
              </div>

              <div className="space-y-3">
                {Object.entries(markets).map(([symbol, market]) => (
                  <div key={symbol} className="grid grid-cols-3 gap-4 items-center rounded-3xl bg-[#11121b] px-3 py-3">
                    <div>
                      <p className="text-white font-semibold [font-family:'Inter',Helvetica]">{market.name}</p>
                      <p className="text-[#9ca3af] text-xs [font-family:'Inter',Helvetica]">{market.symbol}</p>
                    </div>
                    <div className="text-right text-white font-semibold [font-family:'Inter',Helvetica]">
                      ${market.price_usd.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                    <div className={`text-right text-sm font-medium [font-family:'Inter',Helvetica] ${market.price_change_percentage_24h >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                      {market.price_change_percentage_24h >= 0 ? "+" : ""}
                      {market.price_change_percentage_24h.toFixed(2)}%
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl bg-white/5 border border-white/5 p-4">
              <p className="text-[#9ca3af] text-sm uppercase tracking-[0.16em] [font-family:'Inter',Helvetica] mb-3">
                KYC details
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-3xl bg-[#11121b] p-4">
                  <p className="text-[#6b7280] text-xs [font-family:'Inter',Helvetica]">Status</p>
                  <p className="text-white text-lg font-semibold mt-2 [font-family:'Inter',Helvetica]">{formatStatusLabel(kyc?.status, "Unknown")}</p>
                </div>
                <div className="rounded-3xl bg-[#11121b] p-4">
                  <p className="text-[#6b7280] text-xs [font-family:'Inter',Helvetica]">Level</p>
                  <p className="text-white text-lg font-semibold mt-2 [font-family:'Inter',Helvetica]">{kyc?.kyc_level ?? 0}</p>
                </div>
                <div className="rounded-3xl bg-[#11121b] p-4">
                  <p className="text-[#6b7280] text-xs [font-family:'Inter',Helvetica]">Submitted</p>
                  <p className="text-white text-lg font-semibold mt-2 [font-family:'Inter',Helvetica]">{kyc?.submitted_at ?? "N/A"}</p>
                </div>
                <div className="rounded-3xl bg-[#11121b] p-4">
                  <p className="text-[#6b7280] text-xs [font-family:'Inter',Helvetica]">Reviewed</p>
                  <p className="text-white text-lg font-semibold mt-2 [font-family:'Inter',Helvetica]">{kyc?.reviewed_at ?? "N/A"}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
