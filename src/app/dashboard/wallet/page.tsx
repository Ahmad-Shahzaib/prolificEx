"use client";
import { useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchWallets } from "@/redux/thunk/walletThunk";
import { Button } from "@/components/common/Button";

const walletCoinMeta: Record<string, { name: string; iconBg: string; iconLetter: string; action: "deposit" | "withdraw" }> = {
  BTC: { name: "Bitcoin", iconBg: "bg-[#f7931a]", iconLetter: "₿", action: "deposit" },
  ETH: { name: "Ethereum", iconBg: "bg-[#627eea]", iconLetter: "Ξ", action: "deposit" },
  USDT: { name: "Tether", iconBg: "bg-[#26a17b]", iconLetter: "₮", action: "withdraw" },
  USDC: { name: "USD Coin", iconBg: "bg-[#2775ca]", iconLetter: "$", action: "withdraw" },
  SOL: { name: "Solana", iconBg: "bg-[#172852]", iconLetter: "🌙", action: "deposit" },
};

export default function WalletPage() {
  const dispatch = useAppDispatch();
  const { loading, error, wallets, totalPortfolioUsd } = useAppSelector((state) => state.wallet);
  const [fromAmount, setFromAmount] = useState("1");
  const [toAmount, setToAmount] = useState("");
  const [fromCurrency, setFromCurrency] = useState("ETH");
  const [toCurrency, setToCurrency] = useState("USD");

  const currencyOptions = ["USD", "BTC", "ETH", "USDT", "USDC"];
  const currencySymbols: Record<string, string> = {
    USD: "$",
    BTC: "₿",
    ETH: "Ξ",
    USDT: "₮",
    USDC: "$",
  };

  const currencyRates: Record<string, number> = {
    USD: 1,
    BTC: 60000,
    ETH: 2500,
    USDT: 1,
    USDC: 1,
  };

  const parseAmount = (value: string) => {
    const parsed = Number(value.replace(/[^0-9.-]/g, ""));
    return Number.isFinite(parsed) ? parsed : 0;
  };

  const formatAmount = (value: number, currency: string) => {
    const decimals = value < 1 ? 6 : 2;
    return `${currencySymbols[currency] ?? ""}${value.toLocaleString("en-US", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    })}`;
  };

  const convert = (amount: number, from: string, to: string) => {
    const fromRate = currencyRates[from] ?? 1;
    const toRate = currencyRates[to] ?? 1;
    return amount * (fromRate / toRate);
  };

  const conversionRateLabel = useMemo(() => {
    const rate = convert(1, fromCurrency, toCurrency);
    return `1 ${fromCurrency} = ${formatAmount(rate, toCurrency)}`;
  }, [fromCurrency, toCurrency]);

  useEffect(() => {
    dispatch(fetchWallets());
  }, [dispatch]);

  useEffect(() => {
    if (!fromAmount.trim()) {
      setToAmount("");
      return;
    }

    const amount = parseAmount(fromAmount);
    const convertedValue = convert(amount, fromCurrency, toCurrency);
    setToAmount(formatAmount(convertedValue, toCurrency));
  }, [fromAmount, fromCurrency, toCurrency]);

  const walletAssets = useMemo(
    () =>
      wallets.map((asset) => {
        const meta = walletCoinMeta[asset.coin] ?? {
          name: asset.coin,
          iconBg: "bg-slate-600",
          iconLetter: asset.coin.charAt(0),
          action: "deposit" as const,
        };

        return {
          ...asset,
          name: meta.name,
          ticker: asset.coin,
          iconBg: meta.iconBg,
          iconLetter: meta.iconLetter,
          available: asset.available_balance,
          inTrade: asset.locked_balance,
          total: asset.balance,
          action: meta.action,
        };
      }),
    [wallets]
  );

  const formattedTotalPortfolio = totalPortfolioUsd.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });

  return (
    <div
      className="min-h-screen w-full p-4 sm:p-6"
      style={{ background: "#0d0e17", fontFamily: "'Inter', sans-serif" }}
    >
      <h1 className="text-white text-2xl font-semibold mb-6">Wallet</h1>

      <div className="flex flex-col xl:flex-row gap-6">
        {/* Left Column - Portfolio + Assets */}
        <div className="flex-1 flex flex-col gap-5">
          {/* Portfolio Card */}
          <div
            className="rounded-2xl p-5 sm:p-6"
            style={{ background: "#161722", border: "1px solid rgba(255,255,255,0.06)" }}
          >
            <div className="flex items-start justify-between mb-1">
              <p className="text-gray-400 text-sm">Total Portfolio Value</p>
              
            </div>
            <p className="text-white text-3xl font-bold mb-2">
              {loading ? "Loading..." : formattedTotalPortfolio}
            </p>
            {error ? (
              <p className="text-sm text-red-400 mb-4">Unable to load wallet balances: {error}</p>
            ) : null}
            <div className="flex flex-wrap gap-3">
              <Button 
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-medium transition-all hover:opacity-90"
                style={{ background: "#7c3aed" }}
              >
                <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
                Deposit
              </Button>
              <Button
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-medium transition-all hover:opacity-90"
                style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.15)" }}
              >
                <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
                Withdraw
              </Button>
              <Button 
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-medium transition-all hover:opacity-90"
                style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.15)" }}
              >
                <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
                P2P Trade
              </Button>
            </div>
          </div>

          {/* Assets Table */}
          <div
            className="rounded-2xl overflow-hidden"
            style={{ background: "#161722", border: "1px solid rgba(255,255,255,0.06)" }}
          >
            {/* Table Header - Hidden on Mobile, Shown on Large Screens */}
            <div
              className="hidden md:grid px-6 py-3 text-xs text-gray-500 uppercase tracking-wide"
              style={{
                gridTemplateColumns: "2fr 1.2fr 1.2fr 1.2fr 1fr",
                borderBottom: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <span>Coin</span>
              <span>Available</span>
              <span>In Trade</span>
              <span>Total</span>
              <span>Actions</span>
            </div>

            {/* Assets Rows */}
            {loading ? (
              <div className="px-6 py-8 text-gray-400 text-sm">Loading wallets…</div>
            ) : error ? (
              <div className="px-6 py-8 text-red-400 text-sm">{error}</div>
            ) : walletAssets.length === 0 ? (
              <div className="px-6 py-8 text-gray-400 text-sm">No wallet records found.</div>
            ) : (
              walletAssets.map((asset) => (
                <div
                  key={asset.id}
                  className="border-b border-white/[0.04] last:border-none hover:bg-white/[0.02] transition-colors px-4 sm:px-6 py-5 md:py-4"
                >
                  {/* Mobile Card Layout */}
                  <div className="md:hidden flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-full ${asset.iconBg} flex items-center justify-center text-white text-base font-bold flex-shrink-0`}
                        >
                          {asset.iconLetter}
                        </div>
                        <div>
                          <p className="text-white font-medium">{asset.name}</p>
                          <p className="text-xs text-gray-500">{asset.ticker}</p>
                        </div>
                      </div>
                      <span className="text-right text-sm font-medium text-white">
                        {asset.total}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-400 text-xs">Available</p>
                        <p className="text-gray-300">{asset.available}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs">In Trade</p>
                        <p className="text-gray-300">{asset.inTrade}</p>
                      </div>
                    </div>

                    <div className="pt-2">
                      {asset.action === "deposit" ? (
                        <Button
                          className="w-full px-4 py-2.5 rounded-xl text-white text-sm font-medium transition-all hover:opacity-90"
                          style={{ background: "#7c3aed" }}
                        >
                          Deposit
                        </Button>
                      ) : (
                        <Button
                          className="w-full px-4 py-2.5 rounded-xl text-sm font-medium transition-all hover:bg-white/10"
                          style={{
                            background: "transparent",
                            border: "1px solid rgba(255,255,255,0.2)",
                            color: "#d1d5db",
                          }}
                        >
                          Withdraw
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Desktop Table Row */}
                  <div
                    className="hidden md:grid items-center"
                    style={{
                      gridTemplateColumns: "2fr 1.2fr 1.2fr 1.2fr 1fr",
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-full ${asset.iconBg} flex items-center justify-center text-white text-sm font-bold flex-shrink-0`}
                      >
                        {asset.iconLetter}
                      </div>
                      <span className="text-white text-sm font-medium">{asset.name}</span>
                    </div>

                    <span className="text-gray-300 text-sm">{asset.available}</span>
                    <span className="text-gray-300 text-sm">{asset.inTrade}</span>
                    <span className="text-gray-300 text-sm">{asset.total}</span>

                    {asset.action === "deposit" ? (
                      <Button
                        className="px-5 py-1.5 rounded-xl text-white text-xs font-medium transition-all hover:opacity-90 justify-self-end"
                        style={{ background: "#7c3aed" }}
                      >
                        Deposit
                      </Button>
                    ) : (
                      <Button
                        className="px-5 py-1.5 rounded-xl text-xs font-medium transition-all hover:bg-white/10 justify-self-end"
                        style={{
                          background: "transparent",
                          border: "1px solid rgba(255,255,255,0.2)",
                          color: "#d1d5db",
                        }}
                      >
                        Withdraw
                      </Button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column — Convert Panel */}
        <div
          className="w-full xl:w-72 rounded-2xl p-5 flex-shrink-0"
          style={{ background: "#161722", border: "1px solid rgba(255,255,255,0.06)" }}
        >
          <h2 className="text-white text-base font-semibold text-center mb-6">Convert</h2>

          {/* From Input */}
          <div
            className="flex items-center justify-between px-4 py-3.5 rounded-xl mb-3"
            style={{ background: "#0d0e17", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            <input
              type="text"
              value={fromAmount}
              onChange={(e) => setFromAmount(e.target.value)}
              className="bg-transparent text-white text-lg font-semibold w-full outline-none"
              placeholder="0"
            />
            <select
              value={fromCurrency}
              onChange={(e) => setFromCurrency(e.target.value)}
              className="ml-3 bg-transparent text-gray-300 text-sm font-medium outline-none appearance-none"
            >
              {currencyOptions.map((currency) => (
                <option key={currency} value={currency} className="bg-[#0d0e17] text-white">
                  {currency}
                </option>
              ))}
            </select>
          </div>

          {/* To Input */}
          <div
            className="flex items-center justify-between px-4 py-3.5 rounded-xl mb-2"
            style={{ background: "#0d0e17", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            <input
              type="text"
              value={toAmount}
              readOnly
              className="bg-transparent text-white text-lg font-semibold w-full outline-none"
              placeholder="0"
            />
            <select
              value={toCurrency}
              onChange={(e) => setToCurrency(e.target.value)}
              className="ml-3 bg-transparent text-gray-300 text-sm font-medium outline-none appearance-none"
            >
              {currencyOptions.map((currency) => (
                <option key={currency} value={currency} className="bg-[#0d0e17] text-white">
                  {currency}
                </option>
              ))}
            </select>
          </div>

          {/* Rate */}
          <p className="text-gray-500 text-xs mb-6 px-1">{conversionRateLabel}</p>

          {/* Convert Button */}
          <button
            className="w-full py-3.5 rounded-xl text-white text-sm font-semibold transition-all hover:opacity-90"
            style={{ background: "#7c3aed" }}
          >
            Convert
          </button>
        </div>
      </div>
    </div>
  );
}