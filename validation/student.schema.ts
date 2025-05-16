import { z } from "zod";

export const studentSchema = z.object({
  first_name: z.string().min(1, "Ismni kiriting"),
  last_name: z.string().min(1, "Familiyani kiriting"),
  phone: z.string().min(1, "Telefon raqamni kiriting"),
  group: z.string().min(1, "Guruh tanlanmagan"),
});

export type StudentInput = z.infer<typeof studentSchema>;
