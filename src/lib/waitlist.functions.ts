import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const signupSchema = z.object({
  email: z.string().trim().toLowerCase().email().max(320),
  phone: z.string().trim().min(6).max(32),
});

const AIRTABLE_SURVEY_URL = "https://airtable.com/appe9w5tQ1qXh9bY7/pagMfKSyqm7bHo0CX/form";
const FROM_NAME = "Picky";
const FROM_EMAIL = "trypickyy@gmail.com";

function buildWelcomeEmail(toEmail: string) {
  const subject = "Welcome to Picky 🎉";
  const html = `<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#faf8f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#1a1a1a;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#faf8f5;padding:40px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:24px;overflow:hidden;box-shadow:0 20px 60px -20px rgba(255,59,48,0.25);">
            <tr>
              <td style="background:linear-gradient(135deg,#ff3b30,#ffb6b9);padding:56px 32px;text-align:center;">
                <div style="display:inline-block;padding:10px 20px;border-radius:999px;background:rgba(255,255,255,0.2);color:#fff;font-size:12px;letter-spacing:2px;text-transform:uppercase;">You're in</div>
                <h1 style="margin:20px 0 0;font-size:36px;line-height:1.15;color:#fff;font-weight:700;">Welcome to Picky 🎉</h1>
              </td>
            </tr>
            <tr>
              <td style="padding:40px 40px 8px;">
                <p style="font-size:16px;line-height:1.6;margin:0 0 16px;">Thanks for joining the Picky waitlist. We're building the smartest way to find your perfect lunch — every day.</p>
                <p style="font-size:16px;line-height:1.6;margin:0 0 24px;">To secure your early-access spot, help us calibrate your personal meal filter with a quick 2-minute survey:</p>
                <div style="text-align:center;margin:28px 0 8px;">
                  <a href="${AIRTABLE_SURVEY_URL}" style="display:inline-block;background:#ff3b30;color:#ffffff;text-decoration:none;font-weight:600;font-size:15px;padding:14px 28px;border-radius:999px;box-shadow:0 10px 24px -8px rgba(255,59,48,0.55);">Take the 2-minute survey →</a>
                </div>
                <p style="font-size:13px;line-height:1.6;color:#6b6b6b;margin:24px 0 0;text-align:center;">Or paste this link into your browser:<br /><a href="${AIRTABLE_SURVEY_URL}" style="color:#ff3b30;word-break:break-all;">${AIRTABLE_SURVEY_URL}</a></p>
              </td>
            </tr>
            <tr>
              <td style="padding:32px 40px 40px;">
                <hr style="border:none;border-top:1px solid #f0ebe3;margin:0 0 20px;" />
                <p style="font-size:12px;line-height:1.6;color:#8a8a8a;margin:0;text-align:center;">You're receiving this because you joined the Picky waitlist at ${toEmail}.<br />© ${new Date().getFullYear()} Picky</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

  const text = `Welcome to Picky!

Thanks for joining the waitlist. To secure your early-access spot, take our 2-minute survey:

${AIRTABLE_SURVEY_URL}

— The Picky team`;

  // Build a base64url-encoded MIME message (multipart/alternative for HTML+text)
  const boundary = `picky_${Math.random().toString(36).slice(2)}`;
  const mime = [
    `From: ${FROM_NAME} <${FROM_EMAIL}>`,
    `To: ${toEmail}`,
    `Subject: ${subject}`,
    `MIME-Version: 1.0`,
    `Content-Type: multipart/alternative; boundary="${boundary}"`,
    ``,
    `--${boundary}`,
    `Content-Type: text/plain; charset="UTF-8"`,
    `Content-Transfer-Encoding: 7bit`,
    ``,
    text,
    ``,
    `--${boundary}`,
    `Content-Type: text/html; charset="UTF-8"`,
    `Content-Transfer-Encoding: 7bit`,
    ``,
    html,
    ``,
    `--${boundary}--`,
    ``,
  ].join("\r\n");

  const raw = Buffer.from(mime, "utf8").toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");

  return { raw };
}

async function sendWelcomeEmail(toEmail: string) {
  const lovableKey = process.env.LOVABLE_API_KEY;
  const gmailKey = process.env.GOOGLE_MAIL_API_KEY;
  if (!lovableKey || !gmailKey) {
    throw new Error("Email service is not configured");
  }
  const { raw } = buildWelcomeEmail(toEmail);
  const res = await fetch("https://connector-gateway.lovable.dev/google_mail/gmail/v1/users/me/messages/send", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${lovableKey}`,
      "X-Connection-Api-Key": gmailKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ raw }),
  });
  if (!res.ok) {
    const body = await res.text();
    console.error(`Gmail send failed [${res.status}]: ${body}`);
    throw new Error(`Gmail send failed [${res.status}]`);
  }
}

export const joinWaitlist = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => signupSchema.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // Duplicate check
    const { data: existing, error: lookupError } = await supabaseAdmin
      .from("waitlist")
      .select("id")
      .eq("email", data.email)
      .maybeSingle();
    if (lookupError) {
      console.error("Waitlist lookup failed", lookupError);
      throw new Error("Something went wrong. Please try again.");
    }
    if (existing) {
      return { ok: true, duplicate: true as const };
    }

    const { error: insertError } = await supabaseAdmin
      .from("waitlist")
      .insert({ email: data.email, phone: data.phone, source: "landing" });
    if (insertError) {
      console.error("Waitlist insert failed", insertError);
      throw new Error("Could not save your signup. Please try again.");
    }

    try {
      await sendWelcomeEmail(data.email);
      await supabaseAdmin.from("waitlist").update({ welcome_email_sent: true }).eq("email", data.email);
    } catch (err) {
      console.error("Welcome email failed", err);
      // Don't fail the signup if email sending has a hiccup.
    }

    return { ok: true, duplicate: false as const };
  });
