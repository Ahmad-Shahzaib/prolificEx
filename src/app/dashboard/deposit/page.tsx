import { PageShell } from "@/components/dashboard/PageShell";
import { Card, CardContent } from "@/components/common/Card";
import { Button } from "@/components/common/Button";

const coins = [
  { name: "Bitcoin", ticker: "BTC", iconBg: "bg-[#f7931a]", iconLetter: "₿" },
  { name: "Tether", ticker: "USDT", iconBg: "bg-[#26a17b]", iconLetter: "$" },
  { name: "USD Coin", ticker: "USDC", iconBg: "bg-[#2775ca]", iconLetter: "$" },
];

export default function DepositPage() {
  return (
    <PageShell title="Deposit" description="Add funds to your wallet.">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {coins.map((coin) => (
          <Card key={coin.ticker} className="bg-[#1a1b23] border border-white/5 rounded-2xl">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className={`w-14 h-14 rounded-full ${coin.iconBg} flex items-center justify-center text-white text-xl font-bold mb-4`}>
                {coin.iconLetter}
              </div>
              <h3 className="text-white text-lg font-bold [font-family:'Inter',Helvetica] mb-1">{coin.name}</h3>
              <p className="text-[#6b7280] text-sm [font-family:'Inter',Helvetica] mb-5">{coin.ticker}</p>
              <Button variant="primary" size="md" className="w-full bg-[#f0b90b] hover:bg-[#d4a30a] text-black shadow-none rounded-lg font-semibold">
                Deposit {coin.ticker}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </PageShell>
  );
}
