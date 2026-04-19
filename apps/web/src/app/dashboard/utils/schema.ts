import { z } from "zod";

export const jobPostSchema = z.object({
  role: z.string().min(1, "Enter a role or job title"),
  linkToPost: z.union([z.url(), z.literal("")]),
  companyId: z.string().nullable(),
  sourceId: z.string().nullable(),
  statusId: z.coerce.number(),
  appliedOn: z.string().optional(),
  repliedOn: z.string().optional(),
});

export type JobPost = z.infer<typeof jobPostSchema>;
