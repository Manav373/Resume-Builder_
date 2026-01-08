import { Router } from "express";
import resumeRoutes from "./resumes";
import aiRoutes from "./ai";
import portfolioRoutes from "./portfolios";

const router = Router();

router.get("/health", (req, res) => {
    res.json({ status: "ok" });
});

router.use("/resumes", resumeRoutes);
router.use("/ai", aiRoutes);
router.use("/portfolios", portfolioRoutes);

export default router;
