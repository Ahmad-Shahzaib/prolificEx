"use client";

import React, { useState } from "react";
import { Search, Filter, TrendingUp, ArrowUp, ArrowDown } from "lucide-react";

const trades = [
  {
    id: "#TR-8942",
    user: "TraderMax",
    email: "eleanor.pena@example.com",
    pair: "BTC/USDT",
    type: "Buy",
    amount: "0.842 BTC",
    price: "$68,420.50",
    total: "$57,650.12",
    time: "2 min ago",
    status: "Completed",
  },
  {
    id: "#TR-8941",
    user: "TraderMax",
    email: "eleanor.pena@example.com",
    pair: "ETH/BTC",
    type: "Sell",
    amount: "12.45 ETH",
    price: "$0.0421",
    total: "0.524 BTC",
    time: "7 min ago",
    status: "Completed",
  },
  {
    id: "#TR-8940",
    user: "TraderMax",
    email: "eleanor.pena@example.com",
    pair: "BTC/USDT",
    type: "Buy",
    amount: "1.25 BTC",
    price: "$67,890.00",
    total: "$84,862.50",
    time: "14 min ago",
    status: "Pending",
  },
  {
    id: "#TR-8939",
    user: "TraderMax",
    email: "eleanor.pena@example.com",
    pair: "SOL/USDT",
    type: "Sell",
    amount: "245.8 SOL",
    price: "$142.30",
    total: "$34,977.34",
    time: "29 min ago",
    status: "Completed",
  },
  {
    id: "#TR-8938",
    user: "TraderMax",
    email: "eleanor.pena@example.com",
    pair: "BTC/USDT",
    type: "Buy",
    amount: "0.5 BTC",
    price: "$68,150.75",
    total: "$34,075.38",
    time: "41 min ago",
    status: "Completed",
  },
];

export default function AdminTradeMonitoringPage() {
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("All");

  const filteredTrades = trades.filter((trade) => {
    const matchesSearch = 
      trade.user.toLowerCase().includes(search.toLowerCase()) ||
      trade.pair.toLowerCase().includes(search.toLowerCase()) ||
      trade.id.toLowerCase().includes(search.toLowerCase());
    
    const matchesFilter = filterType === "All" || trade.type === filterType;
    
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-[#10111a] text-white p-4 sm:p-6 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Trade Monitoring</h1>
            <p className="text-gray-400 text-sm mt-1">Real-time overview of all user trades</p>
          </div>
          
          <div className="flex items-center gap-3 text-sm">
            <div className="flex items-center gap-2 bg-emerald-500/10 text-emerald-400 px-3 py-1.5 rounded-xl">
              <TrendingUp className="w-4 h-4" />
              <span>Live Market</span>
            </div>
          </div>
        </div>

        {/* Search + Filter Bar */}
        <div className="bg-[#181a27] rounded-2xl border border-[#22253a] p-4 mb-6 flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              <Search className="w-5 h-5" />
            </div>
            <input
              type="text"
              placeholder="Search by user, pair, or trade ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#0f1017] border border-[#22253a] rounded-xl pl-11 py-3 text-sm focus:outline-none focus:border-blue-600 placeholder-gray-500"
            />
          </div>

          <div className="flex gap-3">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-[#1e2133] border border-[#2a2d45] rounded-xl px-4 py-3 text-sm text-gray-300 focus:outline-none"
            >
              <option value="All">All Types</option>
              <option value="Buy">Buy Only</option>
              <option value="Sell">Sell Only</option>
            </select>

            <button className="flex items-center gap-2 bg-[#1e2133] border border-[#2a2d45] rounded-xl px-5 py-3 text-sm hover:bg-[#252840] transition-colors">
              <Filter className="w-4 h-4" />
              More Filters
            </button>
          </div>
        </div>

        {/* Trades Table */}
        <div className="bg-[#181a27] rounded-3xl border border-[#22253a] overflow-hidden">
          {/* Table Header */}
          <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 border-b border-[#22253a] text-xs text-gray-500 font-medium">
            <div className="col-span-2">Trade ID</div>
            <div className="col-span-3">User</div>
            <div className="col-span-2">Pair</div>
            <div className="col-span-1 text-center">Type</div>
            <div className="col-span-1 text-right">Amount</div>
            <div className="col-span-1 text-right">Price</div>
            <div className="col-span-1 text-right">Total</div>
            <div className="col-span-1 text-center">Status</div>
          </div>

          {/* Trade Rows */}
          <div className="divide-y divide-[#22253a]">
            {filteredTrades.map((trade, index) => (
              <div
                key={index}
                className="grid grid-cols-1 md:grid-cols-12 gap-4 px-6 py-5 md:py-4 hover:bg-[#1e2133] transition-colors items-start md:items-center"
              >
                {/* Mobile Header */}
                <div className="flex justify-between md:hidden mb-3">
                  <div className="font-mono text-sm text-gray-400">{trade.id}</div>
                  <div className="text-xs text-gray-500">{trade.time}</div>
                </div>

                {/* Trade ID */}
                <div className="md:col-span-2">
                  <div className="hidden md:block font-mono text-sm text-gray-400">{trade.id}</div>
                  <div className="md:hidden text-xs text-gray-500">Trade ID</div>
                </div>

                {/* User */}
                <div className="md:col-span-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#23263a] flex items-center justify-center text-gray-400 flex-shrink-0">
                      👤
                    </div>
                    <div>
                      <div className="font-medium text-sm">{trade.user}</div>
                      <div className="text-xs text-gray-500 truncate">{trade.email}</div>
                    </div>
                  </div>
                </div>

                {/* Pair */}
                <div className="md:col-span-2 text-sm font-medium">
                  <span className="md:hidden text-xs text-gray-500 block mb-1">Pair</span>
                  {trade.pair}
                </div>

                {/* Type */}
                <div className="md:col-span-1 flex justify-start md:justify-center">
                  <span
                    className={`inline-flex items-center gap-1.5 px-4 py-1 rounded-full text-xs font-semibold ${
                      trade.type === "Buy"
                        ? "bg-emerald-500/10 text-emerald-400"
                        : "bg-red-500/10 text-red-400"
                    }`}
                  >
                    {trade.type === "Buy" ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                    {trade.type}
                  </span>
                </div>

                {/* Amount */}
                <div className="md:col-span-1 text-right md:text-right">
                  <span className="md:hidden text-xs text-gray-500 block">Amount</span>
                  <span className="text-sm font-medium">{trade.amount}</span>
                </div>

                {/* Price */}
                <div className="md:col-span-1 text-right">
                  <span className="md:hidden text-xs text-gray-500 block">Price</span>
                  <span className="text-sm text-gray-300">{trade.price}</span>
                </div>

                {/* Total */}
                <div className="md:col-span-1 text-right font-medium">
                  <span className="md:hidden text-xs text-gray-500 block">Total</span>
                  {trade.total}
                </div>

                {/* Status + Time */}
                <div className="md:col-span-1 flex flex-col md:items-end gap-1">
                  <span
                    className={`inline-block px-3.5 py-1 rounded-full text-xs font-medium ${
                      trade.status === "Completed"
                        ? "bg-emerald-500/10 text-emerald-400"
                        : "bg-amber-500/10 text-amber-400"
                    }`}
                  >
                    {trade.status}
                  </span>
                  <span className="text-xs text-gray-500 md:hidden mt-1">{trade.time}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredTrades.length === 0 && (
            <div className="py-20 text-center text-gray-400">
              No trades found matching your search.
            </div>
          )}
        </div>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between mt-6 text-sm text-gray-400">
          <p>Showing 1–{filteredTrades.length} of {trades.length} trades</p>
          <div className="flex items-center gap-2 mt-4 sm:mt-0">
            <button className="w-9 h-9 flex items-center justify-center rounded-xl border border-[#22253a] hover:bg-[#1e2133] transition-colors">
              ←
            </button>
            <button className="w-9 h-9 flex items-center justify-center rounded-xl border border-[#22253a] hover:bg-[#1e2133] transition-colors">
              →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}