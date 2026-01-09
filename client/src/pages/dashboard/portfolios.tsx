import { motion } from "framer-motion";
// Remove unused imports
import { Bot, PencilRuler, Sparkles, Loader2, Globe, Eye, Trash2, Pencil } from "lucide-react";
import { PortfolioPreview } from "@/components/portfolio-preview";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAppUser } from "@/components/auth-provider";
import { API_URL } from "@/lib/utils";

import { toast } from "sonner";

export default function PortfoliosPage() {
    const navigate = useNavigate();
    const { user } = useAppUser();
    const [previewPortfolio, setPreviewPortfolio] = useState<{ html: string; id?: string; title?: string } | null>(null);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);

    // Fetch existing portfolios
    const { data: portfolios, isLoading: isLoadingPortfolios, refetch: refetchPortfolios } = useQuery({
        queryKey: ["portfolios", user?.id],
        queryFn: async () => {
            if (!user?.id) return [];
            const res = await fetch(`${API_URL}/api/portfolios?userId=${user.id}`);
            if (!res.ok) throw new Error("Failed to fetch portfolios");
            return res.json();
        },
        enabled: !!user?.id,
    });


    const handleDelete = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!confirm("Are you sure you want to delete this portfolio?")) return;

        try {
            const res = await fetch(`${API_URL}/api/portfolios/${id}`, {
                method: "DELETE",
            });

            if (!res.ok) throw new Error("Failed to delete portfolio");

            toast.success("Portfolio deleted");
            refetchPortfolios();
        } catch (error) {
            console.error("Delete Error:", error);
            toast.error("Failed to delete portfolio");
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
        },
    };

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-8">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-2"
            >
                <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                    My Portfolios
                </h1>
                <p className="text-muted-foreground">
                    Create and manage your professional portfolio websites.
                </p>
            </motion.div>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid md:grid-cols-2 gap-6"
            >
                {/* AI Option */}
                <motion.div variants={itemVariants}>
                    <Card className="h-full hover:shadow-lg transition-all border-primary/20 relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                        <CardHeader>
                            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 text-primary">
                                <Bot className="w-6 h-6" />
                            </div>
                            <CardTitle className="text-xl">AI Generated Portfolio</CardTitle>
                            <CardDescription>
                                Instantly generate a stunning portfolio website from your resume data.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li className="flex items-center gap-2">
                                    <Sparkles className="w-4 h-4 text-yellow-500" />
                                    Generated in seconds
                                </li>
                                <li className="flex items-center gap-2">
                                    <Sparkles className="w-4 h-4 text-yellow-500" />
                                    Professional templates
                                </li>
                                <li className="flex items-center gap-2">
                                    <Sparkles className="w-4 h-4 text-yellow-500" />
                                    SEO optimized
                                </li>
                            </ul>
                        </CardContent>
                        <CardFooter>
                            <Button
                                className="w-full group"
                                onClick={() => navigate("/dashboard/portfolios/new")}
                            >
                                Generate with AI
                                <Sparkles className="w-4 h-4 ml-2 group-hover:animate-pulse" />
                            </Button>
                        </CardFooter>
                    </Card>
                </motion.div>

                {/* Manual Option */}
                <motion.div variants={itemVariants}>
                    <Card className="h-full hover:shadow-lg transition-all relative overflow-hidden group text-muted-foreground border-dashed">
                        <CardHeader>
                            <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center mb-4">
                                <PencilRuler className="w-6 h-6" />
                            </div>
                            <CardTitle className="text-xl">Build Manually</CardTitle>
                            <CardDescription>
                                Design your portfolio from scratch with our drag-and-drop builder.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-2 text-sm">
                                <li className="flex items-center gap-2 opacity-50">
                                    <div className="w-1.5 h-1.5 rounded-full bg-current" />
                                    Custom layouts
                                </li>
                                <li className="flex items-center gap-2 opacity-50">
                                    <div className="w-1.5 h-1.5 rounded-full bg-current" />
                                    Advanced styling
                                </li>
                                <li className="flex items-center gap-2 opacity-50">
                                    <div className="w-1.5 h-1.5 rounded-full bg-current" />
                                    Full control
                                </li>
                            </ul>
                        </CardContent>
                        <CardFooter>
                            <Button variant="secondary" className="w-full" disabled>
                                Coming Soon
                            </Button>
                        </CardFooter>
                    </Card>
                </motion.div>
            </motion.div>

            <h2 className="text-2xl font-semibold tracking-tight">Your Portfolios</h2>
            {isLoadingPortfolios ? (
                <div className="flex justify-center py-8">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
            ) : portfolios?.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12 border-2 border-dashed rounded-lg bg-muted/50 flex flex-col items-center justify-center gap-4"
                >
                    <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                        <Bot className="w-8 h-8 text-muted-foreground opacity-50" />
                    </div>
                    <div className="space-y-1">
                        <h3 className="font-semibold text-lg">No portfolios yet</h3>
                        <p className="text-muted-foreground max-w-sm mx-auto">
                            You haven't created any portfolios. Click "Generate with AI" above to get started in seconds.
                        </p>
                    </div>
                </motion.div>
            ) : (
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid md:grid-cols-3 gap-6"
                >
                    {portfolios?.map((portfolio: any) => (
                        <motion.div key={portfolio.id} variants={itemVariants} whileHover={{ y: -5, transition: { duration: 0.2 } }}>
                            <Card className="h-full hover:shadow-xl transition-all group flex flex-col border-primary/10 overflow-hidden relative">
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />

                                <CardHeader className="cursor-pointer pb-2" onClick={() => navigate(`/dashboard/portfolios/${portfolio.id}`)}>
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                                            <Globe className="w-5 h-5" />
                                        </div>
                                        <span className="text-xs font-mono text-muted-foreground bg-muted px-2 py-1 rounded">
                                            v1.0
                                        </span>
                                    </div>
                                    <CardTitle className="truncate text-lg group-hover:text-primary transition-colors">{portfolio.title}</CardTitle>
                                    <CardDescription>
                                        Updated {new Date(portfolio.updatedAt).toLocaleDateString()}
                                    </CardDescription>
                                </CardHeader>

                                <CardContent className="flex-1">
                                    <div className="text-sm text-muted-foreground line-clamp-2">
                                        A professional portfolio website generated with AI architecture.
                                    </div>
                                </CardContent>

                                <CardFooter className="mt-auto pt-4 flex gap-2 border-t bg-muted/20">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="flex-1 hover:bg-primary/10 hover:text-primary"
                                        onClick={async (e) => {
                                            e.stopPropagation();
                                            try {
                                                // Fetch full content on demand
                                                const res = await fetch(`${API_URL}/api/portfolios/${portfolio.id}`);
                                                if (!res.ok) throw new Error("Failed to load");
                                                const fullPortfolio = await res.json();

                                                setPreviewPortfolio({
                                                    html: fullPortfolio.content?.html,
                                                    id: fullPortfolio.id,
                                                    title: fullPortfolio.title
                                                });
                                                setIsPreviewOpen(true);
                                            } catch (err) {
                                                toast.error("Failed to load preview");
                                            }
                                        }}
                                    >
                                        <Eye className="w-4 h-4 mr-2" />
                                        Preview
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="flex-1"
                                        onClick={() => navigate(`/dashboard/portfolios/${portfolio.id}`, { state: { isEditing: true } })}
                                    >
                                        <Pencil className="w-4 h-4 mr-2" />
                                        Edit
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="text-destructive hover:bg-destructive/10"
                                        onClick={(e) => handleDelete(portfolio.id, e)}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </CardFooter>
                            </Card>
                        </motion.div>
                    ))}
                </motion.div>
            )}

            <PortfolioPreview
                open={isPreviewOpen}
                onClose={() => setIsPreviewOpen(false)}
                data={previewPortfolio}
                title={previewPortfolio?.title}
            />
        </div>
    );
}
