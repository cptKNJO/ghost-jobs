import * as z from "zod";

z.config({
  customError: (iss) => {
    // 1. Missing values (Empty fields)
    if (iss.code === "invalid_type") {
      if (iss.received === "undefined" || iss.received === "null") {
        return "Enter the required information.";
      }
    }

    // 2. Specific field length requirements (too_small)
    if (iss.code === "too_small") {
      if (iss.type === "string") {
        // If it's a 'required' field triggered by .min(1)
        if (iss.minimum === 1) return "Enter an answer.";
      }
      if (iss.type === "number")
        return `Enter a number that is ${iss.minimum} or more.`;
      return `Entered value must be ${iss.minimum} characters or more.`;
    }

    // 3. Selection components (Select / Enum)
    // if (iss.code === "invalid_enum_value") {
    //   return "Select an option from the list.";
    // }

    // 4. Formatting errors (URL / Email)
    // if (iss.code === "invalid_string") {
    //   if (iss.validation === "url") {
    //     return "Enter a link in the correct format, like https://www.example.com";
    //   }
    //   if (iss.validation === "email") {
    //     return "Enter an email address in the correct format, like name@example.com";
    //   }
    // }

    // Default fallback (Simple and direct)
    return "Check this answer.";
  },
});

// Custom Zod schemas
export const idFromFormSchema = z
  .string()
  .check(z.trim())
  .transform((s) => (s === "" ? null : Number(s)))
  .pipe(z.union([z.null(), z.number()]));

export const requiredTextSchema = (error = "Enter the required information") =>
  z
    .string()
    .transform((s) => s.trim())
    .refine((s) => s.length > 0, { error });

export const idSchema = z.coerce.number().int().positive();
