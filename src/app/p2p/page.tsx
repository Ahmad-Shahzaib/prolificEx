import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const marketMetrics = [
  { value: "24/7", label: "Public access to market overview" },
  { value: "3 min", label: "Typical start-to-order flow" },
  { value: "Escrow", label: "Protected settlement model" },
  { value: "KYC", label: "Required before live trading" },
];

const featuredOffers = [
  {
    side: "Buy",
    coin: "USDT",
    network: "TRC20",
    price: "$1.01",
    min: "$100",
    max: "$2,000",
    payment: "Bank Transfer",
    rating: "98% completion",
  },
  {
    side: "Sell",
    coin: "BTC",
    network: "BTC Network",
    price: "$68,420",
    min: "$250",
    max: "$10,000",
    payment: "Mobile Money",
    rating: "4.9 seller score",
  },
  {
    side: "Buy",
    coin: "USDC",
    network: "ERC20",
    price: "$1.00",
    min: "$50",
    max: "$1,500",
    payment: "Wise",
    rating: "Fast response",
  },
];

const strengths = [
  {
    title: "Clear pricing",
    description: "See the price, order limits, payment method, and trader profile before you move forward.",
  },
  {
    title: "Escrow-protected flow",
    description: "Orders are structured so settlement happens only after both sides complete their steps.",
  },
  {
    title: "Regional payment rails",
    description: "The marketplace is aligned with bank transfer and mobile money behaviors that users already trust.",
  },
];

const steps = [
  {
    step: "01",
    title: "Explore offers",
    description: "Review public offer previews, supported coins, and payment methods before logging in.",
  },
  {
    step: "02",
    title: "Create an account",
    description: "Sign up to unlock the trading dashboard, wallet funding, and KYC onboarding.",
  },
  {
    step: "03",
    title: "Complete verification",
    description: "KYC is required for buying, selling, and creating offers on the live marketplace.",
  },
  {
    step: "04",
    title: "Trade with escrow",
    description: "Open an order, follow the payment instructions, and confirm once settlement is complete.",
  },
];

const faq = [
  {
    q: "Can I trade directly from this public page?",
    a: "This page is a public introduction. To place orders or create offers, sign in and complete the required checks.",
  },
  {
    q: "Why is KYC mentioned here?",
    a: "Your platform already requires KYC before buying, selling, or creating offers, so the public page should reflect that flow clearly.",
  },
  {
    q: "What payment methods are supported?",
    a: "The platform currently highlights bank transfer and mobile money, with additional rails represented in the market overview.",
  },
  {
    q: "Where do I go after reading this page?",
    a: "Use the login button to continue into the dashboard or create an account if you are new.",
  },
];

export default function PublicP2PPage() {
  return (
    <div className="min-h-screen bg-[#0d0d1a] text-white">
      <Navbar />
      <main className="mx-auto max-w-[1240px] px-4 sm:px-6 pt-28 pb-20 space-y-10">
        <section className="relative overflow-hidden rounded-[34px] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(124,58,237,0.25),transparent_36%),linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-8 sm:p-12 shadow-[0_24px_80px_rgba(0,0,0,0.32)]">
          <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.04)_0%,transparent_40%,rgba(255,255,255,0.02)_100%)] pointer-events-none" />
          <div className="relative z-10 max-w-4xl">
            <p className="text-violet-300 uppercase tracking-[0.24em] text-xs sm:text-sm">Public P2P Marketplace</p>
            <h1 className="mt-4 text-4xl sm:text-6xl font-bold leading-tight">
              Trade crypto through a secure peer-to-peer marketplace built for real users.
            </h1>
            <p className="mt-5 max-w-3xl text-white/70 text-base sm:text-lg leading-8">
              ProlificEx connects buyers and sellers with transparent pricing, escrow-based settlement, and familiar
              payment options. Public users can review how the marketplace works before signing in.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/login" className="rounded-full bg-violet-600 px-6 py-3 font-medium hover:bg-violet-700 transition-colors no-underline text-white">
                Start trading
              </Link>
              <Link href="/signup" className="rounded-full border border-white/15 px-6 py-3 font-medium hover:bg-white/5 transition-colors no-underline text-white">
                Sign up free
              </Link>
              <Link href="/markets" className="rounded-full border border-white/15 px-6 py-3 font-medium hover:bg-white/5 transition-colors no-underline text-white">
                View markets
              </Link>
            </div>
          </div>

          <div className="relative z-10 mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {marketMetrics.map((metric) => (
              <article key={metric.label} className="rounded-2xl border border-white/10 bg-[#171826]/85 p-5 backdrop-blur-sm">
                <p className="text-3xl font-bold text-white">{metric.value}</p>
                <p className="mt-2 text-sm text-white/60 leading-6">{metric.label}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="grid gap-5 lg:grid-cols-3">
          {strengths.map((item) => (
            <article key={item.title} className="rounded-[28px] border border-white/10 bg-[#171826] p-6 shadow-[0_14px_40px_rgba(0,0,0,0.2)]">
              <h2 className="text-xl font-semibold">{item.title}</h2>
              <p className="mt-3 text-white/70 leading-7">{item.description}</p>
            </article>
          ))}
        </section>

        <section className="rounded-[30px] border border-white/10 bg-white/[0.04] p-8 sm:p-10">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-violet-300 uppercase tracking-[0.24em] text-xs sm:text-sm">Market snapshot</p>
              <h2 className="mt-2 text-2xl sm:text-3xl font-semibold">Featured public offer previews</h2>
            </div>
            <p className="max-w-2xl text-white/60 leading-7">
              These cards reflect the kind of information users see before placing a trade: side, coin, network,
              pricing, limits, and payment method.
            </p>
          </div>

          <div className="mt-7 grid gap-5 lg:grid-cols-3">
            {featuredOffers.map((offer) => (
              <article key={`${offer.side}-${offer.coin}-${offer.network}`} className="rounded-[26px] border border-white/10 bg-[#171826] p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-violet-300 text-sm font-medium">{offer.side} crypto</p>
                    <h3 className="mt-1 text-2xl font-bold text-white">
                      {offer.coin} <span className="text-white/50 text-sm font-medium">{offer.network}</span>
                    </h3>
                  </div>
                  <span className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-xs text-white/70">
                    {offer.rating}
                  </span>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-white/45">Price</p>
                    <p className="mt-1 text-lg font-semibold text-white">{offer.price}</p>
                  </div>
                  <div>
                    <p className="text-white/45">Payment</p>
                    <p className="mt-1 text-lg font-semibold text-white">{offer.payment}</p>
                  </div>
                  <div>
                    <p className="text-white/45">Min order</p>
                    <p className="mt-1 text-white/80">{offer.min}</p>
                  </div>
                  <div>
                    <p className="text-white/45">Max order</p>
                    <p className="mt-1 text-white/80">{offer.max}</p>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white/70">
                  <span>Escrow protected</span>
                  <span>Public preview</span>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.02fr_0.98fr]">
          <article className="rounded-[30px] border border-white/10 bg-[#171826] p-8 sm:p-10">
            <p className="text-violet-300 uppercase tracking-[0.24em] text-xs sm:text-sm">How it works</p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {steps.map((item) => (
                <article key={item.step} className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                  <p className="text-violet-300 text-sm font-medium">{item.step}</p>
                  <h3 className="mt-2 text-lg font-semibold">{item.title}</h3>
                  <p className="mt-2 text-white/65 leading-7">{item.description}</p>
                </article>
              ))}
            </div>
          </article>

          <article className="rounded-[30px] border border-white/10 bg-white/[0.04] p-8 sm:p-10">
            <p className="text-violet-300 uppercase tracking-[0.24em] text-xs sm:text-sm">Supported trading flow</p>
            <div className="mt-6 space-y-4">
              {[
                "Choose Buy or Sell offers from the public marketplace.",
                "Filter by coin, network, payment method, or rating.",
                "Complete KYC and fund your wallet before trading live.",
                "Use the dashboard to monitor orders, messages, and settlement status.",
              ].map((line) => (
                <div key={line} className="rounded-2xl border border-white/10 bg-[#171826] px-5 py-4 text-white/70 leading-7">
                  {line}
                </div>
              ))}
            </div>
          </article>
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
          <article className="rounded-[30px] border border-white/10 bg-white/[0.04] p-8 sm:p-10">
            <p className="text-violet-300 uppercase tracking-[0.24em] text-xs sm:text-sm">Payment rails</p>
            <div className="mt-5 space-y-3 text-white/70 leading-7">
              <p>• Bank Transfer</p>
              <p>• Mobile Money</p>
              <p>• Stablecoin rails such as USDT and USDC</p>
              <p>• Network support including TRC20, ERC20, and BEP20 where applicable</p>
            </div>
          </article>

          <article className="rounded-[30px] border border-white/10 bg-[#171826] p-8 sm:p-10">
            <p className="text-violet-300 uppercase tracking-[0.24em] text-xs sm:text-sm">FAQ</p>
            <div className="mt-6 space-y-5">
              {faq.map((item) => (
                <div key={item.q} className="border-b border-white/10 pb-4 last:border-b-0 last:pb-0">
                  <h3 className="text-lg font-semibold">{item.q}</h3>
                  <p className="mt-2 text-white/65 leading-7">{item.a}</p>
                </div>
              ))}
            </div>
          </article>
        </section>

        <section className="rounded-[30px] border border-white/10 bg-[linear-gradient(135deg,rgba(124,58,237,0.18),rgba(255,255,255,0.04))] p-8 sm:p-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-violet-200 uppercase tracking-[0.24em] text-xs sm:text-sm">Ready to trade?</p>
            <h2 className="mt-2 text-2xl sm:text-3xl font-semibold">Create your account and unlock the full P2P experience.</h2>
            <p className="mt-3 max-w-2xl text-white/70 leading-7">
              The public page gives users confidence before sign-in. Once they are ready, they can move into the dashboard,
              complete verification, and start trading.
            </p>
          </div>
          <div className="flex flex-wrap gap-4">
            <Link href="/signup" className="rounded-full bg-white text-[#11131a] px-6 py-3 font-semibold hover:bg-white/90 transition-colors no-underline">
              Create account
            </Link>
            <Link href="/login" className="rounded-full border border-white/20 px-6 py-3 font-semibold text-white hover:bg-white/5 transition-colors no-underline">
              Login
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
