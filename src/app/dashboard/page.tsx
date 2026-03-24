import { PortfolioOverview } from "@/components/dashboard/PortfolioOverview";
import { ActiveOrders } from "@/components/dashboard/ActiveOrders";
import { MyPortfolio } from "@/components/dashboard/MyPortfolio";
import { PriceChart } from "@/components/dashboard/PriceChart";
import { Transactions } from "@/components/dashboard/Transactions";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <h2 className="[font-family:'Inter',Helvetica] font-bold text-white text-xl">
        Welcome back, Henry 👋
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-4 space-y-6">
          <PortfolioOverview />
          {/* <ActiveOrders /> */}
        </div>
        {/* <div>
          <MyPortfolio />
        </div> */}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <PriceChart />
        </div>
        <div>
          <Transactions />
        </div>
      </div>
    </div>
  );
}
