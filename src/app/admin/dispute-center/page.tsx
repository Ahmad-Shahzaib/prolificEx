"use client";

import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchAdminDisputes, resolveDispute, Dispute } from "@/redux/thunk/adminDisputesThunk";
import { selectDispute } from "@/redux/slices/adminDisputesSlice";

const statusStyle = (status: string) => {
  if (status === "disputed")
    return {
      background: "rgba(234,179,8,0.13)",
      color: "#eab308",
      border: "1px solid rgba(234,179,8,0.18)",
    };
  if (status === "Under Review")
    return {
      background: "rgba(234,179,8,0.13)",
      color: "#eab308",
      border: "1px solid rgba(234,179,8,0.18)",
    };
  if (status === "Buyer Claim")
    return {
      background: "rgba(59,130,246,0.13)",
      color: "#60a5fa",
      border: "1px solid rgba(59,130,246,0.18)",
    };
  if (status === "Seller Claim")
    return {
      background: "rgba(239,68,68,0.13)",
      color: "#f87171",
      border: "1px solid rgba(239,68,68,0.18)",
    };
  return {};
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export default function AdminEscrowDisputesPage() {
  const dispatch = useAppDispatch();
  const { disputes, selectedDispute, loading, error, resolveLoading } =
    useAppSelector((state) => state.adminDisputes);

  useEffect(() => {
    dispatch(fetchAdminDisputes());
  }, [dispatch]);

  const handleResolve = (target: "buyer" | "seller") => {
    if (!selectedDispute) return;
    const notes =
      target === "buyer"
        ? "Buyer provided payment proof. Releasing crypto to buyer."
        : "No payment proof found. Returning funds to seller.";
    dispatch(
      resolveDispute({
        disputeId: selectedDispute.id,
        target,
        notes,
      })
    );
  };

  return (
    <div className="min-h-screen text-white p-4 sm:p-7 font-sans">
      <div className="mx-auto">
        {/* Heading */}
        <h1 className="text-2xl font-semibold mb-7 tracking-tight">
          Escrow Disputes
        </h1>

        {/* Error Message */}
        {error && (
          <div className="bg-red-900/30 border border-red-700 text-red-300 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="text-center py-10">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
            <p className="mt-2 text-gray-400">Loading disputes...</p>
          </div>
        ) : (
          <>
            {/* Table Card */}
            <div className="bg-[#181a27] rounded-2xl border border-[#22253a] overflow-hidden mb-6">
              {/* Table Header */}
              <div className="hidden md:grid grid-cols-5 gap-4 px-6 lg:px-7 py-4 border-b border-[#22253a] text-[#6b7280] text-sm font-medium">
                <div>Name</div>
                <div>Email</div>
                <div>Amount</div>
                <div>Date Raised</div>
                <div className="text-right">Status</div>
              </div>

              {/* Table Rows */}
              {disputes.length === 0 ? (
                <div className="text-center py-10 text-gray-400">
                  No disputes found
                </div>
              ) : (
                disputes.map((d: Dispute) => (
                  <div
                    key={d.id}
                    onClick={() => dispatch(selectDispute(d))}
                    className={`grid grid-cols-1 md:grid-cols-5 gap-4 px-6 lg:px-7 py-5 items-center border-b border-[#22253a] last:border-none hover:bg-[#1e2133] transition-colors cursor-pointer ${
                      selectedDispute?.id === d.id ? "bg-[#1e2133]" : ""
                    }`}
                  >
                    {/* Name */}
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[#23263a] flex items-center justify-center flex-shrink-0">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                          <circle cx="12" cy="8" r="4" fill="#6b7280" />
                          <path
                            d="M4 20c0-4 3.6-7 8-7s8 3 8 7"
                            fill="#6b7280"
                          />
                        </svg>
                      </div>
                      <span className="font-medium text-[15px]">
                        {d.buyer.full_name}
                      </span>
                    </div>

                    {/* Email */}
                    <div className="text-sm text-[#9ca3af] truncate md:block">
                      {d.buyer.email}
                    </div>

                    {/* Amount */}
                    <div className="text-sm font-medium text-[#fb923c]">
                      {d.crypto_amount} {d.coin}{" "}
                      <span className="text-[#fb923c] font-normal">
                        (${d.fiat_amount})
                      </span>
                    </div>

                    {/* Date */}
                    <div className="text-sm text-[#9ca3af]">
                      {formatDate(d.created_at)}
                    </div>

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
                      {formatDate(d.created_at)} • {d.crypto_amount} {d.coin}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Bottom Two Cards - Stack on mobile */}
            {selectedDispute && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Dispute Details Card */}
                <div className="bg-[#181a27] rounded-2xl border border-[#22253a] p-6">
                  <h2 className="text-lg font-semibold mb-5">
                    Escrow Dispute #{selectedDispute.order_number}
                  </h2>

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-500 uppercase">
                          Order Number
                        </p>
                        <p className="text-sm text-white">
                          {selectedDispute.order_number}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase">
                          Payment Method
                        </p>
                        <p className="text-sm text-white">
                          {selectedDispute.payment_method}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase">
                          Crypto Amount
                        </p>
                        <p className="text-sm text-white">
                          {selectedDispute.crypto_amount} {selectedDispute.coin}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase">
                          Fiat Amount
                        </p>
                        <p className="text-sm text-white">
                          ${selectedDispute.fiat_amount}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase">
                          Buyer
                        </p>
                        <p className="text-sm text-white">
                          {selectedDispute.buyer.full_name}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase">
                          Seller
                        </p>
                        <p className="text-sm text-white">
                          {selectedDispute.seller.full_name}
                        </p>
                      </div>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500 uppercase mb-1">
                        Dispute Reason
                      </p>
                      <p className="text-sm text-gray-300">
                        {selectedDispute.dispute_reason}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Payment Proof Card */}
                <div className="bg-[#181a27] rounded-2xl border border-[#22253a] p-6">
                  <h2 className="text-lg font-semibold mb-5">
                    Payment Proof
                  </h2>

                  {selectedDispute.payment_proof && (
                    <div className="mb-6">
                      <img
                        src={`${process.env.NEXT_PUBLIC_API_BASE_URL || ""}/${selectedDispute.payment_proof}`}
                        alt="Payment Proof"
                        className="w-full rounded-xl border border-gray-700"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <button
                      onClick={() => handleResolve("buyer")}
                      disabled={resolveLoading}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3.5 rounded-2xl transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {resolveLoading ? "Processing..." : "Release to Buyer"}
                    </button>
                    <button
                      onClick={() => handleResolve("seller")}
                      disabled={resolveLoading}
                      className="bg-amber-600 hover:bg-amber-700 text-white font-semibold py-3.5 rounded-2xl transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {resolveLoading ? "Processing..." : "Return to Seller"}
                    </button>
                    <button
                      disabled={resolveLoading}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 rounded-2xl transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Request More Evidence
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
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
