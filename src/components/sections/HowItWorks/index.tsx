import Image from "next/image";
import { Card, CardContent } from "@/components/common/Card";
import { HowItWorksItem } from "@/types";

const howItWorksData: HowItWorksItem[] = [
  {
    img: "/figmaAssets/img.svg",
    title: "Create Account",
    description: "Sign up in seconds with your email or phone number.",
  },
  {
    img: "/figmaAssets/img-1.svg",
    title: "Verify Identity",
    description: "Complete KYC to unlock higher trading limits.",
  },
  {
    img: "/figmaAssets/img-2.svg",
    title: "Trade",
    description: "Buy and sell crypto instantly using P2P offers.",
  },
];

interface HowItWorksCardProps {
  item: HowItWorksItem;
}

function HowItWorksCard({ item }: HowItWorksCardProps) {
  return (
    <Card
      variant="howItWorks"
      className="flex flex-col items-center gap-6 sm:gap-8 px-4 sm:px-6 py-6 sm:py-8"
    >
      <CardContent className="flex flex-col items-center gap-4 p-0 w-full">
        <div className="relative w-16 h-16 sm:w-20 sm:h-[87.84px]">
          <Image src={item.img} alt={item.title} fill className="object-contain" />
        </div>
        <h3 className="[font-family:'Inter',Helvetica] font-extrabold text-white text-xl sm:text-[32px] text-center tracking-[0] leading-tight sm:leading-[41.6px]">
          {item.title}
        </h3>
        <p className="[font-family:'Inter',Helvetica] font-normal text-[#898ca9] text-sm sm:text-base text-center tracking-[0] leading-6">
          {item.description}
        </p>
      </CardContent>
    </Card>
  );
}

export function HowItWorksSection() {
  return (
    <section className="w-full max-w-[1240px] mx-auto px-4 sm:px-6 py-12 sm:py-20">
      <h2 className="mb-8 sm:mb-12 bg-[linear-gradient(90deg,rgba(255,255,255,1)_44%,rgba(255,255,255,0.2)_100%)] [-webkit-background-clip:text] bg-clip-text [-webkit-text-fill-color:transparent] [font-family:'Inter',Helvetica] font-bold text-3xl sm:text-5xl text-center leading-tight sm:leading-[67.2px]">
        How It Works
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-[30px]">
        {howItWorksData.map((item) => (
          <HowItWorksCard key={item.title} item={item} />
        ))}
      </div>
    </section>
  );
}
