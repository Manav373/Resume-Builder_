import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useAppUser } from "@/components/auth-provider";
import { zodResolver } from "@hookform/resolvers/zod";
import { resumeSchema, type ResumeData } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Loader2, ChevronRight, ChevronLeft, Save, Plus, Trash2, Wand2, Eye, ArrowLeft } from "lucide-react";
import { ResumePreview } from "@/components/resume-preview";
import { API_URL } from "@/lib/utils";

import { useNavigate } from "react-router-dom";

interface ResumeFormProps {
    initialData?: ResumeData | null;
    resumeId?: string;
}

export default function ResumeForm({ initialData, resumeId }: ResumeFormProps = {}) {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [isGenerating, setIsGenerating] = useState(false);
    const [showPreview, setShowPreview] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const { user } = useAppUser();
    // const { toast } = useToast(); // Removed

    const form = useForm({
        resolver: zodResolver(resumeSchema),
        defaultValues: initialData || {
            title: "My Resume",
            personalInfo: {
                fullName: "",
                email: "",
                phone: "",
                location: "",
                linkedin: "",
                website: "",
            },
            experience: [],
            education: [],
            certifications: [],
            projects: [],
            skills: [],
        },
    });

    const { fields: expFields, append: appendExp, remove: removeExp } = useFieldArray({
        control: form.control,
        name: "experience",
    });

    const { fields: eduFields, append: appendEdu, remove: removeEdu } = useFieldArray({
        control: form.control,
        name: "education",
    });

    const { fields: certFields, append: appendCert, remove: removeCert } = useFieldArray({
        control: form.control,
        name: "certifications",
    });

    const { fields: projFields, append: appendProj, remove: removeProj } = useFieldArray({
        control: form.control,
        name: "projects",
    });

    const onSubmit = async (data: ResumeData) => {
        try {
            // Allow save without auth in dev mode for testing
            if (!user && import.meta.env.PROD) {
                toast.error("Error", { description: "You must be logged in to save." });
                return;
            }

            const userId = user?.id || "dev-test-user";
            console.log("Submitting:", { ...data, userId });

            const url = resumeId
                ? `${API_URL}/api/resumes/${resumeId}`
                : `${API_URL}/api/resumes`;

            const method = resumeId ? "PUT" : "POST";

            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ ...data, userId }),
            });


            if (!response.ok) {
                throw new Error("Failed to save resume");
            }

            const result = await response.json();
            console.log("Saved:", result);
            toast.success("Success", { description: "Resume saved successfully!" });
            setIsSaved(true);
            setShowPreview(true);
        } catch (error) {
            console.error("Save Resume Error Details:", error);
            toast.error("Error", { description: "Failed to save resume. Check console for details." });
        }
    };

    const generateAIContent = async () => {
        const title = form.getValues("title");
        const currentSkills = form.getValues("skills");

        if (!title) {
            toast.error("Missing Information", { description: "Please enter a Resume Title first." });
            return;
        }

        setIsGenerating(true);
        try {
            const res = await fetch(`${API_URL}/api/ai/generate`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ jobTitle: title, currentSkills })
            });

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(errorData.error || "AI request failed");
            }

            const data = await res.json();

            if (data.summary) {
                form.setValue("summary", data.summary);
            }

            if (data.skills && Array.isArray(data.skills)) {
                // Merge unique skills
                const current = currentSkills || [];
                const newSkills = Array.from(new Set([...current, ...data.skills]));
                form.setValue("skills", newSkills);
            }

            toast.success("AI Magic", { description: "Content generated successfully!" });
        } catch (e) {
            console.error("AI Generation Error Details:", e);
            toast.error("Error", { description: "AI Generation failed. Check console for details." });
        } finally {
            setIsGenerating(false);
        }
    };

    const nextStep = () => setStep((s) => s + 1);
    const prevStep = () => setStep((s) => s - 1);

    const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                form.setValue("personalInfo.photoUrl", reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-3 bg-muted/50 p-4 rounded-lg animate-in fade-in slide-in-from-top-2 duration-500">
                <div className="flex space-x-2 w-full">
                    {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                        <div key={i} className={`h-2 flex-1 rounded-full transition-all duration-500 ease-in-out ${i <= step ? 'bg-primary' : 'bg-muted-foreground/20'}`} />
                    ))}
                </div>
                <div className="flex justify-between items-center w-full">
                    <span className="text-sm font-medium text-muted-foreground animate-in fade-in duration-300" key={step}>Step {step} of 7</span>
                </div>
            </div>

            <Card>
                <CardContent className="p-6">
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <AnimatePresence mode="wait">
                            {step === 1 && (
                                <motion.div
                                    key="step1"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-6"
                                >
                                    <div className="space-y-2">
                                        <h2 className="text-xl font-semibold">Choose Your Style</h2>
                                        <p className="text-sm text-muted-foreground">Select a template to get started.</p>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <Label>Resume Title</Label>
                                            <Input {...form.register("title")} placeholder="Full Stack Developer" />
                                            {form.formState.errors.title && <p className="text-sm text-red-500">{form.formState.errors.title.message}</p>}
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {/* Modern Sidebar Option */}
                                            <div
                                                className={`cursor-pointer border-2 rounded-lg p-4 hover:border-primary transition-all ${form.watch("templateId") === 'modern-sidebar' ? 'border-primary bg-primary/5' : 'border-border'}`}
                                                onClick={() => form.setValue("templateId", "modern-sidebar")}
                                            >
                                                <div className="h-24 bg-slate-900 w-full mb-3 rounded flex items-center justify-center overflow-hidden">
                                                    <div className="grid grid-cols-[1fr_2fr] w-3/4 h-full gap-1 pt-4">
                                                        <div className="bg-slate-700 rounded-t-sm"></div>
                                                        <div className="bg-slate-200 rounded-t-sm"></div>
                                                    </div>
                                                </div>
                                                <h3 className="font-semibold text-sm">Modern Sidebar</h3>
                                                <p className="text-xs text-muted-foreground">Dark sidebar, high contrast.</p>
                                            </div>

                                            {/* Classic Option */}
                                            <div
                                                className={`cursor-pointer border-2 rounded-lg p-4 hover:border-primary transition-all ${form.watch("templateId") === 'classic' ? 'border-primary bg-primary/5' : 'border-border'}`}
                                                onClick={() => form.setValue("templateId", "classic")}
                                            >
                                                <div className="h-24 bg-white border w-full mb-3 rounded flex items-center justify-center overflow-hidden">
                                                    <div className="flex flex-col items-center w-3/4 gap-1 pt-4">
                                                        <div className="bg-slate-900 h-1 w-full rounded-full"></div>
                                                        <div className="bg-slate-300 h-1 w-3/4 rounded-full"></div>
                                                        <div className="bg-slate-300 h-1 w-5/6 rounded-full"></div>
                                                    </div>
                                                </div>
                                                <h3 className="font-semibold text-sm">Classic</h3>
                                                <p className="text-xs text-muted-foreground">Traditional, serif typography.</p>
                                            </div>

                                            {/* Minimalist Option */}
                                            <div
                                                className={`cursor-pointer border-2 rounded-lg p-4 hover:border-primary transition-all ${form.watch("templateId") === 'minimalist' ? 'border-primary bg-primary/5' : 'border-border'}`}
                                                onClick={() => form.setValue("templateId", "minimalist")}
                                            >
                                                <div className="h-24 bg-slate-50 border w-full mb-3 rounded flex items-center justify-center overflow-hidden">
                                                    <div className="flex flex-col items-start w-3/4 gap-1 pl-2 pt-4">
                                                        <div className="bg-slate-800 h-2 w-10 rounded-full mb-1"></div>
                                                        <div className="bg-slate-300 h-1 w-full rounded-full"></div>
                                                        <div className="bg-slate-300 h-1 w-full rounded-full"></div>
                                                    </div>
                                                </div>
                                                <h3 className="font-semibold text-sm">Minimalist</h3>
                                                <p className="text-xs text-muted-foreground">Clean, whitespace-focused.</p>
                                            </div>

                                            {/* Creative Option */}
                                            <div
                                                className={`cursor-pointer border-2 rounded-lg p-4 hover:border-primary transition-all ${form.watch("templateId") === 'creative' ? 'border-primary bg-primary/5' : 'border-border'}`}
                                                onClick={() => form.setValue("templateId", "creative")}
                                            >
                                                <div className="h-24 bg-white border w-full mb-3 rounded flex items-center justify-center overflow-hidden relative">
                                                    <div className="absolute top-0 w-full h-8 bg-rose-500"></div>
                                                    <div className="flex flex-col items-start w-3/4 gap-1 pl-2 pt-10">
                                                        <div className="bg-rose-400 h-2 w-16 rounded-full mb-1"></div>
                                                        <div className="bg-slate-200 h-1 w-full rounded-full"></div>
                                                    </div>
                                                </div>
                                                <h3 className="font-semibold text-sm">Creative</h3>
                                                <p className="text-xs text-muted-foreground">Bold colors, header banner.</p>
                                            </div>

                                            {/* Tech Option */}
                                            <div
                                                className={`cursor-pointer border-2 rounded-lg p-4 hover:border-primary transition-all ${form.watch("templateId") === 'tech' ? 'border-primary bg-primary/5' : 'border-border'}`}
                                                onClick={() => form.setValue("templateId", "tech")}
                                            >
                                                <div className="h-24 bg-[#1a1b26] w-full mb-3 rounded flex items-center justify-center overflow-hidden">
                                                    <div className="w-full h-full p-2 font-mono text-[6px] text-[#a9b1d6] leading-tight">
                                                        <div className="text-[#e0af68]">$ cat resume.json</div>
                                                        <div>{"{"}</div>
                                                        <div className="pl-2">"role": "Dev",</div>
                                                        <div>{"}"}</div>
                                                    </div>
                                                </div>
                                                <h3 className="font-semibold text-sm">Tech / Terminal</h3>
                                                <p className="text-xs text-muted-foreground">Monospace, dark mode.</p>
                                            </div>

                                            {/* Ivy Option */}
                                            <div
                                                className={`cursor-pointer border-2 rounded-lg p-4 hover:border-primary transition-all ${form.watch("templateId") === 'ivy' ? 'border-primary bg-primary/5' : 'border-border'}`}
                                                onClick={() => form.setValue("templateId", "ivy")}
                                            >
                                                <div className="h-24 bg-white border w-full mb-3 rounded flex items-center justify-center overflow-hidden">
                                                    <div className="w-3/4 h-full pt-4 flex flex-col gap-1 items-center">
                                                        <div className="text-[6px] font-serif font-bold uppercase tracking-widest text-black">J. DOE</div>
                                                        <div className="h-px bg-black w-full"></div>
                                                        <div className="w-full flex justify-between text-[4px] font-serif">
                                                            <span>EDUCATION</span>
                                                        </div>
                                                        <div className="w-full h-[2px] bg-black/10"></div>
                                                        <div className="w-full h-[2px] bg-black/10"></div>
                                                    </div>
                                                </div>
                                                <h3 className="font-semibold text-sm">Ivy League</h3>
                                                <p className="text-xs text-muted-foreground">Timeless, dense, academic.</p>
                                            </div>

                                            {/* Silicon Option */}
                                            <div
                                                className={`cursor-pointer border-2 rounded-lg p-4 hover:border-primary transition-all ${form.watch("templateId") === 'silicon' ? 'border-primary bg-primary/5' : 'border-border'}`}
                                                onClick={() => form.setValue("templateId", "silicon")}
                                            >
                                                <div className="h-24 bg-white border w-full mb-3 rounded flex items-start justify-center overflow-hidden pl-4 py-4">
                                                    <div className="w-full h-full flex flex-col gap-1">
                                                        <div className="text-blue-600 text-[8px] font-sans font-medium">Jane Doe</div>
                                                        <div className="h-1 w-10 bg-slate-200 rounded"></div>
                                                        <div className="mt-2 text-[5px] text-slate-400 font-bold uppercase">EXPERIENCE</div>
                                                        <div className="h-1 w-20 bg-slate-100 rounded"></div>
                                                        <div className="h-1 w-20 bg-slate-100 rounded"></div>
                                                    </div>
                                                </div>
                                                <h3 className="font-semibold text-sm">Silicon</h3>
                                                <p className="text-xs text-muted-foreground">Clean, tech-focused, modern.</p>
                                            </div>

                                            {/* Executive Option */}
                                            <div
                                                className={`cursor-pointer border-2 rounded-lg p-4 hover:border-primary transition-all ${form.watch("templateId") === 'executive' ? 'border-primary bg-primary/5' : 'border-border'}`}
                                                onClick={() => form.setValue("templateId", "executive")}
                                            >
                                                <div className="h-24 bg-[#f8f9fa] border w-full mb-3 rounded flex flex-col overflow-hidden">
                                                    <div className="h-8 bg-[#1e293b] w-full flex items-center justify-center">
                                                        <div className="w-8 h-1 bg-white/20 rounded"></div>
                                                    </div>
                                                    <div className="flex-1 p-2 flex flex-col gap-1 items-center">
                                                        <div className="w-20 h-px bg-[#1e293b]"></div>
                                                        <div className="w-16 h-1 bg-[#cbd5e1] rounded mt-1"></div>
                                                    </div>
                                                </div>
                                                <h3 className="font-semibold text-sm">Executive</h3>
                                                <p className="text-xs text-muted-foreground">Authoritative, leadership style.</p>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {step === 2 && (
                                <motion.div
                                    key="step2"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-6"
                                >
                                    <div className="space-y-2">
                                        <h2 className="text-xl font-semibold">Personal Information</h2>
                                        <p className="text-sm text-muted-foreground">How can employers contact you?</p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Full Name</Label>
                                            <Input {...form.register("personalInfo.fullName")} placeholder="John Doe" />
                                            {form.formState.errors.personalInfo?.fullName && <p className="text-sm text-red-500">{form.formState.errors.personalInfo.fullName.message}</p>}
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Email</Label>
                                            <Input {...form.register("personalInfo.email")} placeholder="john@example.com" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Phone</Label>
                                            <Input {...form.register("personalInfo.phone")} placeholder="+1 234 567 8900" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Location</Label>
                                            <Input {...form.register("personalInfo.location")} placeholder="New York, NY" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>LinkedIn (Optional)</Label>
                                            <Input {...form.register("personalInfo.linkedin")} placeholder="linkedin.com/in/johndoe" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Twitter / X (Optional)</Label>
                                            <Input {...form.register("personalInfo.twitter")} placeholder="@johndoe" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>GitHub (Optional)</Label>
                                            <Input {...form.register("personalInfo.github")} placeholder="github.com/johndoe" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Instagram (Optional)</Label>
                                            <Input {...form.register("personalInfo.instagram")} placeholder="@johndoe" />
                                        </div>
                                        <div className="space-y-2 col-span-1 md:col-span-2">
                                            <Label>Profile Photo</Label>
                                            <div className="flex items-center gap-4">
                                                {form.watch("personalInfo.photoUrl") && (
                                                    <div className="w-16 h-16 rounded-full overflow-hidden border border-slate-200">
                                                        <img src={form.watch("personalInfo.photoUrl")} alt="Preview" className="w-full h-full object-cover" />
                                                    </div>
                                                )}
                                                <div className="flex-1 space-y-2">
                                                    <Input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={handlePhotoUpload}
                                                        className="cursor-pointer"
                                                    />
                                                    <p className="text-xs text-muted-foreground">Upload a photo from your computer (Max 2MB)</p>
                                                    <div className="text-xs text-muted-foreground">OR</div>
                                                    <Input {...form.register("personalInfo.photoUrl")} placeholder="https://example.com/photo.jpg" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <Label>Professional Summary</Label>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={generateAIContent}
                                                disabled={isGenerating}
                                            >
                                                {isGenerating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Wand2 className="w-4 h-4 mr-2" />}
                                                {isGenerating ? "Generating..." : "Auto-Generate with AI"}
                                            </Button>
                                        </div>
                                        <Textarea {...form.register("summary")} placeholder="Brief overview of your career..." className="min-h-[100px]" />
                                    </div>
                                </motion.div>
                            )}

                            {step === 3 && (
                                <motion.div
                                    key="step3"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-6"
                                >
                                    <div className="flex justify-between items-center">
                                        <div className="space-y-1">
                                            <h2 className="text-xl font-semibold">Experience</h2>
                                            <p className="text-sm text-muted-foreground">Add your work history.</p>
                                        </div>
                                        <Button type="button" size="sm" onClick={() => appendExp({ id: crypto.randomUUID(), company: "", position: "", startDate: "", current: false, description: "" })}>
                                            <Plus className="w-4 h-4 mr-2" /> Add Position
                                        </Button>
                                    </div>

                                    <div className="space-y-6">
                                        {expFields.map((field, index) => (
                                            <div key={field.id} className="p-4 border rounded-lg bg-card space-y-4 relative">
                                                <Button type="button" variant="ghost" size="icon" className="absolute top-2 right-2 text-destructive" onClick={() => removeExp(index)}>
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                                                    <div className="space-y-2">
                                                        <Label>Company</Label>
                                                        <Input {...form.register(`experience.${index}.company`)} placeholder="Company Name" />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label>Position</Label>
                                                        <Input {...form.register(`experience.${index}.position`)} placeholder="Job Title" />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label>Start Date</Label>
                                                        <Input type="date" {...form.register(`experience.${index}.startDate`)} />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label>End Date</Label>
                                                        <Input type="date" {...form.register(`experience.${index}.endDate`)} />
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Description</Label>
                                                    <Textarea {...form.register(`experience.${index}.description`)} placeholder="Describe your responsibilities..." />
                                                </div>
                                            </div>
                                        ))}
                                        {expFields.length === 0 && (
                                            <p className="text-center text-muted-foreground py-8">No experience added yet.</p>
                                        )}
                                    </div>
                                </motion.div>
                            )}

                            {step === 4 && (
                                <motion.div
                                    key="step4"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-6"
                                >
                                    <div className="flex justify-between items-center">
                                        <div className="space-y-1">
                                            <h2 className="text-xl font-semibold">Certifications</h2>
                                            <p className="text-sm text-muted-foreground">Add your professional certifications.</p>
                                        </div>
                                        <Button type="button" size="sm" onClick={() => appendCert({ id: crypto.randomUUID(), name: "", issuer: "", date: "", link: "" })}>
                                            <Plus className="w-4 h-4 mr-2" /> Add Certification
                                        </Button>
                                    </div>

                                    <div className="space-y-6">
                                        {certFields.map((field, index) => (
                                            <div key={field.id} className="p-4 border rounded-lg bg-card space-y-4 relative">
                                                <Button type="button" variant="ghost" size="icon" className="absolute top-2 right-2 text-destructive" onClick={() => removeCert(index)}>
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                                                    <div className="space-y-2">
                                                        <Label>Name</Label>
                                                        <Input {...form.register(`certifications.${index}.name`)} placeholder="Certification Name" />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label>Issuer</Label>
                                                        <Input {...form.register(`certifications.${index}.issuer`)} placeholder="Issuing Organization" />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label>Date</Label>
                                                        <Input type="date" {...form.register(`certifications.${index}.date`)} />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label>Link (Optional)</Label>
                                                        <Input {...form.register(`certifications.${index}.link`)} placeholder="https://..." />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        {certFields.length === 0 && (
                                            <p className="text-center text-muted-foreground py-8">No certifications added yet.</p>
                                        )}
                                    </div>
                                </motion.div>
                            )}

                            {step === 5 && (
                                <motion.div
                                    key="step5"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-6"
                                >
                                    <div className="flex justify-between items-center">
                                        <div className="space-y-1">
                                            <h2 className="text-xl font-semibold">Projects</h2>
                                            <p className="text-sm text-muted-foreground">Showcase your best work.</p>
                                        </div>
                                        <Button type="button" size="sm" onClick={() => appendProj({ id: crypto.randomUUID(), name: "", description: "", link: "", technologies: [], startDate: "", endDate: "" })}>
                                            <Plus className="w-4 h-4 mr-2" /> Add Project
                                        </Button>
                                    </div>

                                    <div className="space-y-6">
                                        {projFields.map((field, index) => (
                                            <div key={field.id} className="p-4 border rounded-lg bg-card space-y-4 relative">
                                                <Button type="button" variant="ghost" size="icon" className="absolute top-2 right-2 text-destructive" onClick={() => removeProj(index)}>
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                                                    <div className="space-y-2">
                                                        <Label>Project Name</Label>
                                                        <Input {...form.register(`projects.${index}.name`)} placeholder="Project Name" />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label>Link (Optional)</Label>
                                                        <Input {...form.register(`projects.${index}.link`)} placeholder="https://..." />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label>Start Date</Label>
                                                        <Input type="date" {...form.register(`projects.${index}.startDate`)} />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label>End Date</Label>
                                                        <Input type="date" {...form.register(`projects.${index}.endDate`)} />
                                                    </div>
                                                    <div className="space-y-2 col-span-2">
                                                        <Label>Description</Label>
                                                        <Textarea {...form.register(`projects.${index}.description`)} placeholder="Describe the project..." />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        {projFields.length === 0 && (
                                            <p className="text-center text-muted-foreground py-8">No projects added yet.</p>
                                        )}
                                    </div>
                                </motion.div>
                            )}

                            {step === 6 && (
                                <motion.div
                                    key="step6"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-6"
                                >
                                    <div className="flex justify-between items-center">
                                        <div className="space-y-1">
                                            <h2 className="text-xl font-semibold">Education</h2>
                                            <p className="text-sm text-muted-foreground">Add your educational background.</p>
                                        </div>
                                        <Button type="button" size="sm" onClick={() => appendEdu({ id: crypto.randomUUID(), school: "", degree: "", startDate: "" })}>
                                            <Plus className="w-4 h-4 mr-2" /> Add Education
                                        </Button>
                                    </div>

                                    <div className="space-y-6">
                                        {eduFields.map((field, index) => (
                                            <div key={field.id} className="p-4 border rounded-lg bg-card space-y-4 relative">
                                                <Button type="button" variant="ghost" size="icon" className="absolute top-2 right-2 text-destructive" onClick={() => removeEdu(index)}>
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                                                    <div className="space-y-2">
                                                        <Label>School</Label>
                                                        <Input {...form.register(`education.${index}.school`)} placeholder="University Name" />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label>Degree</Label>
                                                        <Input {...form.register(`education.${index}.degree`)} placeholder="Degree" />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label>Start Date</Label>
                                                        <Input type="date" {...form.register(`education.${index}.startDate`)} />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label>End Date</Label>
                                                        <Input type="date" {...form.register(`education.${index}.endDate`)} />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        {eduFields.length === 0 && (
                                            <p className="text-center text-muted-foreground py-8">No education added yet.</p>
                                        )}
                                    </div>
                                </motion.div>
                            )}

                            {step === 7 && (
                                <motion.div
                                    key="step7"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-6"
                                >
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <h2 className="text-xl font-semibold">Skills</h2>
                                                <p className="text-sm text-muted-foreground">Add your technical and soft skills.</p>
                                            </div>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={generateAIContent}
                                                disabled={isGenerating}
                                            >
                                                {isGenerating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Wand2 className="w-4 h-4 mr-2" />}
                                                AI Suggestions
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex gap-2">
                                            <Input
                                                placeholder="Add a skill (e.g. React, Python) and press Enter"
                                                onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                                                    if (e.key === "Enter") {
                                                        e.preventDefault();
                                                        const val = e.currentTarget.value.trim();
                                                        if (val) {
                                                            const current = form.getValues("skills") || [];
                                                            if (!current.includes(val)) {
                                                                form.setValue("skills", [...current, val]);
                                                            }
                                                            e.currentTarget.value = "";
                                                        }
                                                    }
                                                }}
                                            />
                                        </div>

                                        <div className="flex flex-wrap gap-2 min-h-[50px] p-4 border rounded-md bg-muted/30">
                                            {form.watch("skills")?.length === 0 && (
                                                <p className="text-sm text-muted-foreground w-full text-center py-2">No skills added yet.</p>
                                            )}
                                            {form.watch("skills")?.map((skill, i) => (
                                                <div key={i} className="bg-primary/10 text-primary px-3 py-1 rounded-full flex items-center gap-2 border border-primary/20">
                                                    <span>{skill}</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            const current = form.getValues("skills") || [];
                                                            form.setValue("skills", current.filter(s => s !== skill));
                                                        }}
                                                        className="hover:text-destructive transition-colors w-4 h-4 flex items-center justify-center rounded-full"
                                                    >
                                                        &times;
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="flex flex-col-reverse sm:flex-row sm:justify-between gap-3 pt-4 border-t">
                            {step === 1 ? (
                                <Button type="button" variant="ghost" onClick={() => navigate('/dashboard')} className="w-full sm:w-auto text-muted-foreground hover:text-foreground">
                                    <ArrowLeft className="w-4 h-4 mr-2" /> Exit to Dashboard
                                </Button>
                            ) : (
                                <Button type="button" variant="outline" onClick={prevStep} className="w-full sm:w-auto">
                                    <ChevronLeft className="w-4 h-4 mr-2" /> Back
                                </Button>
                            )}

                            {step < 7 ? (
                                <Button type="button" onClick={nextStep} className="w-full sm:w-auto">
                                    Next <ChevronRight className="w-4 h-4 ml-2" />
                                </Button>
                            ) : (
                                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                                    <Button type="button" variant="outline" onClick={() => setShowPreview(true)} className="w-full sm:w-auto order-2 sm:order-1">
                                        <Eye className="w-4 h-4 mr-2" /> Preview
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={async () => {
                                            // const savedId = resumeId || (isSaved ? "temp-id" : null); // In real app, we need the ID. 
                                            // If not saved, we can't generate easily without passing content.
                                            // Let's just navigate to portfolios page for now or show value prop.
                                            navigate("/dashboard/portfolios");
                                        }}
                                        className="w-full sm:w-auto order-2 sm:order-1 hidden md:flex"
                                    >
                                        <Wand2 className="w-4 h-4 mr-2" /> Portfolio
                                    </Button>
                                    <Button type="submit" className="w-full sm:w-auto order-1 sm:order-2" disabled={form.formState.isSubmitting}>
                                        {form.formState.isSubmitting ? (
                                            <>
                                                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...
                                            </>
                                        ) : (
                                            <>
                                                <Save className="w-4 h-4 mr-2" /> Save Resume
                                            </>
                                        )}
                                    </Button>
                                </div>
                            )}
                        </div>
                    </form>
                </CardContent>
            </Card>
            {/* Preview Dialog */}
            <ResumePreview
                open={showPreview}
                onClose={() => {
                    setShowPreview(false);
                    if (isSaved) {
                        navigate("/dashboard/resumes");
                    }
                }}
                data={form.getValues() as ResumeData}
            />
        </div >
    );
}
