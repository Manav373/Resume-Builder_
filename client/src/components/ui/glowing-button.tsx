"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface GlowingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
}

export const GlowingButton = ({ children, className, ...props }: GlowingButtonProps) => {
    return (
        <div className="relative group">
            {/* Glow Effect / Gradient Border */}
            {/* Seamless Gradient: Cyan -> Purple -> Blue -> Cyan (matches start for loop) */}
            <div className="absolute -inset-0.5 bg-[linear-gradient(90deg,#06b6d4,#a855f7,#3b82f6,#06b6d4)] rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 animate-running-shine bg-[length:200%_auto]" />

            {/* Main Button */}
            <button
                className={cn(
                    "relative flex items-center justify-center w-full px-8 py-4 text-lg font-bold text-white transition-all bg-black rounded-lg leading-none",
                    "dark:bg-black bg-white dark:text-white text-black", // Adaptive background/text
                    "hover:bg-zinc-50 dark:hover:bg-zinc-900", // Hover states
                    className
                )}
                {...props}
            >
                {children}
            </button>
        </div >
    );
};
