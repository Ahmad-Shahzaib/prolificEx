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
      className="flex flex-col w-[380px] items-center gap-8 px-6 py-8"
    >
      <CardContent className="flex flex-col items-center gap-4 p-0 w-full">
        <div className="relative w-20 h-[87.84px] mt-[-7.84px]">
          <Image src={item.img} alt={item.title} fill className="object-contain" />
        </div>
        <h3 className="w-fit [font-family:'Inter',Helvetica] font-extrabold text-white text-[32px] text-center tracking-[0] leading-[41.6px] whitespace-nowrap">
          {item.title}
        </h3>
        <p className="self-stretch [font-family:'Inter',Helvetica] font-normal text-[#898ca9] text-base text-center tracking-[0] leading-6">
          {item.description}
        </p>
      </CardContent>
    </Card>
  );
}

export function HowItWorksSection() {
  return (
    <section className="absolute top-[1670px] left-0 w-full">
      <h2 className="w-96 mx-auto h-[67px] flex items-center justify-center bg-[linear-gradient(90deg,rgba(255,255,255,1)_44%,rgba(255,255,255,0.2)_100%)] [-webkit-background-clip:text] bg-clip-text [-webkit-text-fill-color:transparent] [font-family:'Inter',Helvetica] font-bold text-transparent text-5xl text-center tracking-[0] leading-[67.2px]">
        How It Works
      </h2>

      <div className="absolute top-[97px] left-[calc(50%_-_620px)] flex gap-[30px]">
        {howItWorksData.map((item) => (
          <HowItWorksCard key={item.title} item={item} />
        ))}
      </div>
    </section>
  );
}
