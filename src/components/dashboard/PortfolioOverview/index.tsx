"use client";

import { Card, CardContent } from "@/components/common/Card";
import { Button } from "@/components/common/Button";

export function PortfolioOverview() {
  return (
    <Card className="bg-[#1a1b23] border border-white/5 rounded-2xl">
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-start justify-between mb-1">
          <p className="text-[#6b7280] text-sm [font-family:'Inter',Helvetica] font-medium">
            Total Portfolio Value
          </p>
          <Button
            variant="secondary"
            size="sm"
            data-testid="button-view-more-portfolio"
            className="text-[#6b7280] text-xs bg-[#252630] border-white/10 px-3 py-1"
          >
            View More
          </Button>
        </div>
        <h2 className="[font-family:'Inter',Helvetica] font-bold text-white text-2xl sm:text-[32px] leading-[44px] tracking-tight mb-5">
          $405,021.00
        </h2>
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <Button
            variant="primary"
            size="sm"
            data-testid="button-deposit"
            leftIcon={
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M7 2V12M7 12L3 8M7 12L11 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            }
          >
            Deposit
          </Button>
          <Button
            variant="outline"
            size="sm"
            data-testid="button-withdraw"
            leftIcon={
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M7 12V2M7 2L3 6M7 2L11 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            }
          >
            Withdraw
          </Button>
          <Button
            variant="secondary"
            size="sm"
            data-testid="button-p2p-trade"
            leftIcon={
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 5H12M2 5L5 2M2 5L5 8M12 9H2M12 9L9 6M12 9L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            }
          >
            P2P Trade
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
