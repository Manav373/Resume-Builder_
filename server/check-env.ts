import dotenv from "dotenv";
dotenv.config();

console.log("Checking Environment Variables...");
console.log("GROQ_API_KEY Type:", typeof process.env.GROQ_API_KEY);
console.log("GROQ_API_KEY Length:", process.env.GROQ_API_KEY?.length);
console.log("DATABASE_URL Type:", typeof process.env.DATABASE_URL);
console.log("DATABASE_URL Length:", process.env.DATABASE_URL?.length);

if (!process.env.GROQ_API_KEY) {
    console.error("❌ GROQ_API_KEY is missing!");
} else {
    console.log("✅ GROQ_API_KEY is present");
}

if (!process.env.DATABASE_URL) {
    console.error("❌ DATABASE_URL is missing!");
} else {
    console.log("✅ DATABASE_URL is present");
}
