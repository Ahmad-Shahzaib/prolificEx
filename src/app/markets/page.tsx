import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SupportedCoinsSection } from "@/components/sections/SupportedCoins";
import { PaymentMethodsSection } from "@/components/sections/PaymentMethods";

const marketHighlights = [
  { value: "BTC", label: "Bitcoin liquidity" },
  { value: "USDT", label: "Stable-value trading" },
  { value: "USDC", label: "Fully backed digital cash" },
  { value: "24/7", label: "Continuous market access" },
];

const marketNotes = [
  "Professional market cards with clear asset context.",
  "Payment methods aligned with the way users actually fund trades.",
  "A public-facing overview that pairs well with the authenticated dashboard experience.",
];

export default function MarketsPage() {
  return (
    <div className="min-h-screen bg-[#0d0d1a] text-white">
      <Navbar />
      <main className="pt-28 pb-20 space-y-10">
        <section className="mx-auto max-w-[1200px] px-4 sm:px-6">
          <div className="rounded-[32px] border border-white/10 bg-white/[0.04] p-8 sm:p-12 shadow-[0_24px_80px_rgba(0,0,0,0.28)]">
            <p className="text-violet-300 uppercase tracking-[0.24em] text-xs sm:text-sm">Markets</p>
            <h1 className="mt-4 max-w-4xl text-4xl sm:text-6xl font-bold leading-tight">Explore the public market overview built for confidence and clarity.</h1>
            <p className="mt-5 max-w-3xl text-white/70 text-base sm:text-lg leading-8">
              Review the assets and payment rails supported by ProlificEx before you begin trading.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {marketHighlights.map((item) => (
                <article key={item.label} className="rounded-2xl border border-white/10 bg-[#171826] p-5">
                  <p className="text-2xl font-bold text-white">{item.value}</p>
                  <p className="mt-1 text-sm text-white/60">{item.label}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1200px] px-4 sm:px-6">
          <div className="rounded-[28px] border border-white/10 bg-[#171826] p-8 sm:p-10">
            <p className="text-violet-300 uppercase tracking-[0.24em] text-xs sm:text-sm">Why it matters</p>
            <div className="mt-5 grid gap-4 md:grid-cols-3">
              {marketNotes.map((note) => (
                <article key={note} className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 text-white/70 leading-7">
                  {note}
                </article>
              ))}
            </div>
          </div>
        </section>

        <SupportedCoinsSection />
        <PaymentMethodsSection />
      </main>
      <Footer />
    </div>
  );
}