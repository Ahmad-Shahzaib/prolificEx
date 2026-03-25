"use client";

import { useState } from "react";

const coins = [
  { name: "Ethereum",     color: "#627EEA", bg: "#627EEA22", letter: "E" },
  { name: "Bitcoin",      color: "#F7931A", bg: "#F7931A22", letter: "B" },
  { name: "Tether",       color: "#26A17B", bg: "#26A17B22", letter: "T" },
  { name: "Binance Coin", color: "#F3BA2F", bg: "#F3BA2F22", letter: "B" },
];

type Status = "Complete" | "Pending";

interface Row {
  id: string;
  name: string;
  email: string;
  coin: (typeof coins)[number];
  amount: string;
  txHash: string;
  status: Status;
}

const rows: Row[] = [
  { id: "#1056", name: "TraderMax", email: "eleanor.pena...", coin: coins[0], amount: "0.5 BTC", txHash: "d3f7b6d1bce2...", status: "Complete" },
  { id: "#1056", name: "TraderMax", email: "eleanor.pena...", coin: coins[1], amount: "0.5 BTC", txHash: "d3f7b6d1bce2...", status: "Pending"  },
  { id: "#1056", name: "TraderMax", email: "eleanor.pena...", coin: coins[2], amount: "0.5 BTC", txHash: "d3f7b6d1bce2...", status: "Complete" },
  { id: "#1056", name: "TraderMax", email: "eleanor.pena...", coin: coins[3], amount: "0.5 BTC", txHash: "d3f7b6d1bce2...", status: "Pending"  },
  { id: "#1056", name: "TraderMax", email: "eleanor.pena...", coin: coins[0], amount: "0.5 BTC", txHash: "d3f7b6d1bce2...", status: "Pending"  },
  { id: "#1056", name: "TraderMax", email: "eleanor.pena...", coin: coins[0], amount: "0.5 BTC", txHash: "d3f7b6d1bce2...", status: "Complete" },
  { id: "#1056", name: "TraderMax", email: "eleanor.pena...", coin: coins[0], amount: "0.5 BTC", txHash: "d3f7b6d1bce2...", status: "Complete" },
  { id: "#1056", name: "TraderMax", email: "eleanor.pena...", coin: coins[0], amount: "0.5 BTC", txHash: "d3f7b6d1bce2...", status: "Complete" },
  { id: "#1056", name: "TraderMax", email: "eleanor.pena...", coin: coins[0], amount: "0.5 BTC", txHash: "d3f7b6d1bce2...", status: "Complete" },
  { id: "#1056", name: "TraderMax", email: "eleanor.pena...", coin: coins[0], amount: "0.5 BTC", txHash: "d3f7b6d1bce2...", status: "Complete" },
];

function CoinIcon({ coin }: { coin: (typeof coins)[number] }) {
  return (
    <span
      className="inline-flex items-center justify-center w-6 h-6 rounded-full text-[11px] font-bold mr-2 flex-shrink-0"
      style={{ background: coin.bg, color: coin.color, border: `1.5px solid ${coin.color}44` }}
    >
      {coin.letter}
    </span>
  );
}

export default function AdminDepositMonitoringPage() {
  const [search, setSearch] = useState("");

  return (
    <div className="min-h-screen bg-[#10111a] text-white py-6 sm:py-8 px-4 sm:px-6 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <h1 className="text-[22px] font-semibold tracking-tight mb-7">Deposits Monitoring</h1>

        {/* Main Card */}
        <div className="bg-[#181a27] rounded-2xl border border-[#22253a] overflow-hidden">

          {/* Search + Filters */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 px-5 py-4 border-b border-[#22253a]">
            <div className="flex-1 flex items-center gap-2 bg-[#0f1017] rounded-xl px-4 py-2.5 border border-[#22253a]">
              <svg className="w-4 h-4 text-gray-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35" strokeLinecap="round"/>
              </svg>
              <input
                type="text"
                placeholder="Search users or transactions..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-transparent text-sm text-gray-300 placeholder-gray-600 outline-none w-full"
              />
            </div>

            <div className="flex flex-wrap gap-3">
              <button className="flex items-center gap-1.5 bg-[#1e2133] border border-[#2a2d45] rounded-xl px-4 py-2.5 text-sm text-gray-300 hover:bg-[#252840] transition-colors whitespace-nowrap">
                Date
                <svg className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/>
                </svg>
              </button>

              <button className="flex items-center gap-1.5 bg-[#1e2133] border border-[#2a2d45] rounded-xl px-4 py-2.5 text-sm text-gray-300 hover:bg-[#252840] transition-colors whitespace-nowrap">
                Coin
                <svg className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/>
                </svg>
              </button>

              <button className="flex items-center gap-1.5 bg-[#1e2133] border border-[#2a2d45] rounded-xl px-4 py-2.5 text-sm text-gray-300 hover:bg-[#252840] transition-colors whitespace-nowrap">
                <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h18M7 8h10M10 12h4"/>
                </svg>
                Filter
                <svg className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/>
                </svg>
              </button>
            </div>
          </div>

          {/* Table Header - Hidden on mobile */}
          <div className="hidden md:grid grid-cols-[60px_130px_170px_150px_100px_1fr_110px] px-5 py-3 text-xs text-gray-500 font-medium border-b border-[#22253a]">
            <span>ID</span>
            <span>Name</span>
            <span>Email</span>
            <span>Coin</span>
            <span>Amount</span>
            <span>TX Hash</span>
            <span className="text-right">Status</span>
          </div>

          {/* Rows */}
          <div className="divide-y divide-[#22253a]">
            {rows.map((row, i) => (
              <div
                key={i}
                className="grid grid-cols-1 md:grid-cols-[60px_130px_170px_150px_100px_1fr_110px] gap-x-4 gap-y-3 px-5 py-5 md:py-3.5 items-start md:items-center hover:bg-[#1e2133] transition-colors"
              >
                {/* ID */}
                <div className="flex items-center gap-2 md:block">
                  <span className="text-xs text-gray-500 md:hidden">ID</span>
                  <span className="text-sm text-gray-400">{row.id}</span>
                </div>

                {/* Name */}
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#23263a] flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
                    </svg>
                  </div>
                  <div>
                    <span className="text-sm font-medium block md:inline">{row.name}</span>
                    <span className="text-xs text-gray-500 md:hidden">{row.email}</span>
                  </div>
                </div>

                {/* Email - hidden on mobile (shown under name) */}
                <span className="hidden md:block text-sm text-gray-400 truncate">{row.email}</span>

                {/* Coin */}
                <div className="flex items-center">
                  <CoinIcon coin={row.coin} />
                  <span className="text-sm font-medium">{row.coin.name}</span>
                </div>

                {/* Amount */}
                <div className="flex items-center gap-2 md:block">
                  <span className="text-xs text-gray-500 md:hidden">Amount</span>
                  <span className="text-sm text-gray-300">{row.amount}</span>
                </div>

                {/* TX Hash */}
                <div className="flex items-center gap-2 md:block">
                  <span className="text-xs text-gray-500 md:hidden">TX Hash</span>
                  <span className="text-sm text-gray-400 font-mono truncate">{row.txHash}</span>
                </div>

                {/* Status */}
                <div className="flex justify-start md:justify-end">
                  <span
                    className={`px-4 py-1 rounded-lg text-xs font-semibold ${
                      row.status === "Complete"
                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                        : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                    }`}
                  >
                    {row.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between mt-6 gap-4 text-sm">
          <span className="text-gray-500">Showing 1–09 of 78</span>
          <div className="flex items-center gap-2">
            <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#181a27] border border-[#22253a] text-gray-400 hover:bg-[#1e2133] transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/>
              </svg>
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#181a27] border border-[#22253a] text-gray-400 hover:bg-[#1e2133] transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}