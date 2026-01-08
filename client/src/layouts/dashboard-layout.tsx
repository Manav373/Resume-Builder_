import { useState } from "react";
import { UserButtonComponent } from "@/components/auth-provider";
import { LayoutDashboard, FileText, Briefcase, Settings, Menu, X } from "lucide-react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

import { ModeToggle } from "@/components/mode-toggle";

const sidebarItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
    { icon: FileText, label: "Resumes", href: "/dashboard/resumes" },
    { icon: Briefcase, label: "Portfolios", href: "/dashboard/portfolios" },
    { icon: Settings, label: "Settings", href: "/dashboard/settings" },
];

export default function DashboardLayout() {
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <div className="flex h-screen bg-background flex-col md:flex-row">
            {/* Mobile Header */}
            <header className="md:hidden h-16 border-b bg-card flex items-center justify-between px-4 sticky top-0 z-30">
                <div className="flex items-center gap-2">
                    <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                        AI Builder
                    </h1>
                </div>
                <div className="flex items-center gap-2">
                    <ModeToggle />
                    <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(true)}>
                        <Menu className="w-6 h-6" />
                    </Button>
                </div>
            </header>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/50 z-40 md:hidden"
                            onClick={() => setIsMobileMenuOpen(false)}
                        />
                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed inset-y-0 right-0 w-3/4 max-w-sm bg-card z-50 border-l shadow-2xl md:hidden flex flex-col"
                        >
                            <div className="p-4 border-b flex items-center justify-between">
                                <span className="font-bold text-lg">Menu</span>
                                <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)}>
                                    <X className="w-5 h-5" />
                                </Button>
                            </div>

                            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                                {sidebarItems.map((item) => {
                                    const Icon = item.icon;
                                    const isActive = location.pathname === item.href;
                                    return (
                                        <Link
                                            key={item.href}
                                            to={item.href}
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className={cn(
                                                "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                                                isActive
                                                    ? "bg-primary/10 text-primary"
                                                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                            )}
                                        >
                                            <Icon className="w-5 h-5" />
                                            <span className="font-medium">{item.label}</span>
                                        </Link>
                                    );
                                })}
                            </nav>

                            <div className="p-4 border-t space-y-4">
                                <div className="flex items-center justify-between px-2">
                                    <span className="text-sm font-medium text-muted-foreground">Theme</span>
                                    <ModeToggle />
                                </div>
                                <div className="flex items-center gap-3 px-2">
                                    <UserButtonComponent />
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium">My Account</span>
                                        <span className="text-xs text-muted-foreground">Manage profile</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Desktop Sidebar */}
            <aside className="w-64 border-r bg-card hidden md:flex flex-col shrink-0 h-full">
                <div className="p-6">
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                        AI Builder
                    </h1>
                </div>
                <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
                    {sidebarItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                to={item.href}
                                className={cn(
                                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                                    isActive
                                        ? "bg-primary/10 text-primary"
                                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                )}
                            >
                                <Icon className="w-5 h-5" />
                                <span className="font-medium">{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>
                <div className="p-4 border-t">
                    <div className="flex items-center gap-3 px-4 py-2">
                        <UserButtonComponent />
                        <span className="text-sm font-medium">Account</span>
                    </div>
                    <div className="flex items-center justify-between px-4 mt-4">
                        <span className="text-sm font-medium text-muted-foreground">Theme</span>
                        <ModeToggle />
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto w-full">
                <Outlet />
            </main>
        </div>
    );
}
