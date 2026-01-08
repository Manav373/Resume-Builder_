
import React from "react";
import { motion } from "framer-motion";
import { AnimatedText } from "./animated-text";
import { Briefcase, Mail, MapPin, Phone, Globe, GraduationCap, Award } from "lucide-react";

export function HeroResumeCard() {
    // Config for scroll reveal behavior - adjusted to prevent flickering
    const viewportConfig = { once: true, amount: 0.2, margin: "0px 0px -10% 0px" };

    return (
        <div className="w-full max-w-5xl mx-auto py-10">
            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={viewportConfig}
                variants={{
                    hidden: { opacity: 0, y: 30 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
                }}
                className="relative transition-all duration-200"
                layout
                style={{ willChange: "opacity, transform" }}
            >
                {/* Card Container */}
                <div className="rounded-2xl border border-primary/10 bg-primary/5 dark:border-white/20 dark:bg-white/5 backdrop-blur-xl shadow-2xl p-2 relative group overflow-hidden">

                    {/* Static background */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-sky-500/5 to-purple-500/5 opacity-80" />

                    {/* Inner Content Area */}
                    <div className="rounded-xl bg-background/95 border border-border/50 dark:border-white/10 overflow-hidden relative shadow-2xl min-h-[600px] flex flex-col md:block">

                        {/* Top Bar Mockup */}
                        <div
                            className="absolute top-0 left-0 right-0 h-9 bg-muted/30 border-b border-border/40 flex items-center px-4 gap-2 z-20 backdrop-blur-sm"
                        >
                            <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                            <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                            <div className="ml-auto flex gap-2 opacity-50">
                                <div className="w-16 h-1.5 rounded-full bg-foreground/20" />
                                <div className="w-8 h-1.5 rounded-full bg-foreground/20" />
                            </div>
                        </div>

                        {/* Resume Content */}
                        <div className="p-4 md:p-8 pt-6 md:pt-12 grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 h-full font-sans text-xs bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#1f2937_1px,transparent_1px)] [background-size:20px_20px]">

                            {/* Left Column (Sidebar) */}
                            <div
                                className="col-span-12 md:col-span-4 space-y-8 flex flex-col relative md:border-r border-border/40 md:pr-6"
                            >
                                {/* Profile Header */}
                                <div className="flex flex-col items-center text-center">
                                    <motion.div
                                        variants={{
                                            hidden: { scale: 0.5, opacity: 0 },
                                            visible: { scale: 1, opacity: 1, transition: { duration: 0.5, ease: "backOut" } }
                                        }}
                                        className="h-32 w-32 rounded-full bg-gradient-to-br from-blue-600 via-indigo-500 to-purple-600 p-[3px] shadow-2xl mb-4 relative"
                                    >
                                        <div className="w-full h-full rounded-full bg-white dark:bg-zinc-900 flex items-center justify-center overflow-hidden relative">
                                            <span className="text-5xl z-10">👨‍💻</span>
                                            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 to-purple-500/10" />
                                        </div>
                                    </motion.div>

                                    <div className="space-y-1.5 w-full">
                                        <AnimatedText
                                            text="Alexander Nova"
                                            delay={0.1}
                                            className="font-bold text-2xl tracking-tight text-foreground"
                                            repeat={true}
                                        />
                                        <AnimatedText
                                            text="Senior Product Architect"
                                            delay={0.2}
                                            className="text-primary font-medium text-xs uppercase tracking-widest"
                                            repeat={true}
                                        />
                                    </div>
                                </div>

                                {/* Contact Info - Using CSS stagger or individual delays */}
                                <div className="space-y-3 w-full">
                                    <SectionTitle text="Contact" delay={0.3} />
                                    <div className="space-y-2.5">
                                        <ContactItem text="hello@nova.design" delay={0.4} icon={<Mail className="w-3.5 h-3.5" />} />
                                        <ContactItem text="www.nova.design" delay={0.45} icon={<Globe className="w-3.5 h-3.5" />} />
                                        <ContactItem text="+1 (555) 019-2834" delay={0.5} icon={<Phone className="w-3.5 h-3.5" />} />
                                        <ContactItem text="San Francisco, CA" delay={0.55} icon={<MapPin className="w-3.5 h-3.5" />} />
                                    </div>
                                </div>

                                {/* Skills */}
                                <div className="space-y-3 w-full">
                                    <SectionTitle text="Skills" delay={0.6} />
                                    <motion.div
                                        className="flex flex-wrap gap-1.5"
                                        variants={{
                                            hidden: { opacity: 0 },
                                            visible: { opacity: 1, transition: { delay: 0.7, duration: 0.4 } }
                                        }}
                                    >
                                        {["Figma", "React", "TypeScript", "Node.js", "System Design", "UI/UX", "Motion", "Strategy"].map((skill, i) => (
                                            <motion.div
                                                key={skill}
                                                variants={{
                                                    hidden: { scale: 0.8, opacity: 0 },
                                                    visible: { scale: 1, opacity: 1, transition: { delay: 0.7 + (i * 0.03), duration: 0.3 } }
                                                }}
                                                whileHover={{ scale: 1.1, backgroundColor: "hsl(var(--secondary))" }}
                                                className="px-2.5 py-1 rounded-md bg-secondary/50 text-[10px] font-medium text-secondary-foreground border border-border/50 transition-colors cursor-default"
                                            >
                                                {skill}
                                            </motion.div>
                                        ))}
                                    </motion.div>
                                </div>

                                {/* Languages */}
                                <div className="space-y-3 w-full">
                                    <SectionTitle text="Languages" delay={0.8} />
                                    <div className="space-y-2">
                                        <LanguageItem language="English" level="Native" delay={0.9} percent={100} />
                                        <LanguageItem language="Spanish" level="Professional" delay={1.0} percent={85} />
                                        <LanguageItem language="Japanese" level="Conversational" delay={1.1} percent={40} />
                                    </div>
                                </div>

                            </div>

                            {/* Right Column (Main Content) */}
                            <div
                                className="col-span-12 md:col-span-8 space-y-8 md:pl-2"
                            >
                                {/* Summary Section */}
                                <motion.div
                                    variants={{
                                        hidden: { opacity: 0, y: 10 },
                                        visible: { opacity: 1, y: 0, transition: { delay: 0.3, duration: 0.5 } }
                                    }}
                                    className="bg-gradient-to-br from-primary/5 via-primary/5 to-transparent p-6 rounded-2xl border border-primary/10 relative overflow-hidden"
                                >
                                    <div className="absolute top-0 right-0 p-3 opacity-20">
                                        <Award className="w-12 h-12 text-primary" />
                                    </div>
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className="font-bold text-primary uppercase tracking-widest text-[11px]">Professional Profile</span>
                                    </div>
                                    <p className="text-muted-foreground leading-relaxed text-sm">
                                        Visionary digital product leader with over 8 years of experience in scaling SaaS platforms. Expert in bridging the gap between engineering and design to deliver pixel-perfect, accessible, and performant user experiences. Proven track record of leading cross-functional teams to success.
                                    </p>
                                </motion.div>

                                {/* Experience Section */}
                                <div>
                                    <div className="flex items-center gap-3 mb-5">
                                        <div className="p-1.5 bg-primary/10 rounded-md text-primary">
                                            <Briefcase className="w-4 h-4" />
                                        </div>
                                        <AnimatedText
                                            text="Work Experience"
                                            delay={0.6}
                                            className="font-bold text-lg tracking-tight"
                                            repeat={true}
                                        />
                                    </div>

                                    <div className="relative border-l-2 border-border/50 ml-3 space-y-8 pb-2">
                                        <ExperienceItem
                                            role="Staff Product Designer"
                                            company="Nebula Systems"
                                            date="2022 - Present"
                                            desc="Leading the design infrastructure team. Architected a new multi-platform design system reduced dev time by 40%. Mentoring 4 senior designers."
                                            delay={0.7}
                                            logoColor="bg-sky-500"
                                            logoLetter="N"
                                        />
                                        <ExperienceItem
                                            role="Senior UX Engineer"
                                            company="Quartz Financial"
                                            date="2019 - 2022"
                                            desc="Led the frontend modernization of the legacy banking portal. Improved load times by 65% and accessibility score to 98/100."
                                            delay={0.9}
                                            logoColor="bg-violet-500"
                                            logoLetter="Q"
                                        />
                                        <ExperienceItem
                                            role="Product Designer"
                                            company="Apex Studio"
                                            date="2017 - 2019"
                                            desc="Designed and shipped 15+ mobile applications for Fortune 500 clients. Specialized in rapid prototyping and user testing."
                                            delay={1.1}
                                            logoColor="bg-rose-500"
                                            logoLetter="A"
                                        />
                                    </div>
                                </div>

                                {/* Education Section */}
                                <div className="pt-2">
                                    <div className="flex items-center gap-3 mb-5">
                                        <div className="p-1.5 bg-primary/10 rounded-md text-primary">
                                            <GraduationCap className="w-4 h-4" />
                                        </div>
                                        <AnimatedText
                                            text="Education"
                                            delay={1.3}
                                            className="font-bold text-lg tracking-tight"
                                            repeat={true}
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <EducationItem
                                            degree="M.S. Human-Computer Interaction"
                                            school="Stanford University"
                                            year="2017"
                                            delay={1.4}
                                        />
                                        <EducationItem
                                            degree="B.A. Graphic Design"
                                            school="Rhode Island School of Design"
                                            year="2015"
                                            delay={1.5}
                                        />
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

function SectionTitle({ text, delay }: { text: string, delay: number }) {
    return (
        <div className="flex items-center gap-2 mb-1">
            <AnimatedText
                text={text}
                delay={delay}
                className="font-bold text-xs uppercase tracking-widest text-muted-foreground"
                repeat={true}
            />
            <motion.div
                variants={{
                    hidden: { width: 0 },
                    visible: { width: "100%", transition: { delay: delay + 0.2, duration: 0.5 } }
                }}
                className="h-[1px] bg-border/50 flex-1"
            />
        </div>
    )
}

function ContactItem({ text, delay, icon }: { text: string, delay: number, icon: React.ReactNode }) {
    return (
        <motion.div
            variants={{
                hidden: { opacity: 0, x: -10 },
                visible: { opacity: 1, x: 0, transition: { delay, duration: 0.4 } }
            }}
            className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors group p-2 rounded-lg hover:bg-muted/50 cursro-default"
        >
            <span className="text-primary/70 group-hover:scale-110 group-hover:text-primary transition-all duration-300">{icon}</span>
            <span className="text-xs font-medium">{text}</span>
        </motion.div>
    );
}

function LanguageItem({ language, level, delay, percent }: { language: string, level: string, delay: number, percent: number }) {
    return (
        <div className="space-y-1">
            <div className="flex justify-between text-[10px]">
                <span className="font-medium">{language}</span>
                <span className="text-muted-foreground">{level}</span>
            </div>
            <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                <motion.div
                    variants={{
                        hidden: { width: 0 },
                        visible: { width: `${percent}%`, transition: { delay: delay, duration: 0.8, ease: "circOut" } }
                    }}
                    className="h-full bg-primary/60 rounded-full"
                />
            </div>
        </div>
    )
}

function ExperienceItem({ role, company, date, desc, delay, logoColor }: { role: string, company: string, date: string, desc: string, delay: number, logoColor: string, logoLetter: string }) {
    return (
        <motion.div
            variants={{
                hidden: { opacity: 0, y: 10 },
                visible: { opacity: 1, y: 0, transition: { delay, duration: 0.5 } }
            }}
            className="relative pl-8 group"
        >
            {/* Timeline Dot */}
            <motion.div
                variants={{
                    hidden: { scale: 0 },
                    visible: { scale: 1, transition: { delay: delay + 0.1, type: "spring" } }
                }}
                className={`absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full border-2 border-background ${logoColor.replace('bg-', 'bg-')}`}
            />

            <div className="flex gap-4 mb-1">
                <div className="space-y-0.5 w-full">
                    <div className="flex justify-between items-start w-full">
                        <div>
                            <div className="font-bold text-sm text-foreground block">{role}</div>
                            <div className="text-xs text-primary font-medium block">{company}</div>
                        </div>
                        <div className="text-[10px] text-muted-foreground bg-secondary px-2 py-0.5 rounded-full font-mono">{date}</div>
                    </div>
                </div>
            </div>
            <p className="text-muted-foreground block text-xs leading-relaxed">{desc}</p>
        </motion.div>
    );
}

function EducationItem({ degree, school, year, delay }: { degree: string, school: string, year: string, delay: number }) {
    return (
        <motion.div
            variants={{
                hidden: { opacity: 0, scale: 0.95 },
                visible: { opacity: 1, scale: 1, transition: { delay, duration: 0.4 } }
            }}
            whileHover={{ y: -2, borderColor: "hsl(var(--primary) / 0.3)" }}
            className="bg-secondary/20 p-3 rounded-lg border border-border/50 transition-colors"
        >
            <div className="font-bold text-xs text-foreground mb-0.5">{degree}</div>
            <div className="text-[10px] text-muted-foreground flex justify-between">
                <span>{school}</span>
                <span className="font-mono text-primary/80">{year}</span>
            </div>
        </motion.div>
    )
}
