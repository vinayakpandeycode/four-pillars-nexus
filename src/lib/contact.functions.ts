import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const contactSchema = z.object({
  fullName: z.string().trim().min(2, "Please enter your full name.").max(100),
  businessEmail: z.string().trim().email("Please enter a valid business email.").max(255),
  company: z.string().trim().max(150).optional().default(""),
  phone: z.string().trim().max(40).optional().default(""),
  country: z.string().trim().max(100).optional().default(""),
  serviceRequired: z.string().trim().max(100).optional().default(""),
  message: z.string().trim().min(10, "Please share a little more about your requirement.").max(2000),
});

export const submitContactEnquiry = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => contactSchema.parse(input))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("contact_enquiries").insert({
      full_name: data.fullName,
      business_email: data.businessEmail,
      company: data.company || null,
      phone: data.phone || null,
      country: data.country || null,
      service_required: data.serviceRequired || null,
      message: data.message,
    });
    if (error) {
      console.error("Contact enquiry insert failed", error.message);
      throw new Error("We couldn't send your enquiry. Please email info@pillars.co.");
    }

    const lovableKey = process.env["LOVABLE_API_KEY"];
    const resendKey = process.env["RESEND_API_KEY"];
    if (!lovableKey || !resendKey) {
      console.error("Contact notification credentials are unavailable");
      throw new Error("Your enquiry was saved, but the notification could not be sent. Please email info@pillars.co.");
    }

    const emailResponse = await fetch("https://connector-gateway.lovable.dev/resend/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${lovableKey}`,
        "X-Connection-Api-Key": resendKey,
      },
      body: JSON.stringify({
        from: "Four Pillars Website <website@pillars.co>",
        to: ["info@pillars.co"],
        reply_to: data.businessEmail,
        subject: `New website enquiry from ${data.fullName}`,
        text: `Name: ${data.fullName}\nEmail: ${data.businessEmail}\nCompany: ${data.company || "Not provided"}\nPhone: ${data.phone || "Not provided"}\nCountry: ${data.country || "Not provided"}\nService: ${data.serviceRequired || "Not provided"}\n\nMessage:\n${data.message}`,
      }),
    });
    if (!emailResponse.ok) {
      const detail = await emailResponse.text();
      console.error(`Contact notification failed [${emailResponse.status}]: ${detail}`);
      throw new Error("Your enquiry was saved, but the notification could not be sent. Please email info@pillars.co.");
    }

    return { ok: true };
  });
