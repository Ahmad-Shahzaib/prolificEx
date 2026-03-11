"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { cn } from "@/lib/utils";

const sidebarLinks = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="2" y="2" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
        <rect x="11" y="2" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
        <rect x="2" y="11" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
        <rect x="11" y="11" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    label: "Markets",
    href: "/dashboard/markets",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M2 15L6 9L10 12L14 5L18 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    label: "P2P Trading",
    href: "/dashboard/p2p",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 7H16M4 7L7 4M4 7L7 10M16 13H4M16 13L13 10M16 13L13 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    label: "Wallet",
    href: "/dashboard/wallet",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="2" y="4" width="16" height="13" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <path d="M14 11.5C14 12.3284 13.3284 13 12.5 13C11.6716 13 11 12.3284 11 11.5C11 10.6716 11.6716 10 12.5 10C13.3284 10 14 10.6716 14 11.5Z" fill="currentColor" />
        <path d="M2 8H18" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    label: "History",
    href: "/dashboard/history",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5" />
        <path d="M10 6V10L13 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    label: "Settings",
    href: "/dashboard/settings",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="10" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.5" />
        <path d="M10 2V4M10 16V18M18 10H16M4 10H2M15.66 4.34L14.24 5.76M5.76 14.24L4.34 15.66M15.66 15.66L14.24 14.24M5.76 5.76L4.34 4.34" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed top-0 left-0 h-full w-[240px] bg-[#0b0e11] border-r border-white/5 flex flex-col z-40 lg:w-[240px] md:w-[72px]">
      <div className="p-6 md:px-4 md:py-6">
        <Link href="/">
          <Image
            src="/figmaAssets/h8fhoaokhdjquwmkrvnczlagvyrx5x-2.png"
            alt="ProlificEx Logo"
            width={129}
            height={51}
            className="object-contain md:w-10 md:h-10 lg:w-[129px] lg:h-[51px]"
            priority
          />
        </Link>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {sidebarLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.label}
              href={link.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 [font-family:'Inter',Helvetica] no-underline",
                isActive
                  ? "bg-violet-600/20 text-violet-400 border border-violet-500/20"
                  : "text-[#898ca9] hover:text-white hover:bg-white/5 border border-transparent"
              )}
            >
              <span className="flex-shrink-0">{link.icon}</span>
              <span className="md:hidden lg:inline">{link.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/5">
        <Link
          href="/"
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-[#898ca9] hover:text-white hover:bg-white/5 transition-all duration-200 [font-family:'Inter',Helvetica] no-underline"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7 17H4C3.44772 17 3 16.5523 3 16V11.4142C3 11.149 3.10536 10.8946 3.29289 10.7071L10 4L16.7071 10.7071C16.8946 10.8946 17 11.149 17 11.4142V16C17 16.5523 16.5523 17 16 17H13M7 17V13C7 12.4477 7.44772 12 8 12H12C12.5523 12 13 12.4477 13 13V17M7 17H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="md:hidden lg:inline">Back to Home</span>
        </Link>
      </div>
    </aside>
  );
}
