import { requiredTextSchema } from "@/app/lib/zod";
import { z } from "zod";

export const profileSchema = z.object({
  displayName: requiredTextSchema("Enter a display name")
    .pipe(z.string().min(3, "Display name must be at least 3 characters")
    .max(50, "Display name must be at most 50 characters")),
});

export type ProfileSchema = z.infer<typeof profileSchema>;
