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

const DialogContext = createContext<DialogContextType | undefined>(undefined);

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
};

export function DialogContent({
  children,
  className = "",
  overlayClassName = "",
  closeOnOverlayClick = true,
  allowDrag = false,
  position = "center",
  showCloseButton = true,
}: DialogContentProps) {
  const { isOpen, closeDialog } = useDialog();
  const contentRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);

  // Handle client-side only rendering for portal
  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  // Escape key to close
  useEffect(() => {
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        closeDialog();
      }
    };

    document.addEventListener("keydown", handleEscapeKey);
    return () => document.removeEventListener("keydown", handleEscapeKey);
  }, [isOpen, closeDialog]);

  // Animation effects
  useEffect(() => {
    if (!contentRef.current) return;
    
    const el = contentRef.current;
    
    if (isOpen) {
      // Customize the initial animation based on position
      let initialY = 0;
      
      if (position === "top") initialY = -100;
      if (position === "bottom") initialY = 100;
      
      // First set the initial position
      gsap.set(el, { 
        y: initialY, 
        opacity: 0,
        scale: 0.95
      });
      
      // Then animate to the final position
      gsap.to(el, {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.4,
        ease: "power2.out",
      });
      
      // Add overflow hidden to the body
      document.body.style.overflow = "hidden";
    } else {
      let targetY = 0;
      
      if (position === "top") targetY = -100;
      if (position === "bottom") targetY = 100;
      
      gsap.to(el, {
        y: targetY,
        opacity: 0,
        scale: 0.95,
        duration: 0.3,
        ease: "power2.in",
      });
      
      // Restore body overflow
      document.body.style.overflow = "";
    }
    
    return () => {
      // Clean up any animations on unmount
      gsap.killTweensOf(el);
      document.body.style.overflow = "";
    };
  }, [isOpen, position]);

  // Setup gestures for drag if enabled
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
              closeDialog();
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
                onComplete: closeDialog,
              });
            } else {
              gsap.to(el, { y: 0, duration: 0.3, ease: "power2.out" });
            }
          }
        }
      },
    },
    {
      target: contentRef,
      enabled: allowDrag && isOpen,
      drag: {
        filterTaps: true,
        bounds: {
          top: position === "bottom" ? 0 : undefined,
          bottom: position === "top" ? 0 : undefined,
        },
      },
    }
  );

  // Base position styles
  let positionClasses = "transform -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2"; // center
  if (position === "top") positionClasses = "transform -translate-x-1/2 left-1/2 top-4";
  if (position === "bottom") positionClasses = "transform -translate-x-1/2 left-1/2 bottom-4";

  if (!isMounted) return null;

  // Render the dialog using a portal
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
        onClick={closeOnOverlayClick ? closeDialog : undefined}
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
            onClick={closeDialog}
            className="absolute top-3 right-4 flex items-center justify-center cursor-pointer text-xs  hover:text-neutral-600 transition-colors"
            aria-label="Close dialog"
          >
            &#x2715;
          </button>
        )}
        {/* Optional drag handle if allowDrag is true */}
        {allowDrag && (
          <div className="absolute top-2 left-0 right-0 flex justify-center">
            <div className="h-1 w-12 rounded-full bg-neutral-200" />
          </div>
        )}
        
        {children}
      </div>
    </div>,
    document.body
  );
}

// Additional helpful components
export function DialogClose({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const { closeDialog } = useDialog();
  
  return (
    <button type="button" onClick={closeDialog} className={className}>
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