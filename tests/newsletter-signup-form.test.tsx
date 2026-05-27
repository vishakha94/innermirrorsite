import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { NewsletterSignupForm } from "@/components/newsletter-signup-form";
import { resolveNewsletterCopy } from "@/lib/newsletter";
import { CTA_COPY } from "@/lib/site-cta";

const copy = resolveNewsletterCopy(null);

describe("NewsletterSignupForm", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("submits a valid email and shows success", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ ok: true, message: CTA_COPY.newsletter.success }),
    });
    vi.stubGlobal("fetch", fetchMock);

    render(<NewsletterSignupForm copy={copy} source="home" />);

    fireEvent.change(screen.getByPlaceholderText(CTA_COPY.newsletter.emailPlaceholder), {
      target: { value: "reader@example.com" },
    });
    fireEvent.click(screen.getByRole("button", { name: CTA_COPY.newsletter.submit }));

    await waitFor(() => {
      expect(screen.getByRole("status")).toHaveTextContent(CTA_COPY.newsletter.success);
    });

    expect(fetchMock).toHaveBeenCalledWith(
      "/api/newsletter/subscribe",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ email: "reader@example.com", source: "home", website: "" }),
      }),
    );
  });
});
