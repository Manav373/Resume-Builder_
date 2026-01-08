"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "next-themes";

export const ParticlesBackground = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { resolvedTheme } = useTheme();

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let particles: Particle[] = [];
        let animationFrameId: number;

        const resizeCanvas = () => {
            // Handle High DPI Displays
            const dpr = window.devicePixelRatio || 1;
            canvas.width = window.innerWidth * dpr;
            canvas.height = window.innerHeight * dpr;
            canvas.style.width = `${window.innerWidth}px`;
            canvas.style.height = `${window.innerHeight}px`;
            ctx.scale(dpr, dpr);

            initParticles();
        };

        class Particle {
            x: number;
            y: number;
            vx: number = 0;
            vy: number = 0;
            size: number;
            color: string;
            speed: number;
            trail: { x: number; y: number; alpha: number }[];
            trailLength: number;

            constructor() {
                this.x = Math.random() * window.innerWidth;
                this.y = Math.random() * window.innerHeight;
                this.y = Math.random() * window.innerHeight;

                // Color Logic based on Theme
                // Color Logic based on Theme
                // Actually, 'theme' string "dark", "light", "system". 
                // We'll rely on the class presence logic if possible, or just the string.
                // Note: 'theme' might be 'system' which is hard to detect here without window matchMedia check.
                // Simplification for now: check if we are in 'light' mode explicitly.

                // Tech colors for Dark Mode: Neon Cyan, Violet, Electric Blue
                const darkColors = ["#22d3ee", "#a78bfa", "#60a5fa"];
                // Tech colors for Light Mode: Blue-600, Purple-600, Sky-600 (Darker for contrast)
                const lightColors = ["#2563eb", "#7c3aed", "#0284c7"];

                const isLight = resolvedTheme === "light";

                const colors = isLight ? lightColors : darkColors;
                this.color = colors[Math.floor(Math.random() * colors.length)];

                this.size = Math.random() * 1.5 + 1; // Slightly larger for visibility
                this.speed = Math.random() * 1.5 + 0.8; // Faster, snappier
                this.trail = [];
                this.trailLength = 20;

                this.setRandomDirection();
            }

            setRandomDirection() {
                const direction = Math.floor(Math.random() * 4);
                switch (direction) {
                    case 0: // Right
                        this.vx = this.speed;
                        this.vy = 0;
                        break;
                    case 1: // Left
                        this.vx = -this.speed;
                        this.vy = 0;
                        break;
                    case 2: // Down
                        this.vx = 0;
                        this.vy = this.speed;
                        break;
                    case 3: // Up
                        this.vx = 0;
                        this.vy = -this.speed;
                        break;
                }
            }

            update() {
                // Add position to trail with opacity 1
                this.trail.push({ x: this.x, y: this.y, alpha: 1.0 });
                if (this.trail.length > this.trailLength) {
                    this.trail.shift();
                }

                // Decay trail alpha
                this.trail.forEach(t => t.alpha *= 0.9);

                this.x += this.vx;
                this.y += this.vy;

                // Smart turning - turn more often when near hypothetical grid intersections?
                // Just random for now, but slightly more frequent
                if (Math.random() < 0.02) {
                    this.setRandomDirection();
                }

                // Wrap
                if (this.x < 0) this.x = window.innerWidth;
                if (this.x > window.innerWidth) this.x = 0;
                if (this.y < 0) this.y = window.innerHeight;
                if (this.y > window.innerHeight) this.y = 0;
            }

            draw() {
                if (!ctx) return;

                // Glow Effect
                ctx.shadowBlur = 8;
                ctx.shadowColor = this.color;

                // Draw Head
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.fill();

                // Draw Trail - smooth curve or connected lines?
                // Connected lines for "circuit" feel
                ctx.shadowBlur = 0; // Disable shadow for trail to save perf

                if (this.trail.length > 1) {
                    ctx.lineWidth = this.size * 0.5;
                    // Draw segments so we can vary opacity
                    for (let i = 0; i < this.trail.length - 1; i++) {
                        const point = this.trail[i];
                        const nextPoint = this.trail[i + 1];

                        // Distance check to avoid drawing lines across screen on wrap
                        if (Math.abs(point.x - nextPoint.x) > 50 || Math.abs(point.y - nextPoint.y) > 50) continue;

                        ctx.beginPath();
                        ctx.moveTo(point.x, point.y);
                        ctx.lineTo(nextPoint.x, nextPoint.y);
                        ctx.strokeStyle = this.color;
                        ctx.globalAlpha = point.alpha * 0.4;
                        ctx.stroke();
                    }
                    ctx.globalAlpha = 1.0;
                }
            }
        }

        const initParticles = () => {
            particles = [];
            const particleCount = Math.min(window.innerWidth * 0.06, 50);
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        };

        const drawGrid = () => {
            const gridSize = 60;
            const isLight = resolvedTheme === "light";

            ctx.lineWidth = 1;
            ctx.strokeStyle = isLight ? "rgba(0, 0, 0, 0.05)" : "rgba(255, 255, 255, 0.02)";

            for (let x = 0; x < window.innerWidth; x += gridSize) {
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, window.innerHeight);
                ctx.stroke();
            }
            for (let y = 0; y < window.innerHeight; y += gridSize) {
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(window.innerWidth, y);
                ctx.stroke();
            }
        }

        const animate = () => {
            if (!ctx || !canvas) return;
            ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

            // Draw faint background grid
            drawGrid();

            particles.forEach((particle) => {
                particle.update();
                particle.draw();
            });

            animationFrameId = requestAnimationFrame(animate);
        };

        window.addEventListener("resize", resizeCanvas);
        resizeCanvas();
        animate();

        return () => {
            window.removeEventListener("resize", resizeCanvas);
            cancelAnimationFrame(animationFrameId);
        };
    }, [resolvedTheme]); // Re-run when theme changes

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 z-0 bg-transparent"
            style={{ width: "100%", height: "100%" }}
        />
    );
};
