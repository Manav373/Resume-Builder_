import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import compression from "compression";

import routes from "./routes";

const app = express();
app.use(compression());
const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: "*", // simpler for dev
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json({ limit: "50mb" }));

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
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Failed to start server:", error);
    }
};

// Only start the server if this file is run directly (not imported)
// @ts-ignore
if (import.meta.url === `file://${process.argv[1]}`) {
    startServer();
} else if (require.main === module) {
    // Fallback for CommonJS if type="module" isn't fully enforced or mixed
    startServer();
}

export default app;

// Force restart for env vars
