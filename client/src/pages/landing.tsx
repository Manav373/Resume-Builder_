
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AppSignInButton, AppSignedIn, AppSignedOut, UserButtonComponent } from "@/components/auth-provider";
import { motion, useScroll, useTransform, useSpring, useMotionValue, useMotionTemplate } from "framer-motion";
import { FileText, Sparkles, Download, Zap } from "lucide-react";
import { SwipeCard } from "@/components/ui/swipe-card";
import { HeroResumeCard } from "@/components/ui/hero-resume-card";
import { ParticlesBackground } from "@/components/ui/particles-background";
import { ModeToggle } from "@/components/mode-toggle";
import { GlowingButton } from "@/components/ui/glowing-button";
import { useEffect } from "react";

export default function LandingPage() {
    const { scrollYProgress } = useScroll();
    const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
    const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

    // Custom Cursor Logic
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const smoothX = useSpring(mouseX, { stiffness: 150, damping: 20, mass: 0.5 });
    const smoothY = useSpring(mouseY, { stiffness: 150, damping: 20, mass: 0.5 });

    useEffect(() => {
        function handleMouseMove({ clientX, clientY }: MouseEvent) {
            mouseX.set(clientX);
            mouseY.set(clientY);
        }
        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, [mouseX, mouseY]);



    return (
        <div className="flex flex-col min-h-screen bg-background relative overflow-hidden selection:bg-primary/20">
            {/* Custom Cursor Spotlight */}
            <motion.div
                className="pointer-events-none fixed inset-0 z-0 transition-opacity duration-300 will-change-[background]"
                style={{
                    background: useMotionTemplate`radial-gradient(600px circle at ${smoothX}px ${smoothY}px, hsl(var(--primary) / 0.05), transparent 80%)`,
                }}
            />

            {/* Super Background - Canvas Based */}
            <ParticlesBackground />

            {/* Header */}
            <header className="px-6 lg:px-8 h-16 flex items-center border-b border-border/40 sticky top-0 bg-background/60 backdrop-blur-xl z-50">
                <Link className="flex items-center justify-center font-bold text-xl gap-2 group" to="/">
                    <div className="p-1.5 bg-primary rounded-lg group-hover:scale-105 transition-transform duration-300 shadow-lg shadow-primary/25">
                        <FileText className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70 group-hover:to-primary transition-all">Resume Builder AI</span>
                </Link>
                <nav className="ml-auto flex gap-4 sm:gap-6">
                    <div className="flex items-center gap-4">
                        <AppSignedOut>
                            <AppSignInButton>
                                <Button variant="ghost" className="text-muted-foreground hover:text-foreground">Sign In</Button>
                            </AppSignInButton>
                        </AppSignedOut>
                        <AppSignedIn>
                            <UserButtonComponent />
                        </AppSignedIn>
                        <ModeToggle />
                        <Link to="/dashboard/resumes/new">
                            <Button size="sm" className="hidden sm:flex shadow-lg shadow-primary/20">Get Started</Button>
                        </Link>
                    </div>
                </nav>
            </header>

            <main className="flex-1 relative z-20">
                {/* Hero Section */}
                <section className="relative pt-20 md:pt-32 pb-32 overflow-hidden">
                    <div className="container px-4 md:px-6 relative">
                        <div className="flex flex-col items-center space-y-10 text-center">
                            <motion.div
                                style={{ opacity, scale }}
                                className="space-y-6 max-w-4xl mx-auto"
                            >
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5 }}
                                    className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-sm text-primary backdrop-blur-sm shadow-xl shadow-primary/10"
                                >
                                    <Sparkles className="mr-2 h-3.5 w-3.5" />
                                    <span>Powered by GPT-4 AI Technology</span>
                                </motion.div>

                                <h1
                                    className="text-4xl font-extrabold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl pb-2"
                                >
                                    <motion.span
                                        initial={{ opacity: 0, scale: 0.9, y: 30, filter: "blur(10px)" }}
                                        animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
                                        transition={{ duration: 0.8, ease: "circOut" }}
                                        className="bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/50 inline-block"
                                    >
                                        Craft Your
                                    </motion.span>
                                    <br className="hidden md:block" />
                                    <motion.span
                                        initial={{ opacity: 0, scale: 0.9, y: 30, filter: "blur(10px)" }}
                                        animate={{
                                            opacity: 1,
                                            scale: 1,
                                            y: 0,
                                            filter: "blur(0px)",
                                            backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
                                        }}
                                        transition={{
                                            y: { duration: 0.8, delay: 0.2, ease: "circOut" },
                                            opacity: { duration: 0.8, delay: 0.2, ease: "circOut" },
                                            scale: { duration: 0.8, delay: 0.2, ease: "circOut" },
                                            filter: { duration: 0.8, delay: 0.2, ease: "circOut" },
                                            backgroundPosition: {
                                                duration: 4,
                                                repeat: Infinity,
                                                ease: "linear",
                                            },
                                        }}
                                        className="bg-clip-text text-transparent bg-gradient-to-r from-sky-400 via-violet-500 to-fuchsia-500 bg-[length:200%_auto] inline-block tracking-tight"
                                    >
                                        Dream Career
                                    </motion.span>
                                </h1>

                                <motion.p
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2, duration: 0.5 }}
                                    className="mx-auto max-w-2xl text-muted-foreground text-lg md:text-xl leading-relaxed"
                                >
                                    Stop wrestling with formatting. Let our AI writer help you describe your achievements and build a professional resume in minutes.
                                </motion.p>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.3, duration: 0.5 }}
                                className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto items-center"
                            >
                                <SwipeCard className="bg-background/80 backdrop-blur-md" />

                                <AppSignedOut>
                                    <AppSignInButton>
                                        <GlowingButton className="w-full sm:w-auto h-14 px-10 text-lg shadow-xl">
                                            Sign In
                                        </GlowingButton>
                                    </AppSignInButton>
                                </AppSignedOut>
                            </motion.div>

                            {/* Hero Visual - 3D Card */}
                            <motion.div
                                initial={{ opacity: 0, y: 40 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4, duration: 0.8, type: "spring" }}
                                className="mt-8 w-full"
                            >
                                <HeroResumeCard />
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="py-32 relative">
                    <div className="container px-4 md:px-6 relative z-10">
                        <div className="text-center mb-20 space-y-4">
                            <motion.h2
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.3 }}
                                className="text-3xl font-bold tracking-tight md:text-5xl"
                            >
                                Supercharge Your Job Search
                            </motion.h2>
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.3 }}
                                transition={{ delay: 0.1 }}
                                className="text-muted-foreground max-w-2xl mx-auto text-xl"
                            >
                                We combine professional design with smart technology to give you the competitive edge.
                            </motion.p>
                        </div>
                        <div className="grid gap-8 md:grid-cols-3">
                            <FeatureCard
                                icon={<Sparkles className="w-10 h-10 text-amber-500" />}
                                title="AI Content Generation"
                                description="Stuck on what to write? Our AI suggests bullet points tailored to your job title."
                                delay={0.1}
                            />
                            <FeatureCard
                                icon={<Zap className="w-10 h-10 text-sky-500" />}
                                title="Instant Optimization"
                                description="Real-time feedback on your resume's strength and ATS compatibility."
                                delay={0.2}
                            />
                            <FeatureCard
                                icon={<Download className="w-10 h-10 text-green-500" />}
                                title="Professional Export"
                                description="Download your finished resume in high-quality PDF format instantly."
                                delay={0.3}
                            />
                        </div>
                    </div>
                </section>

                {/* How it Works Section */}
                <section className="py-32 bg-muted/30 relative overflow-hidden">
                    <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />
                    <div className="container px-4 md:px-6">
                        <div className="text-center mb-20">
                            <h2 className="text-3xl font-bold tracking-tight md:text-4xl mb-4">Three Steps to Success</h2>
                            <p className="text-muted-foreground text-lg">Detailed guide to building your perfect resume</p>
                        </div>
                        <div className="grid gap-12 md:grid-cols-3 relative">
                            {/* Connector Line (Desktop) */}
                            <motion.div
                                initial={{ scaleX: 0 }}
                                whileInView={{ scaleX: 1 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ duration: 1.5, ease: "easeInOut" }}
                                style={{ originX: 0 }}
                                className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-transparent via-primary/50 to-transparent"
                            />

                            <Step
                                step="1"
                                title="Enter Details"
                                description="Fill in your experience manually or upload your existing resume."
                                delay={0.1}
                            />
                            <Step
                                step="2"
                                title="Enhance with AI"
                                description="Use our AI tools to polish your summary and bullet points."
                                delay={0.2}
                            />
                            <Step
                                step="3"
                                title="Download & Apply"
                                description="Select a premium template and export your PDF instantly."
                                delay={0.3}
                            />
                        </div>
                    </div>
                </section>

                {/* CTA Section (New) */}
                <section className="py-24 relative overflow-hidden">
                    <div className="absolute inset-0 bg-primary/5 -z-10" />
                    <div className="container px-4 md:px-6">
                        <div className="bg-gradient-to-br from-background to-muted dark:from-sky-900/20 dark:to-purple-900/20 rounded-3xl p-12 md:p-24 text-center relative overflow-hidden text-foreground border border-border/50 dark:text-white dark:border-white/10 shadow-2xl">
                            <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(45deg,transparent_25%,rgba(var(--primary),.1)_50%,transparent_75%,transparent_100%)] bg-[length:250%_250%,100%_100%] bg-[position:-100%_0,0_0] bg-no-repeat animate-shine" />

                            <h2 className="text-3xl md:text-5xl font-bold mb-6 relative z-10">Ready to Land Your Dream Job?</h2>
                            <p className="text-lg md:text-xl text-muted-foreground dark:text-gray-300 mb-10 max-w-2xl mx-auto relative z-10">
                                Join thousands of professionals who have successfully advanced their careers with AI Resume.
                            </p>
                            <Link to="/dashboard/resumes/new" className="relative z-10 inline-block">
                                <GlowingButton className="h-14 px-10 text-lg shadow-xl">
                                    Create My Resume
                                </GlowingButton>
                            </Link>
                        </div>
                    </div>
                </section>
            </main>

            <footer className="py-12 w-full border-t border-border/40 bg-background/50 backdrop-blur-lg">
                <div className="container px-4 md:px-6 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-primary/20 rounded-md">
                            <FileText className="w-5 h-5 text-primary" />
                        </div>
                        <span className="font-bold text-lg">Resume Builder AI</span>
                    </div>
                    <p className="text-sm text-muted-foreground">© 2024 Resume Builder AI. All rights reserved.</p>
                    <nav className="flex gap-6 text-sm text-muted-foreground">
                        <Link to="#" className="hover:text-foreground transition-colors">Terms</Link>
                        <Link to="#" className="hover:text-foreground transition-colors">Privacy</Link>
                        <Link to="#" className="hover:text-foreground transition-colors">Support</Link>
                    </nav>
                </div>
            </footer>
        </div>
    );
}

function FeatureCard({ icon, title, description, delay }: { icon: React.ReactNode, title: string, description: string, delay: number }) {
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseX = useSpring(x, { stiffness: 150, damping: 20, mass: 0.5 });
    const mouseY = useSpring(y, { stiffness: 150, damping: 20, mass: 0.5 });

    function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
        const { left, top, width, height } = currentTarget.getBoundingClientRect();
        const xPct = clientX - left - width / 2;
        const yPct = clientY - top - height / 2;
        x.set(xPct);
        y.set(yPct);

        const target = currentTarget as HTMLElement;
        target.style.setProperty("--mouse-x", `${clientX - left}px`);
        target.style.setProperty("--mouse-y", `${clientY - top}px`);
    }

    function handleMouseLeave() {
        x.set(0);
        y.set(0);
    }

    const rotateX = useTransform(mouseY, [-100, 100], [5, -5]); // Inverted for tilt effect
    const rotateY = useTransform(mouseX, [-100, 100], [-5, 5]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ delay, duration: 0.5 }}
            style={{ perspective: 1000 }}
        >
            <motion.div
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                style={{
                    rotateX,
                    rotateY,
                    transformStyle: "preserve-3d",
                }}
                className="h-full"
            >
                <div className="h-full p-8 rounded-2xl border border-border/50 bg-background/40 hover:bg-background/60 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10 backdrop-blur-sm transition-colors group relative overflow-hidden shadow-lg hover:shadow-2xl">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    {/* Glare Effect */}
                    <div
                        className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                        style={{
                            background: window.navigator.userAgent.includes("Firefox") ? "" : "radial-gradient(800px circle at var(--mouse-x) var(--mouse-y), rgba(255,255,255,0.1), transparent 40%)"
                        }}
                    />

                    <div className="relative z-10" style={{ transform: "translateZ(20px)" }}>
                        <div className="mb-6 p-3 bg-primary/10 rounded-xl w-fit border border-primary/10 shadow-sm group-hover:scale-110 transition-transform duration-300">
                            {icon}
                        </div>
                        <h3 className="text-xl font-bold mb-3">{title}</h3>
                        <p className="text-muted-foreground leading-relaxed">
                            {description}
                        </p>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}

function Step({ step, title, description, delay }: { step: string, title: string, description: string, delay: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ delay, duration: 0.5 }}
            className="flex flex-col items-center space-y-4 relative z-10"
        >
            <div className="w-20 h-20 rounded-full bg-background border-4 border-primary/10 flex items-center justify-center text-3xl font-bold text-primary shadow-xl relative group">
                <span className="relative z-10">{step}</span>
                <div className="absolute inset-0 rounded-full bg-primary/5 scale-0 group-hover:scale-110 transition-transform duration-500" />
            </div>
            <h3 className="text-xl font-bold mt-4">{title}</h3>
            <p className="text-muted-foreground max-w-[280px] mx-auto leading-relaxed">
                {description}
            </p>
        </motion.div>
    );
}


