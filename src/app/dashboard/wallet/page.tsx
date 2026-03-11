import { PageShell } from "@/components/dashboard/PageShell";
import { Card, CardContent } from "@/components/common/Card";

const walletAssets = [
  { name: "Bitcoin", ticker: "BTC", iconBg: "bg-[#f7931a]", iconLetter: "₿", balance: "0.2145", usd: "$14,421.80", change: "+2.34%" },
  { name: "Tether", ticker: "USDT", iconBg: "bg-[#26a17b]", iconLetter: "$", balance: "5,840.00", usd: "$5,840.00", change: "+0.01%" },
  { name: "USD Coin", ticker: "USDC", iconBg: "bg-[#2775ca]", iconLetter: "$", balance: "4,301.00", usd: "$4,301.00", change: "-0.02%" },
  { name: "Ethereum", ticker: "ETH", iconBg: "bg-[#627eea]", iconLetter: "Ξ", balance: "1.5230", usd: "$5,263.04", change: "+1.87%" },
];

export default function WalletPage() {
  return (
    <PageShell title="Wallet" description="Manage your crypto assets and balances.">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {walletAssets.map((asset) => (
          <Card key={asset.ticker} className="bg-[#1a1b23] border border-white/5 rounded-2xl hover:border-white/10 transition-colors">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full ${asset.iconBg} flex items-center justify-center text-white text-base font-bold`}>
                    {asset.iconLetter}
                  </div>
                  <div>
                    <p className="text-white text-sm font-semibold [font-family:'Inter',Helvetica]">{asset.name}</p>
                    <p className="text-[#6b7280] text-xs [font-family:'Inter',Helvetica]">{asset.ticker}</p>
                  </div>
                </div>
                <span className={`text-xs font-medium [font-family:'Inter',Helvetica] ${asset.change.startsWith("+") ? "text-[#1ecb4f]" : "text-[#ef4444]"}`}>
                  {asset.change}
                </span>
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-[#6b7280] text-xs [font-family:'Inter',Helvetica] mb-0.5">Balance</p>
                  <p className="text-white text-lg font-bold [font-family:'Inter',Helvetica]">{asset.balance} {asset.ticker}</p>
                </div>
                <p className="text-[#6b7280] text-sm [font-family:'Inter',Helvetica]">≈ {asset.usd}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </PageShell>
  );
}
