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
      "inline-flex items-center justify-center font-medium transition-all duration-200 cursor-pointer border-none focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

    const variantStyles = {
      primary:
        "bg-violet-600 hover:bg-violet-700 text-white rounded-[48px] shadow-[0px_16px_32px_-8px_rgba(124,58,237,0.48),0px_4px_8px_rgba(124,58,237,0.12)]",
      secondary:
        "[background:radial-gradient(50%_50%_at_50%_50%,rgba(255,255,255,0.08)_0%,rgba(255,255,255,0)_100%),linear-gradient(0deg,rgba(255,255,255,0.04)_0%,rgba(255,255,255,0.04)_100%)] shadow-[inset_0px_0px_0px_1px_rgba(255,255,255,0.06),inset_1px_1px_0px_rgba(255,255,255,0.08)] text-white rounded-[48px] hover:shadow-[inset_0px_0px_0px_1px_rgba(255,255,255,0.12)]",
      ghost:
        "bg-transparent hover:bg-white/10 text-white rounded-[999px]",
      outline:
        "bg-transparent border border-white/20 hover:bg-white/5 text-white rounded-[48px]",
    };

    const sizeStyles = {
      sm: "px-4 py-2 text-sm gap-2",
      md: "px-6 py-3 text-base gap-3",
      lg: "pl-6 pr-7 py-4 text-lg gap-3",
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
