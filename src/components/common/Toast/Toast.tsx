"use client";

import * as ToastPrimitives from "@radix-ui/react-toast";
import { X, CheckCircle2, AlertCircle, Info, AlertTriangle } from "lucide-react";
import { Toast as ToastType } from "@/hooks/use-toast";

interface ToastProps {
  toast: ToastType;
  onDismiss: (id: string) => void;
}

const iconMap = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info,
  warning: AlertTriangle,
};

const colorMap = {
  success: "bg-[#0a2f1e] border-emerald-500/30 text-emerald-200",
  error: "bg-[#2d0a0f] border-red-500/30 text-red-200",
  info: "bg-[#0a1a2d] border-blue-500/30 text-blue-200",
  warning: "bg-[#2d1f0a] border-amber-500/30 text-amber-200",
};

const iconColorMap = {
  success: "text-emerald-400",
  error: "text-red-400",
  info: "text-blue-400",
  warning: "text-amber-400",
};

export function Toast({ toast, onDismiss }: ToastProps) {
  const Icon = iconMap[toast.type];

  return (
    <ToastPrimitives.Root
      className={`rounded-2xl border p-4 shadow-2xl flex items-start gap-3 min-w-[320px] max-w-md animate-in slide-in-from-top-5 ${colorMap[toast.type]}`}
      onOpenChange={(open) => {
        if (!open) onDismiss(toast.id);
      }}
    >
      <Icon size={20} className={`mt-0.5 flex-shrink-0 ${iconColorMap[toast.type]}`} />
      
      <div className="flex-1 space-y-1">
        <ToastPrimitives.Title className="font-semibold text-sm">
          {toast.title}
        </ToastPrimitives.Title>
        {toast.description && (
          <ToastPrimitives.Description className="text-sm opacity-90">
            {toast.description}
          </ToastPrimitives.Description>
        )}
      </div>

      <ToastPrimitives.Close
        className="rounded-full p-1 hover:bg-white/10 transition flex-shrink-0"
        onClick={() => onDismiss(toast.id)}
      >
        <X size={16} />
      </ToastPrimitives.Close>
    </ToastPrimitives.Root>
  );
}

interface ToasterProps {
  toasts: ToastType[];
  onDismiss: (id: string) => void;
}

export function Toaster({ toasts, onDismiss }: ToasterProps) {
  return (
    <ToastPrimitives.Provider swipeDirection="right">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
      <ToastPrimitives.Viewport className="fixed top-0 right-0 flex flex-col gap-2 w-full max-w-md p-4 z-[100] outline-none" />
    </ToastPrimitives.Provider>
  );
}
