"use client";

import { useEffect, useRef } from "react";
import { useGesture } from "@use-gesture/react";
import { animate, motion, useMotionValue, useTransform } from "framer-motion";

interface BottomDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

export default function BottomDrawer({ isOpen, onClose, children }: BottomDrawerProps) {
    const y = useMotionValue(0);
    const drawerRef = useRef<HTMLDivElement>(null);
    
    // Reset position when drawer opens/closes
    useEffect(() => {
        if (isOpen) {
            animate(y, 0, { 
                duration: 0.6, 
                ease: [0.16, 1, 0.3, 1] // expo.out equivalent
            });
        } else {
            animate(y, window.innerHeight, { 
                duration: 0.6, 
                ease: [0.7, 0, 0.84, 0] // expo.in equivalent
            });
        }
    }, [isOpen, y]);

    // Handle escape key
    useEffect(() => {
        const onEsc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
        document.addEventListener("keydown", onEsc);
        return () => document.removeEventListener("keydown", onEsc);
    }, [onClose]);

    // Configure gesture handling
    useGesture(
        {
            onDrag: ({ down, movement: [, my], velocity: [, vy], direction: [, dy] }) => {
                if (down) {
                    // Only allow dragging downward
                    y.set(Math.max(0, my));
                } else {
                    if (vy > 0.3 && dy > 0) {
                        // If flicked downward with enough velocity
                        animate(y, window.innerHeight, { 
                            duration: 0.5, 
                            ease: [0.16, 1, 0.3, 1], // expo.out equivalent
                            onComplete: onClose
                        });
                    } else {
                        // Snap back to open position
                        animate(y, 0, { 
                            duration: 0.4, 
                            ease: [0.16, 1, 0.3, 1] // expo.out equivalent
                        });
                    }
                }
            },
        },
        {
            target: drawerRef,
            drag: { axis: 'y' },
        }
    );

    // Calculate background opacity based on drawer position
    const opacity = useTransform(
        y, 
        [0, window.innerHeight], 
        [1, 0]
    );

    return (
        <>
            {/* Backdrop */}
            <motion.div
                style={{ opacity }}
                className={`fixed inset-0 bg-black/40 z-40 ${
                    isOpen ? "" : "pointer-events-none"
                }`}
                onClick={onClose}
            />

            {/* Bottom Drawer */}
            <motion.div
                ref={drawerRef}
                style={{ 
                    y,
                    willChange: "transform"
                }}
                className={`fixed bottom-0 left-0 right-0 z-50 max-h-[75vh] w-full bg-white rounded-t-2xl shadow-xl overflow-y-scroll scrollbar-hide ${
                    isOpen ? "" : "pointer-events-none"
                }`}
            >
                <div className="mx-auto h-1.5 w-12 rounded-full bg-neutral-300 mt-4 mb-2" />
                <div className="px-4 pb-6">{children}</div>
            </motion.div>
        </>
    );
}