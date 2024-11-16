import { z } from "zod";

export const emailFormSchema = z.object({
  name: z.string().min(1, "Numele este obligatoriu"),
  email: z.string().email("Adresa de email este obligatorie"),
  message: z.string().min(1, "Mesajul este obligatoriu"),
});
