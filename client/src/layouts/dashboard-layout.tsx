import { useState, useEffect } from "react";
import { UserButtonComponent } from "@/components/auth-provider";
import { LayoutDashboard, FileText, Settings, Menu, X, Globe, LogOut } from "lucide-react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

import { ModeToggle } from "@/components/mode-toggle";

const sidebarItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
    { icon: FileText, label: "Resumes", href: "/dashboard/resumes" },
    { icon: Globe, label: "Portfolios", href: "/dashboard/portfolios" },
    { icon: Settings, label: "Settings", href: "/dashboard/settings" },
];

export default function DashboardLayout() {
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Close mobile menu when route changes
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [location.pathname]);

    return (
        <div className="flex h-screen bg-background flex-col md:flex-row overflow-hidden">
            {/* Mobile Header */}
            <header className="md:hidden h-16 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex items-center justify-between px-4 sticky top-0 z-40 shrink-0 w-full">
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
                            transition={{ duration: 0.2 }}
                            className="fixed inset-0 bg-black/80 z-50 md:hidden backdrop-blur-sm"
                            onClick={() => setIsMobileMenuOpen(false)}
                        />
                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="fixed inset-y-0 right-0 w-[85%] max-w-sm bg-background z-50 border-l shadow-2xl md:hidden flex flex-col h-full"
                        >
                            <div className="p-4 border-b flex items-center justify-between shrink-0">
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
                                            className={cn(
                                                "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                                                isActive
                                                    ? "bg-primary/10 text-primary font-medium"
                                                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                            )}
                                        >
                                            <Icon className="w-5 h-5" />
                                            <span>{item.label}</span>
                                        </Link>
                                    );
                                })}
                            </nav>

                            <div className="p-4 border-t space-y-4 shrink-0 bg-muted/20">
                                <div className="flex items-center justify-between px-2">
                                    <span className="text-sm font-medium text-muted-foreground">Theme</span>
                                    <ModeToggle />
                                </div>
                                <div className="flex items-center gap-3 px-2 py-2 rounded-lg bg-background/50 border">
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
                                        ? "bg-primary/10 text-primary font-medium"
                                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                )}
                            >
                                <Icon className="w-5 h-5" />
                                <span>{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>
                <div className="p-4 border-t">
                    <div className="flex items-center gap-3 px-4 py-2 mb-2">
                        <UserButtonComponent />
                        <span className="text-sm font-medium">Account</span>
                    </div>
                    <div className="flex items-center justify-between px-4 py-2 rounded-md hover:bg-muted/50 transition-colors">
                        <span className="text-sm font-medium text-muted-foreground">Theme</span>
                        <ModeToggle />
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto w-full relative scroll-smooth">
                <Outlet />
            </main>
        </div>
    );
}
