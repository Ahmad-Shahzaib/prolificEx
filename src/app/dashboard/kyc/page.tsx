import { PageShell } from "@/components/dashboard/PageShell";
import { Card, CardContent } from "@/components/common/Card";
import { Button } from "@/components/common/Button";

const steps = [
  { step: 1, title: "Personal Information", description: "Provide your name, date of birth, and address.", status: "completed" },
  { step: 2, title: "Identity Document", description: "Upload a government-issued ID (passport, driver's license, or national ID).", status: "completed" },
  { step: 3, title: "Selfie Verification", description: "Take a selfie to match against your identity document.", status: "current" },
  { step: 4, title: "Address Proof", description: "Upload a recent utility bill or bank statement.", status: "pending" },
];

const statusStyles: Record<string, { dot: string; text: string; label: string }> = {
  completed: { dot: "bg-[#1ecb4f]", text: "text-[#1ecb4f]", label: "Completed" },
  current: { dot: "bg-[#f0b90b]", text: "text-[#f0b90b]", label: "In Progress" },
  pending: { dot: "bg-[#6b7280]", text: "text-[#6b7280]", label: "Pending" },
};

export default function KYCPage() {
  return (
    <PageShell title="KYC Verification" description="Complete verification to unlock higher trading limits.">
      <div className="space-y-4">
        {steps.map((s) => {
          const style = statusStyles[s.status];
          return (
            <Card key={s.step} className="bg-[#1a1b23] border border-white/5 rounded-2xl">
              <CardContent className="p-5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full ${s.status === "completed" ? "bg-[#1ecb4f]/10" : s.status === "current" ? "bg-[#f0b90b]/10" : "bg-white/5"} flex items-center justify-center`}>
                    <span className={`text-sm font-bold [font-family:'Inter',Helvetica] ${style.text}`}>{s.step}</span>
                  </div>
                  <div>
                    <p className="text-white text-sm font-semibold [font-family:'Inter',Helvetica]">{s.title}</p>
                    <p className="text-[#6b7280] text-xs [font-family:'Inter',Helvetica] mt-0.5">{s.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <div className="flex items-center gap-1.5">
                    <div className={`w-2 h-2 rounded-full ${style.dot}`}></div>
                    <span className={`text-xs font-medium [font-family:'Inter',Helvetica] ${style.text}`}>{style.label}</span>
                  </div>
                  {s.status === "current" && (
                    <Button variant="primary" size="sm" className="bg-[#f0b90b] hover:bg-[#d4a30a] text-black shadow-none rounded-lg text-xs px-4 py-1.5">
                      Continue
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </PageShell>
  );
}
