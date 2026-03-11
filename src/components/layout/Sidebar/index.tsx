"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { cn } from "@/lib/utils";

const mainLinks = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <rect x="1" y="1" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
        <rect x="11" y="1" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
        <rect x="1" y="11" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
        <rect x="11" y="11" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    label: "P2P Marketplace",
    href: "/dashboard/p2p",
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M3 6H15M3 6L6 3M3 6L6 9M15 12H3M15 12L12 9M15 12L12 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    label: "Wallet",
    href: "/dashboard/wallet",
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <rect x="1" y="3" width="16" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="13" cy="10" r="1.5" fill="currentColor" />
        <path d="M1 7H17" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    label: "Deposit",
    href: "/dashboard/deposit",
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M9 2V14M9 14L4 9M9 14L14 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M2 16H16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    label: "Withdraw",
    href: "/dashboard/withdraw",
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M9 14V2M9 2L4 7M9 2L14 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M2 16H16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    label: "Transaction History",
    href: "/dashboard/history",
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <circle cx="9" cy="9" r="7.5" stroke="currentColor" strokeWidth="1.5" />
        <path d="M9 5V9L12 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    label: "KYC Verification",
    href: "/dashboard/kyc",
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M9 1L2 4V8.5C2 12.64 4.99 16.49 9 17.5C13.01 16.49 16 12.64 16 8.5V4L9 1Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M6 9L8 11L12 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    label: "Security",
    href: "/dashboard/security",
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <rect x="3" y="8" width="12" height="8" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <path d="M6 8V5C6 3.34 7.34 2 9 2C10.66 2 12 3.34 12 5V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="9" cy="12" r="1" fill="currentColor" />
      </svg>
    ),
  },
  {
    label: "Support",
    href: "/dashboard/support",
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <circle cx="9" cy="9" r="7.5" stroke="currentColor" strokeWidth="1.5" />
        <path d="M6.5 6.5C6.5 5.12 7.62 4 9 4C10.38 4 11.5 5.12 11.5 6.5C11.5 7.88 10.38 9 9 9V10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="9" cy="13" r="0.75" fill="currentColor" />
      </svg>
    ),
  },
];

const bottomLinks = [
  {
    label: "Setting",
    href: "/dashboard/settings",
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <circle cx="9" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.5" />
        <path d="M9 1V3M9 15V17M17 9H15M3 9H1M14.66 3.34L13.24 4.76M4.76 13.24L3.34 14.66M14.66 14.66L13.24 13.24M4.76 4.76L3.34 3.34" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    label: "Logout",
    href: "/",
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M6 16H3C2.44772 16 2 15.5523 2 15V3C2 2.44772 2.44772 2 3 2H6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M12 13L16 9L12 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M16 9H7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed top-0 left-0 h-screen w-[200px] bg-[#11131a] flex flex-col z-40 overflow-y-auto">
      <div className="flex items-center justify-center px-5 py-5">
        <Link href="/" className="no-underline">
          <Image
            src="/figmaAssets/h8fhoaokhdjquwmkrvnczlagvyrx5x-2.png"
            alt="Prolific Logo"
            width={36}
            height={36}
            className="object-contain"
            priority
          />
        </Link>
      </div>

      <nav className="flex-1 px-3 py-2 space-y-1">
        {mainLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.label}
              href={link.href}
              data-testid={`sidebar-link-${link.label.toLowerCase().replace(/\s+/g, "-")}`}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200 [font-family:'Inter',Helvetica] no-underline border",
                isActive
                  ? "bg-violet-600 text-white border-violet-500/40 shadow-[0_2px_8px_rgba(124,58,237,0.25)]"
                  : "text-[#6b7280] hover:text-white hover:bg-white/5 border-transparent"
              )}
            >
              <span className="flex-shrink-0 w-[18px] h-[18px]">{link.icon}</span>
              <span className="truncate">{link.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="px-3 pb-5 space-y-1">
        {bottomLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.label}
              href={link.href}
              data-testid={`sidebar-link-${link.label.toLowerCase()}`}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200 [font-family:'Inter',Helvetica] no-underline border",
                isActive
                  ? "bg-violet-600 text-white border-violet-500/40 shadow-[0_2px_8px_rgba(124,58,237,0.25)]"
                  : "text-[#6b7280] hover:text-white hover:bg-white/5 border-transparent"
              )}
            >
              <span className="flex-shrink-0 w-[18px] h-[18px]">{link.icon}</span>
              <span>{link.label}</span>
            </Link>
          );
        })}
      </div>
    </aside>
  );
}
