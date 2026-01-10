---
description: Debug Vercel "Function Invocation Failed" errors by trapping boot crashes.
---

# Debugging Vercel Serverless Crashes

If Vercel returns `500 INTERNAL_SERVER_ERROR` with `Code: FUNCTION_INVOCATION_FAILED`, it means the server crashed before it could even start (usually due to missing dependencies).

## Step 1: Trap Boot Errors (Safe Mode)

Modify `api/index.ts` to catch the crash and print the error message.

1. Open `api/index.ts`.
2. Replace the content with this "Safe Mode" code:

```typescript
// Vercel Entry Point - Safe Mode
export default async (req, res) => {
    try {
        // Dynamic import to catch load errors
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
```

## Step 2: Redeploy and Check Error

1. Commit and push this change:
   ```bash
   git add api/index.ts
   git commit -m "Debug: Enable safe mode"
   git push origin main
   ```
2. Visit your Vercel URL (e.g., `https://your-app.vercel.app/api/health`).
3. You will now see a JSON error message telling you exactly what is missing (e.g., `Cannot find module 'compression'`).

## Step 3: Fix the Issue

If the error says "Cannot find module 'X'":

1. Open `package.json` (the root one).
2. Add the missing package to `dependencies`:
   ```json
   "dependencies": {
     "X": "^version"
   }
   ```
   (Check `server/package.json` to find the correct version if you are unsure).

## Step 4: Restore Entry Point

Once fixed, revert `api/index.ts` to the standard code:

```typescript
import app from "../server/src/index";
export default app;
```

5. Commit and push the final fix:
   ```bash
   git add .
   git commit -m "Fix: Add missing dependency and restore entry point"
   git push origin main
   ```
