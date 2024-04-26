import { z } from "zod";

export const usernameValidation = z
  .string()
  .min(3, { message: "Username must be at least 3 characters long" })
  .max(20, { message: "Username must be at most 20 characters long" })
  .regex(/^[a-zA-Z0-9_]*$/, {
    message: "Username must only contain letters, numbers, and underscores",
  });

export const singupschema = z.object({
  username: usernameValidation,
  email: z.string().email({ message: "Please provide a valid email" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" }),
});
