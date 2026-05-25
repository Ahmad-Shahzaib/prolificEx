import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const supportTopics = [
  {
    title: "Account access",
    detail: "Help with login, verification, password resets, and account recovery steps.",
  },
  {
    title: "Trading help",
    detail: "Guidance for P2P orders, escrow flow, payment confirmation, and trade disputes.",
  },
  {
    title: "Platform questions",
    detail: "Answers about wallets, deposits, withdrawals, settings, and security preferences.",
  },
];

const supportChannels = [
  {
    title: "Live support",
    detail: "Best for urgent account or trading issues during business hours.",
    label: "Open login",
    href: "/login",
  },
  {
    title: "Self-service help",
    detail: "Review public product pages for trading, markets, and account information.",
    label: "View markets",
    href: "/markets",
  },
  {
    title: "Trading support",
    detail: "Use the P2P page for a clear overview of the trading flow and next steps.",
    label: "Open P2P",
    href: "/p2p",
  },
];

const faqs = [
  {
    question: "How do I recover my account?",
    answer:
      "Use the login page and follow the password reset or verification prompts. If two-factor authentication is enabled, complete the OTP step first.",
  },
  {
    question: "What should I do if a P2P order is pending?",
    answer:
      "Check the trade instructions carefully, confirm your payment status, and keep the order open until both sides complete their actions.",
  },
  {
    question: "Where can I see supported assets and payment methods?",
    answer:
      "Visit the Markets page for supported coins and payment rails, or review the product sections on the home page.",
  },
  {
    question: "How fast is support response?",
    answer:
      "Support is designed to be responsive during active service hours, with the most common issues resolved through guided self-service flows.",
  },
];

const responseLevels = [
  { label: "Urgent account access", value: "Priority handling" },
  { label: "Trading issues", value: "High priority" },
  { label: "General questions", value: "Standard queue" },
];

const guidanceSteps = [
  "Start with the relevant product page to confirm the flow.",
  "Review your account status, order status, or payment details.",
  "Escalate through login or product entry points if the issue persists.",
];

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-[#0d0d1a] text-white">
      <Navbar />
      <main className="mx-auto max-w-[1200px] px-4 sm:px-6 pt-28 pb-20 space-y-10">
        <section className="rounded-[32px] border border-white/10 bg-white/[0.04] p-8 sm:p-12 shadow-[0_24px_80px_rgba(0,0,0,0.28)]">
          <p className="text-violet-300 uppercase tracking-[0.24em] text-xs sm:text-sm">Support</p>
          <h1 className="mt-4 max-w-4xl text-4xl sm:text-6xl font-bold leading-tight">
            Professional support for account, trading, and platform help.
          </h1>
          <p className="mt-5 max-w-3xl text-white/70 text-base sm:text-lg leading-8">
            This support center gives you clear paths for getting help with login, trading, payment flows, and account
            management. Start with the most relevant route and move forward with confidence.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {responseLevels.map((item) => (
              <article key={item.label} className="rounded-2xl border border-white/10 bg-[#171826] p-5">
                <p className="text-sm text-white/60">{item.label}</p>
                <p className="mt-2 text-lg font-semibold text-white">{item.value}</p>
              </article>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/login" className="rounded-full bg-violet-600 px-6 py-3 font-medium hover:bg-violet-700 transition-colors no-underline text-white">
              Login for account help
            </Link>
            <Link href="/p2p" className="rounded-full border border-white/15 px-6 py-3 font-medium hover:bg-white/5 transition-colors no-underline text-white">
              Go to P2P
            </Link>
          </div>
        </section>

        <section className="grid gap-5 md:grid-cols-3">
          {supportTopics.map((topic) => (
            <article key={topic.title} className="rounded-[28px] border border-white/10 bg-[#171826] p-6 shadow-[0_12px_40px_rgba(0,0,0,0.2)]">
              <h2 className="text-xl font-semibold">{topic.title}</h2>
              <p className="mt-3 text-white/70 leading-7">{topic.detail}</p>
            </article>
          ))}
        </section>

        <section className="rounded-[28px] border border-white/10 bg-[#171826] p-8 sm:p-10">
          <p className="text-violet-300 uppercase tracking-[0.24em] text-xs sm:text-sm">How to get help</p>
          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            {guidanceSteps.map((step, index) => (
              <article key={step} className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                <p className="text-violet-300 text-sm font-medium">Step {index + 1}</p>
                <p className="mt-2 text-white/75 leading-7">{step}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
     

          <article className="rounded-[28px] border border-white/10 bg-[#171826] p-8 sm:p-10">
            <p className="text-violet-300 uppercase tracking-[0.24em] text-xs sm:text-sm">Frequently asked questions</p>
            <div className="mt-6 space-y-5">
              {faqs.map((faq) => (
                <div key={faq.question} className="border-b border-white/10 pb-4 last:border-b-0 last:pb-0">
                  <h3 className="text-lg font-semibold">{faq.question}</h3>
                  <p className="mt-2 text-white/65 leading-7">{faq.answer}</p>
                </div>
              ))}
            </div>
          </article>
        </section>
      </main>
      <Footer />
    </div>
  );
}