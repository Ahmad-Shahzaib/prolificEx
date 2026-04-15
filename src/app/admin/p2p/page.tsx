"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchAdminP2PStats } from "@/redux/thunk/adminP2PStatsThunk";
import P2PMarketStats from "@/components/admin/P2PMarketStats";

export default function AdminP2PPage() {
  const dispatch = useAppDispatch();
  const { stats, loading, error } = useAppSelector((state) => state.adminP2PStats);

  useEffect(() => {
    dispatch(fetchAdminP2PStats());
  }, [dispatch]);

  return (
    <div className="min-h-screen text-white">
      <P2PMarketStats stats={stats} loading={loading} error={error} />
    </div>
  );
}
