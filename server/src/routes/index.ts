import { Router } from "express";
import resumeRoutes from "./resumes";
import aiRoutes from "./ai";
import portfolioRoutes from "./portfolios";

const router = Router();

import { prisma } from "../lib/prisma";

router.get("/health", async (req, res) => {
    try {
        await prisma.$queryRaw`SELECT 1`;
        res.json({ status: "ok", db: "connected", timestamp: new Date().toISOString() });
    } catch (e: any) {
        console.error("Health Check Failed:", e);
        res.status(500).json({ status: "error", db: "disconnected", error: e.message });
    }
});

router.use("/resumes", resumeRoutes);
router.use("/ai", aiRoutes);
router.use("/portfolios", portfolioRoutes);

export default router;
