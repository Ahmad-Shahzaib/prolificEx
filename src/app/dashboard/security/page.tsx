import { PageShell } from "@/components/dashboard/PageShell";
import { Card, CardContent } from "@/components/common/Card";

const securitySettings = [
  { title: "Two-Factor Authentication", description: "Add an extra layer of security to your account.", enabled: true, icon: "🔐" },
  { title: "Email Notifications", description: "Receive email alerts for login attempts and transactions.", enabled: true, icon: "📧" },
  { title: "SMS Verification", description: "Verify transactions with SMS codes.", enabled: false, icon: "📱" },
  { title: "Anti-Phishing Code", description: "Set a code to identify genuine ProlificEx emails.", enabled: false, icon: "🛡️" },
  { title: "Withdrawal Whitelist", description: "Restrict withdrawals to pre-approved addresses only.", enabled: false, icon: "📋" },
];

export default function SecurityPage() {
  return (
    <PageShell title="Security" description="Manage your account security settings.">
      <div className="space-y-3">
        {securitySettings.map((setting) => (
          <Card key={setting.title} className="bg-[#1a1b23] border border-white/5 rounded-2xl">
            <CardContent className="p-5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#252630] flex items-center justify-center text-lg">
                  {setting.icon}
                </div>
                <div>
                  <p className="text-white text-sm font-semibold [font-family:'Inter',Helvetica]">{setting.title}</p>
                  <p className="text-[#6b7280] text-xs [font-family:'Inter',Helvetica] mt-0.5">{setting.description}</p>
                </div>
              </div>
              <div className={`w-11 h-6 rounded-full p-0.5 cursor-pointer transition-colors ${setting.enabled ? "bg-[#1ecb4f]" : "bg-[#252630]"}`}>
                <div className={`w-5 h-5 rounded-full bg-white transition-transform ${setting.enabled ? "translate-x-5" : "translate-x-0"}`}></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </PageShell>
  );
}
