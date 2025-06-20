import { z } from "zod";

const hairstyleSchema = z.object({
  name: z.string(),
  value: z.string(),
  cover: z.string(),
  type: z.string().optional(),
});

const haircolorSchema = z.object({
  name: z.string(),
  value: z.string(),
  type: z.string().optional(),
  color: z.string().optional(),
  cover: z.string().optional(),
});

export const createAiHairstyleSchema = z.object({
  photo: z.instanceof(File),
  type: z.enum(["gpt-4o", "kontext"]).default("gpt-4o"),
  hairstyle: z.string().transform((value, ctx) => {
    try {
      const parsed = JSON.parse(value);
      return hairstyleSchema.array().parse(parsed); // validate against nested schema
    } catch (e) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Invalid JSON format for hairstyle",
      });
      return z.NEVER;
    }
  }),
  hair_color: z.string().transform((value, ctx) => {
    try {
      const parsed = JSON.parse(value);
      return haircolorSchema.parse(parsed); // validate against nested schema
    } catch (e) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Invalid JSON format for hair color",
      });
      return z.NEVER;
    }
  }),
  detail: z.string(),
});

export type CreateAiHairstyleDTO = z.infer<typeof createAiHairstyleSchema>;
