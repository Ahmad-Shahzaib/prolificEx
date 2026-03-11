import Image from "next/image";
import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";

interface CoinCardProps {
  icon: string;
  name: string;
  ticker: string;
  description: string;
  variant?: "bitcoin" | "default";
  actionLabel?: string;
  actionIcon?: string;
  arrowIcon?: string;
}

function CoinCard({
  icon,
  name,
  ticker,
  description,
  variant = "default",
  actionLabel,
  actionIcon,
  arrowIcon,
}: CoinCardProps) {
  const isBitcoin = variant === "bitcoin";

  return (
    <Card variant="coin" className="w-[370px] h-[433px] relative">
      <div className="absolute top-[48px] left-[142px] w-20 h-20">
        <Image src={icon} alt={name} fill className="object-contain" />
      </div>

      <div className="absolute top-[176px] left-0 right-0 flex justify-center items-baseline gap-[11px]">
        <span
          className={`[font-family:'Inter',Helvetica] font-bold ${isBitcoin ? "text-white" : "text-white"} text-[32px] text-center leading-[48px] whitespace-nowrap`}
        >
          {name}
        </span>
        <span
          className={`[font-family:'Inter',Helvetica] font-medium ${isBitcoin ? "text-white opacity-70" : "text-[#bdbdbd]"} text-lg text-center leading-[27px] whitespace-nowrap`}
        >
          {ticker}
        </span>
      </div>

      <div
        className={`absolute top-[240px] left-[24px] w-[322px] [font-family:'Inter',Helvetica] font-normal ${isBitcoin ? "text-white" : "text-[#828282]"} text-base text-center tracking-[0.16px] leading-7`}
      >
        {description}
      </div>

      {actionLabel && actionIcon && (
        <button className="inline-flex items-center justify-center gap-6 pl-6 pr-4 py-4 absolute top-[331px] left-[68px] bg-violet-600 rounded-[32px] overflow-hidden cursor-pointer border-none hover:bg-violet-700 transition-colors">
          <span className="[font-family:'Rubik',Helvetica] font-medium text-white text-lg text-center leading-[27px] whitespace-nowrap">
            {actionLabel}
          </span>
          <div className="relative w-8 h-8">
            <Image src={actionIcon} alt="arrow" fill className="object-contain" />
          </div>
        </button>
      )}

      {arrowIcon && (
        <div className="absolute top-[321px] left-[153px] w-16 h-16">
          <Image src={arrowIcon} alt="arrow right" fill className="object-contain" />
        </div>
      )}
    </Card>
  );
}

export function SupportedCoinsSection() {
  return (
    <section className="absolute top-[2220px] left-0 w-full">
      <h2 className="w-[614px] mx-auto h-[67px] flex items-center justify-center bg-[linear-gradient(90deg,rgba(255,255,255,1)_44%,rgba(255,255,255,0.2)_100%)] [-webkit-background-clip:text] bg-clip-text [-webkit-text-fill-color:transparent] [font-family:'Inter',Helvetica] font-bold text-transparent text-5xl text-center tracking-[0] leading-[67.2px]">
        Supported Coins Section
      </h2>

      <div className="absolute top-[118px] left-[99px] flex gap-[34px]">
        <CoinCard
          icon="/figmaAssets/icon-1.png"
          name="Bitcoin"
          ticker="BTC"
          description="World's largest cryptocurrency used for secure digital payments."
          variant="bitcoin"
          actionLabel="Trade BTC"
          actionIcon="/figmaAssets/group-16.png"
        />
        <CoinCard
          icon="/figmaAssets/image-3.png"
          name="Tether"
          ticker="USDT"
          description="Stablecoin pegged to USD widely used for crypto trading."
          arrowIcon="/figmaAssets/arrow-right.png"
        />
        <CoinCard
          icon="/figmaAssets/image-2.png"
          name="USD Coin"
          ticker="USDC"
          description="Fully backed digital dollar used across crypto markets."
          arrowIcon="/figmaAssets/arrow-right-1.png"
        />
      </div>
    </section>
  );
}
