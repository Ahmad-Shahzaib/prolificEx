"use client";

import { AdminP2PStatsData } from "@/redux/thunk/adminP2PStatsThunk";

interface P2PMarketStatsProps {
  stats: AdminP2PStatsData | null;
  loading: boolean;
  error: string | null;
}

const statCards = (stats: AdminP2PStatsData | null) => [
  {
    label: "Total Orders",
    value: stats?.total_orders ?? 0,
  },
  {
    label: "Completed Orders",
    value: stats?.completed_orders ?? 0,
  },
  {
    label: "Active Disputes",
    value: stats?.active_disputes ?? 0,
  },
  {
    label: "Total Offers",
    value: stats?.total_offers ?? 0,
  },
  {
    label: "Active Offers",
    value: stats?.active_offers ?? 0,
  },
];

export default function P2PMarketStats({ stats, loading, error }: P2PMarketStatsProps) {
  return (
    <div className="space-y-6 text-white">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">P2P Market Statistics</h1>
          <p className="text-sm text-slate-400 mt-1">
            Data is loaded from the admin P2P stats endpoint.
          </p>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-[#13151f] px-4 py-3 text-sm text-slate-300">
          API: <span className="text-slate-100">/admin/p2p/stats</span>
        </div>
      </div>

      {loading && (
        <div className="rounded-3xl border border-blue-500/20 bg-blue-500/10 p-4 text-blue-100">
          Loading P2P stats...
        </div>
      )}

      {error && (
        <div className="rounded-3xl border border-red-500/20 bg-red-500/10 p-4 text-red-100">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
        {statCards(stats).map((card) => (
          <div key={card.label} className="rounded-3xl border border-slate-800 bg-[#161a28] p-5 shadow-sm">
            <p className="text-sm text-slate-400">{card.label}</p>
            <p className="mt-3 text-3xl font-semibold text-white">{card.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
