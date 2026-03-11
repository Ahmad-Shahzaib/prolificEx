import Image from "next/image";
import { StatItem } from "@/types";

const statsData: StatItem[] = [
  { icon: "/figmaAssets/icon-4.png", value: "10K+", label: "Users" },
  { icon: "/figmaAssets/icon.png", value: "50K+", label: "Trades" },
  { icon: "/figmaAssets/icon-2.png", value: "4", label: "Countries" },
  { icon: "/figmaAssets/icon-3.png", value: "$20M+", label: "Volume" },
];

interface StatsCardProps {
  stat: StatItem;
}

function StatsCard({ stat }: StatsCardProps) {
  return (
    <div className="flex items-center gap-4 sm:gap-6">
      <div className="relative w-14 h-14 sm:w-20 sm:h-20 flex-shrink-0">
        <Image src={stat.icon} alt={stat.label} fill className="object-contain" />
      </div>
      <div className="flex flex-col">
        <span className="[font-family:'Inter',Helvetica] font-bold text-white text-2xl sm:text-[40px] tracking-[0] leading-tight sm:leading-[60px] whitespace-nowrap">
          {stat.value}
        </span>
        <span className="[font-family:'Inter',Helvetica] font-normal text-[#e0e0e0] text-sm sm:text-base tracking-[0.16px] leading-7">
          {stat.label}
        </span>
      </div>
    </div>
  );
}

export function StatsSection() {
  return (
    <section className="w-full max-w-[1240px] mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
        {statsData.map((stat) => (
          <StatsCard key={stat.label} stat={stat} />
        ))}
      </div>
    </section>
  );
}
