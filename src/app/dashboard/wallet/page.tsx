"use client";
import { useState } from "react";
import { PageShell } from "@/components/dashboard/PageShell";
import { Button } from "@/components/common/Button";

const walletAssets = [
  {
    name: "Ethereum",
    ticker: "ETH",
    iconBg: "bg-[#627eea]",
    iconLetter: "Ξ",
    available: "0.45 BTC",
    inTrade: "0.02 BTC",
    total: "0.47 BTC",
    action: "deposit",
  },
  {
    name: "Bitcoin",
    ticker: "BTC",
    iconBg: "bg-[#f7931a]",
    iconLetter: "₿",
    available: "0.45 BTC",
    inTrade: "0.02 BTC",
    total: "0.47 BTC",
    action: "deposit",
  },
  {
    name: "LUNA",
    ticker: "LUNA",
    iconBg: "bg-[#172852]",
    iconLetter: "🌙",
    available: "0.45 BTC",
    inTrade: "0.02 BTC",
    total: "0.47 BTC",
    action: "deposit",
  },
  {
    name: "Tether",
    ticker: "USDT",
    iconBg: "bg-[#26a17b]",
    iconLetter: "₮",
    available: "0.45 BTC",
    inTrade: "0.02 BTC",
    total: "0.47 BTC",
    action: "withdraw",
  },
  {
    name: "Binance Coin",
    ticker: "BNB",
    iconBg: "bg-[#f3ba2f]",
    iconLetter: "B",
    available: "0.45 BTC",
    inTrade: "0.02 BTC",
    total: "0.47 BTC",
    action: "withdraw",
  },
  {
    name: "USD Coin",
    ticker: "USDC",
    iconBg: "bg-[#2775ca]",
    iconLetter: "$",
    available: "0.45 BTC",
    inTrade: "0.02 BTC",
    total: "0.47 BTC",
    action: "withdraw",
  },
];

export default function WalletPage() {
  const [fromAmount, setFromAmount] = useState("89");
  const [toAmount, setToAmount] = useState("$120.000");
  const [fromCurrency, setFromCurrency] = useState("ETH");
  const [toCurrency, setToCurrency] = useState("USD");

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
              <Button className="text-gray-400 text-xs hover:text-white transition-colors">
                View More
              </Button>
            </div>
            <p className="text-white text-3xl font-bold mb-6">$405,021.00</p>

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
            {walletAssets.map((asset, i) => (
              <div
                key={asset.ticker}
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
            ))}
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
            <div className="flex items-center gap-1 ml-3 flex-shrink-0">
              <span className="text-gray-300 text-sm font-medium">{fromCurrency}</span>
              <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} className="text-gray-400">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {/* To Input */}
          <div
            className="flex items-center justify-between px-4 py-3.5 rounded-xl mb-2"
            style={{ background: "#0d0e17", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            <input
              type="text"
              value={toAmount}
              onChange={(e) => setToAmount(e.target.value)}
              className="bg-transparent text-white text-lg font-semibold w-full outline-none"
              placeholder="0"
            />
            <div className="flex items-center gap-1 ml-3 flex-shrink-0">
              <span className="text-gray-300 text-sm font-medium">{toCurrency}</span>
              <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} className="text-gray-400">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {/* Rate */}
          <p className="text-gray-500 text-xs mb-6 px-1">1 ETH = 2500 USD</p>

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