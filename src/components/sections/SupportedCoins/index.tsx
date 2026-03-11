import Image from "next/image";
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
  return (
    <Card variant="coin" className="flex flex-col items-center px-4 sm:px-6 py-8 sm:py-12">
      <div className="relative w-16 h-16 sm:w-20 sm:h-20 mb-6 sm:mb-8">
        <Image src={icon} alt={name} fill className="object-contain" />
      </div>

      <div className="flex items-baseline gap-2 sm:gap-[11px] mb-4">
        <span className="[font-family:'Inter',Helvetica] font-bold text-white text-2xl sm:text-[32px] text-center leading-tight whitespace-nowrap">
          {name}
        </span>
        <span className={`[font-family:'Inter',Helvetica] font-medium ${variant === "bitcoin" ? "text-white opacity-70" : "text-[#bdbdbd]"} text-base sm:text-lg text-center leading-[27px] whitespace-nowrap`}>
          {ticker}
        </span>
      </div>

      <p className={`[font-family:'Inter',Helvetica] font-normal ${variant === "bitcoin" ? "text-white" : "text-[#828282]"} text-sm sm:text-base text-center tracking-[0.16px] leading-7 mb-6 sm:mb-8 max-w-[322px]`}>
        {description}
      </p>

      {actionLabel && actionIcon && (
        <button className="inline-flex items-center justify-center gap-4 sm:gap-6 pl-4 sm:pl-6 pr-3 sm:pr-4 py-3 sm:py-4 bg-violet-600 rounded-[32px] overflow-hidden cursor-pointer border-none hover:bg-violet-700 transition-colors">
          <span className="[font-family:'Rubik',Helvetica] font-medium text-white text-base sm:text-lg text-center leading-[27px] whitespace-nowrap">
            {actionLabel}
          </span>
          <div className="relative w-6 h-6 sm:w-8 sm:h-8">
            <Image src={actionIcon} alt="arrow" fill className="object-contain" />
          </div>
        </button>
      )}

      {arrowIcon && (
        <div className="relative w-12 h-12 sm:w-16 sm:h-16">
          <Image src={arrowIcon} alt="arrow right" fill className="object-contain" />
        </div>
      )}
    </Card>
  );
}

export function SupportedCoinsSection() {
  return (
    <section className="w-full max-w-[1240px] mx-auto px-4 sm:px-6 py-12 sm:py-20">
      <h2 className="mb-8 sm:mb-12 bg-[linear-gradient(90deg,rgba(255,255,255,1)_44%,rgba(255,255,255,0.2)_100%)] [-webkit-background-clip:text] bg-clip-text [-webkit-text-fill-color:transparent] [font-family:'Inter',Helvetica] font-bold text-3xl sm:text-5xl text-center leading-tight sm:leading-[67.2px]">
        Supported Coins Section
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-[34px]">
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
