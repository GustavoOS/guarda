import z from "zod";

export const pointSchema = z.object({
  type: z.literal("Point").nonoptional(),
  coordinates: z.tuple([z.number(), z.number()]).nonoptional(),
});
