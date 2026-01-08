import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";

import routes from "./routes";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: "*", // simpler for dev
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());

app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

app.get("/", (req, res) => {
    res.send("API is running...");
});

app.use("/api", routes);


// Global error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error("Unhandled Server Error:", err);
    res.status(500).json({ error: "Internal Server Error", details: err.message });
});

const startServer = async () => {
    try {
        if (require.main === module) {
            app.listen(PORT, () => {
                console.log(`Server is running on port ${PORT}`);
            });
        }
    } catch (error) {
        console.error("Failed to start server:", error);
    }
};

startServer();

export default app;
