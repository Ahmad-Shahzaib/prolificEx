import Image from "next/image";

export function PaymentMethodsSection() {
  return (
    <section className="absolute top-[2926px] left-0 w-full">
      <h2 className="w-[715px] mx-auto h-[67px] flex items-center justify-center bg-[linear-gradient(90deg,rgba(255,255,255,1)_44%,rgba(255,255,255,0.2)_100%)] [-webkit-background-clip:text] bg-clip-text [-webkit-text-fill-color:transparent] [font-family:'Inter',Helvetica] font-bold text-transparent text-5xl text-center tracking-[0] leading-[67.2px]">
        Payment Methods
      </h2>

      <div className="absolute top-[146px] left-[99px] w-[1232px] h-[38px] flex items-center">
        <div className="relative w-[200px] h-[38px]">
          <Image src="/figmaAssets/image-4.png" alt="Paystack" fill className="object-contain object-left" />
        </div>

        <div className="relative mt-0.5 w-[216px] h-[35px] ml-32">
          <Image src="/figmaAssets/image-5.png" alt="Flutterwave" fill className="object-contain object-left" />
        </div>

        <div className="mt-px w-56 h-[37px] relative ml-32 flex items-center gap-3">
          <div className="relative w-[40px] h-full">
            <Image src="/figmaAssets/vector-2.svg" alt="Bank Transfer" fill className="object-contain" />
          </div>
          <span className="[font-family:'Inter',Helvetica] font-bold text-white text-2xl text-center tracking-[0] leading-9 whitespace-nowrap">
            Bank Transfer
          </span>
        </div>

        <div className="w-[212px] h-[38px] relative ml-[126px] flex items-center gap-3">
          <div className="relative w-[40px] h-full">
            <Image src="/figmaAssets/vector.svg" alt="Mobile Money" fill className="object-contain" />
          </div>
          <span className="[font-family:'Inter',Helvetica] font-bold text-white text-2xl text-center tracking-[0] leading-9 whitespace-nowrap">
            Mobile Money
          </span>
        </div>
      </div>
    </section>
  );
}
