import { toast as createToast } from "../../hooks/uses-toast";
import * as React from "react";

export type ToastProps = {
  id: string
  title?: string
  description?: string
}

const ToastContext = React.createContext<{
  toast: (props: ToastProps) => void
} | null>(null)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const toast = (props: ToastProps) => {
    try {
      // forward to global toaster
      // remove `id` before forwarding if present
      const { id, ...rest } = props as any;
      createToast({ ...rest });
    } catch (err) {
      console.warn("toast failed:", err);
    }
  };
  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = React.useContext(ToastContext)
  if (!context) {
    throw new Error("useToast must be used within ToastProvider")
  }
  return context
}
