
"use client";

import { Users, BarChart3, TrendingUp, FileText, Inbox } from "lucide-react";

interface Stat {
  id: string;
  title: string;
  value: string;
  icon: React.ReactNode;
  bg: string;
}

const stats: Stat[] = [
  {
    id: "1",
    title: "Total Users",
    value: "10293",
    icon: <Users size={20} />,
    bg: "bg-yellow-500/20 text-yellow-400",
  },
  {
    id: "2",
    title: "Active Trade",
    value: "10293",
    icon: <BarChart3 size={20} />,
    bg: "bg-blue-500/20 text-blue-400",
  },
  {
    id: "3",
    title: "Total Volume",
    value: "10293",
    icon: <TrendingUp size={20} />,
    bg: "bg-green-500/20 text-green-400",
  },
  {
    id: "4",
    title: "Pending KYC",
    value: "10293",
    icon: <FileText size={20} />,
    bg: "bg-orange-500/20 text-orange-400",
  },
  {
    id: "5",
    title: "Open Dispute",
    value: "48",
    icon: <Inbox size={20} />,
    bg: "bg-purple-500/20 text-purple-400",
  },
];

export function DashboardStats() {
  return (
    <div className="w-full">
      
      {/* Heading */}
      <h2 className="text-white text-lg sm:text-xl font-semibold mb-6">
        Welcome back, Henry 👋
      </h2>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {stats.map((item) => (
          <div
            key={item.id}
            className="bg-[#1a1b23] border border-white/5 rounded-2xl p-4 flex items-center gap-4"
          >
            {/* Icon */}
            <div
              className={`w-10 h-10 flex items-center justify-center rounded-full ${item.bg}`}
            >
              {item.icon}
            </div>

            {/* Text */}
            <div>
              <p className="text-[#9ca3af] text-xs">
                {item.title}
              </p>
              <p className="text-white text-lg font-semibold mt-1">
                {item.value}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}