import Image from "next/image";

export function PaymentMethodsSection() {
  return (
    <section className="w-full max-w-[1240px] mx-auto px-4 sm:px-6 py-12 sm:py-20">
      <h2 className="mb-8 sm:mb-12 bg-[linear-gradient(90deg,rgba(255,255,255,1)_44%,rgba(255,255,255,0.2)_100%)] [-webkit-background-clip:text] bg-clip-text [-webkit-text-fill-color:transparent] [font-family:'Inter',Helvetica] font-bold text-3xl sm:text-5xl text-center leading-tight sm:leading-[67.2px]">
        Payment Methods
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 items-center justify-items-center">
        <div className="relative w-[120px] sm:w-[180px] h-[28px] sm:h-[38px]">
          <Image src="/figmaAssets/image-4.png" alt="Paystack" fill className="object-contain" />
        </div>

        <div className="relative w-[130px] sm:w-[200px] h-[26px] sm:h-[35px]">
          <Image src="/figmaAssets/image-5.png" alt="Flutterwave" fill className="object-contain" />
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="relative w-[28px] sm:w-[40px] h-[28px] sm:h-[37px]">
            <Image src="/figmaAssets/vector-2.svg" alt="Bank Transfer" fill className="object-contain" />
          </div>
          <span className="[font-family:'Inter',Helvetica] font-bold text-white text-base sm:text-2xl text-center tracking-[0] leading-tight whitespace-nowrap">
            Bank Transfer
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="relative w-[28px] sm:w-[40px] h-[28px] sm:h-[38px]">
            <Image src="/figmaAssets/vector.svg" alt="Mobile Money" fill className="object-contain" />
          </div>
          <span className="[font-family:'Inter',Helvetica] font-bold text-white text-base sm:text-2xl text-center tracking-[0] leading-tight whitespace-nowrap">
            Mobile Money
          </span>
        </div>
      </div>
    </section>
  );
}
