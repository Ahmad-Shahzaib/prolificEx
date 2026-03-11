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
    <section className="inline-flex flex-col items-center gap-10 absolute top-[211px] left-[100px] w-[1240px] z-10">
      <div className="inline-flex flex-col items-center gap-6 relative flex-[0_0_auto] w-full">
        <div className="inline-flex flex-col items-start relative flex-[0_0_auto] w-full">
          <h1 className="relative flex items-center justify-center w-full mt-[-1.00px] bg-[linear-gradient(90deg,rgba(255,255,255,1)_44%,rgba(255,255,255,0.2)_100%)] [-webkit-background-clip:text] bg-clip-text [-webkit-text-fill-color:transparent] [text-fill-color:transparent] [font-family:'Inter',Helvetica] font-bold text-transparent text-6xl text-center tracking-[0] leading-[84px]">
            Buy &amp; Sell Crypto with Ease
          </h1>
        </div>

        <p className="relative flex items-center justify-center w-[818px] [font-family:'Inter',Helvetica] font-medium text-[#a6aab2] text-lg text-center tracking-[0] leading-6">
          Trade BTC, USDT and USDC securely using trusted P2P merchants across Africa.
        </p>
      </div>

      <div className="inline-flex items-start gap-6 relative flex-[0_0_auto]">
        {featureBadges.map((badge) => (
          <Badge key={badge.label} icon={badge.icon} label={badge.label} iconAlt={badge.label} />
        ))}
      </div>

      <div className="inline-flex items-start gap-6 relative flex-[0_0_auto]">
        <Button
          variant="primary"
          size="lg"
          className="shadow-[0px_16px_32px_-8px_#f0b90b7a,0px_4px_8px_#f0b90b1f,0px_2px_6px_#f0b90b3d,0px_1px_3px_#f0b90b3d,inset_1px_1px_2px_#ffffff3d] [background:radial-gradient(50%_50%_at_50%_50%,rgba(255,255,255,0.12)_0%,rgba(0,0,0,0)_100%),linear-gradient(0deg,rgba(124,58,237,1)_0%,rgba(124,58,237,1)_100%)] rounded-[48px]"
          leftIcon={
            <div className="relative w-6 h-6">
              <Image src="/figmaAssets/62e275df6d0fc5b329129b81-fire-svg.svg" alt="Fire" fill className="object-contain" />
            </div>
          }
        >
          <span className="[font-family:'Inter',Helvetica] font-medium text-white text-lg text-center leading-6 whitespace-nowrap">
            Start Trading
          </span>
        </Button>

        <Button
          variant="secondary"
          size="lg"
          className="w-[200px]"
          leftIcon={
            <div className="relative w-6 h-6">
              <Image src="/figmaAssets/63011d2ad7739c0ae2d6a345-gift-svg.svg" alt="Gift" fill className="object-contain" />
            </div>
          }
        >
          <span className="[font-family:'Inter',Helvetica] font-medium text-white text-lg text-center leading-6 whitespace-nowrap">
            Sign Up Free
          </span>
        </Button>
      </div>
    </section>
  );
}
