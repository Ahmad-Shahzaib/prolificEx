import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  children: ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      leftIcon,
      rightIcon,
      children,
      className,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium transition-all duration-200 cursor-pointer border-none focus:outline-none focus:ring-2 focus:ring-[#f0b90b]/50 focus:ring-offset-2 focus:ring-offset-[#0d0e14] disabled:opacity-50 disabled:cursor-not-allowed [font-family:'Inter',Helvetica]";

    const variantStyles = {
      primary:
        "bg-[#f0b90b] hover:bg-[#d4a30a] text-black rounded-lg font-semibold",
      secondary:
        "bg-[#1a1b23] border border-white/10 text-white rounded-lg hover:bg-[#252630]",
      ghost:
        "bg-transparent hover:bg-white/5 text-white rounded-lg",
      outline:
        "bg-transparent border border-[#f0b90b] text-[#f0b90b] rounded-lg hover:bg-[#f0b90b]/10",
    };

    const sizeStyles = {
      sm: "px-4 py-2 text-sm gap-2",
      md: "px-6 py-3 text-sm gap-2",
      lg: "px-8 py-4 text-base gap-3",
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
        {...props}
      >
        {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
        {children}
        {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
export type { ButtonProps };
