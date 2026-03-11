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
    <div className="bg-[#0d0d1a] overflow-hidden w-full relative">
      <div className="relative min-h-[600px] sm:min-h-[820px]">
        <Image
          className="absolute inset-0 w-full h-full object-cover z-0"
          alt="Background"
          src="/figmaAssets/image.png"
          width={1440}
          height={820}
          priority
        />
        <Image
          className="absolute top-0 left-0 w-full max-w-[1031px] h-auto z-0"
          alt="Background overlay"
          src="/figmaAssets/image-1.png"
          width={1031}
          height={806}
          priority
        />
        <Navbar />
        <HeroSection />
      </div>

      <div className="relative w-full max-w-[1100px] mx-auto px-4 sm:px-6 -mt-[100px] sm:-mt-[180px] z-10 mb-16 sm:mb-24">
        <Image
          className="w-full rounded-2xl sm:rounded-[26px] object-cover"
          alt="Dashboard preview"
          src="/figmaAssets/image-1-1.png"
          width={1063}
          height={709}
        />
      </div>

      <StatsSection />
      <HowItWorksSection />
      <SupportedCoinsSection />
      <PaymentMethodsSection />
      <CTABanner />
      <Footer />
    </div>
  );
}
