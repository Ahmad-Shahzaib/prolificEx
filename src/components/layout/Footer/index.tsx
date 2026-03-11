import Image from "next/image";

const footerProducts = ["P2P Trading", "Markets", "Wallet"];
const footerCompanyLinks = ["About", "Careers", "Support"];

const footerPaymentLogos = [
  { src: "/figmaAssets/visa.png", alt: "Visa" },
  { src: "/figmaAssets/mastercard.png", alt: "Mastercard" },
  { src: "/figmaAssets/bitcoin.png", alt: "Bitcoin" },
];

export function Footer() {
  return (
    <footer className="absolute left-[calc(50%_-_720px)] bottom-0 w-[1440px] h-[482px] bg-[#0b0e11]">
      <div className="relative w-full h-full">
        <div className="absolute top-20 left-[120px]">
          <Image
            src="/figmaAssets/h8fhoaokhdjquwmkrvnczlagvyrx5x-2-1.png"
            alt="ProlificEx Logo"
            width={129}
            height={51}
            className="object-contain"
          />
        </div>

        <div className="absolute top-20 left-[426px] w-[104px] flex flex-col gap-6">
          <span className="[font-family:'Inter',Helvetica] font-medium text-white text-xl tracking-[0] leading-[30px] whitespace-nowrap">
            Products
          </span>
          <div className="[font-family:'Inter',Helvetica] font-normal text-[#f2f2f2] text-base tracking-[0] leading-[38px]">
            {footerProducts.map((item) => (
              <div key={item} className="hover:text-white cursor-pointer transition-colors">
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="absolute top-20 left-[594px] flex flex-col gap-6">
          <span className="[font-family:'Inter',Helvetica] font-medium text-white text-xl tracking-[0] leading-[30px] whitespace-nowrap">
            Company
          </span>
          <div className="[font-family:'Inter',Helvetica] font-normal text-[#e0e0e0] text-base tracking-[0] leading-[38px]">
            {footerCompanyLinks.map((item) => (
              <div key={item} className="hover:text-white cursor-pointer transition-colors">
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="absolute top-20 left-[756px] flex flex-col gap-6">
          <span className="[font-family:'Inter',Helvetica] font-medium text-white text-xl tracking-[0] leading-[30px] whitespace-nowrap">
            Company
          </span>
          <div className="[font-family:'Inter',Helvetica] font-normal text-[#e0e0e0] text-base tracking-[0] leading-[38px]">
            {footerCompanyLinks.map((item) => (
              <div key={item} className="hover:text-white cursor-pointer transition-colors">
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="absolute top-20 left-[965px] w-[357px]">
          <p className="[font-family:'Inter',Helvetica] font-medium text-white text-[32px] tracking-[0] leading-[48px] mb-8">
            We accept following payment systems
          </p>
          <div className="flex items-center gap-4">
            {footerPaymentLogos.map((logo) => (
              <div key={logo.alt} className="relative w-24 h-16">
                <Image
                  src={logo.src}
                  alt={logo.alt}
                  fill
                  className="object-contain"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="absolute top-[370px] left-[120px] w-[1200px] h-px bg-white/10" />

        <div className="absolute top-[389px] left-[120px] [font-family:'Rubik',Helvetica] font-normal text-white text-base tracking-[0.16px] leading-7">
          © 2026 ProlificEx
        </div>

        <div className="absolute top-[391px] left-[1072px]">
          <Image
            src="/figmaAssets/socials.png"
            alt="Social media links"
            width={248}
            height={24}
            className="object-contain"
          />
        </div>
      </div>
    </footer>
  );
}
