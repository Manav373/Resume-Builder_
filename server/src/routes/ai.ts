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
      You are an elite creative developer known for winning Awwwards. Generate a "Bento-Style", high-end, single-file HTML5 personal portfolio website using TailwindCSS (via CDN) based on the following resume data.

      Resume Data:
      ${JSON.stringify(resumeData)}

      
      Design Requirements:
      1. **Theme & Vibe**: 
         - **Dark Mode Only**: Use \`bg-slate-950\` as the base.
         - **Palette**: Use a primary accent of Neon Violet (\`violet-500\`) mixed with Cyan (\`cyan-400\`) for gradients.
         - **Glassmorphism**: Heavy use of \`backdrop-blur-2xl\`, \`bg-white/5\`, and \`border-white/10\`.
         - **Mesh Gradients**: Create fixed background blobs using large blurred divs with absolute positioning to create a mood.

      2. **Layout Structure (Bento Grid)**:
         - **Hero**: Minimalist, large typography, "scramble text" effect on hover for the name.
         - **Grid System**: The main content (About, Experience, Projects) should be a CSS Grid (Bento Box style).
         - **Cards**: Each section is a rounded card (\`rounded-3xl\`) with a \`hover:scale-[1.02]\` and glow effect.

      3. **Specific Sections**:
         - **Hero Section**: Huge Name, animated typing text for roles, and a "magnetic" CTA button.
         - **Tech Stack**: Infinite scrolling marquee of skills.
         - **Experience**: Use a "step-by-step" vertical styling inside a card.
         - **Projects**: A grid of cards. logical inference for image placeholders (use realistic unsplash keywords).
         - **Contact**: A glass card with large clickable email/social links.

      4. **Animations & Interactivity**:
         - **AOS**: Use \`data-aos="fade-up"\` with staggered delays.
         - **Custom Cursor**: A small circle that follows the mouse (implement with vanilla JS script at the bottom).
         - **Scroll Progress**: A thin gradient bar at the top fixed to scroll position.
         - **Hover Effects**: All cards must have distinct hover states (border lighting up, slight lift).

      5. **Content**:
         - **NO LOREM IPSUM**. You must generate realistic, high-quality professional text everywhere.
         - Infer missing details to make the user look like a top 1% expert.

      Technical Constraints:
      - Valid HTML5.
      - Tailwind CSS (CDN).
      - FontAwesome (CDN).
      - AOS Library (CDN).
      - Google Fonts (Space Grotesk for headers, Inter for body).
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
