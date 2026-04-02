"use client";

import React, { useState, useEffect } from "react";
import { User, X } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchKycPending, KycPendingEntry } from "@/redux/thunk/adminKycPendingThunk";

export default function AdminKYCApprovalsPage() {
  const dispatch = useAppDispatch();
  const { entries: kycList, loading, error } = useAppSelector((state) => state.adminKycPending);

  const [selectedUser, setSelectedUser] = useState<KycPendingEntry | null>(null);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    dispatch(fetchKycPending({ per_page: 20 }));
  }, [dispatch]);

  const openModal = (user: any) => {
    setSelectedUser(user);
    setNotes("");
  };

  const closeModal = () => {
    setSelectedUser(null);
  };

  const handleApprove = () => {
    alert(`✅ KYC Approved for ${selectedUser?.user.full_name || selectedUser?.user.username}`);
    closeModal();
  };

  const handleReject = () => {
    alert(`❌ KYC Rejected for ${selectedUser?.user.full_name || selectedUser?.user.username}`);
    closeModal();
  };

  return (
    <div className="min-h-screen  text-white p-4 sm:p-6 font-sans">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-semibold mb-6 sm:mb-8">KYC Approvals</h1>

        {/* Table */}
        <div className="bg-[#1a1c2e] rounded-3xl overflow-hidden border border-[#23263b]">
          {/* Table Header - Hidden on mobile, shown as cards on mobile */}
          <div className="hidden md:grid grid-cols-12 gap-4 px-6 lg:px-8 py-5 border-b border-[#23263b] text-sm text-gray-400 font-medium">
            <div className="col-span-2">Name</div>
            <div className="col-span-2">Username</div>
            <div className="col-span-2">Email</div>
            <div className="col-span-1">Country</div>
            <div className="col-span-1">Role</div>
            <div className="col-span-1">KYC Level</div>
            <div className="col-span-1">Status</div>
            <div className="col-span-1">Doc Type</div>
            <div className="col-span-1 text-right">Action</div>
          </div>

          {/* Table Rows */}
          <div className="divide-y divide-[#23263b]">
            {loading ? (
              <div className="p-6 text-center text-gray-300">Loading pending KYC submissions...</div>
            ) : error ? (
              <div className="p-6 text-center text-red-400">{error}</div>
            ) : kycList.length === 0 ? (
              <div className="p-6 text-center text-gray-400">No pending KYC submissions found.</div>
            ) : (
              kycList.map((entry) => {
                const submittedDate = new Date(entry.submitted_at);
                const dateText = submittedDate.toLocaleDateString();
                const timeText = submittedDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

                return (
                  <div
                    key={entry.id}
                    className="md:grid md:grid-cols-12 gap-4 px-6 lg:px-8 py-5 items-center hover:bg-[#222531] transition-colors flex flex-col md:flex-row gap-4 md:gap-0"
                  >
                    {/* Mobile card content */}
                    <div className="flex items-center gap-3 w-full md:col-span-2">
                      <div className="w-9 h-9 bg-[#2a2d3f] rounded-full flex items-center justify-center flex-shrink-0">
                        <User className="w-5 h-5 text-gray-400" />
                      </div>
                      <div>
                        <span className="font-medium block">{entry.user.full_name || entry.user.username}</span>
                        <span className="text-sm text-gray-400 md:hidden">{entry.user.email}</span>
                        <div className="text-xs text-gray-400 mt-1 md:hidden">
                          <div>Username: {entry.user.username || "-"}</div>
                          <div>Country: {entry.user.country || "-"}</div>
                          <div>Role: {entry.user.role || "-"}</div>
                          <div>KYC: {entry.user.kyc_level ?? "-"}</div>
                          <div>Status: {entry.status || "-"}</div>
                          <div>Doc: {entry.document_type || "-"}</div>
                        </div>
                      </div>
                    </div>

                    <div className="hidden md:block md:col-span-2 text-sm text-gray-400 truncate">{entry.user.username || "-"}</div>
                    <div className="hidden md:block md:col-span-2 text-sm text-gray-400 truncate">{entry.user.email}</div>
                    <div className="hidden md:block md:col-span-1 text-sm text-gray-400 truncate">{entry.user.country || "-"}</div>
                    <div className="hidden md:block md:col-span-1 text-sm text-gray-400 truncate">{entry.user.role || "-"}</div>
                    <div className="hidden md:block md:col-span-1 text-sm text-gray-400 truncate">{entry.user.kyc_level ?? "-"}</div>
                    <div className="hidden md:block md:col-span-1 text-sm text-gray-400 truncate capitalize">{entry.status || "-"}</div>
                    <div className="hidden md:block md:col-span-1 text-sm text-gray-400 truncate">{entry.document_type || "-"}</div>

                    <div className="md:col-span-1 text-right w-full md:w-auto mt-2 md:mt-0">
                      <button
                        onClick={() => openModal(entry)}
                        className="text-blue-500 hover:text-blue-400 font-medium text-sm underline-offset-2 hover:underline w-full md:w-auto"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Professional Small Modal - Fully Responsive */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a1c2e] rounded-3xl w-full max-w-lg border border-[#23263b] shadow-2xl overflow-hidden">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#23263b]">
              <h2 className="text-lg font-semibold">{selectedUser.user.full_name || selectedUser.user.username}'s KYC Details</h2>
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
                {/* Document Preview (front/back/selfie) */}
                <div className="flex-1 bg-[#222531] p-3 rounded-2xl border border-[#2a2d3f]">
                  <img
                    src={selectedUser.document_front || "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/US_Passport_2021.jpg/800px-US_Passport_2021.jpg"}
                    alt={`${selectedUser.document_type || "Document"} front`}
                    className="w-full rounded-xl shadow-md object-cover"
                  />
                </div>

                {/* User Photo */}
                <div className="flex-1 bg-[#222531] p-3 rounded-2xl border border-[#2a2d3f] overflow-hidden">
                  <img
                    src={selectedUser.user.avatar || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600"}
                    alt={selectedUser.user.full_name || selectedUser.user.username || "User avatar"}
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