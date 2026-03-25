"use client";

import { useState } from "react";

const coins = [
  { name: "Ethereum", symbol: "ETH", color: "#627EEA", bg: "#627EEA22", letter: "E" },
  { name: "Bitcoin", symbol: "BTC", color: "#F7931A", bg: "#F7931A22", letter: "B" },
  { name: "Tether", symbol: "USDT", color: "#26A17B", bg: "#26A17B22", letter: "T" },
  { name: "Binance Coin", symbol: "BNB", color: "#F3BA2F", bg: "#F3BA2F22", letter: "B" },
];

type RowAction = "Approve" | "Reject";

interface Row {
  id: string;
  name: string;
  email: string;
  coin: (typeof coins)[number];
  amount: string;
  address: string;
  action: RowAction;
}

const rows: Row[] = [
  { id: "#1056", name: "TraderMax", email: "eleanor.pena...", coin: coins[0], amount: "0.5 BTC", address: "0x4A93...5B72", action: "Approve" },
  { id: "#1056", name: "TraderMax", email: "eleanor.pena...", coin: coins[1], amount: "0.5 BTC", address: "0x4A93...5B72", action: "Approve" },
  { id: "#1056", name: "TraderMax", email: "eleanor.pena...", coin: coins[2], amount: "0.5 BTC", address: "0x4A93...5B72", action: "Approve" },
  { id: "#1056", name: "TraderMax", email: "eleanor.pena...", coin: coins[3], amount: "0.5 BTC", address: "0x4A93...5B72", action: "Reject" },
  { id: "#1056", name: "TraderMax", email: "eleanor.pena...", coin: coins[0], amount: "0.5 BTC", address: "0x4A93...5B72", action: "Reject" },
  { id: "#1056", name: "TraderMax", email: "eleanor.pena...", coin: coins[0], amount: "0.5 BTC", address: "0x4A93...5B72", action: "Reject" },
  { id: "#1056", name: "TraderMax", email: "eleanor.pena...", coin: coins[0], amount: "0.5 BTC", address: "0x4A93...5B72", action: "Approve" },
  { id: "#1056", name: "TraderMax", email: "eleanor.pena...", coin: coins[0], amount: "0.5 BTC", address: "0x4A93...5B72", action: "Approve" },
  { id: "#1056", name: "TraderMax", email: "eleanor.pena...", coin: coins[0], amount: "0.5 BTC", address: "0x4A93...5B72", action: "Approve" },
  { id: "#1056", name: "TraderMax", email: "eleanor.pena...", coin: coins[0], amount: "0.5 BTC", address: "0x4A93...5B72", action: "Approve" },
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

export default function AdminWithdrawalMonitoringPage() {
  const [autoApproval, setAutoApproval] = useState(true);
  const [actions, setActions] = useState<RowAction[]>(rows.map((r) => r.action));
  const [search, setSearch] = useState("");

  const toggleAction = (i: number) => {
    setActions((prev) => {
      const next = [...prev];
      next[i] = next[i] === "Approve" ? "Reject" : "Approve";
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-[#10111a] text-white px-4 sm:px-6 py-6 sm:py-8 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-7">
          <h1 className="text-[22px] font-semibold tracking-tight">Withdrawals Approval</h1>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-300 font-medium">Auto-Approval Mode</span>
            <button
              onClick={() => setAutoApproval((v) => !v)}
              className={`relative w-12 h-6 rounded-full transition-colors duration-200 focus:outline-none ${
                autoApproval ? "bg-blue-500" : "bg-[#2a2d3f]"
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200 ${
                  autoApproval ? "translate-x-6" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-[#181a27] rounded-2xl border border-[#22253a] overflow-hidden">

          {/* Search + Filters */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 px-5 py-4 border-b border-[#22253a]">
            <div className="flex-1 flex items-center gap-2 bg-[#0f1017] rounded-xl px-4 py-2.5 border border-[#22253a]">
              <svg className="w-4 h-4 text-gray-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <circle cx="11" cy="11" r="8" strokeWidth="2"/>
                <path d="M21 21l-4.35-4.35" strokeWidth="2" strokeLinecap="round"/>
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
                <svg className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/>
                </svg>
              </button>

              <button className="flex items-center gap-1.5 bg-[#1e2133] border border-[#2a2d45] rounded-xl px-4 py-2.5 text-sm text-gray-300 hover:bg-[#252840] transition-colors whitespace-nowrap">
                Coin
                <svg className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/>
                </svg>
              </button>

              <button className="flex items-center gap-1.5 bg-[#1e2133] border border-[#2a2d45] rounded-xl px-4 py-2.5 text-sm text-gray-300 hover:bg-[#252840] transition-colors whitespace-nowrap">
                <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4h18M7 8h10M10 12h4"/>
                </svg>
                Filter
                <svg className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/>
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
            <span>Destination Address</span>
            <span className="text-right">Action</span>
          </div>

          {/* Table Rows */}
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
                    <span className="text-xs text-gray-500 md:hidden block mt-0.5">{row.email}</span>
                  </div>
                </div>

                {/* Email - hidden on mobile */}
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

                {/* Address */}
                <div className="flex items-center gap-2 md:block">
                  <span className="text-xs text-gray-500 md:hidden">Destination Address</span>
                  <span className="text-sm text-gray-400 font-mono truncate">{row.address}</span>
                </div>

                {/* Action Button */}
                <div className="flex justify-start md:justify-end pt-2 md:pt-0">
                  <button
                    onClick={() => toggleAction(i)}
                    className={`px-6 py-2 rounded-lg text-xs font-semibold transition-all w-full md:w-auto ${
                      actions[i] === "Approve"
                        ? "bg-emerald-500 hover:bg-emerald-600 text-white"
                        : "bg-red-500 hover:bg-red-600 text-white"
                    }`}
                  >
                    {actions[i]}
                  </button>
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
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/>
              </svg>
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#181a27] border border-[#22253a] text-gray-400 hover:bg-[#1e2133] transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}