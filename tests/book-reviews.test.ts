import { describe, expect, it } from "vitest";

import {
  DEFAULT_BOOK_REVIEW_ENTRIES,
  DEFAULT_BOOK_REVIEW_SLUGS,
  resolveBookReviewItems,
  resolveBookReviewsSectionHeadline,
} from "@/lib/book-reviews";
import { CTA_COPY } from "@/lib/site-cta";

describe("resolveBookReviewItems", () => {
  it("includes the default Deified review when Sanity is empty", () => {
    const items = resolveBookReviewItems([]);
    expect(items).toHaveLength(1);
    expect(items[0]?.slug).toBe("deified-publications");
    expect(items[0]?.sourceName).toBe("Deified Publications");
    expect(items[0]?.rating).toBe(4.3);
    expect(items[0]?.reviewUrl).toContain("deifiedpublications.com");
  });

  it("merges Sanity overrides by slug while keeping default fallbacks", () => {
    const items = resolveBookReviewItems([
      {
        _id: "cms-1",
        slug: "deified-publications",
        quote: "Updated quote from CMS.",
        sourceName: "Deified Publications",
        reviewUrl: "https://example.com/review",
        rating: 4.5,
      },
    ]);

    expect(items).toHaveLength(1);
    expect(items[0]?.quote).toBe("Updated quote from CMS.");
    expect(items[0]?.rating).toBe(4.5);
    expect(items[0]?.reviewUrl).toBe("https://example.com/review");
    expect(items[0]?.reviewerName).toBe("Priya Srivastava");
  });

  it("adds new Sanity reviews not in defaults", () => {
    const items = resolveBookReviewItems([
      {
        _id: "cms-2",
        slug: "amazon-review",
        quote: "A clear and practical workbook.",
        sourceName: "Amazon",
        reviewUrl: "https://amazon.in/review/123",
        publishedAt: "2026-06-01T12:00:00.000Z",
      },
    ]);

    expect(items).toHaveLength(2);
    expect(items.map((item) => item.slug)).toEqual(["amazon-review", "deified-publications"]);
  });
});

describe("resolveBookReviewsSectionHeadline", () => {
  it("uses the default headline when Sanity is empty", () => {
    expect(resolveBookReviewsSectionHeadline(null)).toBe(CTA_COPY.sections.bookReviews);
  });

  it("uses a custom headline from Sanity when provided", () => {
    expect(resolveBookReviewsSectionHeadline("  Praise for the book  ")).toBe("Praise for the book");
  });
});

describe("DEFAULT_BOOK_REVIEW_ENTRIES", () => {
  it("defines stable slugs for CMS merge", () => {
    expect(DEFAULT_BOOK_REVIEW_SLUGS).toEqual(
      DEFAULT_BOOK_REVIEW_ENTRIES.map((entry) => entry.slug),
    );
  });
});
