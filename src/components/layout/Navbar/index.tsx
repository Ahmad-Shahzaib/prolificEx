"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/common/Button";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { closeMobileMenu, setActiveNavLink } from "@/redux/slices/uiSlice";
import { NavLink } from "@/types";

const navLinks: NavLink[] = [
  { label: "Markets", href: "#markets" },
  { label: "P2P", href: "#p2p" },
  { label: "About", href: "#about" },
];

export function Navbar() {
  const dispatch = useAppDispatch();
  const { activeNavLink } = useAppSelector((state) => state.ui);

  const handleNavClick = (label: string) => {
    dispatch(setActiveNavLink(label));
    dispatch(closeMobileMenu());
  };

  return (
    <nav className="absolute top-10 left-[100px] w-[1240px] h-16 flex items-center z-50">
      <Link href="/" className="relative w-[129px] h-[51px] block">
        <Image
          src="/figmaAssets/h8fhoaokhdjquwmkrvnczlagvyrx5x-2.png"
          alt="ProlificEx Logo"
          fill
          className="object-contain"
          priority
        />
      </Link>

      <div className="inline-flex h-12 items-center px-4 py-3 absolute top-2 left-[calc(50%_-_134px)] bg-white/[0.15] rounded-[999px] border border-solid border-white/10 backdrop-blur-[20px]">
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

      <div className="inline-flex items-center gap-5 absolute top-2 left-[1032px]">
        <Link
          href="/dashboard"
          className="inline-flex items-center px-3 py-0.5 no-underline hover:text-white/80 transition-colors"
        >
          <span className="[font-family:'Inter',Helvetica] font-medium text-white/90 text-base tracking-[0] leading-6 whitespace-nowrap">
            Login
          </span>
        </Link>

        <Link href="/dashboard" className="no-underline">
          <Button
            variant="primary"
            size="lg"
            className="rounded-[48px] relative overflow-hidden before:content-[''] before:absolute before:inset-0 before:p-px before:rounded-[48px] before:[background:linear-gradient(180deg,rgba(124,58,237,1)_0%,rgba(124,58,237,0)_100%)] before:[-webkit-mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)] before:[-webkit-mask-composite:xor] before:[mask-composite:exclude] before:z-[1] before:pointer-events-none"
          >
            <span className="[font-family:'Inter',Helvetica] font-medium text-white text-lg text-center leading-6 whitespace-nowrap">
              Sign Up
            </span>
          </Button>
        </Link>
      </div>
    </nav>
  );
}
