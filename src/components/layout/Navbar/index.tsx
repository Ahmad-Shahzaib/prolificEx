"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/common/Button";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { closeMobileMenu, setActiveNavLink, toggleMobileMenu } from "@/redux/slices/uiSlice";
import { NavLink } from "@/types";

const navLinks: NavLink[] = [
  { label: "Markets", href: "#markets" },
  { label: "P2P", href: "#p2p" },
  { label: "About", href: "#about" },
];

export function Navbar() {
  const dispatch = useAppDispatch();
  const { activeNavLink, isMobileMenuOpen } = useAppSelector((state) => state.ui);

  const handleNavClick = (label: string) => {
    dispatch(setActiveNavLink(label));
    dispatch(closeMobileMenu());
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0d0d14]/95 backdrop-blur-lg border-b border-white/10">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 py-5 sm:py-6 flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className="relative w-[100px] sm:w-[129px] h-[40px] sm:h-[51px] block flex-shrink-0">
          <Image
            src="/figmaAssets/h8fhoaokhdjquwmkrvnczlagvyrx5x-2.png"
            alt="ProlificEx Logo"
            fill
            className="object-contain"
            priority
          />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:inline-flex h-12 items-center px-4 py-3 bg-white/[0.15] rounded-[999px] border border-solid border-white/10 backdrop-blur-[20px]">
          {navLinks.map((link) => (
            <button
              key={link.label}
              onClick={() => handleNavClick(link.label)}
              className={`inline-flex items-center px-4 py-0.5 bg-transparent border-none cursor-pointer transition-colors duration-200 ${
                activeNavLink === link.label ? "text-white" : "text-white/90 hover:text-white"
              }`}
            >
              <span className="[font-family:'Inter',Helvetica] font-medium text-base tracking-[0] leading-6 whitespace-nowrap">
                {link.label}
              </span>
            </button>
          ))}
        </div>

        {/* Desktop Auth Buttons */}
        <div className="hidden sm:inline-flex items-center gap-3 sm:gap-5">
          <Link
            href="/login"
            className="inline-flex items-center px-3 py-0.5 no-underline hover:text-white/80 transition-colors"
          >
            <span className="[font-family:'Inter',Helvetica] font-medium text-white/90 text-base tracking-[0] leading-6 whitespace-nowrap">
              Login
            </span>
          </Link>

          <Link href="/signup" className="no-underline">
            <Button
              variant="primary"
              size="md"
              className="rounded-[48px] relative overflow-hidden before:content-[''] before:absolute before:inset-0 before:p-px before:rounded-[48px] before:[background:linear-gradient(180deg,rgba(124,58,237,1)_0%,rgba(124,58,237,0)_100%)] before:[-webkit-mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)] before:[-webkit-mask-composite:xor] before:[mask-composite:exclude] before:z-[1] before:pointer-events-none"
            >
              <span className="[font-family:'Inter',Helvetica] font-medium text-white text-base sm:text-lg text-center leading-6 whitespace-nowrap">
                Sign Up
              </span>
            </Button>
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => dispatch(toggleMobileMenu())}
          className="sm:hidden w-10 h-10 flex items-center justify-center rounded-lg bg-white/10 text-white border-none cursor-pointer"
          data-testid="button-mobile-menu"
          aria-label="Toggle navigation menu"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            {isMobileMenuOpen ? (
              <path d="M5 5L15 15M15 5L5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            ) : (
              <path d="M3 5H17M3 10H17M3 15H17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            )}
          </svg>
        </button>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 mt-3 mx-4 bg-[#1a1b23] border border-white/10 rounded-2xl p-4 shadow-2xl sm:hidden z-50">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <button
                  key={link.label}
                  onClick={() => handleNavClick(link.label)}
                  className="text-left px-4 py-3 rounded-xl text-white/90 hover:text-white hover:bg-white/5 bg-transparent border-none cursor-pointer [font-family:'Inter',Helvetica] font-medium text-base"
                >
                  {link.label}
                </button>
              ))}

              <div className="border-t border-white/10 mt-3 pt-4 flex flex-col gap-2">
                <Link 
                  href="/login" 
                  onClick={() => dispatch(closeMobileMenu())} 
                  className="px-4 py-3 rounded-xl text-white/90 hover:text-white hover:bg-white/5 no-underline [font-family:'Inter',Helvetica] font-medium text-base"
                >
                  Login
                </Link>
                <Link href="/signup" onClick={() => dispatch(closeMobileMenu())} className="no-underline">
                  <Button variant="primary" size="md" className="w-full rounded-xl">
                    Sign Up
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}