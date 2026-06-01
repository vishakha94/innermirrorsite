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

type BeehiivSubscribeStatus = "created" | "already_subscribed";

function getBeehiivConfig(): { apiKey: string; publicationId: string } | null {
  const apiKey = process.env.BEEHIIV_API_KEY?.trim();
  const publicationId = process.env.BEEHIIV_PUBLICATION_ID?.trim();
  if (!apiKey || !publicationId) return null;
  return { apiKey, publicationId };
}

async function subscribeWithBeehiiv(
  email: string,
  source: NewsletterSignupSource,
): Promise<BeehiivSubscribeStatus> {
  const config = getBeehiivConfig();
  if (!config) {
    throw new Error("Beehiiv not configured");
  }

  const response = await fetch(
    `https://api.beehiiv.com/v2/publications/${config.publicationId}/subscriptions`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        reactivate_existing: true,
        send_welcome_email: true,
        utm_source: source,
      }),
    },
  );

  if (response.ok) {
    return "created";
  }

  let message = "";
  try {
    const payload = (await response.json()) as { errors?: Array<{ message?: string }> };
    message = payload.errors?.map((e) => e.message ?? "").join(" ").toLowerCase() ?? "";
  } catch {
    message = "";
  }

  if (response.status === 409 || message.includes("already")) {
    return "already_subscribed";
  }

  throw new Error("Beehiiv subscribe failed");
}

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
    subscribeViaBeehiiv?: (
      email: string,
      source: NewsletterSignupSource,
    ) => Promise<BeehiivSubscribeStatus>;
  },
): Promise<SubscribeNewsletterResult> {
  const parsed = parseNewsletterEmail(rawEmail);
  if (!parsed) {
    return { ok: false, code: "invalid_email" };
  }

  const beehiivSubscribe = options?.subscribeViaBeehiiv ?? subscribeWithBeehiiv;
  const useBeehiiv = options?.subscribeViaBeehiiv != null || getBeehiivConfig() != null;

  if (useBeehiiv) {
    try {
      const status = await beehiivSubscribe(parsed.raw, source);
      return {
        ok: true,
        status: status === "already_subscribed" ? "already_subscribed" : "created",
      };
    } catch {
      return { ok: false, code: "storage_error" };
    }
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
