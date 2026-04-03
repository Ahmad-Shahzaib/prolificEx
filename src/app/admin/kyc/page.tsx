"use client";

import React, { useState, useEffect } from "react";
import { User, X, FileText, CreditCard, Camera, ChevronLeft, ChevronRight } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchKycPending, approveKyc, rejectKyc, KycPendingEntry } from "@/redux/thunk/adminKycPendingThunk";

// Build the storage root URL from NEXT_PUBLIC_STORAGE_URL (preferred)
// or by extracting the origin from NEXT_PUBLIC_API_BASE_URL.
// e.g. "https://api.prolificex.softsuitetech.com/api/v1"
//   origin → "https://api.prolificex.softsuitetech.com"
//   STORAGE_ROOT → "https://api.prolificex.softsuitetech.com/storage"
const STORAGE_ROOT = (() => {
  if (process.env.NEXT_PUBLIC_STORAGE_URL) {
    return process.env.NEXT_PUBLIC_STORAGE_URL.replace(/\/$/, "");
  }
  const raw = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";
  try {
    const { origin } = new URL(raw);
    return `${origin}/storage`;
  } catch {
    try {
      const { origin } = new URL(`https://${raw}`);
      return `${origin}/storage`;
    } catch {
      return "/storage";
    }
  }
})();

function resolveImageUrl(path: string | null): string | null {
  if (!path) return null;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  // path is like: kyc/uuid/front/filename.jpg
  return `${STORAGE_ROOT}/${path}`;
}

function DocImage({
  src,
  alt,
  fallback,
}: {
  src: string | null;
  alt: string;
  fallback?: React.ReactNode;
}) {
  const resolved = resolveImageUrl(src);
  const [errored, setErrored] = useState(false);

  // Uncomment to debug: console.log("[DocImage]", alt, "→", resolved);
  if (!resolved || errored) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-[#181a2a] rounded-xl border border-dashed border-[#2a2d3f] text-gray-500 text-xs gap-2 min-h-[120px]">
        {fallback ?? <span>No image</span>}
      </div>
    );
  }

  return (
    <img
      src={resolved}
      alt={alt}
      className="w-full h-full object-cover rounded-xl"
      onError={() => setErrored(true)}
    />
  );
}

const DOC_TYPE_LABELS: Record<string, string> = {
  passport: "Passport",
  national_id: "National ID",
  drivers_license: "Driver's License",
};

export default function AdminKYCApprovalsPage() {
  const dispatch = useAppDispatch();
  const { entries: kycList, loading, error, actionLoading } = useAppSelector(
    (state) => state.adminKycPending
  );

  const [selectedUser, setSelectedUser] = useState<KycPendingEntry | null>(null);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    dispatch(fetchKycPending({ per_page: 20 }));
  }, [dispatch]);

  const openModal = (entry: KycPendingEntry) => {
    setSelectedUser(entry);
    setNotes("");
  };

  const closeModal = () => {
    setSelectedUser(null);
  };

  const handleApprove = async () => {
    if (!selectedUser) return;

    try {
      const resultAction = await dispatch(
        approveKyc({ id: selectedUser.id, notes })
      );

      if (approveKyc.fulfilled.match(resultAction)) {
        alert(`✅ KYC approved for ${selectedUser.user.full_name || selectedUser.user.username}`);
        setNotes("");
        closeModal();
      } else {
        alert(`❌ Failed to approve KYC: ${resultAction.payload || "Unknown error"}`);
      }
    } catch (err) {
      alert(`❌ Failed to approve KYC: ${err}`);
    }
  };

  const handleReject = async () => {
    if (!selectedUser) return;

    try {
      const resultAction = await dispatch(
        rejectKyc({ id: selectedUser.id, notes })
      );

      if (rejectKyc.fulfilled.match(resultAction)) {
        alert(`✅ KYC rejected for ${selectedUser.user.full_name || selectedUser.user.username}`);
        setNotes("");
        closeModal();
      } else {
        alert(`❌ Failed to reject KYC: ${resultAction.payload || "Unknown error"}`);
      }
    } catch (err) {
      alert(`❌ Failed to reject KYC: ${err}`);
    }
  };

  return (
    <div className="min-h-screen text-white p-4 sm:p-6 font-sans">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-semibold mb-6 sm:mb-8">KYC Approvals</h1>

        {/* Table */}
        <div className="bg-[#1a1c2e] rounded-3xl overflow-hidden border border-[#23263b]">
          {/* Table Header */}
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
              <div className="p-6 text-center text-gray-300">
                Loading pending KYC submissions...
              </div>
            ) : error ? (
              <div className="p-6 text-center text-red-400">{error}</div>
            ) : kycList.length === 0 ? (
              <div className="p-6 text-center text-gray-400">
                No pending KYC submissions found.
              </div>
            ) : (
              kycList.map((entry) => (
                <div
                  key={entry.id}
                  className="md:grid md:grid-cols-12 gap-4 px-6 lg:px-8 py-5 items-center hover:bg-[#222531] transition-colors flex flex-col md:flex-row gap-4 md:gap-0"
                >
                  <div className="flex items-center gap-3 w-full md:col-span-2">
                    <div className="w-9 h-9 bg-[#2a2d3f] rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="w-5 h-5 text-gray-400" />
                    </div>
                    <div>
                      <span className="font-medium block">
                        {entry.user.full_name || entry.user.username}
                      </span>
                      <span className="text-sm text-gray-400 md:hidden">
                        {entry.user.email}
                      </span>
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

                  <div className="hidden md:block md:col-span-2 text-sm text-gray-400 truncate">
                    {entry.user.username || "-"}
                  </div>
                  <div className="hidden md:block md:col-span-2 text-sm text-gray-400 truncate">
                    {entry.user.email}
                  </div>
                  <div className="hidden md:block md:col-span-1 text-sm text-gray-400 truncate">
                    {entry.user.country || "-"}
                  </div>
                  <div className="hidden md:block md:col-span-1 text-sm text-gray-400 truncate">
                    {entry.user.role || "-"}
                  </div>
                  <div className="hidden md:block md:col-span-1 text-sm text-gray-400 truncate">
                    {entry.user.kyc_level ?? "-"}
                  </div>
                  <div className="hidden md:block md:col-span-1 text-sm text-gray-400 truncate capitalize">
                    {entry.status || "-"}
                  </div>
                  <div className="hidden md:block md:col-span-1 text-sm text-gray-400 truncate capitalize">
                    {DOC_TYPE_LABELS[entry.document_type] ?? entry.document_type ?? "-"}
                  </div>

                  <div className="md:col-span-1 text-right w-full md:w-auto mt-2 md:mt-0">
                    <button
                      onClick={() => openModal(entry)}
                      className="text-blue-500 hover:text-blue-400 font-medium text-sm underline-offset-2 hover:underline w-full md:w-auto"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a1c2e] rounded-3xl w-full max-w-2xl border border-[#23263b] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">

            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#23263b] flex-shrink-0">
              <div>
                <h2 className="text-lg font-semibold">
                  {selectedUser.user.full_name || selectedUser.user.username}
                </h2>
                <p className="text-sm text-gray-400 mt-0.5">
                  KYC Review —{" "}
                  <span className="capitalize font-medium text-gray-300">
                    {DOC_TYPE_LABELS[selectedUser.document_type] ?? selectedUser.document_type ?? "Unknown"}
                  </span>
                  {" · "}
                  <span className="text-yellow-400 capitalize">{selectedUser.status}</span>
                </p>
              </div>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-white p-2 rounded-full hover:bg-[#222531] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scrollable Content */}
            <div className="p-6 overflow-y-auto flex-1">

              {/* Document Images Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">

                {/* Document Front */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-1.5 text-xs text-gray-400 font-medium uppercase tracking-wide">
                    <CreditCard className="w-3.5 h-3.5" />
                    Front
                  </div>
                  <div className="bg-[#222531] rounded-2xl border border-[#2a2d3f] overflow-hidden aspect-[4/3]">
                    <DocImage
                      src={selectedUser.document_front}
                      alt="Document Front"
                      fallback={
                        <>
                          <CreditCard className="w-6 h-6 text-gray-600" />
                          <span>No front image</span>
                        </>
                      }
                    />
                  </div>
                </div>

                {/* Document Back */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-1.5 text-xs text-gray-400 font-medium uppercase tracking-wide">
                    <FileText className="w-3.5 h-3.5" />
                    Back
                  </div>
                  <div className="bg-[#222531] rounded-2xl border border-[#2a2d3f] overflow-hidden aspect-[4/3]">
                    <DocImage
                      src={selectedUser.document_back}
                      alt="Document Back"
                      fallback={
                        <>
                          <FileText className="w-6 h-6 text-gray-600" />
                          <span>No back image</span>
                        </>
                      }
                    />
                  </div>
                </div>

                {/* Selfie with ID */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-1.5 text-xs text-gray-400 font-medium uppercase tracking-wide">
                    <Camera className="w-3.5 h-3.5" />
                    Selfie with ID
                  </div>
                  <div className="bg-[#222531] rounded-2xl border border-[#2a2d3f] overflow-hidden aspect-[4/3]">
                    <DocImage
                      src={selectedUser.selfie_with_id}
                      alt="Selfie with ID"
                      fallback={
                        <>
                          <Camera className="w-6 h-6 text-gray-600" />
                          <span>No selfie</span>
                        </>
                      }
                    />
                  </div>
                </div>
              </div>

              {/* User Info Summary */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                {[
                  { label: "Email", value: selectedUser.user.email },
                  { label: "Phone", value: selectedUser.user.phone || "-" },
                  { label: "Country", value: selectedUser.user.country || "-" },
                  {
                    label: "Account Status",
                    value: selectedUser.user.status || "-",
                    capitalize: true,
                  },
                ].map(({ label, value, capitalize }) => (
                  <div
                    key={label}
                    className="bg-[#222531] rounded-xl border border-[#2a2d3f] px-4 py-3"
                  >
                    <p className="text-xs text-gray-500 mb-1">{label}</p>
                    <p
                      className={`text-sm font-medium truncate ${capitalize ? "capitalize" : ""}`}
                    >
                      {value}
                    </p>
                  </div>
                ))}
              </div>

              {/* Notes */}
              <div className="mb-6">
                <label className="text-sm text-gray-400 mb-2 block">
                  Review Notes{" "}
                  <span className="text-gray-600">(Optional)</span>
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Write any additional notes here..."
                  className="w-full h-24 bg-[#222531] border border-[#2a2d3f] rounded-2xl p-4 text-sm focus:outline-none focus:border-blue-600 resize-none placeholder-gray-600"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleApprove}
                  disabled={actionLoading}
                  className={`flex-1 py-3.5 rounded-2xl font-semibold text-base transition-all active:scale-[0.98] ${actionLoading ? "bg-emerald-400 cursor-not-allowed" : "bg-emerald-600 hover:bg-emerald-700"}`}
                >
                  {actionLoading ? "Processing…" : "Approve"}
                </button>
                <button
                  onClick={handleReject}
                  disabled={actionLoading}
                  className={`flex-1 py-3.5 rounded-2xl font-semibold text-base transition-all active:scale-[0.98] ${actionLoading ? "bg-red-400 cursor-not-allowed" : "bg-red-600 hover:bg-red-700"}`}
                >
                  {actionLoading ? "Processing…" : "Reject"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}