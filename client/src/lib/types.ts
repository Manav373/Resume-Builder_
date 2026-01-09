import { z } from "zod";

export const resumeSchema = z.object({
    title: z.string().min(1, "Title is required"),
    templateId: z.string().default("modern-sidebar"),
    personalInfo: z.object({
        fullName: z.string().optional(), // Allow saving without name initially
        email: z.string().email("Invalid email").optional().or(z.literal("")),
        phone: z.string().optional(),
        website: z.string().url("Invalid URL").optional().or(z.literal("")),
        linkedin: z.string().optional(),
        twitter: z.string().optional(),
        github: z.string().optional(),
        instagram: z.string().optional(),
        location: z.string().optional(),
        photoUrl: z.string().optional(),
    }),
    summary: z.string().optional(),
    experience: z.array(
        z.object({
            id: z.string(),
            company: z.string().optional(),
            position: z.string().optional(),
            startDate: z.string().optional().or(z.literal("")),
            endDate: z.string().optional().or(z.literal("")),
            current: z.boolean().default(false),
            location: z.string().optional(),
            description: z.string().optional().or(z.literal("")),
        })
    ).default([]),
    education: z.array(
        z.object({
            id: z.string(),
            school: z.string().optional(),
            degree: z.string().optional(),
            startDate: z.string().optional().or(z.literal("")),
            endDate: z.string().optional().or(z.literal("")),
            description: z.string().optional().or(z.literal("")),
        })
    ).default([]),
    certifications: z.array(
        z.object({
            id: z.string(),
            name: z.string().optional(),
            issuer: z.string().optional(),
            date: z.string().optional().or(z.literal("")),
            link: z.string().optional().or(z.literal("")),
        })
    ).default([]),
    projects: z.array(
        z.object({
            id: z.string(),
            name: z.string().optional(),
            description: z.string().optional().or(z.literal("")),
            link: z.string().optional().or(z.literal("")),
            technologies: z.array(z.string()).default([]),
            startDate: z.string().optional().or(z.literal("")),
            endDate: z.string().optional().or(z.literal("")),
        })
    ).default([]),
    skills: z.array(z.string()).default([]),
});

export type ResumeData = z.infer<typeof resumeSchema>;
