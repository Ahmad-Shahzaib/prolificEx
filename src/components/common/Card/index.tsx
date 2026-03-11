import { cn } from "@/lib/utils";
import { HTMLAttributes, ReactNode } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  variant?: "default" | "coin" | "howItWorks";
}

function Card({ children, variant = "default", className, ...props }: CardProps) {
  const variantStyles = {
    default: "bg-[#191a23] rounded-[25px] border border-white/5",
    coin: "bg-[#1a1b23] rounded-2xl backdrop-blur-[125px]",
    howItWorks: "bg-[#191a23] rounded-[25px] border-none",
  };

  return (
    <div
      className={cn(
        "overflow-hidden",
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

interface CardContentProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

function CardContent({ children, className, ...props }: CardContentProps) {
  return (
    <div className={cn("p-6", className)} {...props}>
      {children}
    </div>
  );
}

interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

function CardHeader({ children, className, ...props }: CardHeaderProps) {
  return (
    <div className={cn("p-6 pb-0", className)} {...props}>
      {children}
    </div>
  );
}

interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  children: ReactNode;
}

function CardTitle({ children, className, ...props }: CardTitleProps) {
  return (
    <h3 className={cn("font-bold text-white text-xl", className)} {...props}>
      {children}
    </h3>
  );
}

export { Card, CardContent, CardHeader, CardTitle };
export type { CardProps };
