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

export const parcours = defineCollection({
    loader: glob({ pattern: 'src/data/parcours/*.yml' }),
    schema: z.object({
        title: z.string(),
        items: z.array(z.object({
            name: z.string(),
            period: z.string(),
            establishment: z.string(),
            location: z.string(),
            description: z.string(),
            tags: z.array(z.object({
                name: z.string(),
                color: z.string(),
            }))
        })),
    }),
});

export const collections = {
    blog,
    parcours,
};
