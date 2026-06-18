"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, BarChart3, FileText, Scale, TrendingUp, Users } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { fetchDashboardStats } from "../../../redux/thunk/dashboardStatsThunk";
import { fetchAdminUserActivity, AdminUserActivityRange } from "@/redux/thunk/adminUserActivityThunk";
import { fetchAdminQuickAlerts } from "@/redux/thunk/adminQuickAlertsThunk";

const defaultStats = [
  {
    label: "Total Users",
    value: "10,293",
    icon: Users,
    color: "text-yellow-500",
    bg: "bg-yellow-500/10",
  },
  {
    label: "Active Trade",
    value: "10,293",
    icon: TrendingUp,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    label: "Total Volume",
    value: "10,293",
    icon: BarChart3,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
  {
    label: "Pending KYC",
    value: "10,293",
    icon: FileText,
    color: "text-orange-500",
    bg: "bg-orange-500/10",
  },
  {
    label: "Open Dispute",
    value: "48",
    icon: Scale,
    color: "text-purple-500",
    bg: "bg-purple-500/10",
  },
];


export default function AdminDashboardPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { stats: statsData, loading, error } = useAppSelector((state) => state.dashboard);
  const {
    data: activityData,
    loading: activityLoading,
    error: activityError,
  } = useAppSelector((state) => state.adminUserActivity);
  const {
    alerts,
    total: alertsTotal,
    loading: alertsLoading,
    error: alertsError,
  } = useAppSelector((state) => state.adminQuickAlerts);

  const [activityRange, setActivityRange] = useState<AdminUserActivityRange>("1w");

  useEffect(() => {
    dispatch(fetchDashboardStats());
    dispatch(fetchAdminQuickAlerts({ limit: 10 }));
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchAdminUserActivity({ range: activityRange }));
  }, [activityRange, dispatch]);

  const chartPoints = useMemo(() => activityData?.series.points ?? [], [activityData]);
  const lineKey = activityData?.series.line_key ?? "value";

  const stats = statsData
    ? [
        {
          label: "Total Users",
          value: statsData.total_users.toLocaleString(),
          icon: Users,
          color: "text-yellow-500",
          bg: "bg-yellow-500/10",
        },
        {
          label: "Active Users",
          value: statsData.active_users.toLocaleString(),
          icon: TrendingUp,
          color: "text-blue-500",
          bg: "bg-blue-500/10",
        },
        {
          label: "Suspended Users",
          value: statsData.suspended_users.toLocaleString(),
          icon: BarChart3,
          color: "text-emerald-500",
          bg: "bg-emerald-500/10",
        },
        {
          label: "Pending KYC",
          value: statsData.pending_kyc.toLocaleString(),
          icon: FileText,
          color: "text-orange-500",
          bg: "bg-orange-500/10",
        },
        {
          label: "Banned Users",
          value: statsData.banned_users.toLocaleString(),
          icon: Scale,
          color: "text-purple-500",
          bg: "bg-purple-500/10",
        },
      ]
    : defaultStats;

  return (
    <div className="min-h-screen text-white p-3 sm:p-4 md:p-6 font-sans">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 md:mb-8">
        <h1 className="text-xl sm:text-2xl font-semibold flex items-center gap-3">
          Welcome back, Henry 👋
        </h1>
      </div>

      {loading && (
        <div className="mb-4 text-sm text-blue-300">Loading stats...</div>
      )}
      {error && (
        <div className="mb-4 text-sm text-red-400">Error: {error}</div>
      )}
      {(activityError || alertsError) && (
        <div className="mb-4 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {activityError || alertsError}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4 mb-6 md:mb-8">
        {stats.map(({ label, value, icon: Icon, color, bg }) => (
          <div
            key={label}
            className="bg-[#222531] rounded-2xl p-4 md:p-6 border border-[#23263b]"
          >
            <div className="flex items-center gap-3 md:gap-4">
              <div
                className={`w-10 h-10 md:w-12 md:h-12 ${bg} rounded-2xl flex items-center justify-center flex-shrink-0`}
              >
                <Icon className={`w-5 h-5 md:w-6 md:h-6 ${color}`} />
              </div>
              <div className="min-w-0">
                <p className="text-gray-400 text-xs sm:text-sm truncate">{label}</p>
                <p className="text-xl sm:text-2xl md:text-3xl font-bold mt-0.5 leading-tight">
                  {value}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 md:gap-6">
        {/* User Activity Chart */}
        <div className="xl:col-span-7 bg-[#222531] rounded-3xl p-4 md:p-6 border border-[#23263b] self-start">
          <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-start md:mb-6">
            <div>
              <h2 className="text-base md:text-lg font-semibold">
                {activityData?.title ?? "User Activity"}
              </h2>
              <p className="mt-1 text-sm text-gray-400">
                {activityData?.subtitle ?? "Registrations and active sessions"}
              </p>
            </div>
            <div className="flex rounded-xl border border-[#2a2d3f] bg-[#1a1c2e] p-1">
              {(["1w", "1m", "3m", "6m"] as AdminUserActivityRange[]).map((range) => (
                <button
                  key={range}
                  type="button"
                  onClick={() => setActivityRange(range)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                    activityRange === range
                      ? "bg-blue-600 text-white"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>

          <div className="h-[210px] sm:h-[240px] md:h-[280px] relative">
            {activityLoading ? (
              <div className="flex h-full items-center justify-center text-sm text-gray-400">
                Loading activity...
              </div>
            ) : chartPoints.length === 0 ? (
              <div className="flex h-full items-center justify-center text-sm text-gray-400">
                No activity data found.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartPoints}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#23263b" />
                  <XAxis
                    dataKey="label"
                    stroke="#666"
                    tick={{ fill: "#888", fontSize: 11 }}
                    interval="preserveStartEnd"
                  />
                  <YAxis
                    stroke="#666"
                    tick={{ fill: "#888", fontSize: 11 }}
                    width={50}
                    allowDecimals={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1a1c2e",
                      border: "1px solid #2a2d3f",
                      borderRadius: "12px",
                      color: "#fff",
                      boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.3)",
                    }}
                    labelStyle={{ color: "#cbd5e1" }}
                  />
                  <Line
                    type="natural"
                    dataKey={lineKey}
                    name="New Users"
                    stroke="#3b82f6"
                    strokeWidth={4}
                    dot={false}
                    activeDot={{
                      r: 8,
                      fill: "#3b82f6",
                      stroke: "#121212",
                      strokeWidth: 3,
                    }}
                  />
                  <Line
                    type="natural"
                    dataKey="active_sessions"
                    name="Active Sessions"
                    stroke="#22c55e"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Quick Alerts */}
        <div className="xl:col-span-5 bg-[#222531] rounded-3xl p-4 md:p-6 border border-[#23263b] flex h-[420px] flex-col self-start">
          <div className="mb-4 flex items-center justify-between gap-3 md:mb-6">
            <div>
              <h2 className="text-base md:text-lg font-semibold">Quick Alerts</h2>
              <p className="mt-1 text-sm text-gray-400">{alertsTotal} total</p>
            </div>
            <AlertTriangle className="h-5 w-5 text-amber-400" />
          </div>

          <div className="min-h-0 flex-1 space-y-3 md:space-y-4 overflow-y-auto pr-1 md:pr-2 custom-scroll">
            {alertsLoading ? (
              <div className="rounded-2xl border border-[#2a2d3f] bg-[#23263b] p-5 text-sm text-gray-400">
                Loading alerts...
              </div>
            ) : alerts.length === 0 ? (
              <div className="rounded-2xl border border-[#2a2d3f] bg-[#23263b] p-5 text-sm text-gray-400">
                No quick alerts found.
              </div>
            ) : (
              alerts.map((alert) => (
                <div
                  key={`${alert.type}-${alert.reference_id}-${alert.created_at}`}
                  className="bg-[#23263b] rounded-2xl p-4 md:p-5 flex items-center justify-between gap-3 border border-[#2a2d3f]"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span
                        className={`h-2.5 w-2.5 rounded-full ${
                          alert.severity === "high"
                            ? "bg-red-400"
                            : alert.severity === "medium"
                              ? "bg-amber-400"
                              : "bg-blue-400"
                        }`}
                      />
                      <p className="font-medium truncate">{alert.title}</p>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-400 truncate">
                      {alert.subtitle}
                    </p>
                    <p className="text-xs text-amber-400 mt-1.5 md:mt-2">
                      {alert.message}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => router.push(alert.action_path)}
                    className="bg-blue-600 hover:bg-blue-700 transition-all px-4 md:px-6 py-2 md:py-2.5 rounded-xl text-xs sm:text-sm font-medium flex-shrink-0"
                  >
                    {alert.action_label || "Review"}
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Custom Scrollbar */}
      <style jsx>{`
        .custom-scroll::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scroll::-webkit-scrollbar-thumb {
          background-color: #3b82f6;
          border-radius: 20px;
        }
      `}</style>
    </div>
  );
}
