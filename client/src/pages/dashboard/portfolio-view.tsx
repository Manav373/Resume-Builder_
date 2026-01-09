import { useParams, useLocation } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { API_URL } from "@/lib/utils";
import { Loader2, ArrowLeft, Pencil, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export default function PortfolioViewPage() {
    const { id } = useParams();
    const location = useLocation();
    const queryClient = useQueryClient();
    const [isEditing, setIsEditing] = useState(location.state?.isEditing || false);
    const [editTitle, setEditTitle] = useState("");

    const { data: portfolio, isLoading, error } = useQuery({
        queryKey: ["portfolio", id],
        queryFn: async () => {
            const res = await fetch(`${API_URL}/api/portfolios/${id}`);
            if (!res.ok) throw new Error("Failed to fetch portfolio");
            return res.json();
        },
        enabled: !!id,
    });

    useEffect(() => {
        if (portfolio?.title) {
            setEditTitle(portfolio.title);
        }
    }, [portfolio]);

    const handleSaveTitle = async () => {
        if (!editTitle.trim()) {
            toast.error("Title cannot be empty");
            return;
        }

        try {
            const res = await fetch(`${API_URL}/api/portfolios/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ title: editTitle }),
            });

            if (!res.ok) throw new Error("Failed to update title");

            await queryClient.invalidateQueries({ queryKey: ["portfolio", id] });
            await queryClient.invalidateQueries({ queryKey: ["portfolios"] }); // Update list view too

            toast.success("Portfolio title updated");
            setIsEditing(false);
        } catch (error) {
            console.error("Update Error:", error);
            toast.error("Failed to update title");
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (error || !portfolio) {
        return (
            <div className="p-8 text-center text-red-500">
                <p>Failed to load portfolio.</p>
                <Link to="/dashboard/portfolios">
                    <Button variant="outline" className="mt-4">Back to Portfolios</Button>
                </Link>
            </div>
        );
    }

    // Prepare the source for the iframe
    // The content is stored as { html: "..." }
    let srcDoc = portfolio.content?.html || "";

    // Inject safety script to fix links
    srcDoc += `
        <script>
            document.addEventListener('DOMContentLoaded', () => {
                document.querySelectorAll('a').forEach(el => {
                    const href = el.getAttribute('href');
                    if (href && (href === '/' || href === '/home' || href === 'index.html')) {
                        el.setAttribute('href', '#home');
                        el.addEventListener('click', (e) => {
                            e.preventDefault();
                            const home = document.getElementById('home');
                            if(home) home.scrollIntoView({ behavior: 'smooth' });
                        });
                    }
                });
            });
        </script>
    `;

    return (
        <div className="flex flex-col h-screen bg-background">
            <header className="h-14 border-b flex items-center px-4 gap-4 bg-muted/30 shrink-0">
                <Link to="/dashboard/portfolios">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="w-4 h-4" />
                    </Button>
                </Link>

                {isEditing ? (
                    <div className="flex items-center gap-2">
                        <Input
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            className="h-8 w-64"
                        />
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-100" onClick={handleSaveTitle}>
                            <Check className="w-4 h-4" />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-100" onClick={() => {
                            setIsEditing(false);
                            setEditTitle(portfolio.title);
                        }}>
                            <X className="w-4 h-4" />
                        </Button>
                    </div>
                ) : (
                    <div className="flex items-center gap-2">
                        <h1 className="font-semibold">{portfolio.title}</h1>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => setIsEditing(true)}
                        >
                            <Pencil className="w-3 h-3 text-muted-foreground" />
                        </Button>
                    </div>
                )}

                <div className="ml-auto">
                    {/* Future: Add Publish/Export buttons here */}
                </div>
            </header>
            <div className="flex-1 w-full bg-white relative">
                <iframe
                    title="Portfolio Preview"
                    srcDoc={srcDoc}
                    className="w-full h-full border-0"
                    sandbox="allow-scripts allow-same-origin"
                />
            </div>
        </div>
    );
}
