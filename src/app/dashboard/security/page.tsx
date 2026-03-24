'use client';

import { PageShell } from "@/components/dashboard/PageShell";
import { Card, CardContent } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import { Copy, Eye, EyeOff } from "lucide-react";
import { useState } from "react";

export default function SecurityPage() {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const backupCodes = ["2384 1479", "9825 3203", "6702 6851"];

  return (
    <PageShell title="Security" description="Manage your account security settings.">
      <div className="space-y-6 px-4 sm:px-0">

        {/* Change Password */}
        <Card className="bg-[#111218] border border-white/5 rounded-3xl">
          <CardContent className="p-5 sm:p-8">
            <h2 className="text-white text-xl font-semibold mb-6">Change Password</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-[#6b7280] text-sm block mb-2">Current password</label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="w-full bg-[#1a1b23] border border-white/10 rounded-2xl px-5 py-3.5 text-white placeholder-[#6b7280] focus:outline-none focus:border-white/30"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6b7280]"
                  >
                    {showCurrentPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-[#6b7280] text-sm block mb-2">New Password</label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="w-full bg-[#1a1b23] border border-white/10 rounded-2xl px-5 py-3.5 text-white placeholder-[#6b7280] focus:outline-none focus:border-white/30"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6b7280]"
                  >
                    {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-8">
              <Button className="bg-violet-600 hover:bg-violet-700 px-10 py-3 rounded-2xl text-white font-medium w-full sm:w-auto">
                Save Changes
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Two-Factor Authentication */}
        <Card className="bg-[#111218] border border-white/5 rounded-3xl">
          <CardContent className="p-5 sm:p-8">
            <h2 className="text-white text-xl font-semibold mb-6">Two-Factor Authentication</h2>

            <div className="flex flex-col lg:flex-row gap-8">
              {/* QR Code */}
              <div className="flex-shrink-0 flex justify-center lg:justify-start">
                <div className="bg-white p-4 rounded-2xl inline-block">
                  <img
                    src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=2FA-Example"
                    alt="QR Code"
                    className="w-[180px] h-[180px]"
                  />
                </div>
              </div>

              {/* 2FA Info */}
              <div className="flex-1">
                <p className="text-[#6b7280] text-sm leading-relaxed">
                  Scan this QR code with your Google Authenticator app. Enter the generated code to enable 2FA.
                </p>

                <div className="mt-8">
                  <p className="text-[#6b7280] text-sm mb-4">Backup Codes</p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {backupCodes.map((code, i) => (
                      <div 
                        key={i} 
                        className="bg-[#1a1b23] border border-white/10 rounded-xl px-5 py-4 text-white font-mono text-sm text-center"
                      >
                        {code}
                      </div>
                    ))}
                  </div>
                  <p className="text-[#6b7280] text-xs mt-5">
                    Keep these backup codes somewhere safe. You can use them to access your account if you lose your device.
                  </p>
                </div>

                <div className="mt-8 flex justify-center lg:justify-end">
                  <Button className="bg-violet-600 hover:bg-violet-700 flex items-center gap-2 px-8 py-3 rounded-2xl text-white w-full sm:w-auto">
                    <Copy size={18} />
                    Copy All Codes
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Login Sessions */}
        <Card className="bg-[#111218] border border-white/5 rounded-3xl">
          <CardContent className="p-5 sm:p-8">
            <h2 className="text-white text-xl font-semibold mb-6">Login Sessions</h2>

            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full min-w-[700px]">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-4 text-[#6b7280] text-sm font-medium">Device</th>
                    <th className="text-left py-4 text-[#6b7280] text-sm font-medium">Location</th>
                    <th className="text-left py-4 text-[#6b7280] text-sm font-medium">Last Active</th>
                    <th className="text-right py-4 text-[#6b7280] text-sm font-medium pr-4">Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-white/10">
                    <td className="py-5">
                      <div className="flex items-center gap-3">
                        <img 
                          src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Google_Chrome_icon_%28September_2014%29.svg/1024px-Google_Chrome_icon_%28September_2014%29.svg.png" 
                          alt="Chrome" 
                          className="w-6 h-6" 
                        />
                        <div>
                          <p className="text-white">Chrome - Windows</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-5 text-white">New York, United States</td>
                    <td className="py-5 text-white">Today 08:23</td>
                    <td className="py-5 text-right">
                      <Button variant="secondary" size="sm" className="bg-white/10 hover:bg-white/15 text-white px-6 py-2 rounded-xl">
                        Revoke
                      </Button>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-5">
                      <div className="flex items-center gap-3">
                        <img 
                          src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Google_Chrome_icon_%28September_2014%29.svg/1024px-Google_Chrome_icon_%28September_2014%29.svg.png" 
                          alt="Chrome" 
                          className="w-6 h-6" 
                        />
                        <div>
                          <p className="text-white">Chrome - iOS</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-5 text-white">New York, United States</td>
                    <td className="py-5 text-white">Aug 02, 2022</td>
                    <td className="py-5 text-right">
                      <Button variant="secondary" size="sm" className="bg-white/10 hover:bg-white/15 text-white px-6 py-2 rounded-xl">
                        Revoke
                      </Button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Mobile Card Layout */}
            <div className="md:hidden space-y-4">
              <div className="bg-[#1a1b23] border border-white/10 rounded-2xl p-5">
                <div className="flex items-center gap-3 mb-4">
                  <img 
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Google_Chrome_icon_%28September_2014%29.svg/1024px-Google_Chrome_icon_%28September_2014%29.svg.png" 
                    alt="Chrome" 
                    className="w-7 h-7" 
                  />
                  <div>
                    <p className="text-white font-medium">Chrome - Windows</p>
                    <p className="text-white/70 text-sm">New York, United States</p>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-white/70 text-sm">Today 08:23</p>
                  <Button variant="secondary" size="sm" className="bg-white/10 hover:bg-white/15 text-white px-6 py-2 rounded-xl">
                    Revoke
                  </Button>
                </div>
              </div>

              <div className="bg-[#1a1b23] border border-white/10 rounded-2xl p-5">
                <div className="flex items-center gap-3 mb-4">
                  <img 
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Google_Chrome_icon_%28September_2014%29.svg/1024px-Google_Chrome_icon_%28September_2014%29.svg.png" 
                    alt="Chrome" 
                    className="w-7 h-7" 
                  />
                  <div>
                    <p className="text-white font-medium">Chrome - iOS</p>
                    <p className="text-white/70 text-sm">New York, United States</p>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-white/70 text-sm">Aug 02, 2022</p>
                  <Button variant="secondary" size="sm" className="bg-white/10 hover:bg-white/15 text-white px-6 py-2 rounded-xl">
                    Revoke
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Email Notifications */}
        <Card className="bg-[#111218] border border-white/5 rounded-3xl">
          <CardContent className="p-5 sm:p-8">
            <h2 className="text-white text-xl font-semibold mb-6">Email Notifications</h2>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <p className="text-white">Login Alerts</p>
                <div className="w-12 h-6 bg-[#1ecb4f] rounded-full relative cursor-pointer">
                  <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5"></div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <p className="text-white">Trade Alerts</p>
                <div className="w-12 h-6 bg-[#1ecb4f] rounded-full relative cursor-pointer">
                  <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5"></div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <p className="text-white">Withdrawal Alerts</p>
                <div className="w-12 h-6 bg-[#6b7280] rounded-full relative cursor-pointer">
                  <div className="w-5 h-5 bg-white rounded-full absolute left-0.5 top-0.5"></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

      </div>
    </PageShell>
  );
}