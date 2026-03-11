import Image from "next/image";

export function CTABanner() {
  return (
    <div className="top-[3387px] left-[120px] w-[1200px] h-[255px] absolute bg-[#1a1b23] rounded-2xl overflow-hidden">
      <div className="absolute top-[81px] left-[1045px] w-[140px] h-[185px]">
        <Image src="/figmaAssets/vector-1.svg" alt="Decoration" fill className="object-contain" />
      </div>
      <div className="absolute top-[-38px] left-[22px] w-40 h-[259px]">
        <Image src="/figmaAssets/vector-3.svg" alt="Decoration" fill className="object-contain" />
      </div>
      <div className="absolute top-[29px] left-[349px] w-[501px] h-[186px]">
        <Image src="/figmaAssets/text.png" alt="Ready to Start Trading?" fill className="object-contain" />
      </div>
    </div>
  );
}
