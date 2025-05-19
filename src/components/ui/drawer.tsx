"use client";

import { useEffect, useRef } from "react";
import { useGesture } from "@use-gesture/react";
import gsap from "gsap";

interface BottomDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export default function BottomDrawer({ isOpen, onClose, children }: BottomDrawerProps) {
    const drawerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const onEsc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
        document.addEventListener("keydown", onEsc);
        return () => document.removeEventListener("keydown", onEsc);
    }, [onClose]);

    useEffect(() => {
        const el = drawerRef.current;
        if (!el) return;

        if (isOpen) {
            gsap.to(el, { y: 0, duration: 0.5, ease: "power3.out" });
        } else {
            gsap.to(el, { y: "100%", duration: 0.5, ease: "power3.in" });
        }
    }, [isOpen]);

    useGesture(
        {
            onDrag: ({ down, movement: [, my], velocity, direction: [, dy] }) => {
                const el = drawerRef.current;
                if (!el) return;

                if (down) {
                gsap.set(el, { y: Math.max(my, 0) }); // drag down only
                } else {
                if (velocity[1] > 0.5 && dy > 0) {
                    gsap.to(el, {
                    y: '100%',
                    duration: 0.5,
                    ease: 'power3.out',
                    onComplete: onClose,
                    });
                } else {
                    gsap.to(el, { y: 0, duration: 0.3, ease: 'power3.out' });
                }
                }
            },
        },
        {
            target: drawerRef,
            drag: { axis: 'y' },
        }
    );

    return (
        <>
        {/* Backdrop */}
        <div
            className={`fixed inset-0 bg-black/40 z-40 transition-opacity ${
            isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
            onClick={onClose}
        />

        {/* Bottom Drawer */}
        <div
            ref={drawerRef}
            className={`fixed bottom-0 left-0 right-0 z-50 max-h-[75vh] w-full bg-white rounded-t-2xl shadow-xl transition-transform duration-300 ease-in-out overflow-y-scroll scrollbar-hide ${
            isOpen ? "translate-y-0" : "translate-y-full"
            }`}
        >
            <div className="mx-auto h-1.5 w-12 rounded-full bg-neutral-300 mt-4 mb-2" />
            <div className="px-4 pb-6">{children}</div>
        </div>
        </>
    );
}
