"use client";

import { usePathname } from "next/navigation";
import { useSidebar } from "@/components/providers/SidebarContext";

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/dashboard/p2p": "P2P Marketplace",
  "/dashboard/wallet": "Wallet",
  "/dashboard/deposit": "Deposit",
  "/dashboard/withdraw": "Withdraw",
  "/dashboard/history": "Transaction History",
  "/dashboard/kyc": "KYC Verification",
  "/dashboard/security": "Security",
  "/dashboard/support": "Support",
  "/dashboard/settings": "Settings",
};

export function DashboardNavbar() {
  const pathname = usePathname();
  const title = pageTitles[pathname] || "Dashboard";
  const { toggle } = useSidebar();

  return (
    <header className="fixed top-0 left-0 lg:left-[200px] right-0 z-30 h-[64px] bg-[#0d0e14] border-b border-white/5 flex items-center justify-between px-4 sm:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={toggle}
          data-testid="button-sidebar-toggle"
          aria-label="Toggle sidebar menu"
          className="lg:hidden w-9 h-9 flex items-center justify-center rounded-xl bg-[#1a1b23] text-[#6b7280] hover:text-white transition-colors cursor-pointer border-none"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M2 4H16M2 9H16M2 14H16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
        <h1 className="[font-family:'Inter',Helvetica] font-bold text-white text-base sm:text-lg">
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <div className="relative hidden sm:block">
          <input
            type="text"
            placeholder="Search..."
            data-testid="input-search"
            className="w-[160px] md:w-[200px] lg:w-[280px] h-9 bg-[#1a1b23] border border-white/10 rounded-xl px-4 pr-10 text-sm text-white placeholder:text-[#6b7280] focus:outline-none focus:border-violet-500/50 [font-family:'Inter',Helvetica] transition-colors"
          />
          <svg className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6b7280]" width="14" height="14" viewBox="0 0 14 14" fill="none">
            <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.5" />
            <path d="M10 10L13 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>

        <button data-testid="button-notifications" aria-label="Notifications" className="relative w-9 h-9 flex items-center justify-center rounded-xl bg-[#1a1b23] text-[#6b7280] hover:text-white transition-colors cursor-pointer border-none">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M14 6C14 3.24 11.76 1 9 1C6.24 1 4 3.24 4 6C4 11 1 12.5 1 12.5H17C17 12.5 14 11 14 6Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M10.73 15.5C10.39 16.06 9.74 16.5 9 16.5C8.26 16.5 7.61 16.06 7.27 15.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-violet-500 rounded-full"></span>
        </button>

        <div className="flex items-center gap-2.5 pl-2 sm:pl-3 border-l border-white/10">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-violet-700 flex items-center justify-center text-white text-xs font-bold [font-family:'Inter',Helvetica]">
            CH
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-medium text-white [font-family:'Inter',Helvetica] leading-4" data-testid="text-username">
              Courtney Henry
            </p>
          </div>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="text-[#6b7280] hidden sm:block">
            <path d="M3 5L6 8L9 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
    </header>
  );
}
