import { z } from "zod";

export const signUpSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export const logInSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

// export const updateUserSchema = z.object({
//   name: z.string().min(2, "Name must be at least 2 characters long").optional(),
//   email: z.string().email("Invalid email").optional(),
//   password: z.string().min(6, "Password must be at least 6 characters long").optional(),
// });

export const transferSchema = z.object({
  toAccountId: z.string().min(1, "Recipient account ID is required"),
  amount: z.number().min(1, "Amount must be at least 1"),
});
