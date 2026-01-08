"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const groq_sdk_1 = __importDefault(require("groq-sdk"));
const zod_1 = require("zod");
const router = (0, express_1.Router)();
const getGroqClient = () => {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
        console.warn("GROQ_API_KEY is not set. AI generation will fail.");
        return null;
    }
    return new groq_sdk_1.default({ apiKey });
};
const generateSchema = zod_1.z.object({
    jobTitle: zod_1.z.string(),
    currentSkills: zod_1.z.array(zod_1.z.string()).optional(),
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
        if (!content)
            throw new Error("No content generated");
        res.json(JSON.parse(content));
    }
    catch (error) {
        console.error("AI Generation Error:", error);
        let errorMessage = "Failed to generate content";
        if (error?.error?.code === "invalid_api_key") {
            errorMessage = "Invalid GROQ_API_KEY. Please check your server .env file.";
        }
        else if (error?.message) {
            errorMessage = error.message;
        }
        // Return the actual error to the client so the user knows why it failed
        res.status(500).json({
            error: errorMessage,
            details: "Real AI Generation Failed. See server logs."
        });
    }
});
exports.default = router;
