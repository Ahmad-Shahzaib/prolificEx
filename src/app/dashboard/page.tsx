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
  const profile = useAppSelector((state) => state.profile.profile);
  const displayName = profile?.full_name || profile?.username || "there";

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
    </div>
  );
}
