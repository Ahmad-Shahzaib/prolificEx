"use client";

import { Button } from "@/components/common/Button";

export function DashboardNavbar() {
  return (
    <header className="sticky top-0 z-30 w-full h-[72px] bg-[#0d0d1a]/80 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-8">
      <div className="flex items-center gap-4">
        <h1 className="[font-family:'Inter',Helvetica] font-bold text-white text-xl tracking-[0] leading-[30px]">
          Dashboard
        </h1>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative">
          <input
            type="text"
            placeholder="Search..."
            className="w-[240px] h-10 bg-white/5 border border-white/10 rounded-xl px-4 pr-10 text-sm text-white placeholder:text-[#898ca9] focus:outline-none focus:border-violet-500/50 [font-family:'Inter',Helvetica] transition-colors"
          />
          <svg className="absolute right-3 top-1/2 -translate-y-1/2 text-[#898ca9]" width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5" />
            <path d="M11 11L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>

        <button className="relative w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-[#898ca9] hover:text-white hover:bg-white/10 transition-colors cursor-pointer">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M13.73 11.27C14.5 10.03 15 8.57 15 7C15 3.13 11.87 0 8 0C4.13 0 1 3.13 1 7C1 10.87 4.13 14 8 14C9.57 14 11.03 13.5 12.27 12.73L15.54 16L17 14.54L13.73 11.27Z" fill="currentColor" fillOpacity="0" />
            <path d="M14 7.5C14 8.88 13.5 10.16 12.66 11.16L12.16 11.66C11.16 12.5 9.88 13 8.5 13C5.46 13 3 10.54 3 7.5C3 4.46 5.46 2 8.5 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <span className="absolute top-2 right-2 w-2 h-2 bg-violet-500 rounded-full"></span>
        </button>

        <button className="relative w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-[#898ca9] hover:text-white hover:bg-white/10 transition-colors cursor-pointer">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M14 6C14 3.24 11.76 1 9 1C6.24 1 4 3.24 4 6C4 11 1 12.5 1 12.5H17C17 12.5 14 11 14 6Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M10.73 15.5C10.55 15.81 10.24 16.06 9.88 16.21C9.52 16.36 9.12 16.42 8.73 16.36C8.34 16.3 7.97 16.14 7.68 15.88C7.39 15.63 7.19 15.29 7.1 14.92" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="absolute top-2 right-2 w-2 h-2 bg-[#f46d22] rounded-full"></span>
        </button>

        <div className="flex items-center gap-3 ml-2 pl-4 border-l border-white/10">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-violet-700 flex items-center justify-center text-white text-sm font-bold [font-family:'Inter',Helvetica]">
            JD
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-white [font-family:'Inter',Helvetica] leading-4">John Doe</p>
            <p className="text-xs text-[#898ca9] [font-family:'Inter',Helvetica] leading-4">john@email.com</p>
          </div>
        </div>
      </div>
    </header>
  );
}
