import { Plus, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useAppUser } from "@/components/auth-provider";
import { API_URL } from "@/lib/utils";

export default function DashboardPage() {
    const { user } = useAppUser();

    const { data: resumes, isLoading, error } = useQuery({
        queryKey: ["resumes", user?.id],
        queryFn: async () => {
            if (!user?.id) return [];
            console.log("Fetching resumes for user:", user?.id);
            try {
                const res = await fetch(`${API_URL}/api/resumes?userId=${user.id}`);
                if (!res.ok) {
                    const txt = await res.text();
                    console.error("Fetch failed:", res.status, txt);
                    throw new Error("Failed to fetch");
                }
                const json = await res.json();
                console.log("Fetched resumes:", json);
                return json;
            } catch (err) {
                console.error("Query Error:", err);
                throw err;
            }
        },
        enabled: !!user,
    });

    if (error) {
        return <div className="p-8 text-red-500">Error loading dashboard: {(error as Error).message}</div>;
    }

    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Dashboard</h1>
                    <p className="text-muted-foreground mt-1">
                        Welcome back! Ready to create something amazing?
                    </p>
                </div>
                <Link
                    to="/dashboard/resumes/new"
                    className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors w-full md:w-auto active:scale-95 transition-transform"
                >
                    <Plus className="w-5 h-5" />
                    Create New
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Quick Stats */}
                <Link to="/dashboard/resumes" className="block h-full animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both" style={{ animationDelay: '0ms' }}>
                    <div className="p-6 rounded-xl border bg-card text-card-foreground shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-300 h-full">
                        <h3 className="font-semibold text-lg">Total Resumes</h3>
                        <p className="text-3xl font-bold mt-2">
                            {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : (resumes?.length || 0)}
                        </p>
                    </div>
                </Link>

                <Link to="/dashboard/portfolios" className="block h-full animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both" style={{ animationDelay: '100ms' }}>
                    <div className="p-6 rounded-xl border bg-card text-card-foreground shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-300 h-full">
                        <h3 className="font-semibold text-lg">Total Portfolios</h3>
                        <p className="text-3xl font-bold mt-2">0</p>
                    </div>
                </Link>

                <div className="p-6 rounded-xl border bg-card text-card-foreground shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both hover:scale-[1.02] transition-all duration-300" style={{ animationDelay: '200ms' }}>
                    <h3 className="font-semibold text-lg">AI Credits</h3>
                    <p className="text-3xl font-bold mt-2">Unlimited</p>
                </div>
            </div>
        </div>
    );
}
