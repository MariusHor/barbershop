import { env } from "@/env";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { emailFormSchema } from "@/utils/schemas";
import { createTransport } from "nodemailer";

export const transporter = createTransport({
  service: "gmail",
  auth: {
    user: env.GMAIL_USER,
    pass: env.GMAIL_APP_PASSWORD,
  },
});

export const emailRouter = createTRPCRouter({
  send: publicProcedure.input(emailFormSchema).mutation(async ({ input }) => {
    await transporter.sendMail({
      from: `"${input.email}" <${env.GMAIL_USER}>`,
      sender: env.GMAIL_USER,
      replyTo: {
        name: input.name,
        address: input.email,
      },
      to: {
        name: env.GMAIL_TO_NAME,
        address: env.GMAIL_TO_EMAIL,
      },
      subject: `Mesaj nou de la ${input.name}`,
      text: `
        Nume: ${input.name}
        Email: ${input.email}
        Mesaj: ${input.message}
      `,
      html: `
        <p><strong>Nume:</strong> ${input.name}</p>
        <p><strong>Email:</strong> ${input.email}</p>
        <p>${input.message}</p>
      `,
    });

    return { success: true };
  }),
});
