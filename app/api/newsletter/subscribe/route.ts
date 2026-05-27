import { NextResponse } from "next/server";

import { newsletterSuccessMessage } from "@/lib/newsletter";
import { subscribeToNewsletter } from "@/lib/newsletter-subscribe";
import { CTA_COPY } from "@/lib/site-cta";

type SubscribeBody = {
  email?: unknown;
  source?: unknown;
  website?: unknown;
};

function errorMessage(code: "invalid_email" | "not_configured" | "storage_error"): string {
  switch (code) {
    case "invalid_email":
      return CTA_COPY.newsletter.invalidEmail;
    case "not_configured":
      return CTA_COPY.newsletter.notConfigured;
    default:
      return CTA_COPY.newsletter.error;
  }
}

export async function POST(request: Request) {
  let body: SubscribeBody;
  try {
    body = (await request.json()) as SubscribeBody;
  } catch {
    return NextResponse.json(
      { ok: false, message: CTA_COPY.newsletter.invalidEmail },
      { status: 400 },
    );
  }

  if (typeof body.website === "string" && body.website.trim()) {
    return NextResponse.json({
      ok: true,
      message: CTA_COPY.newsletter.success,
    });
  }

  const email = typeof body.email === "string" ? body.email : "";
  const source = body.source === "footer" ? "footer" : "home";

  const result = await subscribeToNewsletter(email, source);

  if (!result.ok) {
    const status =
      result.code === "not_configured" ? 503 : result.code === "invalid_email" ? 400 : 500;
    return NextResponse.json(
      { ok: false, message: errorMessage(result.code) },
      { status },
    );
  }

  return NextResponse.json({
    ok: true,
    message: newsletterSuccessMessage(result.status),
  });
}
