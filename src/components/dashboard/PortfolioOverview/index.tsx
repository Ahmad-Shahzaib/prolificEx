"use client";

import { Card, CardContent } from "@/components/common/Card";
import { Button } from "@/components/common/Button";

export function PortfolioOverview() {
  return (
    <Card className="bg-[#1a1b23] border border-white/5 rounded-2xl">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-1">
          <p className="text-[#6b7280] text-sm [font-family:'Inter',Helvetica] font-medium">
            Total Portfolio Value
          </p>
          <button data-testid="button-view-more-portfolio" className="text-[#6b7280] text-xs [font-family:'Inter',Helvetica] bg-[#252630] border border-white/10 rounded-md px-3 py-1 cursor-pointer hover:bg-[#2f3040] transition-colors">
            View More
          </button>
        </div>
        <h2 className="[font-family:'Inter',Helvetica] font-bold text-white text-[32px] leading-[44px] tracking-tight mb-5">
          $405,021.00
        </h2>
        <div className="flex items-center gap-3">
          <Button
            variant="primary"
            size="sm"
            className="rounded-lg px-5 py-2 text-sm font-semibold"
            leftIcon={
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M7 2V12M7 12L3 8M7 12L11 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            }
          >
            Deposit
          </Button>
          <button data-testid="button-withdraw" className="flex items-center gap-2 px-5 py-2 bg-transparent border border-violet-500 text-violet-400 rounded-lg text-sm font-semibold [font-family:'Inter',Helvetica] cursor-pointer hover:bg-violet-500/10 transition-colors">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M7 12V2M7 2L3 6M7 2L11 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Withdraw
          </button>
          <button data-testid="button-p2p-trade" className="flex items-center gap-2 px-5 py-2 bg-transparent border border-white/10 text-white rounded-lg text-sm font-semibold [font-family:'Inter',Helvetica] cursor-pointer hover:bg-white/5 transition-colors">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 5H12M2 5L5 2M2 5L5 8M12 9H2M12 9L9 6M12 9L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            P2P Trade
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
