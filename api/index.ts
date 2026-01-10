// Vercel Entry Point - Safe Mode
// We use dynamic imports to catch initialization errors (like missing modules)
// and print them to the screen instead of crashing with 500.

export default async (req, res) => {
    try {
        const app = (await import("../server/src/index")).default;
        app(req, res);
    } catch (error) {
        console.error("Critical Boot Error:", error);
        res.status(500).json({
            error: "Server Failed to Start",
            details: error.message,
            stack: error.stack,
            hint: "Check server logs for 'Cannot find module' or other startup errors."
        });
    }
};
