
import { motion } from "framer-motion";

export function AnimatedText({ text, delay = 0, className = "", shimmer = false, repeat = true }: { text: string, delay?: number, className?: string, shimmer?: boolean, repeat?: boolean }) {
    return (
        <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: !repeat, margin: "-10%" }}
            variants={{
                hidden: {},
                visible: {
                    transition: {
                        staggerChildren: 0.015,
                        delayChildren: delay
                    }
                }
            }}
            className={`inline-block whitespace-normal ${className}`}
        >
            <span className="sr-only">{text}</span>
            <span aria-hidden="true">
                {text.split("").map((char, i) => (
                    <motion.span
                        key={i}
                        variants={{
                            hidden: { opacity: 0, y: 5, filter: "blur(4px)" },
                            visible: { opacity: 1, y: 0, filter: "blur(0px)" }
                        }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className={`inline-block relative ${char === " " ? "w-[0.25em]" : ""}`}
                    >
                        {char === " " ? "\u00A0" : char}
                        {shimmer && (
                            <motion.span
                                initial={{ x: "-100%", opacity: 0 }}
                                animate={{ x: "100%", opacity: [0, 1, 0] }}
                                transition={{
                                    repeat: Infinity,
                                    repeatDelay: 5,
                                    duration: 1.5,
                                    ease: "linear",
                                    delay: delay + 1 + (i * 0.02)
                                }}
                                className="absolute inset-0 bg-white/20 select-none pointer-events-none mix-blend-overlay"
                            >
                                {char === " " ? "\u00A0" : char}
                            </motion.span>
                        )}
                    </motion.span>
                ))}
            </span>
        </motion.div>
    );
}
