import { useState, useCallback } from "react";

export type ToastType = "success" | "error" | "info" | "warning";

export interface Toast {
  id: string;
  title: string;
  description?: string;
  type: ToastType;
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback(
    ({
      title,
      description,
      type = "info",
    }: {
      title: string;
      description?: string;
      type?: ToastType;
    }) => {
      const id = Math.random().toString(36).substring(2, 9);
      const newToast: Toast = { id, title, description, type };

      setToasts((prev) => [...prev, newToast]);

      // Auto dismiss after 3 seconds
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 3000);

      return id;
    },
    []
  );

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return {
    toasts,
    toast,
    dismiss,
  };
}
