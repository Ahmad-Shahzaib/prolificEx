import { PageShell } from "@/components/dashboard/PageShell";
import { Card, CardContent } from "@/components/common/Card";
import { Button } from "@/components/common/Button";

const faqItems = [
  { q: "How do I deposit funds?", a: "Go to the Deposit page and select your preferred cryptocurrency. Follow the instructions to complete your deposit." },
  { q: "How long do withdrawals take?", a: "Withdrawal processing times vary by cryptocurrency. BTC withdrawals typically take 30-60 minutes." },
  { q: "What are the trading fees?", a: "P2P trading fees are 0.1% per transaction. There are no fees for deposits." },
  { q: "How do I complete KYC?", a: "Navigate to KYC Verification in the sidebar and follow the step-by-step verification process." },
];

export default function SupportPage() {
  return (
    <PageShell title="Support" description="Get help with your account and trading.">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-[#1a1b23] border border-white/5 rounded-2xl">
          <CardContent className="p-6">
            <h3 className="text-white text-base font-bold [font-family:'Inter',Helvetica] mb-4">Contact Support</h3>
            <div className="space-y-4">
              <div>
                <label className="text-[#6b7280] text-xs font-medium [font-family:'Inter',Helvetica] mb-1.5 block">Subject</label>
                <input type="text" placeholder="What do you need help with?" className="w-full h-10 bg-[#252630] border border-white/10 rounded-lg px-4 text-sm text-white placeholder:text-[#6b7280] focus:outline-none focus:border-[#f0b90b]/50 [font-family:'Inter',Helvetica]" />
              </div>
              <div>
                <label className="text-[#6b7280] text-xs font-medium [font-family:'Inter',Helvetica] mb-1.5 block">Message</label>
                <textarea rows={4} placeholder="Describe your issue..." className="w-full bg-[#252630] border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder:text-[#6b7280] focus:outline-none focus:border-[#f0b90b]/50 [font-family:'Inter',Helvetica] resize-none" />
              </div>
              <Button variant="primary" size="md" className="w-full bg-[#f0b90b] hover:bg-[#d4a30a] text-black shadow-none rounded-lg font-semibold">
                Submit Ticket
              </Button>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-[#1a1b23] border border-white/5 rounded-2xl">
          <CardContent className="p-6">
            <h3 className="text-white text-base font-bold [font-family:'Inter',Helvetica] mb-4">FAQ</h3>
            <div className="space-y-4">
              {faqItems.map((item) => (
                <div key={item.q} className="border-b border-white/5 pb-4 last:border-none last:pb-0">
                  <p className="text-white text-sm font-medium [font-family:'Inter',Helvetica] mb-1">{item.q}</p>
                  <p className="text-[#6b7280] text-xs [font-family:'Inter',Helvetica] leading-5">{item.a}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </PageShell>
  );
}
