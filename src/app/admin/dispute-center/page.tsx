"use client";

import React, { useState } from "react";

const disputes = [
  { id: "87234", name: "TraderMax", email: "eleanor.pena...", amount: "0.75 BTC", usd: "-$47,512", date: "Apr 24, 2024", status: "Under Review" },
  { id: "87234", name: "TraderMax", email: "eleanor.pena...", amount: "0.75 BTC", usd: "-$47,512", date: "Apr 24, 2024", status: "Buyer Claim" },
  { id: "87234", name: "TraderMax", email: "eleanor.pena...", amount: "0.75 BTC", usd: "-$47,512", date: "Apr 24, 2024", status: "Seller Claim" },
  { id: "87234", name: "TraderMax", email: "eleanor.pena...", amount: "0.75 BTC", usd: "-$47,512", date: "Apr 24, 2024", status: "Under Review" },
];

const messages = [
  { text: "Thank you. Please enter the amount and date of the transaction (eg 100, December 21th).", time: "13:34" },
  { text: "Thank you. Please enter the amount and date of the transaction (eg 100, December 21th).", time: "13:34" },
  { text: "Thank you. Please enter the amount and date of the transaction (eg 100, December 21th).", time: "13:34" },
];

const statusStyle = (status: string) => {
  if (status === "Under Review") return { background: "rgba(234,179,8,0.13)", color: "#eab308", border: "1px solid rgba(234,179,8,0.18)" };
  if (status === "Buyer Claim") return { background: "rgba(59,130,246,0.13)", color: "#60a5fa", border: "1px solid rgba(59,130,246,0.18)" };
  if (status === "Seller Claim") return { background: "rgba(239,68,68,0.13)", color: "#f87171", border: "1px solid rgba(239,68,68,0.18)" };
  return {};
};

export default function AdminEscrowDisputesPage() {
  const [selected, setSelected] = useState(0);

  return (
    <div className="min-h-screen   text-white p-4 sm:p-7 font-sans">
      <div className="  mx-auto">
        {/* Heading */}
        <h1 className="text-2xl font-semibold mb-7 tracking-tight">
          Escrow Disputes
        </h1>

        {/* Table Card */}
        <div className="bg-[#181a27] rounded-2xl border border-[#22253a] overflow-hidden mb-6">
          {/* Table Header */}
          <div className="hidden md:grid grid-cols-5 gap-4 px-6 lg:px-7 py-4 border-b border-[#22253a] text-[#6b7280] text-sm font-medium">
            <div>Name</div>
            <div>Email</div>
            <div>Amount</div>
            <div>Date Raised</div>
            <div className="text-right">Action</div>
          </div>

          {/* Table Rows */}
          {disputes.map((d, i) => (
            <div
              key={i}
              onClick={() => setSelected(i)}
              className={`grid grid-cols-1 md:grid-cols-5 gap-4 px-6 lg:px-7 py-5 items-center border-b border-[#22253a] last:border-none hover:bg-[#1e2133] transition-colors cursor-pointer ${
                selected === i ? "bg-[#1e2133]" : ""
              }`}
            >
              {/* Name */}
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#23263a] flex items-center justify-center flex-shrink-0">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="8" r="4" fill="#6b7280"/>
                    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" fill="#6b7280"/>
                  </svg>
                </div>
                <span className="font-medium text-[15px]">{d.name}</span>
              </div>

              {/* Email */}
              <div className="text-sm text-[#9ca3af] truncate md:block">
                {d.email}
              </div>

              {/* Amount */}
              <div className="text-sm font-medium text-[#fb923c]">
                {d.amount}{" "}
                <span className="text-[#fb923c] font-normal">({d.usd})</span>
              </div>

              {/* Date */}
              <div className="text-sm text-[#9ca3af]">{d.date}</div>

              {/* Status */}
              <div className="text-right">
                <span
                  style={statusStyle(d.status)}
                  className="inline-block px-4 py-1 rounded-full text-xs font-medium"
                >
                  {d.status}
                </span>
              </div>

              {/* Mobile-only labels */}
              <div className="md:hidden text-xs text-gray-500 mt-1">
                {d.date} • {d.amount}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Two Cards - Stack on mobile */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Chat Card */}
          <div className="bg-[#181a27] rounded-2xl border border-[#22253a] p-6">
            <h2 className="text-lg font-semibold mb-5">
              Escrow Dispute #{disputes[selected].id}
            </h2>

            <div className="space-y-6 pr-2 max-h-[420px] overflow-y-auto custom-scroll">
              {messages.map((msg, i) => (
                <div key={i} className="flex gap-3">
                  <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-[#2a2d3f] flex-shrink-0">
                    <img
                      src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80"
                      alt="avatar"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="bg-[#1e2133] rounded-2xl px-4 py-3 text-sm leading-relaxed text-[#d1d5db]">
                      {msg.text}
                    </div>
                    <div className="text-xs text-[#6b7280] mt-2 pl-1">
                      {msg.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Proof Card */}
          <div className="bg-[#181a27] rounded-2xl border border-[#22253a] p-6">
            <h2 className="text-lg font-semibold mb-5">Payment Proof</h2>

            {/* Wire Transfer Receipt */}
            <div className="bg-white rounded-xl overflow-hidden border border-[#e5e7eb] p-5 mb-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center gap-1">
                    <span className="font-black text-3xl text-[#003087] tracking-tighter">citi</span>
                  </div>
                  <div className="text-[10px] text-gray-500 mt-1 tracking-widest">WIRE TRANSFER</div>
                  <div className="text-xs text-gray-400 mt-1">Ref: 047••••0209 2024</div>
                </div>

                <div className="text-right">
                  <div className="text-2xl font-bold text-black tracking-tight">$47,500.00</div>
                  <div className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-800 text-xs font-semibold px-3 py-1 rounded-full mt-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                    Completed
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4 space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">From account</span>
                  <span className="font-medium text-gray-800">•••• •••• 4821</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">To account</span>
                  <span className="font-medium text-gray-800">Blockchain Investments Inc.</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Transaction ID</span>
                  <span className="font-medium text-gray-800">TXN••••••7743</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3.5 rounded-2xl transition-all active:scale-[0.98]">
                Release to Buyer
              </button>
              <button className="bg-amber-600 hover:bg-amber-700 text-white font-semibold py-3.5 rounded-2xl transition-all active:scale-[0.98]">
                Return to Seller
              </button>
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 rounded-2xl transition-all active:scale-[0.98]">
                Request More Evidence
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Scrollbar for Chat */}
      <style jsx>{`
        .custom-scroll::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scroll::-webkit-scrollbar-thumb {
          background-color: #3b82f6;
          border-radius: 20px;
        }
      `}</style>
    </div>
  );
}