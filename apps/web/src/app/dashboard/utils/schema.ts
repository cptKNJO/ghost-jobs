import { idFromFormSchema, requiredTextSchema } from "@/app/lib/zod";
import { z } from "zod";

export const jobPostSchema = z.object({
  // TODO: Also create a custom schema that cleans before accepting strings like role
  role: requiredTextSchema("Enter a role or job title"),
  linkToPost: z.union([z.url(), z.literal("")]),
  companyId: idFromFormSchema,
  sourceId: idFromFormSchema,
  statusId: idFromFormSchema,
  appliedOn: z.string().optional(),
  repliedOn: z.string().optional(),
});

export type JobPost = z.infer<typeof jobPostSchema>;
