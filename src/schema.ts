
import { z } from "zod";

export const userSchema = z.object({
  name: z.string().trim().min(3, "Minimum 3 characters"),

  email: z.string().trim().email("Invalid email"),

  phone: z.string().trim().min(6, "Invalid phone number"),

  image: z.string().url("Invalid image URL"),

  status: z.boolean(),
});

export const validateUser = (values: any) => {
  const result = userSchema.safeParse(values);
  const errors: any = {};

  if (!result.success) {
    result.error.issues.forEach((issue) => {
      errors[issue.path[0]] = issue.message;
    });
  }

  return errors;
};
