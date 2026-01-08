import { Router } from "express";
import Groq from "groq-sdk";
import { z } from "zod";

const router = Router();
const getGroqClient = () => {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
        console.warn("GROQ_API_KEY is not set. AI generation will fail.");
        return null;
    }
    return new Groq({ apiKey });
};

const generateSchema = z.object({
    jobTitle: z.string(),
    currentSkills: z.array(z.string()).optional(),
});

router.post("/generate", async (req, res) => {
    try {
        console.log(`[AI] Generating content for: ${req.body.jobTitle}`);
        console.log("[AI] Key check:", process.env.GROQ_API_KEY ? "Present" : "Missing");
        const { jobTitle, currentSkills } = generateSchema.parse(req.body);

        const prompt = `You are an expert resume writer. Generate a professional summary and a list of 5 key skills for a "${jobTitle}".
    ${currentSkills?.length ? `The candidate already has these skills: ${currentSkills.join(", ")}.` : ""}
    Return JSON format: { "summary": "string", "skills": ["string"] }`;

        const groq = getGroqClient();
        if (!groq) {
            throw new Error("AI Service is not configured (missing API Key)");
        }

        const completion = await groq.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: process.env.GROQ_MODEL || "llama-3.1-8b-instant", // Default to fastest model
            response_format: { type: "json_object" },
        });

        const content = completion.choices[0]?.message?.content;
        if (!content) throw new Error("No content generated");

        res.json(JSON.parse(content));
    } catch (error: any) {
        console.error("AI Generation Error:", error);

        let errorMessage = "Failed to generate content";

        if (error?.error?.code === "invalid_api_key") {
            errorMessage = "Invalid GROQ_API_KEY. Please check your server .env file.";
        } else if (error?.message) {
            errorMessage = error.message;
        }

        // Return the actual error to the client so the user knows why it failed
        res.status(500).json({
            error: errorMessage,
            details: "Real AI Generation Failed. See server logs."
        });
    }
});

const portfolioSchema = z.object({
    resumeData: z.any(),
});

router.post("/generate-portfolio", async (req, res) => {
    try {
        console.log("[AI] Generating portfolio website");
        const { resumeData } = portfolioSchema.parse(req.body);

        const prompt = `
      You are an elite web designer and developer. Generate a stunning, high-end, single-file HTML5 personal portfolio website using TailwindCSS (via CDN) based on the following resume data.

      Resume Data:
      ${JSON.stringify(resumeData)}

      
      Design Requirements:
      1. **COMPLETENESS**: The portfolio must be FULLY POPULATED. 
         - **NO PLACEHOLDERS**. Do not use "Lorem Ipsum" or "Insert Text Here". 
         - If specific details are missing in the Resume Data, **creatively infer** realistic, impressive details based on the user's role and skills.
         - The content must be lengthy, professional, and convincing.
      
      2. **Aesthetics & UI**: 
         - Use a "Premium Dark Mode" (slate-900 or zinc-950 base) with vibrant neon gradients (violet/blue/cyan) for text and borders.
         - **Glassmorphism**: Extensive use of bg-white/5 or bg-black/40 with backdrop-blur-xl for cards, navbars, and modal backgrounds.
         
      3. **Structure & Sections** (Must include ALL of these):
         - **Hero Section**: Full-height, with a dramatic headline, typing animation for roles, and a "Hire Me" CTA.
         - **About Me**: A detailed professional bio (inferred from summary).
         - **Skills Cloud**: Visually striking tags or animated progress bards.
         - **Experience Timeline**: A vertical, connected timeline of roles with detailed bullet points.
         - **Project Gallery**: A grid of cards with hover effects (zoom/glow). infer 3-4 realistic projects if none are listed.
         - **Services/What I Do**: (Infer based on role) e.g., "Web Development", "UI Design", "Consulting".
         - **Testimonials**: Generate 2-3 realistic, positive testimonials from "Previous Clients" or "Managers".
         - **Contact Section**: A functional-looking form and large social icons.
      
      4. **Animations**: 
         - Use AOS (Animate On Scroll) heavily.
         - \`data-aos="fade-up"\` for cards, \`data-aos="zoom-in"\` for badges.
         - Smooth scrolling for navigation links.

      Technical Constraints:
      - Valid HTML5.
      - Tailwind CSS (CDN).
      - Google Fonts (Outfit/Inter).
      - FontAwesome (CDN).
      - AOS Library (CDN).
      - **NO MARKDOWN**. Return ONLY the raw HTML string.
    `;

        const groq = getGroqClient();
        if (!groq) {
            throw new Error("AI Service is not configured (missing API Key)");
        }

        const completion = await groq.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: process.env.GROQ_MODEL || "llama-3.3-70b-versatile",
        });

        let content = completion.choices[0]?.message?.content;
        if (!content) throw new Error("No content generated");

        // Cleanup: Remove markdown code blocks if the AI includes them despite instructions
        content = content.replace(/```html/g, "").replace(/```/g, "");

        res.json({ html: content });
    } catch (error: any) {
        console.error("AI Portfolio Generation Error:", error);
        res.status(500).json({
            error: error.message || "Failed to generate portfolio",
        });
    }
});

export default router;
