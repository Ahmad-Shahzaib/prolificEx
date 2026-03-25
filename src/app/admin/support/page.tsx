"use client";

import React, { useState } from "react";
import { User, MessageCircle, Clock, Search, Filter, AlertCircle } from "lucide-react";

const tickets = [
  {
    id: "#SUP-4821",
    user: "TraderMax",
    email: "eleanor.pena@example.com",
    subject: "Unable to withdraw my funds - Transaction stuck",
    priority: "High",
    status: "Open",
    time: "2 hours ago",
  },
  {
    id: "#SUP-4820",
    user: "CryptoKing",
    email: "michael.smith@example.com",
    subject: "KYC verification is taking too long",
    priority: "Medium",
    status: "In Progress",
    time: "5 hours ago",
  },
  {
    id: "#SUP-4819",
    user: "TraderMax",
    email: "eleanor.pena@example.com",
    subject: "Wrong amount credited in my escrow account",
    priority: "High",
    status: "Open",
    time: "Yesterday",
  },
  {
    id: "#SUP-4818",
    user: "SarahTrade",
    email: "sarah.johnson@example.com",
    subject: "Account suspension - Need urgent help",
    priority: "Low",
    status: "Closed",
    time: "2 days ago",
  },
];

export default function AdminSupportPage() {
  const [selectedTicket, setSelectedTicket] = useState(tickets[0]);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredTickets = tickets.filter(ticket =>
    ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ticket.user.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0f1017] text-white p-6 font-sans">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-semibold mb-8">Support & Help</h1>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          {/* Left Side - Tickets List */}
          <div className="xl:col-span-7 bg-[#1a1c2e] rounded-3xl overflow-hidden border border-[#23263b]">
            {/* Search & Filter Bar */}
            <div className="px-8 py-5 border-b border-[#23263b] flex items-center gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search tickets by user or subject..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-[#222531] border border-[#2a2d3f] rounded-2xl pl-12 py-3 text-sm focus:outline-none focus:border-blue-600 placeholder-gray-500"
                />
              </div>
              <button className="flex items-center gap-2 bg-[#222531] hover:bg-[#2a2d3f] border border-[#23263b] px-5 py-3 rounded-2xl text-sm">
                <Filter className="w-4 h-4" />
                Filter
              </button>
            </div>

            {/* Tickets Table */}
            <div className="grid grid-cols-12 px-8 py-5 border-b border-[#23263b] text-sm text-gray-400 font-medium">
              <div className="col-span-3">User</div>
              <div className="col-span-5">Subject</div>
              <div className="col-span-2">Priority</div>
              <div className="col-span-2 text-right">Status</div>
            </div>

            <div className="divide-y divide-[#23263b] max-h-[620px] overflow-y-auto custom-scroll">
              {filteredTickets.map((ticket, i) => (
                <div
                  key={i}
                  onClick={() => setSelectedTicket(ticket)}
                  className={`grid grid-cols-12 px-8 py-5 items-center hover:bg-[#222531] transition-colors cursor-pointer ${
                    selectedTicket.id === ticket.id ? "bg-[#222531]" : ""
                  }`}
                >
                  <div className="col-span-3 flex items-center gap-3">
                    <div className="w-9 h-9 bg-[#2a2d3f] rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-gray-400" />
                    </div>
                    <div>
                      <p className="font-medium">{ticket.user}</p>
                      <p className="text-xs text-gray-500 truncate">{ticket.email}</p>
                    </div>
                  </div>

                  <div className="col-span-5 text-sm text-gray-300 pr-4 line-clamp-2">
                    {ticket.subject}
                  </div>

                  <div className="col-span-2">
                    <span
                      className={`inline-block px-4 py-1 text-xs font-medium rounded-full ${
                        ticket.priority === "High"
                          ? "bg-red-500/10 text-red-400"
                          : ticket.priority === "Medium"
                          ? "bg-amber-500/10 text-amber-400"
                          : "bg-emerald-500/10 text-emerald-400"
                      }`}
                    >
                      {ticket.priority}
                    </span>
                  </div>

                  <div className="col-span-2 text-right">
                    <span
                      className={`inline-block px-4 py-1 text-xs font-medium rounded-full ${
                        ticket.status === "Open"
                          ? "bg-blue-500/10 text-blue-400"
                          : ticket.status === "In Progress"
                          ? "bg-purple-500/10 text-purple-400"
                          : "bg-gray-500/10 text-gray-400"
                      }`}
                    >
                      {ticket.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side - Ticket Details & Chat */}
          <div className="xl:col-span-5 space-y-6">
            <div className="bg-[#1a1c2e] rounded-3xl p-6 border border-[#23263b]">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-xl font-semibold">Ticket {selectedTicket.id}</h2>
                  <p className="text-gray-400 text-sm mt-1">{selectedTicket.time}</p>
                </div>
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-yellow-400" />
                </div>
              </div>

              <div className="mb-8">
                <p className="text-gray-400 text-sm mb-1">Subject</p>
                <p className="font-medium leading-relaxed">{selectedTicket.subject}</p>
              </div>

              <div className="grid grid-cols-2 gap-6 text-sm">
                <div>
                  <p className="text-gray-400">Priority</p>
                  <p className="font-semibold mt-1">{selectedTicket.priority}</p>
                </div>
                <div>
                  <p className="text-gray-400">Status</p>
                  <p className="font-semibold mt-1">{selectedTicket.status}</p>
                </div>
              </div>
            </div>

            {/* Conversation / Chat */}
            <div className="bg-[#1a1c2e] rounded-3xl p-6 border border-[#23263b] flex flex-col" style={{ height: "460px" }}>
              <div className="flex items-center gap-3 mb-6">
                <MessageCircle className="w-5 h-5 text-blue-500" />
                <h3 className="font-semibold">Conversation</h3>
              </div>

              <div className="flex-1 overflow-y-auto space-y-6 pr-2 custom-scroll">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-9 h-9 rounded-full overflow-hidden flex-shrink-0">
                      <img
                        src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80"
                        alt="user"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="bg-[#222531] rounded-2xl px-5 py-4 text-sm leading-relaxed">
                        Hi Admin, I deposited funds but they are not showing in my wallet. Please check urgently.
                      </div>
                      <p className="text-xs text-gray-500 mt-2 pl-1">14:28</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Reply Area */}
              <div className="mt-6 pt-5 border-t border-[#23263b]">
                <textarea
                  className="w-full bg-[#222531] border border-[#2a2d3f] rounded-2xl p-4 text-sm focus:outline-none focus:border-blue-600 resize-none h-28"
                  placeholder="Write your reply to the user..."
                />
                <button className="mt-4 w-full bg-blue-600 hover:bg-blue-700 py-3.5 rounded-2xl font-semibold transition-colors">
                  Send Reply
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Scrollbar */}
      <style jsx>{`
        .custom-scroll::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scroll::-webkit-scrollbar-thumb {
          background: #3b82f6;
          border-radius: 20px;
        }
      `}</style>
    </div>
  );
}