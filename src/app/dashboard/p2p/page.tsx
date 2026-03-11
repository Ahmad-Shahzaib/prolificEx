import { PageShell } from "@/components/dashboard/PageShell";
import { Card, CardContent } from "@/components/common/Card";
import { Button } from "@/components/common/Button";

const offers = [
  { seller: "CryptoKing", coin: "BTC", price: "$67,250.00", minMax: "$100 - $5,000", payment: "Bank Transfer", completionRate: "98.5%" },
  { seller: "TradeNaija", coin: "BTC", price: "$67,180.00", minMax: "$50 - $10,000", payment: "Mobile Money", completionRate: "97.2%" },
  { seller: "P2PMaster", coin: "USDT", price: "$1.00", minMax: "$10 - $50,000", payment: "Bank Transfer", completionRate: "99.1%" },
  { seller: "FastTrader", coin: "USDC", price: "$1.00", minMax: "$20 - $25,000", payment: "Paystack", completionRate: "96.8%" },
  { seller: "CoinDealer", coin: "BTC", price: "$67,300.00", minMax: "$200 - $8,000", payment: "Bank Transfer", completionRate: "95.4%" },
];

export default function P2PPage() {
  return (
    <PageShell title="P2P Marketplace" description="Buy and sell crypto directly with other traders.">
      <Card className="bg-[#1a1b23] border border-white/5 rounded-2xl">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              {["Buy", "Sell"].map((tab) => (
                <button key={tab} className={`px-4 py-2 rounded-lg text-sm font-semibold [font-family:'Inter',Helvetica] cursor-pointer border-none transition-colors ${tab === "Buy" ? "bg-[#1ecb4f] text-white" : "bg-[#252630] text-[#6b7280] hover:text-white"}`}>
                  {tab}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              {["BTC", "USDT", "USDC"].map((coin) => (
                <button key={coin} className={`px-3 py-1.5 rounded-md text-xs font-medium [font-family:'Inter',Helvetica] cursor-pointer border transition-colors ${coin === "BTC" ? "bg-[#f0b90b]/10 text-[#f0b90b] border-[#f0b90b]/30" : "bg-transparent text-[#6b7280] border-white/10 hover:text-white"}`}>
                  {coin}
                </button>
              ))}
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left text-[#6b7280] text-xs font-medium [font-family:'Inter',Helvetica] pb-3">Seller</th>
                  <th className="text-left text-[#6b7280] text-xs font-medium [font-family:'Inter',Helvetica] pb-3">Price</th>
                  <th className="text-left text-[#6b7280] text-xs font-medium [font-family:'Inter',Helvetica] pb-3 hidden md:table-cell">Limit</th>
                  <th className="text-left text-[#6b7280] text-xs font-medium [font-family:'Inter',Helvetica] pb-3 hidden sm:table-cell">Payment</th>
                  <th className="text-left text-[#6b7280] text-xs font-medium [font-family:'Inter',Helvetica] pb-3 hidden lg:table-cell">Rate</th>
                  <th className="text-right text-[#6b7280] text-xs font-medium [font-family:'Inter',Helvetica] pb-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {offers.map((offer) => (
                  <tr key={offer.seller} className="border-b border-white/5 last:border-none">
                    <td className="py-4">
                      <span className="text-white text-sm font-medium [font-family:'Inter',Helvetica]">{offer.seller}</span>
                    </td>
                    <td className="py-4 text-white text-sm [font-family:'Inter',Helvetica]">{offer.price}</td>
                    <td className="py-4 text-[#6b7280] text-sm [font-family:'Inter',Helvetica] hidden md:table-cell">{offer.minMax}</td>
                    <td className="py-4 text-[#6b7280] text-sm [font-family:'Inter',Helvetica] hidden sm:table-cell">{offer.payment}</td>
                    <td className="py-4 text-[#1ecb4f] text-sm [font-family:'Inter',Helvetica] hidden lg:table-cell">{offer.completionRate}</td>
                    <td className="py-4 text-right">
                      <Button variant="primary" size="sm" className="bg-[#1ecb4f] hover:bg-[#19b545] shadow-none rounded-lg text-xs px-4 py-1.5">
                        Buy
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </PageShell>
  );
}
