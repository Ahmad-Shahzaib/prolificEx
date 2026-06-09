"use client";

import { useAppSelector } from "@/redux/hooks";
import { PortfolioOverview } from "@/components/dashboard/PortfolioOverview";
import { ActiveOrders } from "@/components/dashboard/ActiveOrders";
import { MyPortfolio } from "@/components/dashboard/MyPortfolio";
import { PriceChart } from "@/components/dashboard/PriceChart";
import { PriceWallet } from "@/components/dashboard/PriceWallet";
import { DashboardOverview } from "@/components/dashboard/DashboardOverview";
import { Transactions } from "@/components/dashboard/Transactions";

export default function DashboardPage() {
  const { profile, loading: profileLoading } = useAppSelector((state) => state.profile);
  const displayName = profile?.full_name || profile?.username || "there";
  const isPageLoading = profileLoading;

  return (
    <div className="space-y-6">
      <h2 className="[font-family:'Inter',Helvetica] font-bold text-white text-xl">
        Welcome back, {displayName} 👋
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <PortfolioOverview />
          <ActiveOrders />
        </div>
        <div>
          <MyPortfolio />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <DashboardOverview />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <PriceChart />
        </div>
        <div>
          <PriceWallet />
        </div>
      </div>

      {isPageLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="flex flex-col items-center gap-3 rounded-3xl bg-[#111125] bg-opacity-95 border border-white/10 p-6 shadow-xl">
            <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin" />
            <p className="text-sm text-white">Please wait...</p>
          </div>
        </div>
      )}
    </div>
  );
}
