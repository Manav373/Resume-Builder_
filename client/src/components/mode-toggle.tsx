"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

import { cn } from "@/lib/utils"

export function ModeToggle() {
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = useState(false)

    // Avoid hydration mismatch
    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return <div className="w-14 h-8 rounded-full bg-muted animate-pulse" />
    }

    const isDark = theme === "dark"

    return (
        <button
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className={cn(
                "relative inline-flex h-8 w-14 shrink-0 cursor-pointer items-center rounded-full p-1 transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                isDark ? "bg-slate-200" : "bg-slate-900"
            )}
            aria-label="Toggle theme"
        >
            <span
                className={cn(
                    "pointer-events-none flex items-center justify-center h-6 w-6 rounded-full shadow-lg ring-0 transition-all duration-300 ease-in-out",
                    isDark ? "bg-slate-900 translate-x-6 text-slate-200" : "bg-white translate-x-0 text-slate-900"
                )}
            >
                {isDark ? (
                    <Moon className="h-3.5 w-3.5" />
                ) : (
                    <Sun className="h-3.5 w-3.5" />
                )}
            </span>
        </button>
    )
}
