import Image from "next/image";
import { Button } from "@/components/common/Button";
import { Badge } from "@/components/common/Badge";
import { FeatureBadge } from "@/types";

const featureBadges: FeatureBadge[] = [
  { icon: "/figmaAssets/63011f1ba65dd9532c03e563-line-svg.svg", label: "Fast Trading" },
  { icon: "/figmaAssets/63011f1a01baa4acd99a562a-corner-svg.svg", label: "Secure & Reliable" },
  { icon: "/figmaAssets/frame-7.svg", label: "Continuous Market Updates" },
];

export function HeroSection() {
  return (
    <section className="relative z-10 flex flex-col items-center gap-8 sm:gap-12 px-4 sm:px-6 pt-16 sm:pt-24 pb-20 sm:pb-32 max-w-[1240px] mx-auto text-center">
      <div className="flex flex-col items-center gap-4 sm:gap-6 w-full pt-6">
        <h1 className="w-full bg-[linear-gradient(90deg,rgba(255,255,255,1)_44%,rgba(255,255,255,0.2)_100%)] [-webkit-background-clip:text] bg-clip-text [-webkit-text-fill-color:transparent] [text-fill-color:transparent] font-bold text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-tight sm:leading-[1.1] text-center">
          Buy & Sell Crypto with Ease
        </h1>

        <p className="w-full max-w-[818px] font-medium text-[#a6aab2] text-base sm:text-lg leading-relaxed px-2">
          Trade BTC, USDT and USDC securely using trusted P2P merchants across Africa.
        </p>
      </div>

      {/* Feature Badges */}
      <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
        {featureBadges.map((badge) => (
          <Badge 
            key={badge.label} 
            icon={badge.icon} 
            label={badge.label} 
            iconAlt={badge.label} 
          />
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto max-w-md sm:max-w-none">
        <Button
          variant="primary"
          size="lg"
          className="w-full sm:w-auto shadow-[0px_16px_32px_-8px_rgba(124,58,237,0.48),0px_4px_8px_rgba(124,58,237,0.12)] [background:radial-gradient(50%_50%_at_50%_50%,rgba(255,255,255,0.12)_0%,rgba(0,0,0,0)_100%),linear-gradient(0deg,rgba(124,58,237,1)_0%,rgba(124,58,237,1)_100%)] rounded-[48px] py-4"
          leftIcon={
            <div className="relative w-6 h-6">
              <Image 
                src="/figmaAssets/62e275df6d0fc5b329129b81-fire-svg.svg" 
                alt="Fire" 
                fill 
                className="object-contain" 
              />
            </div>
          }
        >
          <span className="font-medium text-white text-base sm:text-lg whitespace-nowrap">
            Start Trading
          </span>
        </Button>

        <Button
          variant="primary"
          size="lg"
          className="w-full sm:w-auto shadow-[0px_16px_32px_-8px_rgba(124,58,237,0.48),0px_4px_8px_rgba(124,58,237,0.12)] bg-transparent rounded-[48px] py-4"
          leftIcon={
            <div className="relative w-6 h-6">
              <Image 
                src="/figmaAssets/63011d2ad7739c0ae2d6a345-gift-svg.svg" 
                alt="Gift" 
                fill 
                className="object-contain" 
              />
            </div>
          }
        >
          <span className="font-medium text-white text-base sm:text-lg whitespace-nowrap">
            Sign Up Free
          </span>
        </Button>
      </div>
    </section>
  );
}