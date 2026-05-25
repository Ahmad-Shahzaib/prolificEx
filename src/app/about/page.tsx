import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const values = [
  {
    title: "Security first",
    description: "We build for safe trading, account protection, and clear verification flows.",
  },
  {
    title: "Simple access",
    description: "We keep the path from discovery to trading straightforward for every user.",
  },
  {
    title: "Local payments",
    description: "We focus on payment methods that work well across our target markets.",
  },
];

const milestones = [
  { year: "2023", title: "Platform launch", description: "Built the first public trading experience with a focus on clarity and trust." },
  { year: "2024", title: "Payments expansion", description: "Added local payment rails to improve deposit and settlement flexibility." },
  { year: "2025", title: "Security hardening", description: "Improved verification, monitoring, and account protection across the platform." },
];

const metrics = [
  { value: "24/7", label: "Platform access" },
  { value: "3", label: "Core markets" },
  { value: "100%", label: "Focus on user safety" },
  { value: "Fast", label: "Support response" },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#0d0d1a] text-white">
      <Navbar />
      <main className="mx-auto max-w-[1200px] px-4 sm:px-6 pt-28 pb-20 space-y-10">
        <section className="rounded-[32px] border border-white/10 bg-white/[0.04] p-8 sm:p-12 shadow-[0_24px_80px_rgba(0,0,0,0.35)]">
          <p className="text-violet-300 uppercase tracking-[0.24em] text-xs sm:text-sm">About Us</p>
          <h1 className="mt-4 max-w-4xl text-4xl sm:text-6xl font-bold leading-tight">A modern crypto platform designed for trust, speed, and everyday trading.</h1>
          <p className="mt-5 max-w-3xl text-white/70 text-base sm:text-lg leading-8">
            ProlificEx is built to make crypto trading feel straightforward for users who want a professional,
            dependable, and locally relevant experience across Africa.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {metrics.map((metric) => (
              <article key={metric.label} className="rounded-2xl border border-white/10 bg-[#171826] p-5">
                <p className="text-3xl font-bold text-white">{metric.value}</p>
                <p className="mt-1 text-sm text-white/60">{metric.label}</p>
              </article>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/signup" className="rounded-full bg-violet-600 px-6 py-3 font-medium hover:bg-violet-700 transition-colors no-underline text-white">
              Create account
            </Link>
            <Link href="/login" className="rounded-full border border-white/15 px-6 py-3 font-medium hover:bg-white/5 transition-colors no-underline text-white">
              Login
            </Link>
          </div>
        </section>

        <section className="grid gap-5 lg:grid-cols-3">
          {values.map((value) => (
            <article key={value.title} className="rounded-[28px] border border-white/10 bg-[#171826] p-6">
              <h2 className="text-xl font-semibold">{value.title}</h2>
              <p className="mt-3 text-white/70 leading-7">{value.description}</p>
            </article>
          ))}
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <article className="rounded-[28px] border border-white/10 bg-white/[0.04] p-8">
            <p className="text-violet-300 uppercase tracking-[0.24em] text-xs sm:text-sm">Mission</p>
            <h2 className="mt-3 text-2xl sm:text-3xl font-semibold">Make crypto trading usable for more people.</h2>
            <p className="mt-4 text-white/70 leading-8">
              We focus on reducing friction in the trading journey: secure accounts, clear interfaces, trusted payment
              methods, and predictable workflows that help users move with confidence.
            </p>
          </article>

          <article className="rounded-[28px] border border-white/10 bg-[#171826] p-8">
            <p className="text-violet-300 uppercase tracking-[0.24em] text-xs sm:text-sm">What we value</p>
            <ul className="mt-4 space-y-4 text-white/75 leading-7">
              <li>• Transparent product experiences with clear next steps.</li>
              <li>• Security-aware design that puts account protection first.</li>
              <li>• Local payment infrastructure that supports everyday use cases.</li>
            </ul>
          </article>
        </section>

        <section className="rounded-[28px] border border-white/10 bg-[#171826] p-8 sm:p-10">
          <p className="text-violet-300 uppercase tracking-[0.24em] text-xs sm:text-sm">Our journey</p>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {milestones.map((milestone) => (
              <article key={milestone.year} className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                <p className="text-violet-300 text-sm font-medium">{milestone.year}</p>
                <h3 className="mt-2 text-lg font-semibold">{milestone.title}</h3>
                <p className="mt-2 text-white/65 leading-7">{milestone.description}</p>
              </article>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}