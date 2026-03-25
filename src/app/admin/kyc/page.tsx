"use client";

import React, { useState } from "react";
import { User, X } from "lucide-react";

const kycList = [
  { id: 1, name: "TraderMax", email: "eleanor.pena...", date: "Apr 24, 2024", doc: "Passport", time: "10 min ago" },
  { id: 2, name: "TraderMax", email: "eleanor.pena...", date: "Apr 24, 2024", doc: "Passport", time: "10 min ago" },
  { id: 3, name: "TraderMax", email: "eleanor.pena...", date: "Apr 24, 2024", doc: "Passport", time: "10 min ago" },
  { id: 4, name: "TraderMax", email: "eleanor.pena...", date: "Apr 24, 2024", doc: "Passport", time: "10 min ago" },
];

export default function AdminKYCApprovalsPage() {
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [notes, setNotes] = useState("");

  const openModal = (user: any) => {
    setSelectedUser(user);
    setNotes("");
  };

  const closeModal = () => {
    setSelectedUser(null);
  };

  const handleApprove = () => {
    alert(`✅ KYC Approved for ${selectedUser?.name}`);
    closeModal();
  };

  const handleReject = () => {
    alert(`❌ KYC Rejected for ${selectedUser?.name}`);
    closeModal();
  };

  return (
    <div className="min-h-screen bg-[#121212] text-white p-4 sm:p-6 font-sans">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-semibold mb-6 sm:mb-8">KYC Approvals</h1>

        {/* Table */}
        <div className="bg-[#1a1c2e] rounded-3xl overflow-hidden border border-[#23263b]">
          {/* Table Header - Hidden on mobile, shown as cards on mobile */}
          <div className="hidden md:grid grid-cols-12 gap-4 px-6 lg:px-8 py-5 border-b border-[#23263b] text-sm text-gray-400 font-medium">
            <div className="col-span-3">Name</div>
            <div className="col-span-3">Email</div>
            <div className="col-span-2">Submission Date</div>
            <div className="col-span-2">Document Type</div>
            <div className="col-span-1">Time</div>
            <div className="col-span-1 text-right">Action</div>
          </div>

          {/* Table Rows */}
          <div className="divide-y divide-[#23263b]">
            {kycList.map((user) => (
              <div
                key={user.id}
                className="md:grid md:grid-cols-12 gap-4 px-6 lg:px-8 py-5 items-center hover:bg-[#222531] transition-colors flex flex-col md:flex-row gap-4 md:gap-0"
              >
                {/* Mobile Card Layout */}
                <div className="flex items-center gap-3 w-full md:col-span-3">
                  <div className="w-9 h-9 bg-[#2a2d3f] rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-gray-400" />
                  </div>
                  <div>
                    <span className="font-medium block">{user.name}</span>
                    <span className="text-sm text-gray-400 md:hidden">{user.email}</span>
                  </div>
                </div>

                {/* Email - Hidden on mobile (shown above) */}
                <div className="hidden md:block md:col-span-3 text-sm text-gray-400 truncate">
                  {user.email}
                </div>

                <div className="text-sm text-gray-400 md:col-span-2 w-full md:w-auto">
                  {user.date}
                </div>

                <div className="text-sm text-gray-400 md:col-span-2 w-full md:w-auto">
                  {user.doc}
                </div>

                <div className="text-sm text-gray-400 md:col-span-1 w-full md:w-auto">
                  {user.time}
                </div>

                <div className="md:col-span-1 text-right w-full md:w-auto mt-2 md:mt-0">
                  <button
                    onClick={() => openModal(user)}
                    className="text-blue-500 hover:text-blue-400 font-medium text-sm underline-offset-2 hover:underline w-full md:w-auto"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Professional Small Modal - Fully Responsive */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a1c2e] rounded-3xl w-full max-w-lg border border-[#23263b] shadow-2xl overflow-hidden">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#23263b]">
              <h2 className="text-lg font-semibold">Eleanor Pena's KYC Details</h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-white p-2 rounded-full hover:bg-[#222531] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                {/* Passport */}
                <div className="flex-1 bg-[#222531] p-3 rounded-2xl border border-[#2a2d3f]">
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/US_Passport_2021.jpg/800px-US_Passport_2021.jpg"
                    alt="Passport"
                    className="w-full rounded-xl shadow-md"
                  />
                </div>

                {/* User Photo */}
                <div className="flex-1 bg-[#222531] p-3 rounded-2xl border border-[#2a2d3f] overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600"
                    alt="Eleanor Pena"
                    className="w-full rounded-xl object-cover aspect-square"
                  />
                </div>
              </div>

              {/* Notes */}
              <div className="mb-8">
                <label className="text-sm text-gray-400 mb-2 block">Notes (Optional)</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Write any additional notes here..."
                  className="w-full h-28 bg-[#222531] border border-[#2a2d3f] rounded-2xl p-4 text-sm focus:outline-none focus:border-blue-600 resize-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleApprove}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 py-3.5 rounded-2xl font-semibold text-base transition-all active:scale-[0.98]"
                >
                  Approve
                </button>
                <button
                  onClick={handleReject}
                  className="flex-1 bg-red-600 hover:bg-red-700 py-3.5 rounded-2xl font-semibold text-base transition-all active:scale-[0.98]"
                >
                  Reject
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}