"use client";

import { Card, CardContent } from "@/components/common/Card";
import { Button } from "@/components/common/Button";

export function PortfolioOverview() {
  return (
    <Card className="bg-gradient-to-br from-[#1a1b23] to-[#191a23] border border-white/5 rounded-2xl">
      <CardContent className="p-6 lg:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <p className="text-[#898ca9] text-sm [font-family:'Inter',Helvetica] font-medium mb-1">
              Total Portfolio Balance
            </p>
            <div className="flex items-baseline gap-3">
              <h2 className="[font-family:'Inter',Helvetica] font-bold text-white text-4xl lg:text-5xl tracking-tight">
                $24,562.80
              </h2>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#1ecb4f]/10 rounded-lg text-[#1ecb4f] text-sm font-medium [font-family:'Inter',Helvetica]">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M6 9V3M6 3L3 6M6 3L9 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                +12.5%
              </span>
            </div>
            <p className="text-[#898ca9] text-sm [font-family:'Inter',Helvetica] mt-2">
              +$2,736.40 this month
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="primary" size="md">
              Deposit
            </Button>
            <Button variant="secondary" size="md">
              Withdraw
            </Button>
            <Button variant="outline" size="md">
              Transfer
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
