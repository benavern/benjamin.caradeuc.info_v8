import { glob } from "astro/loaders";
import { defineCollection, z } from "astro:content";

const blog = defineCollection({
    type: "content",
    schema: z.object({
        title: z.string(),
        author: z.string().default("Benjamin Caradeuc"),
        date: z.date(),
        tags: z.array(z.string()).optional(),
        featured_image: z.string().optional(),
        thumbnail: z.string().optional(),
        excerpt: z.string().optional(),
    }),
});

const parcoursItemSchema = z.object({
    name: z.string(),
    period: z.string(),
    establishment: z.string(),
    location: z.string(),
    tags: z.array(
        z.object({
            name: z.string(),
            color: z.string(),
        })
    ),
});

const formations = defineCollection({
    loader: glob({
        pattern: 'src/data/parcours/formations/*.{md,mdx}',
        generateId: ({ entry }) => {
            const match = entry.match(/^(\d+)-/);
            return match ? match[1] : entry;
        },
    }),
    schema: parcoursItemSchema,
});

const experiences = defineCollection({
    loader: glob({
        pattern: 'src/data/parcours/experiences/*.{md,mdx}',
        generateId: ({ entry }) => {
            const match = entry.match(/^(\d+)-/);
            return match ? match[1] : entry;
        },
    }),
    schema: parcoursItemSchema,
});

export const collections = {
    blog,
    formations,
    experiences,
};
