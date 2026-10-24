// app/actions/sendEmail.ts
"use server";

import { Resend } from "resend";

export interface EmailData {
    email?: string | null;
    message: string;
    subject: string;
}
export async function sendEmail(emailData:EmailData) {
  try {
    const apiKey = process.env.NEXT_PUBLIC_RESEND_API_KEY || "re_mock_key_for_testing";
    const resend = new Resend(apiKey);


     if(!emailData.email){
        throw new Error("Email address is required to send email")
     }

    const { data, error } = await resend.emails.send({
      from: "info@luxelynetransfers.co.uk", // must be verified in Resend
      to:emailData.email, // your receiving address
      subject:emailData.subject,
      html:emailData.message,
    });

    if (error) throw error;

    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
