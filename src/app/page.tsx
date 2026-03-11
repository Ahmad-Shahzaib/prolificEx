import Image from "next/image";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/sections/Hero";
import { StatsSection } from "@/components/sections/Stats";
import { HowItWorksSection } from "@/components/sections/HowItWorks";
import { SupportedCoinsSection } from "@/components/sections/SupportedCoins";
import { PaymentMethodsSection } from "@/components/sections/PaymentMethods";
import { CTABanner } from "@/components/sections/CTABanner";

export default function Home() {
  return (
    <div className="bg-[#0d0d1a] overflow-hidden w-full min-w-[1440px] min-h-[4243px] relative">
      <Navbar />
      <HeroSection />

      <Image
        className="absolute top-0 left-[calc(50%_-_720px)] w-[1440px] h-[820px] z-0"
        alt="Background"
        src="/figmaAssets/image.png"
        width={1440}
        height={820}
        priority
      />
      <Image
        className="absolute top-0 left-[calc(50%_-_720px)] w-[1031px] h-[806px] z-0"
        alt="Background overlay"
        src="/figmaAssets/image-1.png"
        width={1031}
        height={806}
        priority
      />

      <Image
        className="absolute top-[593px] left-[188px] w-[1063px] h-[709px] rounded-[26px] object-cover z-10"
        alt="Dashboard preview"
        src="/figmaAssets/image-1-1.png"
        width={1063}
        height={709}
      />

      <StatsSection />
      <HowItWorksSection />
      <SupportedCoinsSection />
      <PaymentMethodsSection />
      <CTABanner />
      <Footer />
    </div>
  );
}
