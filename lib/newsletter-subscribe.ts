import {
  parseNewsletterEmail,
  subscriberDocumentId,
  type NewsletterSignupSource,
} from "@/lib/newsletter";
import { getSanityWriteClient } from "@/sanity/lib/write-client";

export type SubscribeNewsletterResult =
  | { ok: true; status: "created" | "already_subscribed" | "resubscribed" }
  | { ok: false; code: "invalid_email" | "not_configured" | "storage_error" };

type ExistingSubscriber = {
  _id: string;
  status?: string | null;
} | null;

async function defaultFetchExisting(normalizedEmail: string): Promise<ExistingSubscriber> {
  const client = getSanityWriteClient();
  if (!client) return null;
  return client.fetch<ExistingSubscriber>(
    `*[_type == "newsletterSubscriber" && emailNormalized == $email][0]{ _id, status }`,
    { email: normalizedEmail },
  );
}

async function defaultPersist(input: {
  documentId: string;
  email: string;
  emailNormalized: string;
  source: NewsletterSignupSource;
  existing: ExistingSubscriber;
}): Promise<void> {
  const client = getSanityWriteClient();
  if (!client) {
    throw new Error("Sanity write client not configured");
  }

  const subscribedAt = new Date().toISOString();

  if (input.existing) {
    await client
      .patch(input.existing._id)
      .set({
        status: "active",
        subscribedAt,
        source: input.source,
        email: input.email,
      })
      .commit();
    return;
  }

  await client.createIfNotExists({
    _id: input.documentId,
    _type: "newsletterSubscriber",
    email: input.email,
    emailNormalized: input.emailNormalized,
    subscribedAt,
    source: input.source,
    status: "active",
  });
}

export async function subscribeToNewsletter(
  rawEmail: string,
  source: NewsletterSignupSource,
  options?: {
    fetchExisting?: (normalizedEmail: string) => Promise<ExistingSubscriber>;
    persist?: (input: {
      documentId: string;
      email: string;
      emailNormalized: string;
      source: NewsletterSignupSource;
      existing: ExistingSubscriber;
    }) => Promise<void>;
  },
): Promise<SubscribeNewsletterResult> {
  const parsed = parseNewsletterEmail(rawEmail);
  if (!parsed) {
    return { ok: false, code: "invalid_email" };
  }

  if (!options?.persist && !getSanityWriteClient()) {
    return { ok: false, code: "not_configured" };
  }

  const fetchExisting = options?.fetchExisting ?? defaultFetchExisting;
  const persist = options?.persist ?? defaultPersist;

  try {
    const existing = await fetchExisting(parsed.normalized);

    if (existing?.status === "active") {
      return { ok: true, status: "already_subscribed" };
    }

    await persist({
      documentId: subscriberDocumentId(parsed.normalized),
      email: parsed.raw,
      emailNormalized: parsed.normalized,
      source,
      existing,
    });

    if (existing) {
      return { ok: true, status: "resubscribed" };
    }

    return { ok: true, status: "created" };
  } catch {
    if (!getSanityWriteClient() && !options?.persist) {
      return { ok: false, code: "not_configured" };
    }
    return { ok: false, code: "storage_error" };
  }
}
