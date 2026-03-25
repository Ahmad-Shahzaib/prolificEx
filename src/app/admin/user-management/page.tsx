"use client";

import React from "react";
import { Search, Filter } from "lucide-react";

const users = [
  { id: "#1056", name: "TraderMax", email: "eleanor.pena@example.com", kyc: "Verified", tradeCount: 320, balance: "$15,392.23", status: "Active" },
  { id: "#1056", name: "TraderMax", email: "eleanor.pena@example.com", kyc: "Unverified", tradeCount: 320, balance: "$15,392.23", status: "Banned" },
  { id: "#1056", name: "TraderMax", email: "eleanor.pena@example.com", kyc: "Unverified", tradeCount: 320, balance: "$15,392.23", status: "Suspended" },
  { id: "#1056", name: "TraderMax", email: "eleanor.pena@example.com", kyc: "Unverified", tradeCount: 320, balance: "$15,392.23", status: "Suspended" },
  { id: "#1056", name: "TraderMax", email: "eleanor.pena@example.com", kyc: "Verified", tradeCount: 320, balance: "$15,392.23", status: "Active" },
  { id: "#1056", name: "TraderMax", email: "eleanor.pena@example.com", kyc: "Verified", tradeCount: 320, balance: "$15,392.23", status: "Active" },
  { id: "#1056", name: "TraderMax", email: "eleanor.pena@example.com", kyc: "Verified", tradeCount: 320, balance: "$15,392.23", status: "Active" },
  { id: "#1056", name: "TraderMax", email: "eleanor.pena@example.com", kyc: "Verified", tradeCount: 320, balance: "$15,392.23", status: "Active" },
  { id: "#1056", name: "TraderMax", email: "eleanor.pena@example.com", kyc: "Verified", tradeCount: 320, balance: "$15,392.23", status: "Active" },
];

export default function AdminUserManagementPage() {
  return (
    <div className="min-h-screen bg-[#121212] text-white p-4 sm:p-6 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <h1 className="text-2xl font-semibold mb-6">User Management</h1>

        {/* Search + Filter Bar */}
        <div className="bg-[#1a1c2e] rounded-2xl p-4 flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between mb-6 border border-[#23263b]">
          <div className="flex-1 relative max-w-md">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              <Search className="w-5 h-5" />
            </div>
            <input
              type="text"
              placeholder="search by name, email, phone"
              className="w-full bg-[#222531] border border-[#23263b] rounded-xl pl-11 py-3 text-sm focus:outline-none focus:border-blue-600 placeholder-gray-500"
            />
          </div>

          <button className="flex items-center gap-2 bg-[#222531] hover:bg-[#2a2d3f] border border-[#23263b] px-5 py-3 rounded-xl text-sm font-medium transition-colors whitespace-nowrap">
            <Filter className="w-4 h-4" />
            Filter
          </button>
        </div>

        {/* Table Container */}
        <div className="bg-[#1a1c2e] rounded-3xl overflow-hidden border border-[#23263b]">
          {/* Table Header - Hidden on mobile */}
          <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 border-b border-[#23263b] text-sm text-gray-400 font-medium">
            <div className="col-span-1">ID</div>
            <div className="col-span-2">Name</div>
            <div className="col-span-3">Email</div>
            <div className="col-span-2">KYC Status</div>
            <div className="col-span-1 text-center">Trade Count</div>
            <div className="col-span-1 text-right">Balance</div>
            <div className="col-span-1 text-center">Status</div>
            <div className="col-span-1 text-center">Action</div>
          </div>

          {/* Table Rows */}
          <div className="divide-y divide-[#23263b]">
            {users.map((user, index) => (
              <div
                key={index}
                className="grid grid-cols-1 md:grid-cols-12 gap-4 px-6 py-5 hover:bg-[#222531] transition-colors items-start md:items-center"
              >
                {/* Mobile Layout */}
                <div className="flex justify-between items-start md:hidden mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[#2a2d3f] rounded-full flex items-center justify-center text-gray-400">
                      👤
                    </div>
                    <div>
                      <div className="font-medium">{user.name}</div>
                      <div className="text-xs text-gray-500">{user.id}</div>
                    </div>
                  </div>
                  <div>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                        user.kyc === "Verified"
                          ? "bg-emerald-500/10 text-emerald-400"
                          : "bg-amber-500/10 text-amber-400"
                      }`}
                    >
                      {user.kyc}
                    </span>
                  </div>
                </div>

                {/* Desktop + Mobile shared fields */}
                <div className="hidden md:block md:col-span-1 text-sm font-medium text-gray-300">
                  {user.id}
                </div>

                <div className="hidden md:flex md:col-span-2 items-center gap-3">
                  <div className="w-8 h-8 bg-[#2a2d3f] rounded-full flex items-center justify-center text-gray-400">
                    👤
                  </div>
                  <span className="font-medium">{user.name}</span>
                </div>

                <div className="col-span-1 md:col-span-3 text-sm text-gray-400 truncate">
                  {user.email}
                </div>

                <div className="hidden md:block md:col-span-2">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                      user.kyc === "Verified"
                        ? "bg-emerald-500/10 text-emerald-400"
                        : "bg-amber-500/10 text-amber-400"
                    }`}
                  >
                    {user.kyc}
                  </span>
                </div>

                <div className="text-sm font-medium md:col-span-1 md:text-center">
                  <span className="md:hidden text-gray-400 text-xs block">Trades:</span>
                  {user.tradeCount}
                </div>

                <div className="text-right font-medium text-emerald-400 md:col-span-1">
                  <span className="md:hidden text-gray-400 text-xs block">Balance:</span>
                  {user.balance}
                </div>

                <div className="md:col-span-1 flex justify-start md:justify-center">
                  <span
                    className={`px-4 py-1 rounded-full text-xs font-medium ${
                      user.status === "Active"
                        ? "bg-emerald-500/10 text-emerald-400"
                        : user.status === "Banned"
                        ? "bg-red-500/10 text-red-400"
                        : "bg-yellow-500/10 text-yellow-400"
                    }`}
                  >
                    {user.status}
                  </span>
                </div>

                <div className="text-center md:col-span-1 mt-2 md:mt-0">
                  <button className="text-blue-500 hover:text-blue-400 font-medium text-sm transition-colors w-full md:w-auto">
                    View Profile
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t border-[#23263b]">
            <p className="text-sm text-gray-400">Showing 1-09 of 78</p>

            <div className="flex items-center gap-2">
              <button className="w-9 h-9 flex items-center justify-center rounded-xl border border-[#23263b] hover:bg-[#222531] transition-colors disabled:opacity-50">
                ←
              </button>
              <button className="w-9 h-9 flex items-center justify-center rounded-xl border border-[#23263b] hover:bg-[#222531] transition-colors disabled:opacity-50">
                →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}