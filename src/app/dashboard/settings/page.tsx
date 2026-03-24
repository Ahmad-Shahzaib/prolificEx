'use client';

import { PageShell } from "@/components/dashboard/PageShell";
import { Card, CardContent } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import Image from "next/image";

export default function SettingsPage() {
  return (
    <PageShell title="Settings" description="Manage your account preferences.">
      <Card className="bg-[#111218] border border-white/5 rounded-3xl overflow-hidden">
        <CardContent className="p-10">
          <div className="flex flex-col md:flex-row gap-10">
            {/* Profile Photo Section */}
            <div className="flex-shrink-0 flex flex-col items-center">
              <div className="relative w-28 h-28 rounded-full overflow-hidden border-4 border-white/10">
                <Image
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&crop=face"
                  alt="Profile Photo"
                  fill
                  className="object-cover"
                />
              </div>

              <Button 
                variant="outline" 
                className="mt-5 border-violet-600 text-violet-400 hover:bg-violet-600/10 hover:text-violet-400 px-6 py-2.5 rounded-2xl text-sm font-medium"
              >
                Change Photo
              </Button>
            </div>

            {/* Form Fields */}
            <div className="flex-1 space-y-6">
              {/* Username */}
              <div>
                <label className="block text-[#6b7280] text-sm mb-2">Username</label>
                <input
                  type="text"
                  defaultValue="@pena.eleanor"
                  className="w-full bg-[#1a1b23] border border-white/10 rounded-2xl px-5 py-3.5 text-white placeholder:text-[#6b7280] focus:outline-none focus:border-white/30"
                />
              </div>

              {/* Display Name */}
              <div>
                <label className="block text-[#6b7280] text-sm mb-2">Display Name</label>
                <input
                  type="text"
                  defaultValue="Eleanor Pena"
                  className="w-full bg-[#1a1b23] border border-white/10 rounded-2xl px-5 py-3.5 text-white placeholder:text-[#6b7280] focus:outline-none focus:border-white/30"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-[#6b7280] text-sm mb-2">Email</label>
                <input
                  type="email"
                  defaultValue="eleanor.pena@example.com"
                  className="w-full bg-[#1a1b23] border border-white/10 rounded-2xl px-5 py-3.5 text-white placeholder:text-[#6b7280] focus:outline-none focus:border-white/30"
                />
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-[#6b7280] text-sm mb-2">Phone Number</label>
                <div className="flex bg-[#1a1b23] border border-white/10 rounded-2xl overflow-hidden">
                  <div className="flex items-center gap-2 px-4 border-r border-white/10">
                    <span className="text-xl">🇺🇸</span>
                    <span className="text-white">+</span>
                  </div>
                  <input
                    type="tel"
                    defaultValue="123 456 7890"
                    className="flex-1 bg-transparent px-5 py-3.5 text-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Country */}
              <div>
                <label className="block text-[#6b7280] text-sm mb-2">Country</label>
                <div className="flex items-center bg-[#1a1b23] border border-white/10 rounded-2xl px-5 py-3.5">
                  <span className="text-xl mr-3">🇺🇸</span>
                  <span className="text-white">United States</span>
                </div>
              </div>

              {/* Save Button */}
              <div className="flex justify-end pt-4">
                <Button className="bg-violet-600 hover:bg-violet-700 text-white px-10 py-3.5 rounded-2xl font-medium">
                  Save Changes
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </PageShell>
  );
}