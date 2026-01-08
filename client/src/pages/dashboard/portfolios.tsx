import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Wand2, Eye, Download, Save, Trash2, Globe, ExternalLink, Plus } from "lucide-react";
import { useAppUser } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { SwipeCard } from "@/components/ui/swipe-card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { API_URL } from "@/lib/utils";
import { toast } from "sonner";
import { format } from "date-fns";

export default function PortfoliosPage() {
    const { user } = useAppUser();
    const [generatingId, setGeneratingId] = useState<string | null>(null);
    const [generatedHtml, setGeneratedHtml] = useState<string | null>(null);
    const [currentResume, setCurrentResume] = useState<any>(null); // To track which resume generated this
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const queryClient = useQueryClient();
    const { data: portfolios, isLoading: isPortfoliosLoading } = useQuery({
        queryKey: ["portfolios", user?.id],
        queryFn: async () => {
            if (!user?.id) return [];
            const res = await fetch(`${API_URL}/api/portfolios?userId=${user.id}`);
            if (!res.ok) throw new Error("Failed to fetch portfolios");
            return res.json();
        },
        enabled: !!user?.id,
    });

    const { data: resumes, isLoading } = useQuery({
        queryKey: ["resumes", user?.id],
        queryFn: async () => {
            if (!user?.id) return [];
            const res = await fetch(`${API_URL}/api/resumes?userId=${user.id}`);
            if (!res.ok) throw new Error("Failed to fetch resumes");
            return res.json();
        },
        enabled: !!user?.id,
    });

    const handleGenerate = async (resume: any) => {
        try {
            setGeneratingId(resume.id);
            toast.info("Generating your portfolio website... This may take a minute.");

            const res = await fetch(`${API_URL}/api/ai/generate-portfolio`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ resumeData: resume.content }),
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.error || "Failed to generate portfolio");
            }

            const data = await res.json();
            setGeneratedHtml(data.html);
            setCurrentResume(resume);
            setIsPreviewOpen(true);
            toast.success("Portfolio generated successfully!");
        } catch (error: any) {
            console.error("Portfolio Generation Error:", error);
            toast.error(error.message || "Failed to generate portfolio");
        } finally {
            setGeneratingId(null);
        }
    };

    const handleSave = async () => {
        if (!generatedHtml || !user?.id) return;
        try {
            setIsSaving(true);
            const res = await fetch(`${API_URL}/api/portfolios`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId: user.id,
                    title: currentResume?.title ? `Portfolio - ${currentResume.title}` : "My Portfolio",
                    content: { html: generatedHtml },
                }),
            });

            if (!res.ok) throw new Error("Failed to save portfolio");

            toast.success("Portfolio saved to your profile!");
            queryClient.invalidateQueries({ queryKey: ["portfolios"] });
            setIsPreviewOpen(false);
        } catch (error) {
            console.error("Save Error:", error);
            toast.error("Failed to save portfolio");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            const res = await fetch(`${API_URL}/api/portfolios/${id}`, { method: "DELETE" });
            if (!res.ok) throw new Error("Failed to delete");

            toast.success("Portfolio deleted");
            queryClient.invalidateQueries({ queryKey: ["portfolios"] });
        } catch (error) {
            toast.error("Failed to delete portfolio");
        }
    };

    const handleDownload = () => {
        if (!generatedHtml) return;
        const blob = new Blob([generatedHtml], { type: "text/html" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "portfolio.html";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast.success("Portfolio downloaded!");
    };

    const handleView = (html: string) => {
        const blob = new Blob([html], { type: "text/html" });
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');
    };

    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold tracking-tight">AI Portfolios</h1>
                    <p className="text-muted-foreground mt-1">
                        Turn your resumes into stunning personal portfolio websites with one click.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="p-6 border rounded-xl bg-card hover:border-primary/50 transition-colors shadow-sm cursor-pointer group" onClick={() => document.getElementById('resume-list')?.scrollIntoView({ behavior: 'smooth' })}>
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary group-hover:scale-110 transition-transform">
                        <Wand2 className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Build with AI</h3>
                    <p className="text-muted-foreground text-sm">Select an existing resume and let our AI generate a complete portfolio website for you instantly.</p>
                </div>

                <div className="p-6 border rounded-xl bg-card hover:border-primary/50 transition-colors shadow-sm cursor-pointer group opacity-80" onClick={() => toast.info("Manual builder coming soon!", { description: "We are working on a drag-and-drop builder." })}>
                    <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4 text-muted-foreground group-hover:scale-110 transition-transform">
                        <Loader2 className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Build Manually</h3>
                    <p className="text-muted-foreground text-sm">Create a portfolio from scratch using our drag-and-drop builder. (Coming Soon)</p>
                </div>
            </div>

            <div id="resume-list">
                <h2 className="text-xl font-semibold mb-4">Select a Resume to Generate From</h2>

                {isLoading ? (
                    <div className="flex justify-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                ) : resumes?.length === 0 ? (
                    <div className="text-center py-12 border-2 border-dashed rounded-lg bg-muted/50">
                        <h3 className="text-lg font-semibold">No resumes found</h3>
                        <p className="text-muted-foreground mb-4">Create a resume first to generate a portfolio.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {resumes.map((resume: any, index: number) => (
                            <div
                                key={resume.id}
                                className="animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <SwipeCard
                                    title={resume.title || "Untitled Resume"}
                                    description={`Last updated ${resume.updatedAt ? format(new Date(resume.updatedAt), 'PPP') : 'Unknown'}`}
                                    className="hover:scale-[1.02] transition-transform duration-300"
                                    action={
                                        <Button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                handleGenerate(resume);
                                            }}
                                            disabled={generatingId === resume.id}
                                            className="w-full gap-2"
                                        >
                                            {generatingId === resume.id ? (
                                                <>
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                    Generating...
                                                </>
                                            ) : (
                                                <>
                                                    <Wand2 className="w-4 h-4" />
                                                    Generate Website
                                                </>
                                            )}
                                        </Button>
                                    }
                                />
                            </div>
                        ))}
                    </div>
                )}

                <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
                    <DialogContent className="max-w-[90vw] w-full h-[90vh] flex flex-col p-0">
                        <DialogHeader className="px-6 py-4 border-b flex flex-row items-center justify-between">
                            <div>
                                <DialogTitle>Portfolio Preview</DialogTitle>
                                <DialogDescription>
                                    Your AI-generated portfolio website.
                                </DialogDescription>
                            </div>
                            <Button onClick={handleSave} disabled={isSaving} className="gap-2">
                                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                Save to Profile
                            </Button>
                            <Button onClick={handleDownload} variant="outline" size="sm" className="gap-2">
                                <Download className="w-4 h-4" />
                                Download HTML
                            </Button>
                        </DialogHeader>
                        <div className="flex-1 bg-muted/20 w-full h-full relative">
                            {generatedHtml && (
                                <iframe
                                    srcDoc={generatedHtml}
                                    className="w-full h-full border-0"
                                    title="Portfolio Preview"
                                    sandbox="allow-scripts"
                                />
                            )}
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            <div>
                <h2 className="text-xl font-semibold mb-4">Your Saved Portfolios</h2>
                {isPortfoliosLoading ? (
                    <div className="flex justify-center py-8">
                        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                    </div>
                ) : portfolios?.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                        No saved portfolios yet. Generate one above!
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {portfolios?.map((portfolio: any) => (
                            <div key={portfolio.id} className="border rounded-xl p-4 bg-card hover:shadow-md transition-all">
                                <div className="h-40 bg-muted/30 rounded-lg mb-4 flex items-center justify-center relative overflow-hidden group">
                                    <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 backdrop-blur-sm">
                                        <Button variant="secondary" size="sm" onClick={() => handleView(portfolio.content.html)}>
                                            <Eye className="w-4 h-4 mr-1" /> View
                                        </Button>
                                    </div>
                                    <Globe className="w-12 h-12 text-muted-foreground/20" />
                                </div>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-semibold truncate">{portfolio.title}</h3>
                                        <p className="text-xs text-muted-foreground">{format(new Date(portfolio.updatedAt), 'PPP')}</p>
                                    </div>
                                    <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive/90 -mt-1 -mr-2" onClick={() => handleDelete(portfolio.id)}>
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
