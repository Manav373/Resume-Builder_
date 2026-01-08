import dotenv from "dotenv";
dotenv.config();
console.log("Dotenv loaded");

import { PrismaClient } from "@prisma/client";
console.log("Prisma Client imported");

try {
    const prisma = new PrismaClient();
    console.log("Prisma Client instantiated");
} catch (e) {
    console.error("Prisma Error", e);
}
