import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ResumeForm from "@/components/resume-form";
import { Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { API_URL } from "@/lib/utils";

export default function EditResumePage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [resumeData, setResumeData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!id) return;

        const fetchResume = async () => {
            try {
                const res = await fetch(`${API_URL}/api/resumes/${id}`);
                if (!res.ok) {
                    if (res.status === 404) throw new Error("Resume not found");
                    throw new Error("Failed to load resume");
                }
                const data = await res.json();

                // Extract the content which matches ResumeData structure
                // Merging title if it exists at top level but not in content (DB schema vs TS type mismatch handling)
                const content = data.content || {};
                const mergedData = {
                    ...content,
                    title: data.title || content.title // Ensure title from DB/Top-level is used
                };

                setResumeData(mergedData);
            } catch (err: any) {
                console.error(err);
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchResume();
    }, [id]);

    if (isLoading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (error) {
        <div className="flex h-[50vh] items-center justify-center">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-destructive flex items-center gap-2">
                        Error
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">{error}</p>
                </CardContent>
                <CardFooter>
                    <Button
                        onClick={() => navigate("/dashboard/resumes")}
                        className="w-full"
                    >
                        Back to Resumes
                    </Button>
                </CardFooter>
            </Card>
        </div>
    }

    return (
        <div className="p-4 md:p-8 max-w-4xl mx-auto">
            <div className="mb-6">
                <Button
                    variant="ghost"
                    onClick={() => navigate("/dashboard/resumes")}
                    className="pl-0 hover:pl-2 transition-all"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Dashboard
                </Button>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center md:text-left">Edit Resume</h1>
            {resumeData && <ResumeForm initialData={resumeData} resumeId={id} />}
        </div>
    );
}
