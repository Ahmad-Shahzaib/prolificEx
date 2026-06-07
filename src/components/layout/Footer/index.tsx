import Link from "next/link";
import Image from "next/image";

const footerProducts = [
  { label: "P2P Trading", href: "/p2p" },
  { label: "Markets", href: "/markets" },
];
const footerCompanyLinks = [
  { label: "About", href: "/about" },
  { label: "Support", href: "/support" },
];

const footerPaymentLogos = [
  { src: "/figmaAssets/visa.png", alt: "Visa" },
  { src: "/figmaAssets/mastercard.png", alt: "Mastercard" },
  { src: "/figmaAssets/bitcoin.png", alt: "Bitcoin" },
];

const footerSocialLinks = [
  { label: "Facebook", href: "https://facebook.com", start: 6, width: 16 },
  { label: "Instagram", href: "https://instagram.com", start: 58, width: 24 },
  { label: "YouTube", href: "https://youtube.com", start: 113, width: 24 },
  { label: "Twitter", href: "https://twitter.com", start: 170, width: 24 },
  { label: "LinkedIn", href: "https://linkedin.com", start: 226, width: 24 },
];

export function Footer() {
  return (
    <footer className="w-full bg-[#0b0e11] mt-8 sm:mt-16">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 py-12 sm:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12">
          <div>
            <Image
              src="/figmaAssets/h8fhoaokhdjquwmkrvnczlagvyrx5x-2-1.png"
              alt="ProlificEx Logo"
              width={129}
              height={51}
              className="object-contain mb-4"
            />
          </div>

          <div className="flex flex-col gap-4 sm:gap-6">
            <span className="[font-family:'Inter',Helvetica] font-medium text-white text-lg sm:text-xl tracking-[0] leading-[30px]">
              Products
            </span>
            <div className="[font-family:'Inter',Helvetica] font-normal text-[#f2f2f2] text-sm sm:text-base tracking-[0] leading-[38px]">
              {footerProducts.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="block hover:text-white transition-colors no-underline"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-4 sm:gap-6">
            <span className="[font-family:'Inter',Helvetica] font-medium text-white text-lg sm:text-xl tracking-[0] leading-[30px]">
              Company
            </span>
            <div className="[font-family:'Inter',Helvetica] font-normal text-[#e0e0e0] text-sm sm:text-base tracking-[0] leading-[38px]">
              {footerCompanyLinks.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="block hover:text-white transition-colors no-underline"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className="[font-family:'Inter',Helvetica] font-medium text-white text-xl sm:text-2xl tracking-[0] leading-tight sm:leading-[48px] mb-4 sm:mb-8">
              We accept following payment systems
            </p>
            <div className="flex items-center gap-3 sm:gap-4">
              {footerPaymentLogos.map((logo) => (
                <div key={logo.alt} className="relative w-16 sm:w-24 h-10 sm:h-16">
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
        </div>

        <div className="mt-8 sm:mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="[font-family:'Rubik',Helvetica] font-normal text-white text-sm sm:text-base tracking-[0.16px] leading-7">
            © 2026 ProlificEx
          </span>
          <div className="flex items-center gap-3 sm:gap-4">
            {footerSocialLinks.map((social) => (
              <Link
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noreferrer noopener"
                aria-label={social.label}
                className="relative block"
                style={{ width: social.width, height: 24 }}
              >
                <Image
                  src="/figmaAssets/socials.png"
                  alt={`${social.label} icon`}
                  fill
                  style={{ objectFit: "none", objectPosition: `-${social.start}px 0` }}
                />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
