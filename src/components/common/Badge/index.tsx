import { cn } from "@/lib/utils";
import Image from "next/image";
import { HTMLAttributes } from "react";

interface BadgeProps extends HTMLAttributes<HTMLDivElement> {
  icon?: string;
  label: string;
  iconAlt?: string;
}

function Badge({ icon, label, iconAlt = "", className, ...props }: BadgeProps) {
  return (
    <div
      className={cn("inline-flex items-center gap-2", className)}
      {...props}
    >
      {icon && (
        <div className="relative w-9 h-9 flex-shrink-0">
          <Image src={icon} alt={iconAlt || label} fill className="object-contain" />
        </div>
      )}
      <span className="[font-family:'Inter',Helvetica] font-medium text-white text-lg tracking-[0] leading-6 whitespace-nowrap">
        {label}
      </span>
    </div>
  );
}

export { Badge };
export type { BadgeProps };
