import { CTA_COPY } from "@/lib/site-cta";

export type NewsletterSignupSource = "home" | "footer";

export type ParsedEmail = {
  raw: string;
  normalized: string;
};

export type NewsletterCopy = {
  headline: string;
  description: string;
  privacyNote: string;
};

export const DEFAULT_NEWSLETTER_HEADLINE = "Stay in the loop" as const;

export const DEFAULT_NEWSLETTER_DESCRIPTION =
  "Join the mailing list for occasional updates on the book launch, news, videos, and articles." as const;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function normalizeNewsletterEmail(raw: string): string {
  return raw.trim().toLowerCase();
}

export function parseNewsletterEmail(raw: string): ParsedEmail | null {
  const trimmed = raw.trim();
  if (!trimmed || trimmed.length > 254) return null;

  const normalized = normalizeNewsletterEmail(trimmed);
  if (!EMAIL_PATTERN.test(normalized)) return null;

  return { raw: trimmed, normalized };
}

export function subscriberDocumentId(normalizedEmail: string): string {
  const slug = normalizedEmail.replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-");
  return `newsletterSubscriber.${slug}`;
}

export function resolveNewsletterCopy(fromSanity: {
  newsletterHeadline?: string | null;
  newsletterDescription?: string | null;
} | null | undefined): NewsletterCopy {
  const headline =
    typeof fromSanity?.newsletterHeadline === "string"
      ? fromSanity.newsletterHeadline.trim()
      : "";
  const description =
    typeof fromSanity?.newsletterDescription === "string"
      ? fromSanity.newsletterDescription.trim()
      : "";

  return {
    headline: headline || DEFAULT_NEWSLETTER_HEADLINE,
    description: description || DEFAULT_NEWSLETTER_DESCRIPTION,
    privacyNote: CTA_COPY.newsletter.privacyNote,
  };
}

export function newsletterSuccessMessage(
  status: "created" | "already_subscribed" | "resubscribed",
): string {
  switch (status) {
    case "already_subscribed":
      return CTA_COPY.newsletter.alreadySubscribed;
    case "resubscribed":
      return CTA_COPY.newsletter.resubscribed;
    default:
      return CTA_COPY.newsletter.success;
  }
}
