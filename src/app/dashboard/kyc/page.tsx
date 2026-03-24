'use client';

import { PageShell } from "@/components/dashboard/PageShell";
import { Card, CardContent } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import { Upload, Check } from "lucide-react";

export default function KYCPage() {
  return (
    <PageShell title="KYC Verification" description="Complete verification to unlock higher trading limits.">
      <Card className="bg-[#111218] border border-white/5 rounded-3xl overflow-hidden">
        <CardContent className="p-5 sm:p-8">

          {/* Level 1 */}
          <div className="mb-10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <div>
                <div className="text-white text-xl font-semibold">Level 1 Verified</div>
                <p className="text-[#6b7280] text-sm mt-1">Your email and phone are verified.</p>
              </div>
              <div className="bg-[#1ecb4f] text-black text-xs font-medium px-5 py-2 rounded-full whitespace-nowrap self-start sm:self-auto">
                Verified
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-[#1a1b23] border border-white/10 rounded-2xl p-5 flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <p className="text-[#6b7280] text-xs">Email Address</p>
                  <p className="text-white text-sm mt-1 truncate">eleanor.pena@example.com</p>
                </div>
                <div className="w-7 h-7 bg-[#1ecb4f] rounded-full flex items-center justify-center flex-shrink-0">
                  <Check size={18} className="text-black" />
                </div>
              </div>

              <div className="bg-[#1a1b23] border border-white/10 rounded-2xl p-5 flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <p className="text-[#6b7280] text-xs">Phone Number</p>
                  <p className="text-white text-sm mt-1">+1 •••••• 56</p>
                </div>
                <div className="w-7 h-7 bg-[#1ecb4f] rounded-full flex items-center justify-center flex-shrink-0">
                  <Check size={18} className="text-black" />
                </div>
              </div>
            </div>
          </div>

          {/* Level 2 */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <div className="text-white text-xl font-semibold">Level 2 – ID Verification</div>
                <p className="text-[#6b7280] text-sm mt-1">Upload ID documents to unlock higher trading limits.</p>
              </div>
              <div className="bg-[#ef4444] text-white text-xs font-medium px-5 py-2 rounded-full whitespace-nowrap self-start sm:self-auto">
                Unverified
              </div>
            </div>

            {/* Upload Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {/* National ID / Passport */}
              <div className="border border-dashed border-white/20 rounded-3xl p-8 text-center hover:border-white/40 transition-colors cursor-pointer">
                <div className="mx-auto w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center mb-5">
                  <Upload size={32} className="text-[#6b7280]" />
                </div>
                <p className="text-white font-medium text-lg">National ID or Passport</p>
                <p className="text-[#6b7280] text-sm mt-2">Drag and drop or click to upload</p>
              </div>

              {/* Selfie with ID */}
              <div className="border border-dashed border-white/20 rounded-3xl p-8 text-center hover:border-white/40 transition-colors cursor-pointer">
                <div className="mx-auto w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center mb-5">
                  <Upload size={32} className="text-[#6b7280]" />
                </div>
                <p className="text-white font-medium text-lg">Selfie with ID</p>
                <p className="text-[#6b7280] text-sm mt-2">Drag and drop or click to upload</p>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center sm:justify-end mb-10">
              <Button className="bg-violet-600 hover:bg-violet-700 text-white px-10 py-3.5 rounded-2xl font-medium w-full sm:w-auto">
                Submit for Review
              </Button>
            </div>
          </div>

          {/* Under Review Notice */}
          <div className="bg-[#1a1b23] border border-amber-500/30 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-black text-2xl leading-none">✓</span>
            </div>
            <p className="text-amber-500 text-sm leading-relaxed">
              Your documents are under review. This usually takes 24 hours.
            </p>
          </div>

        </CardContent>
      </Card>
    </PageShell>
  );
}