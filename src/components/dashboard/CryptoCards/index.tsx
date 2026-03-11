"use client";

import Image from "next/image";
import { Card, CardContent } from "@/components/common/Card";

interface CryptoAsset {
  name: string;
  ticker: string;
  icon: string;
  price: string;
  change: string;
  changePositive: boolean;
  balance: string;
  balanceUsd: string;
}

const cryptoAssets: CryptoAsset[] = [
  {
    name: "Bitcoin",
    ticker: "BTC",
    icon: "/figmaAssets/icon-1.png",
    price: "$67,234.50",
    change: "+2.34%",
    changePositive: true,
    balance: "0.2145 BTC",
    balanceUsd: "$14,421.80",
  },
  {
    name: "Tether",
    ticker: "USDT",
    icon: "/figmaAssets/image-3.png",
    price: "$1.00",
    change: "+0.01%",
    changePositive: true,
    balance: "5,840.00 USDT",
    balanceUsd: "$5,840.00",
  },
  {
    name: "USD Coin",
    ticker: "USDC",
    icon: "/figmaAssets/image-2.png",
    price: "$1.00",
    change: "-0.02%",
    changePositive: false,
    balance: "4,301.00 USDC",
    balanceUsd: "$4,301.00",
  },
];

function CryptoAssetCard({ asset }: { asset: CryptoAsset }) {
  return (
    <Card className="bg-[#1a1b23] border border-white/5 rounded-2xl hover:border-white/10 transition-colors">
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 flex-shrink-0">
              <Image src={asset.icon} alt={asset.name} fill className="object-contain" />
            </div>
            <div>
              <p className="text-white text-sm font-semibold [font-family:'Inter',Helvetica]">
                {asset.name}
              </p>
              <p className="text-[#898ca9] text-xs [font-family:'Inter',Helvetica]">
                {asset.ticker}
              </p>
            </div>
          </div>
          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium [font-family:'Inter',Helvetica] ${
              asset.changePositive
                ? "bg-[#1ecb4f]/10 text-[#1ecb4f]"
                : "bg-[#f46d22]/10 text-[#f46d22]"
            }`}
          >
            {asset.changePositive ? (
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path d="M5 8V2M5 2L2 5M5 2L8 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ) : (
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path d="M5 2V8M5 8L2 5M5 8L8 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
            {asset.change}
          </span>
        </div>

        <div className="flex items-end justify-between">
          <div>
            <p className="text-[#898ca9] text-xs [font-family:'Inter',Helvetica] mb-0.5">Price</p>
            <p className="text-white text-lg font-bold [font-family:'Inter',Helvetica]">
              {asset.price}
            </p>
          </div>
          <div className="text-right">
            <p className="text-[#898ca9] text-xs [font-family:'Inter',Helvetica] mb-0.5">Balance</p>
            <p className="text-white text-sm font-semibold [font-family:'Inter',Helvetica]">
              {asset.balance}
            </p>
            <p className="text-[#898ca9] text-xs [font-family:'Inter',Helvetica]">
              ≈ {asset.balanceUsd}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function CryptoCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {cryptoAssets.map((asset) => (
        <CryptoAssetCard key={asset.ticker} asset={asset} />
      ))}
    </div>
  );
}
