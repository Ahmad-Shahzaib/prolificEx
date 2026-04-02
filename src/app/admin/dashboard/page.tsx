"use client";

import React, { useEffect } from "react";
import { Users, TrendingUp, BarChart3, FileText, Scale } from "lucide-react";
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

const registrationData = [
  { date: "Apr 1", users: 45000 },
  { date: "Apr 2", users: 42000 },
  { date: "Apr 3", users: 38000 },
  { date: "Apr 4", users: 48000 },
  { date: "Apr 5", users: 32000 },
  { date: "Apr 6", users: 28000 },
];

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
  const { stats: statsData, loading, error } = useAppSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(fetchDashboardStats());
  }, [dispatch]);

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
        {/* User Registrations Chart */}
        <div className="xl:col-span-7 bg-[#222531] rounded-3xl p-4 md:p-6 border border-[#23263b]">
          <h2 className="text-base md:text-lg font-semibold mb-4 md:mb-6">
            User Registrations
          </h2>

          <div className="h-[260px] sm:h-[300px] md:h-[340px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={registrationData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#23263b" />
                <XAxis
                  dataKey="date"
                  stroke="#666"
                  tick={{ fill: "#888", fontSize: 11 }}
                  interval="preserveStartEnd"
                />
                <YAxis
                  stroke="#666"
                  tick={{ fill: "#888", fontSize: 11 }}
                  domain={[10000, 50000]}
                  width={50}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1a1c2e",
                    border: "none",
                    borderRadius: "12px",
                    color: "#fff",
                    boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.3)",
                  }}
                />
                <Line
                  type="natural"
                  dataKey="users"
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
              </LineChart>
            </ResponsiveContainer>

            {/* Custom Highlight Tooltip */}
            <div className="absolute left-1/2 top-[22%] -translate-x-1/2 pointer-events-none">
              <div className="bg-blue-600 text-white text-xs font-medium px-3 md:px-4 py-1.5 rounded-full shadow-xl flex items-center gap-2">
                64,364.77
                <div className="w-2.5 h-2.5 bg-blue-400 rounded-full" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Alerts */}
        <div className="xl:col-span-5 bg-[#222531] rounded-3xl p-4 md:p-6 border border-[#23263b] flex flex-col">
          <h2 className="text-base md:text-lg font-semibold mb-4 md:mb-6">
            Quick Alerts
          </h2>

          <div className="flex-1 space-y-3 md:space-y-4 overflow-y-auto pr-1 md:pr-2 max-h-[360px] xl:max-h-none custom-scroll">
            {Array.from({ length: 7 }).map((_, i) => (
              <div
                key={i}
                className="bg-[#23263b] rounded-2xl p-4 md:p-5 flex items-center justify-between gap-3 border border-[#2a2d3f]"
              >
                <div className="min-w-0">
                  <p className="font-medium truncate">dave.king1</p>
                  <p className="text-xs sm:text-sm text-gray-400 truncate">
                    daveking@email.com
                  </p>
                  <p className="text-xs text-amber-400 mt-1.5 md:mt-2">
                    High Risk Account
                  </p>
                </div>
                <button className="bg-blue-600 hover:bg-blue-700 transition-all px-4 md:px-6 py-2 md:py-2.5 rounded-xl text-xs sm:text-sm font-medium flex-shrink-0">
                  Review
                </button>
              </div>
            ))}
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