import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

// Navigation links data
const navLinks = ["Markets", "P2P", "About"];

// Stats data
const statsData = [
  {
    icon: "/figmaAssets/icon-4.png",
    value: "10K+",
    label: "Users",
  },
  {
    icon: "/figmaAssets/icon.png",
    value: "50K+",
    label: "Trades",
  },
  {
    icon: "/figmaAssets/icon-2.png",
    value: "4",
    label: "Countries",
  },
  {
    icon: "/figmaAssets/icon-3.png",
    value: "$20M+",
    label: "Volume",
  },
];

// How It Works data
const howItWorksData = [
  {
    img: "/figmaAssets/img.svg",
    title: "Create Account",
    description: "Sign up in seconds with your email or phone number.",
    href: "https://www.figma.com/file/6Noyh5yp83iXms3L4iW5pr?type=design&node-id=0-1&mode=design",
  },
  {
    img: "/figmaAssets/img-1.svg",
    title: "Verify Identity",
    description: "Complete KYC to unlock higher trading limits.",
    href: "https://www.figma.com/file/6Noyh5yp83iXms3L4iW5pr?type=design&node-id=0-1&mode=design",
  },
  {
    img: "/figmaAssets/img-2.svg",
    title: "Trade",
    description: "Buy and sell crypto instantly using P2P offers.",
    href: "https://www.figma.com/file/6Noyh5yp83iXms3L4iW5pr?type=design&node-id=0-1&mode=design",
  },
];

// Supported coins data
const coinsData = [
  {
    icon: "/figmaAssets/icon-1.png",
    iconBg: "",
    name: "Bitcoin",
    ticker: "BTC",
    tickerOpacity: "opacity-70",
    description:
      "World's largest cryptocurrency used for secure digital payments.",
    actionLabel: "Trade BTC",
    actionIcon: "/figmaAssets/group-16.png",
    arrowIcon: null,
    textColor: "text-neutral-white",
    descColor: "text-neutral-white",
    tickerColor: "text-neutral-white",
  },
  {
    icon: "/figmaAssets/image-3.png",
    iconBg: "bg-[100%_100%]",
    name: "Tether",
    ticker: "USDT",
    tickerOpacity: "",
    description: "Stablecoin pegged to USD widely used for crypto trading.",
    actionLabel: null,
    actionIcon: null,
    arrowIcon: "/figmaAssets/arrow-right.png",
    textColor: "text-white",
    descColor: "text-neutral-grey-3",
    tickerColor: "text-neutralgrey-4",
  },
  {
    icon: "/figmaAssets/image-2.png",
    iconBg: "rounded-[40px] bg-cover bg-[50%_50%]",
    name: "USD Coin",
    ticker: "USDC",
    tickerOpacity: "",
    description: "Fully backed digital dollar used across crypto markets.",
    actionLabel: null,
    actionIcon: null,
    arrowIcon: "/figmaAssets/arrow-right-1.png",
    textColor: "text-white",
    descColor: "text-neutral-grey-3",
    tickerColor: "text-neutralgrey-4",
  },
];

// Feature badges data
const featureBadges = [
  {
    icon: "/figmaAssets/63011f1ba65dd9532c03e563-line-svg.svg",
    label: "Fast Trading",
  },
  {
    icon: "/figmaAssets/63011f1a01baa4acd99a562a-corner-svg.svg",
    label: "Secure & Reliable",
  },
  {
    icon: "/figmaAssets/frame-7.svg",
    label: "Continuous Market Updates",
  },
];

// Footer products links
const footerProducts = ["P2P Trading", "Markets", "Wallet"];

// Footer company links (two columns)
const footerCompanyLinks = ["About", "Careers", "Support"];

// Payment method logos in footer
const footerPaymentLogos = [
  { src: "/figmaAssets/visa.png", alt: "Visa" },
  { src: "/figmaAssets/mastercard.png", alt: "Mastercard" },
  { src: "/figmaAssets/bitcoin.png", alt: "Bitcoin" },
];

export const Frame = (): JSX.Element => {
  return (
    <div className="bg-[#0d0d1a] overflow-hidden w-full min-w-[1440px] min-h-[4243px] relative">
      {/* ===== NAVIGATION BAR ===== */}
      <nav className="absolute top-10 left-[100px] w-[1240px] h-16 flex items-center">
        {/* Logo */}
        <img
          className="absolute top-1.5 left-0 w-[129px] h-[51px]"
          alt="ProlificEx Logo"
          src="/figmaAssets/h8fhoaokhdjquwmkrvnczlagvyrx5x-2.png"
        />

        {/* Center nav links */}
        <div className="inline-flex h-12 items-center px-4 py-3 absolute top-2 left-[calc(50.00%_-_134px)] bg-[#ffffff26] rounded-[999px] border border-solid border-white/10 backdrop-blur-[20px] backdrop-brightness-[100%] [-webkit-backdrop-filter:blur(20px)_brightness(100%)]">
          {navLinks.map((link) => (
            <button
              key={link}
              className="inline-flex items-start px-4 py-0.5 relative flex-[0_0_auto] mt-[-2.00px] mb-[-2.00px] cursor-pointer bg-transparent border-none"
            >
              <span className="relative flex items-center w-fit mt-[-1.00px] [font-family:'Inter',Helvetica] font-medium text-[#ffffffe6] text-base tracking-[0] leading-6 whitespace-nowrap">
                {link}
              </span>
            </button>
          ))}
        </div>

        {/* Right side: Login + Sign Up */}
        <div className="inline-flex items-center gap-5 absolute top-2 left-[1032px]">
          <button className="inline-flex items-center px-3 py-0.5 relative flex-[0_0_auto] bg-transparent border-none cursor-pointer">
            <span className="relative flex items-center w-fit mt-[-1.00px] [font-family:'Inter',Helvetica] font-medium text-[#ffffffe6] text-base tracking-[0] leading-6 whitespace-nowrap">
              Login
            </span>
          </button>

          <Button className="inline-flex max-w-[346.44px] items-center justify-center gap-[11px] pl-6 pr-7 py-3 h-auto flex-[0_0_auto] bg-violet-600 border-none relative rounded-[48px] overflow-hidden before:content-[''] before:absolute before:inset-0 before:p-px before:rounded-[48px] before:[background:linear-gradient(180deg,rgba(124,58,237,1)_0%,rgba(124,58,237,0)_100%)] before:[-webkit-mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)] before:[-webkit-mask-composite:xor] before:[mask-composite:exclude] before:z-[1] before:pointer-events-none hover:bg-violet-700">
            <span className="relative flex items-center justify-center w-fit mt-[-1.00px] [font-family:'Inter',Helvetica] font-medium text-white text-lg text-center tracking-[0] leading-6 whitespace-nowrap">
              Sign Up
            </span>
          </Button>
        </div>
      </nav>

      {/* ===== HERO SECTION ===== */}
      <section className="inline-flex flex-col items-center gap-10 absolute top-[211px] left-[100px] w-[1240px]">
        {/* Headline + subtitle */}
        <div className="inline-flex flex-col items-center gap-6 relative flex-[0_0_auto] w-full">
          <div className="inline-flex flex-col items-start relative flex-[0_0_auto] w-full">
            <h1 className="relative flex items-center justify-center w-full mt-[-1.00px] bg-[linear-gradient(90deg,rgba(255,255,255,1)_44%,rgba(255,255,255,0.2)_100%)] [-webkit-background-clip:text] bg-clip-text [-webkit-text-fill-color:transparent] [text-fill-color:transparent] [font-family:'Inter',Helvetica] font-bold text-transparent text-6xl text-center tracking-[0] leading-[84px]">
              Buy &amp; Sell Crypto with Ease
            </h1>
          </div>

          <p className="relative flex items-center justify-center w-[818px] [font-family:'Inter',Helvetica] font-medium text-[#a6aab2] text-lg text-center tracking-[0] leading-6">
            Trade BTC, USDT and USDC securely using trustedP2P merchants across
            Africa.
          </p>
        </div>

        {/* Feature badges */}
        <div className="inline-flex items-start gap-6 relative flex-[0_0_auto]">
          {featureBadges.map((badge) => (
            <div
              key={badge.label}
              className="inline-flex items-center gap-2 relative flex-[0_0_auto]"
            >
              <img
                className="relative w-9 h-9"
                alt={badge.label}
                src={badge.icon}
              />
              <span className="relative flex items-center w-fit [font-family:'Inter',Helvetica] font-medium text-white text-lg tracking-[0] leading-6 whitespace-nowrap">
                {badge.label}
              </span>
            </div>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="inline-flex items-start gap-6 relative flex-[0_0_auto]">
          {/* Start Trading button */}
          <button className="inline-flex max-w-[346.44px] items-center justify-center gap-[11px] pl-6 pr-7 py-4 flex-[0_0_auto] shadow-[0px_16px_32px_-8px_#f0b90b7a,0px_4px_8px_#f0b90b1f,0px_2px_6px_#f0b90b3d,0px_1px_3px_#f0b90b3d,inset_1px_1px_2px_#ffffff3d] [background:radial-gradient(50%_50%_at_50%_50%,rgba(255,255,255,0.12)_0%,rgba(0,0,0,0)_100%),linear-gradient(0deg,rgba(124,58,237,1)_0%,rgba(124,58,237,1)_100%)] relative rounded-[48px] overflow-hidden cursor-pointer border-none">
            <img
              className="relative max-w-[157.5px] w-6"
              alt="Fire"
              src="/figmaAssets/62e275df6d0fc5b329129b81-fire-svg.svg"
            />
            <span className="relative flex items-center justify-center w-fit mt-[-1.00px] [font-family:'Inter',Helvetica] font-medium text-white text-lg text-center tracking-[0] leading-6 whitespace-nowrap">
              Start Trading
            </span>
          </button>

          {/* Sign Up Free button */}
          <button className="flex w-[200px] items-start gap-3 pl-6 pr-7 py-4 shadow-[inset_0px_0px_0px_1px_#ffffff0f,inset_1px_1px_0px_#ffffff14,0px_8px_40px_-20px_#ffffff33] [background:radial-gradient(50%_50%_at_50%_50%,rgba(255,255,255,0.08)_0%,rgba(255,255,255,0)_100%),linear-gradient(0deg,rgba(255,255,255,0.04)_0%,rgba(255,255,255,0.04)_100%)] relative rounded-[48px] overflow-hidden cursor-pointer border-none">
            <img
              className="relative max-w-[164.94px] w-6"
              alt="Gift"
              src="/figmaAssets/63011d2ad7739c0ae2d6a345-gift-svg.svg"
            />
            <span className="relative flex items-center justify-center w-fit mt-[-1.00px] [font-family:'Inter',Helvetica] font-medium text-white text-lg text-center tracking-[0] leading-6 whitespace-nowrap">
              Sign Up Free
            </span>
          </button>
        </div>
      </section>

      {/* ===== BACKGROUND IMAGES ===== */}
      <img
        className="absolute top-0 left-[calc(50.00%_-_720px)] w-[1440px] h-[820px]"
        alt="Background"
        src="/figmaAssets/image.png"
      />

      <img
        className="absolute top-0 left-[calc(50.00%_-_720px)] w-[1031px] h-[806px]"
        alt="Background overlay"
        src="/figmaAssets/image-1.png"
      />

      {/* ===== DASHBOARD SCREENSHOT ===== */}
      <img
        className="absolute top-[593px] left-[188px] w-[1063px] h-[709px] rounded-[26px] object-cover"
        alt="Dashboard preview"
        src="/figmaAssets/image-1-1.png"
      />

      {/* ===== STATS SECTION ===== */}
      <section className="absolute top-[1424px] left-[100px] w-[1240px] flex items-start gap-6">
        {statsData.map((stat) => (
          <div key={stat.label} className="flex items-center gap-6">
            <img className="w-20 h-20" alt={stat.label} src={stat.icon} />
            <div className="flex flex-col">
              <span className="[font-family:'Inter',Helvetica] font-bold text-neutral-white text-[40px] tracking-[0] leading-[60px] whitespace-nowrap">
                {stat.value}
              </span>
              <span className="[font-family:'Inter',Helvetica] font-normal text-neutral-grey-5 text-base tracking-[0.16px] leading-7">
                {stat.label}
              </span>
            </div>
          </div>
        ))}
      </section>

      {/* ===== HOW IT WORKS SECTION ===== */}
      <section className="absolute top-[1670px] left-0 w-full">
        {/* Section title */}
        <h2 className="w-96 mx-auto h-[67px] flex items-center justify-center bg-[linear-gradient(90deg,rgba(255,255,255,1)_44%,rgba(255,255,255,0.2)_100%)] [-webkit-background-clip:text] bg-clip-text [-webkit-text-fill-color:transparent] [text-fill-color:transparent] [font-family:'Inter',Helvetica] font-bold text-transparent text-5xl text-center tracking-[0] leading-[67.2px]">
          How It Works
        </h2>

        {/* Cards */}
        <div className="absolute top-[97px] left-[calc(50.00%_-_620px)] flex gap-[30px]">
          {howItWorksData.map((item) => (
            <Card
              key={item.title}
              className="flex flex-col w-[380px] items-center gap-8 px-6 py-8 bg-[#191a23] rounded-[25px] border-none"
            >
              <CardContent className="flex flex-col items-center gap-4 p-0 w-full">
                <img
                  className="w-20 h-[87.84px] mt-[-7.84px]"
                  alt={item.title}
                  src={item.img}
                />
                <h3 className="w-fit [font-family:'Inter',Helvetica] font-extrabold text-blackblack-100 text-[32px] text-center tracking-[0] leading-[41.6px] whitespace-nowrap">
                  {item.title}
                </h3>
                <a
                  className="self-stretch [font-family:'Inter',Helvetica] font-normal text-blackblack-60 text-base text-center tracking-[0] leading-6"
                  href={item.href}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {item.description}
                </a>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* ===== SUPPORTED COINS SECTION ===== */}
      <section className="absolute top-[2220px] left-0 w-full">
        {/* Section title */}
        <h2 className="w-[614px] mx-auto h-[67px] flex items-center justify-center bg-[linear-gradient(90deg,rgba(255,255,255,1)_44%,rgba(255,255,255,0.2)_100%)] [-webkit-background-clip:text] bg-clip-text [-webkit-text-fill-color:transparent] [text-fill-color:transparent] [font-family:'Inter',Helvetica] font-bold text-transparent text-5xl text-center tracking-[0] leading-[67.2px]">
          Supported Coins Section
        </h2>

        {/* Bitcoin Card */}
        <div className="absolute top-[118px] left-[99px] w-[370px] h-[433px] bg-[#1a1b23] rounded-2xl backdrop-blur-[125px] backdrop-brightness-[100%] [-webkit-backdrop-filter:blur(125px)_brightness(100%)]">
          {/* Bitcoin icon */}
          <img
            className="absolute top-[48px] left-[145px] w-20 h-20"
            alt="Bitcoin icon"
            src="/figmaAssets/icon-1.png"
          />
          {/* Name + ticker */}
          <div className="absolute top-[176px] left-[207px] w-[162px] h-12 flex gap-[11px]">
            <span className="w-[110px] h-12 [font-family:'Inter',Helvetica] font-bold text-neutral-white text-[32px] text-center tracking-[0] leading-[48px] whitespace-nowrap">
              Bitcoin
            </span>
            <span className="mt-[11px] w-[37px] h-[27px] opacity-70 [font-family:'Inter',Helvetica] font-medium text-neutral-white text-lg text-center tracking-[0] leading-[27px] whitespace-nowrap">
              BTC
            </span>
          </div>
          {/* Description */}
          <div className="absolute top-[240px] left-[24px] w-[322px] [font-family:'Inter',Helvetica] font-normal text-neutral-white text-base text-center tracking-[0.16px] leading-7">
            World&#39;s largest cryptocurrency used for secure digital payments.
          </div>
          {/* Trade BTC button */}
          <button className="inline-flex items-center justify-center gap-6 pl-6 pr-4 py-4 absolute top-[331px] left-[68px] bg-violet-600 rounded-[32px] overflow-hidden cursor-pointer border-none">
            <span className="w-fit font-body-standard-medium font-[number:var(--body-standard-medium-font-weight)] text-neutral-white text-[length:var(--body-standard-medium-font-size)] text-center tracking-[var(--body-standard-medium-letter-spacing)] leading-[var(--body-standard-medium-line-height)] whitespace-nowrap [font-style:var(--body-standard-medium-font-style)]">
              Trade BTC
            </span>
            <img
              className="w-8 h-8"
              alt="Arrow"
              src="/figmaAssets/group-16.png"
            />
          </button>
        </div>

        {/* Tether Card */}
        <div className="absolute top-[118px] left-[533px] w-[370px] h-[433px] bg-[#1a1b23] rounded-2xl backdrop-blur-[125px] backdrop-brightness-[100%] [-webkit-backdrop-filter:blur(125px)_brightness(100%)]">
          {/* Tether icon */}
          <div className="absolute top-[48px] left-[142px] w-[86px] h-[85px] bg-[url(/figmaAssets/image-3.png)] bg-[100%_100%]" />
          {/* Name + ticker */}
          <div className="absolute top-[176px] left-[112px] flex gap-[11px] items-baseline">
            <span className="[font-family:'Inter',Helvetica] font-bold text-white text-[32px] text-center tracking-[0] leading-[48px] whitespace-nowrap">
              Tether
            </span>
            <span className="[font-family:'Inter',Helvetica] font-medium text-neutralgrey-4 text-lg text-center tracking-[0] leading-[27px] whitespace-nowrap">
              USDT
            </span>
          </div>
          {/* Description */}
          <div className="absolute top-[240px] left-[24px] w-[322px] [font-family:'Inter',Helvetica] font-normal text-neutral-grey-3 text-base text-center tracking-[0.16px] leading-7">
            Stablecoin pegged to USD widely used for crypto trading.
          </div>
          {/* Arrow */}
          <img
            className="absolute top-[321px] left-[153px] w-16 h-16"
            alt="Arrow right"
            src="/figmaAssets/arrow-right.png"
          />
        </div>

        {/* USD Coin Card */}
        <div className="absolute top-[118px] left-[967px] w-[370px] h-[433px] bg-[#1a1b23] rounded-2xl backdrop-blur-[125px] backdrop-brightness-[100%] [-webkit-backdrop-filter:blur(125px)_brightness(100%)]">
          {/* USDC icon */}
          <div className="absolute top-[49px] left-[141px] w-20 h-20 flex">
            <div className="w-20 h-20 bg-neutral-white rounded-[40px] bg-[url(/figmaAssets/image-2.png)] bg-cover bg-[50%_50%]" />
          </div>
          {/* Name + ticker */}
          <div className="absolute top-44 left-[91px] w-[217px] h-12 flex gap-[13px]">
            <span className="w-[148px] h-12 [font-family:'Inter',Helvetica] font-bold text-white text-[32px] text-center tracking-[0] leading-[48px] whitespace-nowrap">
              USD Coin
            </span>
            <span className="mt-[11px] w-[52px] h-[27px] [font-family:'Inter',Helvetica] font-medium text-neutralgrey-4 text-lg text-center tracking-[0] leading-[27px] whitespace-nowrap">
              USDC
            </span>
          </div>
          {/* Description */}
          <div className="absolute top-[241px] left-6 w-[322px] [font-family:'Inter',Helvetica] font-normal text-neutral-grey-3 text-base text-center tracking-[0.16px] leading-7">
            Fully backed digital dollar used across crypto markets.
          </div>
          {/* Arrow */}
          <img
            className="absolute top-[321px] left-[153px] w-16 h-16"
            alt="Arrow right"
            src="/figmaAssets/arrow-right-1.png"
          />
        </div>
      </section>

      {/* ===== PAYMENT METHODS SECTION ===== */}
      <section className="absolute top-[2926px] left-0 w-full">
        {/* Section title */}
        <h2 className="w-[715px] mx-auto h-[67px] flex items-center justify-center bg-[linear-gradient(90deg,rgba(255,255,255,1)_44%,rgba(255,255,255,0.2)_100%)] [-webkit-background-clip:text] bg-clip-text [-webkit-text-fill-color:transparent] [text-fill-color:transparent] [font-family:'Inter',Helvetica] font-bold text-transparent text-5xl text-center tracking-[0] leading-[67.2px]">
          Payment Methods
        </h2>

        {/* Payment logos row */}
        <div className="absolute top-[146px] left-[99px] w-[1232px] h-[38px] flex items-center">
          <img
            className="w-[200px] h-[38px]"
            alt="Paystack"
            src="/figmaAssets/image-4.png"
          />

          <img
            className="mt-0.5 w-[216px] h-[35px] ml-32 object-cover"
            alt="Flutterwave"
            src="/figmaAssets/image-5.png"
          />

          <div className="mt-px w-56 h-[37px] relative ml-32">
            <span className="absolute top-px left-[58px] [font-family:'Inter',Helvetica] font-bold text-white text-2xl text-center tracking-[0] leading-9 whitespace-nowrap">
              Bank Transfer
            </span>
            <img
              className="absolute w-[16.96%] h-full top-0 left-0"
              alt="Bank Transfer icon"
              src="/figmaAssets/vector-2.svg"
            />
          </div>

          <div className="w-[212px] h-[38px] relative ml-[126px]">
            <span className="absolute top-px left-[45px] [font-family:'Inter',Helvetica] font-bold text-white text-2xl text-center tracking-[0] leading-9 whitespace-nowrap">
              Mobile Money
            </span>
            <img
              className="absolute w-[11.52%] h-full top-0 left-0"
              alt="Mobile Money icon"
              src="/figmaAssets/vector.svg"
            />
          </div>
        </div>
      </section>

      {/* ===== CTA BANNER SECTION ===== */}
      <div className="top-[3387px] left-[120px] w-[1200px] h-[255px] absolute bg-[#1a1b23] rounded-2xl overflow-hidden">
        {/* Decorative vectors */}
        <img
          className="absolute top-[81px] left-[1045px] w-[140px] h-[185px]"
          alt="Vector decoration"
          src="/figmaAssets/vector-1.svg"
        />
        <img
          className="absolute top-[-38px] left-[22px] w-40 h-[259px]"
          alt="Vector decoration"
          src="/figmaAssets/vector-3.svg"
        />
        {/* CTA text + button */}
        <img
          className="absolute top-[29px] left-[349px] w-[501px] h-[186px]"
          alt="Ready to Start Trading?"
          src="/figmaAssets/text.png"
        />
      </div>

      {/* ===== FOOTER ===== */}
      <footer className="absolute left-[calc(50.00%_-_720px)] bottom-0 w-[1440px] h-[482px] bg-[#0b0e11]">
        {/* Logo */}
        <img
          className="absolute top-20 left-[120px] w-[129px] h-[51px]"
          alt="ProlificEx Logo"
          src="/figmaAssets/h8fhoaokhdjquwmkrvnczlagvyrx5x-2-1.png"
        />

        {/* Products column */}
        <div className="absolute top-20 left-[426px] w-[104px] h-[168px] flex flex-col gap-6">
          <span className="w-[100px] h-[30px] [font-family:'Inter',Helvetica] font-medium text-neutralwhite text-xl tracking-[0] leading-[30px] whitespace-nowrap">
            Products
          </span>
          <div className="w-[100px] h-[114px] [font-family:'Inter',Helvetica] font-normal text-neutralgrey-6 text-base tracking-[0] leading-[38px]">
            {footerProducts.map((item) => (
              <div key={item}>{item}</div>
            ))}
          </div>
        </div>

        {/* Company column 1 */}
        <div className="absolute top-20 left-[594px] w-[98px] h-[168px] flex flex-col gap-6">
          <span className="w-[94px] h-[30px] [font-family:'Inter',Helvetica] font-medium text-neutralwhite text-xl tracking-[0] leading-[30px] whitespace-nowrap">
            Company
          </span>
          <div className="w-[69px] h-[114px] [font-family:'Inter',Helvetica] font-normal text-neutral-grey-5 text-base tracking-[0] leading-[38px]">
            {footerCompanyLinks.map((item) => (
              <div key={item}>{item}</div>
            ))}
          </div>
        </div>

        {/* Company column 2 */}
        <div className="absolute top-20 left-[756px] w-[100px] h-[168px] flex flex-col gap-6">
          <span className="w-24 h-[30px] [font-family:'Inter',Helvetica] font-medium text-neutralwhite text-xl tracking-[0] leading-[30px] whitespace-nowrap">
            Company
          </span>
          <div className="w-[69px] h-[114px] [font-family:'Inter',Helvetica] font-normal text-neutral-grey-5 text-base tracking-[0] leading-[38px]">
            {footerCompanyLinks.map((item) => (
              <div key={item}>{item}</div>
            ))}
          </div>
        </div>

        {/* Payment systems */}
        <div className="absolute top-20 left-[965px] w-[357px] h-[200px]">
          <p className="absolute top-0 left-0 w-[355px] [font-family:'Inter',Helvetica] font-medium text-neutralwhite text-[32px] tracking-[0] leading-[48px]">
            We accept following payment systems
          </p>
          {footerPaymentLogos.map((logo, index) => (
            <img
              key={logo.alt}
              className={`absolute top-[136px] w-24 h-16`}
              style={{ left: `${index * 120}px` }}
              alt={logo.alt}
              src={logo.src}
            />
          ))}
        </div>

        {/* Separator */}
        <Separator className="absolute top-[370px] left-[120px] w-[1200px] bg-white/10" />

        {/* Copyright */}
        <div className="absolute top-[389px] left-[120px] w-[162px] font-body-small-regular font-[number:var(--body-small-regular-font-weight)] text-neutralwhite text-[length:var(--body-small-regular-font-size)] tracking-[var(--body-small-regular-letter-spacing)] leading-[var(--body-small-regular-line-height)] [font-style:var(--body-small-regular-font-style)]">
          © 2026 ProlificEx
        </div>

        {/* Social icons */}
        <img
          className="absolute top-[391px] left-[1072px] w-[248px] h-6"
          alt="Social media links"
          src="/figmaAssets/socials.png"
        />
      </footer>
    </div>
  );
};
