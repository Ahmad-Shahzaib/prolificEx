import { PageShell } from "@/components/dashboard/PageShell";
import { Card, CardContent } from "@/components/common/Card";
import { Button } from "@/components/common/Button";

const coins = [
  { name: "Bitcoin", ticker: "BTC", iconBg: "bg-[#f7931a]", iconLetter: "₿", balance: "0.2145 BTC" },
  { name: "Tether", ticker: "USDT", iconBg: "bg-[#26a17b]", iconLetter: "$", balance: "5,840.00 USDT" },
  { name: "USD Coin", ticker: "USDC", iconBg: "bg-[#2775ca]", iconLetter: "$", balance: "4,301.00 USDC" },
];

export default function WithdrawPage() {
  return (
    <PageShell title="Withdraw" description="Withdraw funds from your wallet.">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {coins.map((coin) => (
          <Card key={coin.ticker} className="bg-[#1a1b23] border border-white/5 rounded-2xl">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className={`w-14 h-14 rounded-full ${coin.iconBg} flex items-center justify-center text-white text-xl font-bold mb-4`}>
                {coin.iconLetter}
              </div>
              <h3 className="text-white text-lg font-bold [font-family:'Inter',Helvetica] mb-1">{coin.name}</h3>
              <p className="text-[#6b7280] text-xs [font-family:'Inter',Helvetica] mb-1">Available: {coin.balance}</p>
              <div className="w-full mt-4">
                <Button variant="outline" size="md" className="w-full rounded-lg font-semibold">
                  Withdraw {coin.ticker}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </PageShell>
  );
}
