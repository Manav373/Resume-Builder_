import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Wand2, Download, Save, Trash2, Globe, Sparkles } from "lucide-react";
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
            toast.info("Generating your creative portfolio... This may take a minute.");

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
        <div className="relative min-h-screen">
            {/* Background Gradients */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-cyan-50 -z-10" />
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob" />
            <div className="absolute -bottom-8 -left-8 w-[500px] h-[500px] bg-cyan-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000" />

            <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-12 relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
                    <div>
                        <h1 className="text-3xl md:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-indigo-600 mb-2">
                            AI Portfolio Builder
                        </h1>
                        <p className="text-slate-600 text-lg max-w-2xl">
                            Transform your professional resume into an award-winning personal website in seconds.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="p-8 border border-white/20 rounded-2xl bg-white/40 backdrop-blur-xl hover:bg-white/60 transition-all shadow-xl hover:shadow-2xl cursor-pointer group relative overflow-hidden" onClick={() => document.getElementById('resume-list')?.scrollIntoView({ behavior: 'smooth' })}>
                        <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="h-16 w-16 rounded-2xl bg-violet-100 flex items-center justify-center mb-6 text-violet-600 group-hover:scale-110 transition-transform">
                            <Sparkles className="w-8 h-8" />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 mb-2">Generate with AI</h3>
                        <p className="text-slate-600">Select an existing resume and let our advanced AI architect a stunning, interactive 3D portfolio for you.</p>
                    </div>

                    <div className="p-8 border border-white/20 rounded-2xl bg-white/40 backdrop-blur-xl hover:bg-white/60 transition-all shadow-xl hover:shadow-2xl cursor-pointer group relative overflow-hidden opacity-75" onClick={() => toast.info("Coming soon!")}>
                        <div className="h-16 w-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-6 text-slate-500 group-hover:scale-110 transition-transform">
                            <Loader2 className="w-8 h-8" />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 mb-2">Custom Builder</h3>
                        <p className="text-slate-600">Build from scratch using our drag-and-drop 'Bento Grid' editor. (Coming Soon)</p>
                    </div>
                </div>

                <div id="resume-list" className="space-y-6">
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-1 bg-violet-600 rounded-full" />
                        <h2 className="text-2xl font-bold text-slate-800">Select Source Resume</h2>
                    </div>

                    {isLoading ? (
                        <div className="flex justify-center py-12">
                            <Loader2 className="w-10 h-10 animate-spin text-violet-600" />
                        </div>
                    ) : resumes?.length === 0 ? (
                        <div className="text-center py-12 border-2 border-dashed border-slate-300 rounded-2xl bg-white/50">
                            <h3 className="text-lg font-semibold text-slate-700">No resumes found</h3>
                            <p className="text-slate-500 mb-4">Create a resume first to generate a portfolio.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {resumes.map((resume: any, index: number) => (
                                <div
                                    key={resume.id}
                                    className="animate-in fade-in slide-in-from-bottom-8 duration-700 fill-mode-both"
                                    style={{ animationDelay: `${index * 100}ms` }}
                                >
                                    <SwipeCard
                                        title={resume.title || "Untitled Resume"}
                                        description={`Last updated ${resume.updatedAt ? format(new Date(resume.updatedAt), 'PPP') : 'Unknown'}`}
                                        className="hover:scale-[1.02] hover:-rotate-1 transition-transform duration-300 shadow-lg border-white/50 bg-white/80 backdrop-blur"
                                        action={
                                            <Button
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    handleGenerate(resume);
                                                }}
                                                disabled={generatingId === resume.id}
                                                className="w-full gap-2 bg-slate-900 hover:bg-slate-800 text-white shadow-lg shadow-slate-900/20"
                                            >
                                                {generatingId === resume.id ? (
                                                    <>
                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                        Architecting...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Wand2 className="w-4 h-4" />
                                                        Generate Site
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
                        <DialogContent className="max-w-[95vw] w-full h-[95vh] flex flex-col p-0 overflow-hidden rounded-2xl border-0 shadow-2xl bg-slate-900/95 backdrop-blur-3xl text-white">
                            <DialogHeader className="px-6 py-4 border-b border-white/10 flex flex-row items-center justify-between bg-black/20">
                                <div>
                                    <DialogTitle className="text-white">Live Preview</DialogTitle>
                                    <DialogDescription className="text-slate-400">
                                        Your AI-generated 3D portfolio.
                                    </DialogDescription>
                                </div>
                                <div className="flex gap-3">
                                    <Button onClick={handleSave} disabled={isSaving} className="gap-2 bg-violet-600 hover:bg-violet-700 text-white border-0">
                                        {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                        Save to Profile
                                    </Button>
                                    <Button onClick={handleDownload} variant="outline" size="sm" className="gap-2 border-white/20 text-white hover:bg-white/10 hover:text-white">
                                        <Download className="w-4 h-4" />
                                        Export HTML
                                    </Button>
                                </div>
                            </DialogHeader>
                            <div className="flex-1 bg-black w-full h-full relative">
                                {generatedHtml && (
                                    <iframe
                                        srcDoc={generatedHtml}
                                        className="w-full h-full border-0"
                                        title="Portfolio Preview"
                                        sandbox="allow-scripts allow-modals allow-popups allow-forms"
                                    />
                                )}
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>

                <div>
                    <div className="flex items-center gap-2 mb-6">
                        <div className="h-8 w-1 bg-cyan-500 rounded-full" />
                        <h2 className="text-2xl font-bold text-slate-800">Your Digital Presence</h2>
                    </div>

                    {isPortfoliosLoading ? (
                        <div className="flex justify-center py-8">
                            <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
                        </div>
                    ) : portfolios?.length === 0 ? (
                        <div className="text-center py-12 bg-slate-50 rounded-2xl">
                            No saved portfolios yet. Generate one above!
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {portfolios?.map((portfolio: any) => (
                                <div key={portfolio.id} className="group relative bg-white rounded-2xl p-4 shadow-sm hover:shadow-xl transition-all border border-slate-100 overflow-hidden">
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-violet-100 to-transparent rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-150" />

                                    <div className="h-48 bg-slate-900 rounded-xl mb-4 flex items-center justify-center relative overflow-hidden cursor-pointer" onClick={() => handleView(portfolio.content.html)}>
                                        <div className="absolute inset-0 bg-gradient-to-br from-violet-600/20 to-cyan-600/20 mix-blend-overlay" />
                                        <Globe className="w-16 h-16 text-white/10 group-hover:text-white/20 transition-colors transform group-hover:scale-110 duration-500" />

                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-sm">
                                            <span className="bg-white text-slate-900 px-4 py-2 rounded-full font-bold shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform">
                                                View Live Site
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-start relative z-10">
                                        <div>
                                            <h3 className="font-bold text-slate-800 truncate text-lg">{portfolio.title}</h3>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                                <p className="text-xs text-slate-500 font-medium">{format(new Date(portfolio.updatedAt), 'PPP')}</p>
                                            </div>
                                        </div>
                                        <Button variant="ghost" size="icon" className="text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-colors" onClick={() => handleDelete(portfolio.id)}>
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
