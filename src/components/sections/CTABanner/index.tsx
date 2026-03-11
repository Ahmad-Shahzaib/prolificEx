import Image from "next/image";

export function CTABanner() {
  return (
    <section className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <div className="relative bg-[#1a1b23] rounded-2xl overflow-hidden px-6 sm:px-12 py-10 sm:py-16 min-h-[180px] sm:min-h-[255px] flex items-center justify-center">
        <div className="absolute top-[-38px] left-0 sm:left-[22px] w-24 sm:w-40 h-[200px] sm:h-[259px] hidden sm:block">
          <Image src="/figmaAssets/vector-3.svg" alt="Decoration" fill className="object-contain" />
        </div>
        <div className="absolute bottom-0 right-4 sm:right-8 w-20 sm:w-[140px] h-[140px] sm:h-[185px] hidden sm:block opacity-50">
          <Image src="/figmaAssets/vector-1.svg" alt="Decoration" fill className="object-contain" />
        </div>
        <div className="relative z-10 w-full max-w-[501px] mx-auto">
          <Image
            src="/figmaAssets/text.png"
            alt="Ready to Start Trading?"
            width={501}
            height={186}
            className="w-full h-auto object-contain"
          />
        </div>
      </div>
    </section>
  );
}
