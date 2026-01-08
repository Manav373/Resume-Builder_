import { Router } from "express";
import { prisma } from "../lib/prisma"; // Need to create this
import { z } from "zod";

const router = Router();

// Schema matching frontend types
const resumeSchema = z.object({
    title: z.string(),
    personalInfo: z.any(), // Store as JSON
    summary: z.string().optional(),
    experience: z.any(),   // Store as JSON
    education: z.any(),    // Store as JSON
    skills: z.array(z.string()),
    certifications: z.any().optional(), // Store as JSON
    projects: z.any().optional(),       // Store as JSON
});

// Create Resume
router.post("/", async (req, res) => {
    try {
        // In a real app, get userId from Auth middleware (Clerk)
        // For now, we'll use a placeholder or data from req.body if provided, 
        // but better to mock auth middleware soon.
        const userId = req.body.userId || "test-user-id";

        const data = resumeSchema.parse(req.body);

        const resume = await prisma.resume.create({
            data: {
                user: {
                    connectOrCreate: {
                        where: { id: userId },
                        create: {
                            id: userId,
                            email: "pending-email-" + userId, // Placeholder until synced
                        }
                    }
                },
                title: data.title,
                content: data as any, // Storing unstructured JSON for flexibility
            },
        });

        res.json(resume);
    } catch (error: any) {
        console.error("Resume Create Error:", error);



        res.status(500).json({ error: "Failed to create resume" });
    }
});

// Get Resumes for User
router.get("/", async (req, res) => {
    console.log("GET /api/resumes request received");
    try {
        const userId = req.query.userId as string; // Get from query param

        if (!userId) {
            console.warn("No userId provided in query");
            return res.status(400).json({ error: "userId is required" });
        }

        console.log("Fetching resumes for userId:", userId);
        const resumes = await prisma.resume.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" },
        });
        console.log(`Found ${resumes.length} resumes for user ${userId}`);
        if (resumes.length > 0) {
            console.log("Sample resume ID:", resumes[0].id);
        }
        res.json(resumes);
    } catch (error: any) {
        console.error("Failed to fetch resumes:", error);
        res.status(500).json({ error: "Failed to fetch resumes", details: error.message });
    }
});

// Delete Resume
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.query.userId as string; // Optional security check

        // In a real app, ensure the user owns the resume
        // const resume = await prisma.resume.findUnique({ where: { id } });
        // if (resume.userId !== userId) return res.status(403).send("Unauthorized");

        await prisma.resume.delete({
            where: { id },
        });

        res.json({ success: true, message: "Resume deleted successfully" });
    } catch (error: any) {
        console.error("Failed to delete resume:", error);
        // P2025: Record to delete does not exist. Treat as success so UI updates.
        if (error.code === 'P2025') {
            return res.json({ success: true, message: "Resume already deleted" });
        }
        res.status(500).json({ error: "Failed to delete resume", details: error.message });
    }
});

// Get Resume by ID
router.get("/:id", async (req, res) => {
    console.log(`GET /api/resumes/${req.params.id} request received`);
    try {
        const { id } = req.params;
        const resume = await prisma.resume.findUnique({ where: { id } });

        if (!resume) {
            console.warn(`Resume with id ${id} not found`);
            return res.status(404).json({ error: "Resume not found" });
        }

        console.log(`Resume found: ${resume.id}`);
        res.json(resume);
    } catch (error: any) {
        console.error("Failed to fetch resume:", error);
        res.status(500).json({ error: "Failed to fetch resume" });
    }
});

// Update Resume
router.put("/:id", async (req, res) => {
    console.log(`PUT /api/resumes/${req.params.id} request received`);
    try {
        const { id } = req.params;
        console.log("Body:", req.body);
        const data = resumeSchema.parse(req.body);

        const resume = await prisma.resume.update({
            where: { id },
            data: {
                title: data.title,
                content: data as any,
                updatedAt: new Date(),
            },
        });
        console.log("Resume updated:", resume.id);
        res.json(resume);
    } catch (error: any) {
        console.error("Failed to update resume:", error);
        res.status(500).json({ error: "Failed to update resume" });
    }
});



export default router;
