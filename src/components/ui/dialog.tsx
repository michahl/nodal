"use client";

import React, { useEffect, useRef, useState, createContext, useContext } from "react";
import { useGesture } from "@use-gesture/react";
import gsap from "gsap";
import { createPortal } from "react-dom";

// Context to manage the dialog state
type DialogContextType = {
  isOpen: boolean;
  openDialog: () => void;
  closeDialog: () => void;
  toggleDialog: () => void;
};

export const DialogContext = createContext<DialogContextType | undefined>(undefined);

function useDialog() {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error("useDialog must be used within a DialogProvider");
  }
  return context;
}

type DialogProviderProps = {
  children: React.ReactNode;
};

function DialogProvider({ children }: DialogProviderProps) {
  const [isOpen, setIsOpen] = useState(false);

  const openDialog = () => setIsOpen(true);
  const closeDialog = () => setIsOpen(false);
  const toggleDialog = () => setIsOpen((prev) => !prev);

  return (
    <DialogContext.Provider value={{ isOpen, openDialog, closeDialog, toggleDialog }}>
      {children}
    </DialogContext.Provider>
  );
}

// Dialog components
type DialogProps = {
  children: React.ReactNode;
};

export function Dialog({ children }: DialogProps) {
  return <DialogProvider>{children}</DialogProvider>;
}

type DialogTriggerProps = {
  children: React.ReactNode;
  asChild?: boolean;
};

export function DialogTrigger({ children, asChild = false }: DialogTriggerProps) {
  const { openDialog } = useDialog();

  if (asChild) {
    const child = children as React.ReactElement<any>;
    const originalOnClick = child.props.onClick;
    return React.cloneElement(child, {
      onClick: (e: React.MouseEvent) => {
        e.preventDefault();
        openDialog();
        if (typeof originalOnClick === "function") {
          originalOnClick(e);
        }
      },
    });
  }

  return (
    <div onClick={openDialog}>
      {children}
    </div>
  );
}

type DialogContentProps = {
  children: React.ReactNode;
  className?: string;
  overlayClassName?: string;
  closeOnOverlayClick?: boolean;
  allowDrag?: boolean;
  position?: "center" | "top" | "bottom";
  showCloseButton?: boolean;
  onClose?: () => void;  // Add this line
};

export function DialogContent({
  children,
  className = "",
  overlayClassName = "",
  closeOnOverlayClick = true,
  allowDrag = false,
  position = "center",
  showCloseButton = true,
  onClose,
}: DialogContentProps) {
  const { isOpen, closeDialog: originalCloseDialog } = useDialog();
  const contentRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);
  
  // Create a wrapper function that calls both the original closeDialog and the onClose prop
  const handleClose = () => {
    originalCloseDialog();
    if (onClose) onClose();
  };
  
  // Handle client-side only rendering for portal
  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  // Escape key to close
  useEffect(() => {
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        handleClose(); // Use the wrapper function
      }
    };

    document.addEventListener("keydown", handleEscapeKey);
    return () => document.removeEventListener("keydown", handleEscapeKey);
  }, [isOpen]);

  // Update the places where closeDialog is called to use handleClose instead
  
  // In the gesture handler
  useGesture(
    {
      onDrag: ({ down, movement: [mx, my], velocity, direction: [dx, dy] }) => {
        if (!allowDrag || !contentRef.current) return;
        
        const el = contentRef.current;
        
        if (position === "center") {
          // For center position, allow movement in any direction
          if (down) {
            gsap.set(el, { x: mx, y: my });
          } else {
            // If velocity is high enough, close the dialog
            if (velocity[0] > 0.5 || velocity[1] > 0.5) {
              handleClose(); // Use the wrapper function
            } else {
              // Otherwise, snap back to center
              gsap.to(el, { x: 0, y: 0, duration: 0.3, ease: "power2.out" });
            }
          }
        } else if (position === "top" || position === "bottom") {
          // For top/bottom positions, only allow vertical movement
          const allowedDirection = position === "top" ? -1 : 1;
          
          if (down && (dy * allowedDirection > 0)) {
            gsap.set(el, { y: my });
          } else if (!down) {
            if (velocity[1] > 0.3 && dy * allowedDirection > 0) {
              gsap.to(el, {
                y: allowedDirection * window.innerHeight,
                duration: 0.3,
                ease: "power2.in",
                onComplete: handleClose, // Use the wrapper function
              });
            } else {
              gsap.to(el, { y: 0, duration: 0.3, ease: "power2.out" });
            }
          }
        }
      },
    },
    // ...rest of useGesture options
  );

  // Determine dialog position classes
  const positionClasses =
    position === "center"
      ? "top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
      : position === "top"
      ? "top-8 left-1/2 transform -translate-x-1/2"
      : "bottom-8 left-1/2 transform -translate-x-1/2";

  return createPortal(
    <div
      className={`fixed inset-0 z-50 ${isOpen ? "block" : "hidden"}`}
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop overlay */}
      <div
        className={`fixed inset-0 bg-black/15 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0"
        } ${overlayClassName}`}
        onClick={closeOnOverlayClick ? handleClose : undefined} // Use wrapper function
      />

      {/* Dialog content */}
      <div
        ref={contentRef}
        style={{ willChange: "transform, opacity" }}
        className={`fixed ${positionClasses} z-50 bg-white rounded-lg shadow-xl max-w-sm md:max-w-md lg:max-w-lg w-full mx-auto p-6 ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        {showCloseButton && (
          <button
            onClick={handleClose} // Use wrapper function
            className="absolute top-3 right-4 flex items-center justify-center cursor-pointer text-xs hover:text-neutral-600 transition-colors"
            aria-label="Close dialog"
          >
            &#x2715;
          </button>
        )}
        
        {/* Rest of the component */}
        {children}
      </div>
    </div>,
    document.body
  );
}

// Also update the DialogClose component
export function DialogClose({ children, className = "", onClose }: { children: React.ReactNode; className?: string; onClose?: () => void }) {
  const { closeDialog } = useDialog();
  
  const handleClick = () => {
    closeDialog();
    if (onClose) onClose();
  };
  
  return (
    <button type="button" onClick={handleClick} className={className}>
      {children}
    </button>
  );
}

export function DialogTitle({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <h2 className={`text-lg font-semibold text-neutral-900 mb-4 ${className}`}>
      {children}
    </h2>
  );
}

export function DialogDescription({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`${className}`}>
      {children}
    </div>
  );
}