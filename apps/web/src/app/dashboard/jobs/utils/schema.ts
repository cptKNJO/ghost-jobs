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

export const companySchema = z.object({
  name: requiredTextSchema("Enter a company name"),
});

export const sourceSchema = z.object({
  name: requiredTextSchema("Enter a source name"),
  url: z.url("Enter a valid URL"),
});

export type JobPost = z.infer<typeof jobPostSchema>;
export type CompanySchema = z.infer<typeof companySchema>;
export type SourceSchema = z.infer<typeof sourceSchema>;
