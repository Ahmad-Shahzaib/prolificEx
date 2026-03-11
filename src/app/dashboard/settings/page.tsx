import { PageShell } from "@/components/dashboard/PageShell";
import { Card, CardContent } from "@/components/common/Card";
import { Button } from "@/components/common/Button";

export default function SettingsPage() {
  return (
    <PageShell title="Settings" description="Manage your account preferences.">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-[#1a1b23] border border-white/5 rounded-2xl">
          <CardContent className="p-6">
            <h3 className="text-white text-base font-bold [font-family:'Inter',Helvetica] mb-5">Profile Information</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-black text-xl font-bold [font-family:'Inter',Helvetica]">
                  CH
                </div>
                <div>
                  <p className="text-white text-sm font-semibold [font-family:'Inter',Helvetica]">Courtney Henry</p>
                  <p className="text-[#6b7280] text-xs [font-family:'Inter',Helvetica]">courtney@email.com</p>
                </div>
              </div>
              <div>
                <label className="text-[#6b7280] text-xs font-medium [font-family:'Inter',Helvetica] mb-1.5 block">Full Name</label>
                <input type="text" defaultValue="Courtney Henry" className="w-full h-10 bg-[#252630] border border-white/10 rounded-lg px-4 text-sm text-white [font-family:'Inter',Helvetica] focus:outline-none focus:border-[#f0b90b]/50" />
              </div>
              <div>
                <label className="text-[#6b7280] text-xs font-medium [font-family:'Inter',Helvetica] mb-1.5 block">Email</label>
                <input type="email" defaultValue="courtney@email.com" className="w-full h-10 bg-[#252630] border border-white/10 rounded-lg px-4 text-sm text-white [font-family:'Inter',Helvetica] focus:outline-none focus:border-[#f0b90b]/50" />
              </div>
              <div>
                <label className="text-[#6b7280] text-xs font-medium [font-family:'Inter',Helvetica] mb-1.5 block">Phone</label>
                <input type="tel" defaultValue="+1 234 567 8900" className="w-full h-10 bg-[#252630] border border-white/10 rounded-lg px-4 text-sm text-white [font-family:'Inter',Helvetica] focus:outline-none focus:border-[#f0b90b]/50" />
              </div>
              <Button variant="primary" size="md" className="bg-[#f0b90b] hover:bg-[#d4a30a] text-black shadow-none rounded-lg font-semibold">
                Save Changes
              </Button>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-[#1a1b23] border border-white/5 rounded-2xl">
          <CardContent className="p-6">
            <h3 className="text-white text-base font-bold [font-family:'Inter',Helvetica] mb-5">Preferences</h3>
            <div className="space-y-5">
              <div>
                <label className="text-[#6b7280] text-xs font-medium [font-family:'Inter',Helvetica] mb-1.5 block">Currency</label>
                <select className="w-full h-10 bg-[#252630] border border-white/10 rounded-lg px-4 text-sm text-white [font-family:'Inter',Helvetica] focus:outline-none focus:border-[#f0b90b]/50 appearance-none cursor-pointer">
                  <option value="usd">USD - US Dollar</option>
                  <option value="eur">EUR - Euro</option>
                  <option value="ngn">NGN - Nigerian Naira</option>
                </select>
              </div>
              <div>
                <label className="text-[#6b7280] text-xs font-medium [font-family:'Inter',Helvetica] mb-1.5 block">Language</label>
                <select className="w-full h-10 bg-[#252630] border border-white/10 rounded-lg px-4 text-sm text-white [font-family:'Inter',Helvetica] focus:outline-none focus:border-[#f0b90b]/50 appearance-none cursor-pointer">
                  <option value="en">English</option>
                  <option value="fr">French</option>
                  <option value="es">Spanish</option>
                </select>
              </div>
              <div>
                <label className="text-[#6b7280] text-xs font-medium [font-family:'Inter',Helvetica] mb-1.5 block">Timezone</label>
                <select className="w-full h-10 bg-[#252630] border border-white/10 rounded-lg px-4 text-sm text-white [font-family:'Inter',Helvetica] focus:outline-none focus:border-[#f0b90b]/50 appearance-none cursor-pointer">
                  <option value="utc">UTC +00:00</option>
                  <option value="wat">WAT +01:00</option>
                  <option value="est">EST -05:00</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageShell>
  );
}
