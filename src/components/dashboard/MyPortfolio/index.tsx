"use client";

import { Card, CardContent } from "@/components/common/Card";

interface PortfolioItem {
  name: string;
  iconBg: string;
  iconLetter: string;
  price: string;
  change: string;
  changePositive: boolean;
  amount: string;
}

const portfolioItems: PortfolioItem[] = [
  { name: "Ethereum", iconBg: "bg-[#627eea]", iconLetter: "Ξ", price: "$3,245.03", change: "-13.40%", changePositive: false, amount: "0.12543 ETH" },
  { name: "Bitcoin", iconBg: "bg-[#f7931a]", iconLetter: "₿", price: "$3,245.03", change: "-6.00%", changePositive: false, amount: "0.12543 BTC" },
  { name: "Litecoin", iconBg: "bg-[#bfbbbb]", iconLetter: "Ł", price: "$3,245.03", change: "+14.25%", changePositive: true, amount: "0.12543 LTC" },
  { name: "Solana", iconBg: "bg-[#9945ff]", iconLetter: "S", price: "$3,245.03", change: "-2.00%", changePositive: false, amount: "0.12543 SOL" },
  { name: "Binance Coin", iconBg: "bg-[#f3ba2f]", iconLetter: "B", price: "$3,245.03", change: "+12.00%", changePositive: true, amount: "0.12543 BNB" },
];

export function MyPortfolio() {
  return (
    <Card className="bg-[#1a1b23] border border-white/5 rounded-2xl h-full">
      <CardContent className="p-6">
        <h3 className="text-white text-base font-bold [font-family:'Inter',Helvetica] mb-5">
          My Portfolio
        </h3>

        <div className="space-y-4">
          {portfolioItems.map((item) => (
            <div key={item.name} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full ${item.iconBg} flex items-center justify-center text-white text-sm font-bold`}>
                  {item.iconLetter}
                </div>
                <div>
                  <p className="text-white text-sm font-medium [font-family:'Inter',Helvetica] leading-4">{item.name}</p>
                  <p className="text-[#6b7280] text-xs [font-family:'Inter',Helvetica] leading-4 mt-0.5">{item.price}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-xs font-medium [font-family:'Inter',Helvetica] leading-4 ${item.changePositive ? "text-[#1ecb4f]" : "text-[#ef4444]"}`}>
                  {item.change}
                </p>
                <p className="text-white text-xs [font-family:'Inter',Helvetica] leading-4 mt-0.5 font-medium">{item.amount}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
