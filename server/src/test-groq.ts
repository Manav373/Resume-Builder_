import dotenv from "dotenv";
dotenv.config();
import Groq from "groq-sdk";

async function main() {
    console.log("Checking environment...");
    const apiKey = process.env.GROQ_API_KEY;
    console.log("API Key length:", apiKey ? apiKey.length : "Missing");
    console.log("API Key start:", apiKey ? apiKey.substring(0, 7) : "N/A");

    if (!apiKey) {
        console.error("GROQ_API_KEY is missing!");
        process.exit(1);
    }

    const groq = new Groq({ apiKey });

    try {
        console.log("Attempting completion...");
        const completion = await groq.chat.completions.create({
            messages: [{ role: "user", content: "Say hello" }],
            model: "llama-3.1-8b-instant",
        });
        console.log("Success:", completion.choices[0]?.message?.content);
    } catch (error: any) {
        console.error("Error:", error.message);
        if (error.error) console.error("Error Details:", error.error);
    }
}

main();
