"use client";

import { Card, CardContent } from "@/components/common/Card";

interface PageShellProps {
  title: string;
  description: string;
  children?: React.ReactNode;
}

export function PageShell({ title, description, children }: PageShellProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="[font-family:'Inter',Helvetica] font-bold text-white text-xl mb-1">
          {title}
        </h2>
        <p className="text-[#6b7280] text-sm [font-family:'Inter',Helvetica]">
          {description}
        </p>
      </div>
      {children || (
        <Card className="bg-[#1a1b23] border border-white/5 rounded-2xl">
          <CardContent className="p-10 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-[#252630] flex items-center justify-center mb-4">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-[#f0b90b]">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h3 className="text-white text-lg font-semibold [font-family:'Inter',Helvetica] mb-2">
              Coming Soon
            </h3>
            <p className="text-[#6b7280] text-sm [font-family:'Inter',Helvetica] max-w-md">
              This feature is currently under development. Check back soon for updates.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
