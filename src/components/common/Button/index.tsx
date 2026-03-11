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
      "inline-flex items-center justify-center font-medium transition-all duration-200 cursor-pointer border-none focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:ring-offset-2 focus:ring-offset-[#0d0e14] disabled:opacity-50 disabled:cursor-not-allowed [font-family:'Inter',Helvetica]";

    const variantStyles = {
      primary:
        "bg-violet-600 hover:bg-violet-700 text-white rounded-lg font-semibold shadow-[0px_8px_20px_-4px_rgba(124,58,237,0.4)]",
      secondary:
        "bg-[#1a1b23] border border-white/10 text-white rounded-lg hover:bg-[#252630]",
      ghost:
        "bg-transparent hover:bg-white/5 text-white rounded-lg",
      outline:
        "bg-transparent border border-violet-500 text-violet-400 rounded-lg hover:bg-violet-500/10",
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
