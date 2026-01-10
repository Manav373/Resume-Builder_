import { z } from "zod";

// Resume Schema
// Using loose validation to allow saving drafts.
export const resumeSchema = z.object({
    title: z.string().min(1, "Title is required"),
    // templateId: z.string().default("modern-sidebar"), // Client specific? Server can store it in content or top level if added to schema.
    // For now, server stores 'content' as Json, so specific fields inside content aren't strictly validated by this top-level schema unless we want to.
    // However, the previous server schema validated strictly. Let's keep it strict but flexible for drafts.
    personalInfo: z.object({
        fullName: z.string().optional(),
        email: z.string().email().optional().or(z.literal("")),
        phone: z.string().optional().or(z.literal("")),
        location: z.string().optional().or(z.literal("")),
        website: z.string().optional().or(z.literal("")),
        linkedin: z.string().optional().or(z.literal("")),
        twitter: z.string().optional().or(z.literal("")),
        github: z.string().optional().or(z.literal("")),
        instagram: z.string().optional().or(z.literal("")),
        photoUrl: z.string().optional().or(z.literal("")),
    }).optional(),
    summary: z.string().optional().or(z.literal("")),
    experience: z.array(z.object({
        id: z.string().optional(),
        company: z.string().optional().or(z.literal("")),
        position: z.string().optional().or(z.literal("")),
        startDate: z.string().optional().or(z.literal("")),
        endDate: z.string().optional().or(z.literal("")),
        current: z.boolean().optional(),
        location: z.string().optional().or(z.literal("")),
        description: z.string().optional().or(z.literal("")),
    })).default([]),
    education: z.array(z.object({
        id: z.string().optional(),
        school: z.string().optional().or(z.literal("")),
        degree: z.string().optional().or(z.literal("")),
        startDate: z.string().optional().or(z.literal("")),
        endDate: z.string().optional().or(z.literal("")),
        description: z.string().optional().or(z.literal("")),
    })).default([]),
    skills: z.array(z.string()).default([]),
    certifications: z.array(z.object({
        id: z.string().optional(),
        name: z.string().optional().or(z.literal("")),
        issuer: z.string().optional().or(z.literal("")),
        date: z.string().optional().or(z.literal("")),
        link: z.string().optional().or(z.literal("")),
    })).default([]),
    projects: z.array(z.object({
        id: z.string().optional(),
        name: z.string().optional().or(z.literal("")),
        description: z.string().optional().or(z.literal("")),
        link: z.string().optional().or(z.literal("")),
        technologies: z.array(z.string()).default([]),
        startDate: z.string().optional().or(z.literal("")),
        endDate: z.string().optional().or(z.literal("")),
    })).default([]),
    // Allow extra fields to flow into 'content' if needed, or stick to this.
});

// Portfolio Schema
export const createPortfolioSchema = z.object({
    userId: z.string(),
    title: z.string().min(1, "Title is required"),
    content: z.record(z.string(), z.any()),
});
