"use client";

import React, { useEffect, useState } from "react";
import { Search, Filter, X, MoreVertical } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchAdminUsers, updateAdminUserStatus } from "@/redux/thunk/adminUsersThunk";
import { fetchAdminUserDetail, AdminUserDetail } from "@/redux/thunk/adminUserDetailThunk";
import { resetAdminUserDetail } from "@/redux/slices/adminUserDetailSlice";

export default function AdminUserManagementPage() {
  const dispatch = useAppDispatch();
  const { users, loading, error, pagination } = useAppSelector((state) => state.adminUsers);
  const { user: selectedUser, loading: detailLoading, error: detailError } = useAppSelector((state) => state.adminUserDetail);

  const [perPage, setPerPage] = useState<number>(20);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [statusUpdateLoading, setStatusUpdateLoading] = useState<number | null>(null);
  const [statusUpdateError, setStatusUpdateError] = useState<string | null>(null);
  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);

  useEffect(() => {
    dispatch(
      fetchAdminUsers({
        search,
        per_page: perPage || 20,
        page: page || 1,
      })
    );
  }, [dispatch, search, perPage, page]);

  const onSearch = () => {
    setPage(1);
    setSearch(searchInput.trim());
  };

  const openUserDetail = (userId: number) => {
    setSelectedUserId(userId);
    dispatch(fetchAdminUserDetail(userId));
  };

  const closeUserDetail = () => {
    setSelectedUserId(null);
    dispatch(resetAdminUserDetail());
  };

  const handlePage = (nextPage: number) => {
    if (pagination && nextPage >= 1 && nextPage <= pagination.last_page) {
      setPage(nextPage);
    }
  };

  const getKycText = (level: number) => {
    if (level === 0) return "Not Submitted";
    if (level === 2) return "Verified";
    return `Level ${level}`;
  };

  const onChangeStatus = async (userId: number, newStatus: "active" | "suspended") => {
    setStatusUpdateError(null);
    setStatusUpdateLoading(userId);
    setOpenDropdownId(null);

    try {
      await dispatch(updateAdminUserStatus({ userId, status: newStatus })).unwrap();

      // always refresh using only search + pagination (no status/kyc filter)
      dispatch(fetchAdminUsers({ search, per_page: perPage, page }));

      if (selectedUserId === userId) {
        dispatch(fetchAdminUserDetail(userId));
      }
    } catch (error: any) {
      setStatusUpdateError(error || "Failed to update status");
    } finally {
      setStatusUpdateLoading(null);
    }
  };

  return (
    <div className="min-h-screen text-white p-4 sm:p-6 font-sans">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-semibold mb-6">User Management</h1>

        <div className="bg-[#1a1c2e] rounded-2xl p-4 flex flex-col gap-4 md:gap-3 mb-6 border border-[#23263b]">
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
            <div className="flex-1 relative max-w-md">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <Search className="w-5 h-5" />
              </div>
              <input
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                type="text"
                placeholder="search by name, email, phone"
                className="w-full bg-[#222531] border border-[#23263b] rounded-xl pl-11 py-3 text-sm focus:outline-none focus:border-blue-600 placeholder-gray-500"
                onKeyDown={(e) => e.key === "Enter" && onSearch()}
              />
            </div>

            <button
              onClick={onSearch}
              className="flex items-center gap-2 bg-[#222531] hover:bg-[#2a2d3f] border border-[#23263b] px-5 py-3 rounded-xl text-sm font-medium transition-colors whitespace-nowrap"
            >
              <Filter className="w-4 h-4" />
              Search
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <label className="text-xs text-gray-400">Per page</label>
            <select
              value={perPage}
              onChange={(e) => {
                const val = Number(e.target.value);
                setPerPage(val);
                setPage(1);
              }}
              className="bg-[#222531] border border-[#23263b] rounded-xl px-3 py-2 text-sm text-gray-200"
            >
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
              <option value={500}>All</option>
            </select>

            <div className="flex items-end">
              <button
                onClick={() => {
                  setPerPage(20);
                  setPage(1);
                }}
                className="w-full bg-[#222531] hover:bg-[#2a2d3f] border border-[#23263b] px-4 py-2 rounded-xl text-xs text-gray-200"
              >
                Show 20 per page
              </button>
            </div>

            <div className="flex items-end">
              <p className="text-xs text-gray-400">No status/kyc filters applied</p>
            </div>
          </div>
        </div>

        {statusUpdateError && (
          <div className="bg-[#2f3349] rounded-2xl p-4 mb-4 text-sm text-red-300">
            {statusUpdateError}
          </div>
        )}

        {loading ? (
          <div className="bg-[#1a1c2e] rounded-3xl p-6 text-center text-gray-300">Loading users...</div>
        ) : error ? (
          <div className="bg-[#1a1c2e] rounded-3xl p-6 text-center text-red-400">{error}</div>
        ) : users.length === 0 ? (
          <div className="bg-[#1a1c2e] rounded-3xl p-6 text-center text-gray-300">No users found.</div>
        ) : (
          <div className="bg-[#1a1c2e] rounded-3xl overflow-hidden border border-[#23263b]">
            <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 border-b border-[#23263b] text-sm text-gray-400 font-medium">
              <div className="col-span-2">Name</div>
              <div className="col-span-2">Username</div>
              <div className="col-span-2">Email</div>
              <div className="col-span-1">KYC Status</div>
              <div className="col-span-1 text-center">Phone</div>
              <div className="col-span-1 text-right">Country</div>
              <div className="col-span-1 text-center">Status</div>
              <div className="col-span-1 text-center">Status Update</div>
              <div className="col-span-1 text-center">Action</div>
            </div>

            <div className="divide-y divide-[#23263b]">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="grid grid-cols-1 md:grid-cols-12 gap-4 px-6 py-5 hover:bg-[#222531] transition-colors items-start md:items-center"
                >
                  {/* Mobile Header */}
                  <div className="flex justify-between items-start md:hidden mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-[#2a2d3f] rounded-full flex items-center justify-center text-gray-400">👤</div>
                      <div>
                        <div className="font-medium">{user.full_name}</div>
                        <div className="text-xs text-gray-500">{user.username ? `@${user.username}` : "No username"}</div>
                        <div className="text-xs text-gray-500">#{user.id}</div>
                      </div>
                    </div>
                    <div>
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                          user.kyc_level === 0 ? "bg-amber-500/10 text-amber-400" : user.kyc_level === 2 ? "bg-emerald-500/10 text-emerald-400" : "bg-blue-500/10 text-blue-400"
                        }`}
                      >
                        {getKycText(user.kyc_level)}
                      </span>
                    </div>
                  </div>

                  <div className="hidden md:flex md:col-span-2 items-center gap-3">
                    <div className="w-8 h-8 bg-[#2a2d3f] rounded-full flex items-center justify-center text-gray-400">👤</div>
                    <span className="font-medium">{user.full_name}</span>
                  </div>

                  <div className="hidden md:flex md:col-span-2 items-center text-sm text-gray-400 truncate">{user.username ?? "-"}</div>

                  <div className="col-span-1 md:col-span-2 text-sm text-gray-400 truncate">{user.email}</div>

                  <div className="hidden md:block md:col-span-1">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                        user.kyc_level === 0 ? "bg-amber-500/10 text-amber-400" : user.kyc_level === 2 ? "bg-emerald-500/10 text-emerald-400" : "bg-blue-500/10 text-blue-400"
                      }`}
                    >
                      {getKycText(user.kyc_level)}
                    </span>
                  </div>

                  <div className="text-sm font-medium md:col-span-1 md:text-center">{user.phone}</div>

                  <div className="text-right font-medium text-gray-300 md:col-span-1">{user.country}</div>

                  <div className="md:col-span-1 flex justify-start md:justify-center">
                    <span
                      className={`px-4 py-1 rounded-full text-xs font-medium ${
                        user.status === "active"
                          ? "bg-emerald-500/10 text-emerald-400"
                          : user.status === "banned"
                          ? "bg-red-500/10 text-red-400"
                          : "bg-yellow-500/10 text-yellow-400"
                      }`}
                    >
                      {user.status}
                    </span>
                  </div>

                  {/* New Status Update Column with Three Dots */}
                  <div className="md:col-span-1 flex justify-center items-center relative">
                    <button
                      onClick={() => setOpenDropdownId(openDropdownId === user.id ? null : user.id)}
                      disabled={statusUpdateLoading === user.id}
                      className="p-2 hover:bg-[#2a2d3f] rounded-xl transition-colors"
                    >
                      <MoreVertical className="w-5 h-5 text-gray-400" />
                    </button>

                    {openDropdownId === user.id && (
                      <div className="absolute right-0 mt-2 w-40 bg-[#1f2238] border border-[#23263b] rounded-xl shadow-2xl z-50 py-1 text-sm">
                        <button
                          onClick={() => onChangeStatus(user.id, "active")}
                          className="w-full px-4 py-2.5 hover:bg-[#2a2d3f] text-left text-emerald-400 flex items-center gap-2"
                        >
                          ✅ Mark Active
                        </button>
                        <button
                          onClick={() => onChangeStatus(user.id, "suspended")}
                          className="w-full px-4 py-2.5 hover:bg-[#2a2d3f] text-left text-yellow-400 flex items-center gap-2"
                        >
                          ⏸️ Suspend
                        </button>
                      </div>
                    )}

                    {statusUpdateLoading === user.id && (
                      <span className="ml-2 text-xs text-gray-400">Updating...</span>
                    )}
                  </div>

                  <div className="text-center md:col-span-1 mt-2 md:mt-0">
                    <button
                      onClick={() => openUserDetail(user.id)}
                      className="text-blue-500 hover:text-blue-400 font-medium text-sm transition-colors w-full md:w-auto"
                    >
                      View Profile
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t border-[#23263b]">
              <p className="text-sm text-gray-400">
                Showing {pagination?.from ?? 0}-{pagination?.to ?? 0} of {pagination?.total ?? 0}
              </p>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePage((pagination?.current_page ?? 1) - 1)}
                  disabled={!pagination?.prev_page_url}
                  className="h-9 w-9 flex items-center justify-center rounded-full border border-[#23263b] hover:bg-[#222531] transition-colors disabled:opacity-50"
                  aria-label="Previous page"
                >
                  ←
                </button>

                <span className="h-9 px-3 flex items-center justify-center text-sm text-gray-300 border border-[#23263b] rounded-full">
                  {pagination?.current_page ?? 1} / {pagination?.last_page ?? 1}
                </span>

                <button
                  onClick={() => handlePage((pagination?.current_page ?? 1) + 1)}
                  disabled={!pagination?.next_page_url}
                  className="h-9 w-9 flex items-center justify-center rounded-full border border-[#23263b] hover:bg-[#222531] transition-colors disabled:opacity-50"
                  aria-label="Next page"
                >
                  →
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* User Detail Modal - Unchanged */}
      {selectedUserId && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a1c2e] rounded-3xl w-full max-w-md border border-[#23263b] shadow-2xl overflow-hidden max-h-[88vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#23263b] shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-lg">
                  👤
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white">User Details</h2>
                </div>
              </div>

              <button
                onClick={closeUserDetail}
                className="text-gray-400 hover:text-white p-2 rounded-xl hover:bg-[#222531] transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-5 text-sm custom-scroll">
              {detailLoading ? (
                <div className="flex flex-col items-center justify-center py-10">
                  <div className="w-7 h-7 border-4 border-gray-600 border-t-blue-500 rounded-full animate-spin mb-3"></div>
                  <p className="text-gray-400 text-sm">Loading user details...</p>
                </div>
              ) : detailError ? (
                <p className="text-red-400 text-center py-8">{detailError}</p>
              ) : selectedUser ? (
                <div className="space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-[#131525] rounded-2xl p-4 border border-[#23263b]">
                      <p className="text-xs text-gray-500 mb-1">Full Name</p>
                      <p className="font-medium text-white text-sm leading-tight">{selectedUser.full_name}</p>
                    </div>

                    <div className="bg-[#131525] rounded-2xl p-4 border border-[#23263b]">
                      <p className="text-xs text-gray-500 mb-1">Username</p>
                      <p className="font-medium text-white text-sm">
                        {selectedUser.username ?? selectedUser.email?.split("@")[0] ?? "—"}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3 divide-y divide-[#23263b] text-sm">
                    <div className="flex justify-between items-center py-2.5">
                      <span className="text-gray-400">Email</span>
                      <span className="text-white font-medium text-right max-w-[180px] truncate">{selectedUser.email}</span>
                    </div>

                    <div className="flex justify-between items-center py-2.5">
                      <span className="text-gray-400">Phone</span>
                      <span className="text-white font-medium">{selectedUser.phone || "—"}</span>
                    </div>

                    <div className="flex justify-between items-center py-2.5">
                      <span className="text-gray-400">Country</span>
                      <span className="text-white font-medium">{selectedUser.country || "—"}</span>
                    </div>

                    <div className="flex justify-between items-center py-2.5">
                      <span className="text-gray-400">Status</span>
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                        selectedUser.status === 'active' 
                          ? 'bg-green-500/10 text-green-400' 
                          : selectedUser.status === 'suspended' 
                          ? 'bg-red-500/10 text-red-400' 
                          : 'bg-yellow-500/10 text-yellow-400'
                      }`}>
                        {selectedUser.status}
                      </span>
                    </div>

                    <div className="flex justify-between items-center py-2.5">
                      <span className="text-gray-400">Role</span>
                      <span className="text-white font-medium capitalize">{selectedUser.role}</span>
                    </div>

                    {/* <div className="flex justify-between items-center py-2.5">
                      <span className="text-gray-400">KYC Level</span>
                      <span className="px-3 py-1 bg-blue-500/10 text-blue-400 text-xs font-medium rounded-full">
                        {getKycText(selectedUser.kyc_level)}
                      </span>
                    </div> */}

                    <div className="flex justify-between items-center py-2.5">
                      <span className="text-gray-400">Email Verified</span>
                      <span className={selectedUser.email_verified_at ? "text-emerald-400" : "text-gray-500"}>
                        {selectedUser.email_verified_at ? "✅ Verified" : "❌ Not Verified"}
                      </span>
                    </div>

                    <div className="flex justify-between items-center py-2.5">
                      <span className="text-gray-400">Phone Verified</span>
                      <span className={selectedUser.phone_verified_at ? "text-emerald-400" : "text-gray-500"}>
                        {selectedUser.phone_verified_at ? "✅ Verified" : "❌ Not Verified"}
                      </span>
                    </div>
                  </div>

                  <div className="pt-3 grid grid-cols-2 gap-6 text-xs border-t border-[#23263b]">
                    <div>
                      <p className="text-gray-500">Created</p>
                      <p className="text-gray-300 mt-1">
                        {new Date(selectedUser.created_at).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric', 
                          year: 'numeric' 
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Updated</p>
                      <p className="text-gray-300 mt-1">
                        {new Date(selectedUser.updated_at).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric', 
                          year: 'numeric' 
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-gray-400 text-center py-10">Select a user to view details.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}