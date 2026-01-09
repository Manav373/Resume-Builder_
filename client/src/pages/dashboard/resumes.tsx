import { Plus, FileText, Loader2, Trash2, Eye, Pencil, Sparkles } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { useAppUser } from "@/components/auth-provider";
import { SwipeCard } from "@/components/ui/swipe-card";
import { format } from "date-fns";
import { useState } from "react";
import { ResumePreview } from "@/components/resume-preview";
import { API_URL } from "@/lib/utils";

export default function ResumesPage() {
    const { user } = useAppUser();
    const navigate = useNavigate();
    const [previewData, setPreviewData] = useState<any>(null);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [generatingId, setGeneratingId] = useState<string | null>(null);

    // const queryClient = useQueryClient(); // Unused

    // Instead of full react-query setup, just use simpler invalidate for this task to be safe
    const { data: resumes, isLoading, error, refetch } = useQuery({
        queryKey: ["resumes", user?.id],
        queryFn: async () => {
            if (!user?.id) return [];
            const res = await fetch(`${API_URL}/api/resumes?userId=${user.id}`);
            if (!res.ok) throw new Error("Failed to fetch resumes");
            return res.json();
        },
        enabled: !!user?.id,
    });

    const handleDelete = async (id: string, e: React.MouseEvent) => {
        e.preventDefault(); // Prevent navigation if button is inside link (it isn't here but good practice)
        if (!confirm("Are you sure you want to delete this resume? This action cannot be undone.")) return;

        try {
            const res = await fetch(`${API_URL}/api/resumes/${id}`, {
                method: "DELETE",
            });

            if (!res.ok) {
                const errData = await res.json().catch(() => ({}));
                console.error("Delete failed details:", errData);
                throw new Error(errData.error || "Failed to delete");
            }

            toast.success("Resume deleted");
            refetch();
        } catch (error) {
            console.error("Delete Resume Error:", error);
            toast.error("Failed to delete resume");
        }
    };

    const handleGeneratePortfolio = async (e: React.MouseEvent, resume: any) => {
        e.preventDefault();
        e.stopPropagation();
        setGeneratingId(resume.id);

        try {
            const loadingToast = toast.loading("Generating AI Portfolio... This may take a minute.");

            // 1. Generate Portfolio HTML with AI
            const genRes = await fetch(`${API_URL}/api/ai/generate-portfolio`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ resumeData: resume.content }),
            });

            if (!genRes.ok) {
                const errorData = await genRes.json();
                throw new Error(errorData.error || "Failed to generate portfolio");
            }

            const { html } = await genRes.json();

            // 2. Save Portfolio to DB
            const saveRes = await fetch(`${API_URL}/api/portfolios`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId: user?.id,
                    title: `${resume.title || "My"} Portfolio`,
                    content: { html },
                }),
            });

            if (!saveRes.ok) throw new Error("Failed to save portfolio");

            const newPortfolio = await saveRes.json();

            toast.dismiss(loadingToast);
            toast.success("Portfolio generated!", {
                action: {
                    label: "View",
                    onClick: () => navigate(`/dashboard/portfolios/${newPortfolio.id}`)
                }
            });

            // Optional: Redirect immediately
            // navigate(`/dashboard/portfolios/${newPortfolio.id}`);

        } catch (error: any) {
            console.error("Portfolio Generation Error:", error);
            toast.error(error.message || "Failed to generate portfolio");
            toast.dismiss();
        } finally {
            setGeneratingId(null);
        }
    };

    if (error) {
        return <div className="p-8 text-center text-red-500">Error loading resumes</div>;
    }

    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold tracking-tight">My Resumes</h1>
                    <p className="text-muted-foreground mt-1">
                        Manage and edit your created resumes.
                    </p>
                </div>
                <Link to="/dashboard/resumes/new" className="w-full md:w-auto">
                    <Button className="w-full md:w-auto active:scale-95 transition-transform">
                        <Plus className="w-4 h-4 mr-2" />
                        Create New
                    </Button>
                </Link>
            </div>

            {isLoading ? (
                <div className="flex justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
            ) : resumes?.length === 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="col-span-full text-center py-12 border-2 border-dashed rounded-lg bg-muted/50">
                        <FileText className="w-12 h-12 mx-auto text-muted-foreground/50" />
                        <h3 className="mt-4 text-lg font-semibold">No resumes yet</h3>
                        <p className="text-muted-foreground mb-4">Create your first AI-powered resume today.</p>
                        <Link to="/dashboard/resumes/new">
                            <Button variant="outline">Get Started</Button>
                        </Link>
                    </div>
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
                                description={`Created ${resume.createdAt ? format(new Date(resume.createdAt), 'PPP') : 'Unknown'}`}
                                href={`/dashboard/resumes/${resume.id}/edit`}
                                className="hover:scale-[1.02] transition-transform duration-300 shadow-md hover:shadow-xl border-dashed hover:border-solid"
                                action={
                                    <div className="flex items-center gap-1">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-muted-foreground hover:text-blue-500 shrink-0 relative z-10 transition-transform hover:scale-110"
                                            onClick={(e) => handleGeneratePortfolio(e, resume)}
                                            title="Generate AI Portfolio"
                                            disabled={generatingId === resume.id}
                                        >
                                            {generatingId === resume.id ? (
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                            ) : (
                                                <Sparkles className="w-4 h-4" />
                                            )}
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-muted-foreground hover:text-primary shrink-0 relative z-10 transition-transform hover:scale-110"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                setPreviewData(resume.content);
                                                setIsPreviewOpen(true);
                                            }}
                                            title="Preview Resume"
                                        >
                                            <Eye className="w-4 h-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-muted-foreground hover:text-primary shrink-0 relative z-10 transition-transform hover:scale-110"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                navigate(`/dashboard/resumes/${resume.id}/edit`);
                                            }}
                                            title="Edit Resume"
                                        >
                                            <Pencil className="w-4 h-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-muted-foreground hover:text-destructive shrink-0 relative z-10 transition-transform hover:scale-110"
                                            onClick={(e) => handleDelete(resume.id, e)}
                                            title="Delete Resume"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                }
                            />
                        </div>
                    ))}
                </div>
            )}

            {/* Preview Modal */}
            <ResumePreview
                open={isPreviewOpen}
                onClose={() => setIsPreviewOpen(false)}
                data={previewData}
            />
        </div>
    );
}
