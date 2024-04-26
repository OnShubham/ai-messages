import { z } from "zod";

export const MessageSchema = z.object({
  content: z
    .string()
    .min(10, { message: "Message must be at least 1 characters long" })
    .max(300, { message: "Message must be at most 1000 characters long" }),
});
