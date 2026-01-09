import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useAppUser } from "@/components/auth-provider";
import { API_URL } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Bot, Send, User, Sparkles, ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

interface Message {
    role: "ai" | "user";
    content: string;
}

export default function NewPortfolioPage() {
    const navigate = useNavigate();
    const { user } = useAppUser();
    const [messages, setMessages] = useState<Message[]>([
        { role: "ai", content: "Hello! I'm your Portfolio Architect. To get started, please select a resume above, and then tell me about the style, vibe, or specific features you want for your website." }
    ]);
    const [inputValue, setInputValue] = useState("");
    const [selectedResumeId, setSelectedResumeId] = useState<string>("");
    const [isGenerating, setIsGenerating] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Fetch resumes
    const { data: resumes, isLoading: isLoadingResumes } = useQuery({
        queryKey: ["resumes", user?.id],
        queryFn: async () => {
            if (!user?.id) return [];
            const res = await fetch(`${API_URL}/api/resumes?userId=${user.id}`);
            if (!res.ok) throw new Error("Failed to fetch resumes");
            return res.json();
        },
        enabled: !!user?.id,
    });

    // Auto-scroll to bottom of chat
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSendMessage = () => {
        if (!inputValue.trim()) return;

        const newMessages = [...messages, { role: "user" as const, content: inputValue }];
        setMessages(newMessages);
        setInputValue("");

        // Simulate AI thinking/response based on keywords
        setTimeout(() => {
            let aiResponse = "Got it. Anything else?";
            const lowerInput = inputValue.toLowerCase();

            if (lowerInput.includes("dark") || lowerInput.includes("black")) {
                aiResponse = "Dark mode is a great choice for a sleek, premium look. I'll make sure the contrast pops.";
            } else if (lowerInput.includes("minimal")) {
                aiResponse = "Minimalism focuses on typography and whitespace. I'll strip away the clutter.";
            } else if (lowerInput.includes("cyberpunk") || lowerInput.includes("neon")) {
                aiResponse = "Cyberpunk style coming right up! Neon borders and glitch effects will look sick.";
            } else if (lowerInput.includes("portfolio") || lowerInput.includes("work")) {
                aiResponse = "I'll highlight your projects with prominent cards and hover effects.";
            } else if (lowerInput.includes("movie") || lowerInput.includes("cinema")) {
                aiResponse = "Cinematic mode active. I'll use full-screen visuals and smooth parallax scrolling for a Hollywood feel.";
            } else if (lowerInput.includes("news") || lowerInput.includes("paper")) {
                aiResponse = "Going for an Editorial look. Classic typography and structured grids will give it a sophisticated vibe.";
            } else if (lowerInput.includes("glass")) {
                aiResponse = "Glassmorphism it is! Soft gradients and frosted glass elements coming right up.";
            }

            setMessages(prev => [...prev, { role: "ai", content: aiResponse }]);
        }, 1000);
    };

    const handleGenerate = async () => {
        if (!selectedResumeId) {
            toast.error("Please select a resume first.");
            return;
        }

        setIsGenerating(true);
        try {
            const selectedResume = resumes?.find((r: any) => r.id === selectedResumeId);
            if (!selectedResume) throw new Error("Resume not found");

            // Aggregate user messages for the custom prompt
            const customPrompt = messages
                .filter(m => m.role === "user")
                .map(m => m.content)
                .join("\n");

            // Determine theme based on keywords in chat (simple heuristic)
            let theme = "modern";
            // Determine theme based on keywords in chat (simple heuristic)

            const fullText = customPrompt.toLowerCase();
            if (fullText.includes("minimal")) theme = "minimal";
            else if (fullText.includes("cyberpunk") || fullText.includes("hacker") || fullText.includes("neon")) theme = "cyberpunk";
            else if (fullText.includes("creative") || fullText.includes("bold") || fullText.includes("art")) theme = "creative";
            else if (fullText.includes("behance") || fullText.includes("2026") || fullText.includes("yulia") || fullText.includes("bento")) theme = "cyber-bento";
            else if (fullText.includes("movie") || fullText.includes("cinema") || fullText.includes("film") || fullText.includes("luxury")) theme = "cinematic";
            else if (fullText.includes("news") || fullText.includes("paper") || fullText.includes("journal") || fullText.includes("blog")) theme = "editorial";
            else if (fullText.includes("glass") || fullText.includes("blur") || fullText.includes("translucent") || fullText.includes("ios")) theme = "glassmorphism";

            // 1. Generate Portfolio
            const genRes = await fetch(`${API_URL}/api/ai/generate-portfolio`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    resumeData: selectedResume.content,
                    theme,
                    customPrompt // Pass the full chat history as instructions
                }),
            });

            if (!genRes.ok) {
                const errorData = await genRes.json();
                throw new Error(errorData.error || "Failed to generate portfolio");
            }

            const { html } = await genRes.json();

            // 2. Save Portfolio
            const saveRes = await fetch(`${API_URL}/api/portfolios`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId: user?.id,
                    title: `${selectedResume.title} Portfolio`,
                    content: { html },
                }),
            });

            if (!saveRes.ok) throw new Error("Failed to save portfolio");

            toast.success("Portfolio generated successfully!");
            navigate("/dashboard/portfolios");

        } catch (error: any) {
            console.error("Portfolio Generation Error:", error);
            toast.error(error.message || "Failed to generate portfolio");
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col h-[calc(100vh-4rem)] md:h-[calc(100vh-4rem)] lg:h-[calc(100vh-4rem)] supports-[height:100dvh]:h-[calc(100dvh-4rem)] max-w-5xl mx-auto p-2 md:p-6 gap-4 md:gap-6"
        >
            {/* Header */}
            <div className="flex items-center gap-2 md:gap-4 shrink-0">
                <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard/portfolios")}>
                    <ArrowLeft className="w-5 h-5" />
                </Button>
                <div>
                    <h1 className="text-xl md:text-2xl font-bold flex items-center gap-2">
                        <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-purple-500" />
                        AI Portfolio Architect
                    </h1>
                    <p className="text-muted-foreground text-xs md:text-sm line-clamp-1">
                        Chat with our AI to build your dream portfolio.
                    </p>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex gap-6 overflow-hidden min-h-0">
                {/* Chat Area */}
                <Card className="flex-1 flex flex-col shadow-md border-primary/10 overflow-hidden bg-background">
                    <div className="p-3 md:p-4 border-b bg-muted/30 flex flex-col sm:flex-row justify-between sm:items-center gap-3 shrink-0">
                        <div className="flex items-center gap-2 text-sm font-medium whitespace-nowrap">
                            <Bot className="w-4 h-4 text-purple-500" />
                            Architect Agent
                        </div>

                        {/* Native Resume Selector */}
                        <div className="w-full sm:w-[250px]">
                            {isLoadingResumes ? (
                                <div className="text-xs text-muted-foreground">Loading resumes...</div>
                            ) : (
                                <select
                                    className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring truncate"
                                    value={selectedResumeId}
                                    onChange={(e) => setSelectedResumeId(e.target.value)}
                                >
                                    <option value="" disabled>Select Base Resume</option>
                                    {resumes?.map((r: any) => (
                                        <option key={r.id} value={r.id}>
                                            {r.title}
                                        </option>
                                    ))}
                                </select>
                            )}
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
                        <div className="space-y-4">
                            {messages.map((m, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className={`flex gap-3 ${m.role === "user" ? "justify-end" : "justify-start"}`}
                                >
                                    {m.role === "ai" && (
                                        <div className="w-8 h-8 rounded-full border flex items-center justify-center bg-muted shrink-0">
                                            <Bot className="w-4 h-4" />
                                        </div>
                                    )}
                                    <div
                                        className={`rounded-2xl px-4 py-2 max-w-[85%] text-sm ${m.role === "user"
                                            ? "bg-primary text-primary-foreground rounded-tr-none"
                                            : "bg-muted text-foreground rounded-tl-none"
                                            }`}
                                    >
                                        {m.content}
                                    </div>
                                    {m.role === "user" && (
                                        <div className="w-8 h-8 rounded-full border flex items-center justify-center bg-primary/10 shrink-0 overflow-hidden">
                                            {user?.imageUrl ? (
                                                <img src={user.imageUrl} alt="User" className="w-full h-full object-cover" />
                                            ) : (
                                                <User className="w-4 h-4" />
                                            )}
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    <div className="p-3 md:p-4 bg-background border-t shrink-0">
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleSendMessage();
                            }}
                            className="flex gap-2"
                        >
                            <Input
                                placeholder="E.g., Make it look like a glossy Apple product page..."
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                className="flex-1"
                                disabled={isGenerating}
                            />
                            <Button type="submit" disabled={!inputValue.trim() || isGenerating} size="icon">
                                <Send className="w-4 h-4" />
                            </Button>
                        </form>
                    </div>
                </Card>

            </div>

            {/* Bottom Actions */}
            <div className="flex justify-between sm:justify-end gap-3 shrink-0">
                {/* Stack actions vertically on very small screens? No, side by side is fine usually, or use icons */}
                <Button variant="outline" onClick={() => setMessages([])} className="flex-1 sm:flex-none">
                    Clear
                </Button>
                <Button
                    size="lg" // Maybe just default size on mobile?
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg flex-1 sm:flex-none"
                    onClick={handleGenerate}
                    disabled={isGenerating || !selectedResumeId}
                >
                    {isGenerating ? (
                        <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            Generating...
                        </>
                    ) : (
                        <>
                            <Sparkles className="w-5 h-5 mr-2" />
                            Generate Portfolio
                        </>
                    )}
                </Button>
            </div>
        </motion.div>
    );
}
