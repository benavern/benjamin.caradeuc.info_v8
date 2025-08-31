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
  }),
});

export const collections = { blog };
