import { describe, expect, it, vi } from "vitest";

import {
  DEFAULT_NEWSLETTER_DESCRIPTION,
  DEFAULT_NEWSLETTER_HEADLINE,
  normalizeNewsletterEmail,
  parseNewsletterEmail,
  resolveNewsletterCopy,
  subscriberDocumentId,
} from "@/lib/newsletter";
import { subscribeToNewsletter } from "@/lib/newsletter-subscribe";

describe("parseNewsletterEmail", () => {
  it("accepts valid emails and normalizes them", () => {
    expect(parseNewsletterEmail("  Reader@Example.com ")).toEqual({
      raw: "Reader@Example.com",
      normalized: "reader@example.com",
    });
  });

  it("rejects invalid emails", () => {
    expect(parseNewsletterEmail("not-an-email")).toBeNull();
    expect(parseNewsletterEmail("")).toBeNull();
  });
});

describe("subscriberDocumentId", () => {
  it("builds a stable document id from normalized email", () => {
    expect(subscriberDocumentId("reader@example.com")).toBe(
      "newsletterSubscriber.reader-example-com",
    );
  });
});

describe("resolveNewsletterCopy", () => {
  it("uses Sanity copy when provided", () => {
    expect(
      resolveNewsletterCopy({
        newsletterHeadline: "Custom headline",
        newsletterDescription: "Custom description",
      }),
    ).toMatchObject({
      headline: "Custom headline",
      description: "Custom description",
    });
  });

  it("falls back to defaults when Sanity fields are empty", () => {
    expect(resolveNewsletterCopy(null)).toMatchObject({
      headline: DEFAULT_NEWSLETTER_HEADLINE,
      description: DEFAULT_NEWSLETTER_DESCRIPTION,
    });
  });
});

describe("subscribeToNewsletter", () => {
  it("returns invalid_email for bad input", async () => {
    expect(await subscribeToNewsletter("bad", "home")).toEqual({
      ok: false,
      code: "invalid_email",
    });
  });

  it("creates a new subscriber", async () => {
    const persist = vi.fn().mockResolvedValue(undefined);
    const fetchExisting = vi.fn().mockResolvedValue(null);

    const result = await subscribeToNewsletter("reader@example.com", "home", {
      fetchExisting,
      persist,
    });

    expect(result).toEqual({ ok: true, status: "created" });
    expect(persist).toHaveBeenCalledOnce();
    expect(normalizeNewsletterEmail("reader@example.com")).toBe("reader@example.com");
  });

  it("detects an already active subscriber", async () => {
    const result = await subscribeToNewsletter("reader@example.com", "footer", {
      fetchExisting: vi.fn().mockResolvedValue({ _id: "sub-1", status: "active" }),
      persist: vi.fn(),
    });

    expect(result).toEqual({ ok: true, status: "already_subscribed" });
  });

  it("reactivates an unsubscribed address", async () => {
    const persist = vi.fn().mockResolvedValue(undefined);

    const result = await subscribeToNewsletter("reader@example.com", "home", {
      fetchExisting: vi.fn().mockResolvedValue({ _id: "sub-1", status: "unsubscribed" }),
      persist,
    });

    expect(result).toEqual({ ok: true, status: "resubscribed" });
    expect(persist).toHaveBeenCalledOnce();
  });
});
