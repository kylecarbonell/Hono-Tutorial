import { z } from "zod";

export const zUser = z.object({
  name: z.string(),
  email: z.string(),
});

export const zUpdateUser = z.object({
  oldName: z.string().nonempty(),
  oldEmail: z.string().nonempty(),
  name: z.string(),
  email: z.string(),
});
