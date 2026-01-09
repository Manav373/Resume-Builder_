import { Router } from "express";
import { prisma } from "../lib/prisma"; // Assuming prisma client export location, will verify
import { z } from "zod";

const router = Router();

// Schema for creating a portfolio
const createPortfolioSchema = z.object({
    userId: z.string(),
    title: z.string().min(1, "Title is required"),
    content: z.record(z.string(), z.any()), // Assuming content is a JSON object with html, etc.
});

// GET /api/portfolios - List all portfolios for a user
router.get("/", async (req, res) => {
    try {
        const userId = req.query.userId as string;

        if (!userId) {
            return res.status(400).json({ error: "userId query parameter is required" });
        }

        const portfolios = await prisma.portfolio.findMany({
            where: { userId },
            orderBy: { updatedAt: "desc" },
            select: {
                id: true,
                title: true,
                updatedAt: true,
                createdAt: true,
                userId: true,
                // content: false // Exclude heavy content
            }
        });

        res.json(portfolios);
    } catch (error) {
        console.error("Error fetching portfolios:", error);
        res.status(500).json({ error: "Failed to fetch portfolios" });
    }
});

// GET /api/portfolios/:id - Get a single portfolio
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const portfolio = await prisma.portfolio.findUnique({
            where: { id },
        });

        if (!portfolio) {
            return res.status(404).json({ error: "Portfolio not found" });
        }

        res.json(portfolio);
    } catch (error) {
        console.error("Error fetching portfolio:", error);
        res.status(500).json({ error: "Failed to fetch portfolio" });
    }
});

// POST /api/portfolios - Create a new portfolio
router.post("/", async (req, res) => {
    try {
        const { userId, title, content } = createPortfolioSchema.parse(req.body);

        const portfolio = await prisma.portfolio.create({
            data: {
                userId,
                title,
                content,
            },
        });

        res.status(201).json(portfolio);
    } catch (error: any) {
        console.error("Error creating portfolio:", error);
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: error.issues });
        }
        res.status(500).json({ error: "Failed to create portfolio" });
    }
});

// DELETE /api/portfolios/:id - Delete a portfolio
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.portfolio.delete({
            where: { id },
        });
        res.json({ message: "Portfolio deleted successfully" });
    } catch (error: any) {
        console.error("Error deleting portfolio:", error);
        // P2025: Record to delete does not exist.
        if (error.code === 'P2025') {
            return res.status(404).json({ error: "Portfolio not found or already deleted" });
        }
        res.status(500).json({ error: "Failed to delete portfolio" });
    }
});

// PATCH /api/portfolios/:id - Update a portfolio
router.patch("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { title } = req.body;

        if (!title || typeof title !== 'string' || title.trim().length === 0) {
            return res.status(400).json({ error: "Title is required" });
        }

        const portfolio = await prisma.portfolio.update({
            where: { id },
            data: { title: title.trim() },
        });

        res.json(portfolio);
    } catch (error: any) {
        console.error("Error updating portfolio:", error);
        // P2025: Record to update does not exist.
        if (error.code === 'P2025') {
            return res.status(404).json({ error: "Portfolio not found" });
        }
        res.status(500).json({ error: "Failed to update portfolio" });
    }
});

export default router;
