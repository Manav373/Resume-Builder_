import { PrismaClient } from "@prisma/client";
import { withAccelerate } from '@prisma/extension-accelerate'

// @ts-ignore
const prisma = new PrismaClient().$extends(withAccelerate())

export { prisma };
