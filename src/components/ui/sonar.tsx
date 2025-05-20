"use client";

import { useEffect, useState, createContext, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cross2Icon } from "@radix-ui/react-icons";

// Types
export type ToastType = "success" | "error" | "info" | "warning" | "default";

export type Toast = {
  id: string;
  title: string;
  description?: string;
  type: ToastType;
  duration: number;
  dismissible: boolean;
  icon?: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
  onDismiss?: () => void;
  createdAt: number;
};

export type ToastOptions = Partial<
  Omit<Toast, "id" | "title" | "type" | "createdAt">
>;

type ToastContextType = {
  toasts: Toast[];
  addToast: (
    title: string,
    type?: ToastType,
    options?: ToastOptions
  ) => string;
  dismissToast: (id: string) => void;
  dismissAllToasts: () => void;
};

export type ToasterProps = {
  position?:
    | "top-left"
    | "top-right"
    | "bottom-left"
    | "bottom-right"
    | "top-center"
    | "bottom-center";
  expand?: boolean;
  visibleToasts?: number;
  richColors?: boolean;
  closeButton?: boolean;
  offset?: string | number;
  duration?: number;
  className?: string;
};

// Context
const ToastContext = createContext<ToastContextType | null>(null);

// Provider
export function SonarProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (
    title: string,
    type: ToastType = "default",
    options: ToastOptions = {}
  ) => {
    const id = Math.random().toString(36).substring(2, 9);
    
    const toast: Toast = {
      id,
      title,
      type,
      duration: options.duration || 4000,
      dismissible: options.dismissible ?? true,
      description: options.description,
      icon: options.icon,
      action: options.action,
      onDismiss: options.onDismiss,
      createdAt: Date.now(),
    };

    setToasts((prev) => [...prev, toast]);
    
    if (toast.duration > 0) {
      setTimeout(() => {
        dismissToast(id);
      }, toast.duration);
    }

    return id;
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => {
      const toast = prev.find((t) => t.id === id);
      if (toast?.onDismiss) toast.onDismiss();
      return prev.filter((t) => t.id !== id);
    });
  };

  const dismissAllToasts = () => {
    setToasts([]);
  };

  return (
    <ToastContext.Provider
      value={{ toasts, addToast, dismissToast, dismissAllToasts }}
    >
      {children}
    </ToastContext.Provider>
  );
}

// Hook
export function useSonar() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useSonar must be used within a SonarProvider");
  }
  return context;
}

// Toast Function
function createToastFunction() {
  let toastContext: ToastContextType | null = null;

  const setToastContext = (context: ToastContextType) => {
    toastContext = context;
  };

  const toast = (title: string, options?: ToastOptions) => {
    if (!toastContext) {
      console.error("Toast context not found. Make sure SonarProvider is set up correctly.");
      return "";
    }
    return toastContext.addToast(title, "default", options);
  };

  toast.success = (title: string, options?: ToastOptions) => {
    if (!toastContext) return "";
    return toastContext.addToast(title, "success", options);
  };

  toast.error = (title: string, options?: ToastOptions) => {
    if (!toastContext) return "";
    return toastContext.addToast(title, "error", options);
  };

  toast.warning = (title: string, options?: ToastOptions) => {
    if (!toastContext) return "";
    return toastContext.addToast(title, "warning", options);
  };

  toast.info = (title: string, options?: ToastOptions) => {
    if (!toastContext) return "";
    return toastContext.addToast(title, "info", options);
  };

  toast.dismiss = (id?: string) => {
    if (!toastContext) return;
    if (id) {
      toastContext.dismissToast(id);
    } else {
      toastContext.dismissAllToasts();
    }
  };

  return {
    toast,
    setToastContext,
  };
}

const { toast, setToastContext } = createToastFunction();
export { toast };

// Components
export function Toaster({
  position = "bottom-right",
  expand = false,
  visibleToasts = 3,
  richColors = false,
  closeButton = true,
  offset = "32px",
  duration = 4000,
  className = "",
}: ToasterProps) {
  const { toasts, addToast, dismissToast, dismissAllToasts } = useSonar();
  
  useEffect(() => {
    setToastContext({ toasts, addToast, dismissToast, dismissAllToasts });
  }, [toasts, addToast, dismissToast, dismissAllToasts]);

  // Only show the most recent visibleToasts
  const visibleToastsList = toasts.slice(-visibleToasts);

  // Determine position styles
  const getPositionStyles = () => {
    switch (position) {
      case "top-left":
        return { top: offset, left: offset };
      case "top-center":
        return { top: offset, left: "50%", transform: "translateX(-50%)" };
      case "top-right":
        return { top: offset, right: offset };
      case "bottom-left":
        return { bottom: offset, left: offset };
      case "bottom-center":
        return { bottom: offset, left: "50%", transform: "translateX(-50%)" };
      case "bottom-right":
      default:
        return { bottom: offset, right: offset };
    }
  };

  // Determine swipe direction based on position
  const getSwipeDirection = () => {
    if (position.startsWith("top")) return "down";
    return "up";
  };

  // Get enter/exit Y values for animation
  const getYValues = () => {
    if (position.startsWith("top")) return { initial: -80, exit: -80 };
    return { initial: 80, exit: 80 };
  };

  const { initial: initialY, exit: exitY } = getYValues();
  const swipeDirection = getSwipeDirection();

  return (
    <div
      className={`fixed z-50 flex flex-col gap-2 ${className}`}
      style={{ ...getPositionStyles() }}
    >
      <AnimatePresence initial={false}>
        {visibleToastsList.map((toast, index) => {
          const isVisible = index === visibleToastsList.length - 1 || expand;
          const zIndex = 100 - index;

          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: initialY, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: exitY, scale: 0.9 }}
              transition={{
                type: "spring",
                damping: 20,
                stiffness: 300,
                duration: 0.2,
              }}
              className={`
                relative w-full max-w-sm px-4 py-2.5 shadow-lg border border-neutral-200 rounded-lg pointer-events-auto 
                ${!isVisible ? "hidden" : ""} 
                ${richColors ? getTypeClass(toast.type) : "bg-white text-black"}
              `}
              style={{ zIndex }}
              onPointerDown={(event: React.PointerEvent<HTMLDivElement>) => {
                const startY = event.clientY;
                
                const onPointerMove = (event: PointerEvent) => {
                  const deltaY = event.clientY - startY;
                  const swipeThreshold = 50;
                  
                  if (
                    (swipeDirection === "up" && deltaY < -swipeThreshold) ||
                    (swipeDirection === "down" && deltaY > swipeThreshold)
                  ) {
                    dismissToast(toast.id);
                    document.removeEventListener("pointermove", onPointerMove);
                    document.removeEventListener("pointerup", onPointerUp);
                  }
                };
                
                const onPointerUp = () => {
                  document.removeEventListener("pointermove", onPointerMove);
                  document.removeEventListener("pointerup", onPointerUp);
                };
                
                document.addEventListener("pointermove", onPointerMove);
                document.addEventListener("pointerup", onPointerUp);
              }}
            >
              <div className="flex items-center justify-center gap-3">
                {toast.icon && (
                  <div className="flex-shrink-0">{toast.icon}</div>
                )}
                <div className="flex-1 pt-0.5">
                  <div className="font-medium">{toast.title}</div>
                  {toast.description && (
                    <div className="text-sm">{toast.description}</div>
                  )}
                  {toast.action && (
                    <button
                      onClick={toast.action.onClick}
                      className="mt-2 text-sm font-medium hover:underline focus:outline-none"
                    >
                      {toast.action.label}
                    </button>
                  )}
                </div>
                {closeButton && toast.dismissible && (
                  <button
                    onClick={() => dismissToast(toast.id)}
                    className="flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity"
                    aria-label="Close toast"
                  >
                    <Cross2Icon width={7} height={7} />
                  </button>
                )}
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

// Helper Functions
function getTypeClass(type: ToastType) {
  switch (type) {
    case "success":
      return "bg-green-600 text-white";
    case "error":
      return "bg-red-600 text-white";
    case "warning":
      return "bg-amber-500 text-white";
    case "info":
      return "bg-blue-500 text-white";
    default:
      return "bg-neutral-800 text-white";
  }
}