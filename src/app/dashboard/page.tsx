import { PortfolioOverview } from "@/components/dashboard/PortfolioOverview";
import { CryptoCards } from "@/components/dashboard/CryptoCards";
import { PriceChart } from "@/components/dashboard/PriceChart";
import { QuickTrade } from "@/components/dashboard/QuickTrade";
import { RecentTransactions } from "@/components/dashboard/RecentTransactions";
import { MarketOverview } from "@/components/dashboard/MarketOverview";

export default function DashboardPage() {
  return (
    <div className="space-y-6 max-w-[1400px]">
      <PortfolioOverview />

      <CryptoCards />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <PriceChart />
        </div>
        <div>
          <QuickTrade />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentTransactions />
        </div>
        <div>
          <MarketOverview />
        </div>
      </div>
    </div>
  );
}
