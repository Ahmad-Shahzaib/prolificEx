import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const openings = [
  { role: "Frontend Engineer", detail: "Build polished trading interfaces and improve product quality." },
  { role: "Product Designer", detail: "Shape clear, premium experiences for onboarding and trading." },
  { role: "Operations Analyst", detail: "Support product operations, user workflows, and market monitoring." },
];

export default function CareersPage() {
  return (
    <div className="min-h-screen bg-[#0d0d1a] text-white">
      <Navbar />
      <main className="mx-auto max-w-[1200px] px-4 sm:px-6 pt-28 pb-20 space-y-10">
        <section className="rounded-[32px] border border-white/10 bg-white/[0.04] p-8 sm:p-12 shadow-[0_24px_80px_rgba(0,0,0,0.28)]">
          <p className="text-violet-300 uppercase tracking-[0.24em] text-xs sm:text-sm">Careers</p>
          <h1 className="mt-4 max-w-4xl text-4xl sm:text-6xl font-bold leading-tight">Join a team focused on secure, user-first crypto products.</h1>
          <p className="mt-5 max-w-3xl text-white/70 text-base sm:text-lg leading-8">
            We are building a platform that balances trust, design quality, and operational clarity. If you care about
            excellent execution, we want to hear from you.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/contact" className="rounded-full bg-violet-600 px-6 py-3 font-medium hover:bg-violet-700 transition-colors no-underline text-white">
              Contact us
            </Link>
            <Link href="/about" className="rounded-full border border-white/15 px-6 py-3 font-medium hover:bg-white/5 transition-colors no-underline text-white">
              Learn about us
            </Link>
          </div>
        </section>

        <section className="grid gap-5 md:grid-cols-3">
          {openings.map((opening) => (
            <article key={opening.role} className="rounded-[28px] border border-white/10 bg-[#171826] p-6">
              <h2 className="text-xl font-semibold">{opening.role}</h2>
              <p className="mt-3 text-white/70 leading-7">{opening.detail}</p>
            </article>
          ))}
        </section>
      </main>
      <Footer />
    </div>
  );
}