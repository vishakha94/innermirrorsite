import { describe, expect, it } from "vitest";

import {
  DEFAULT_BOOK_NEWS_ENTRIES,
  DEFAULT_BOOK_NEWS_SLUGS,
  getBookNewsItemBySlug,
  resolveBookNewsItems,
} from "@/lib/book-news";

describe("resolveBookNewsItems", () => {
  it("includes all default event posts when Sanity is empty", () => {
    const items = resolveBookNewsItems([]);
    expect(items).toHaveLength(3);
    expect(items.map((item) => item.slug)).toEqual([
      "seminar-medanta",
      "book-event-w-contributors",
      "book-event-vinay-singh-w-anchor",
    ]);
  });

  it("merges Sanity overrides by slug while keeping default images", () => {
    const items = resolveBookNewsItems([
      {
        _id: "cms-1",
        slug: "seminar-medanta",
        title: "Updated Medanta headline",
        publishedAt: "2026-01-01T00:00:00.000Z",
        excerpt: "CMS excerpt",
      },
    ]);

    const medanta = items.find((item) => item.slug === "seminar-medanta");
    expect(medanta?.title).toBe("Updated Medanta headline");
    expect(medanta?.defaultImage?.src).toBe("/images/news/seminar-medanta-1.png");
  });
});

describe("getBookNewsItemBySlug", () => {
  it("returns a default post by slug", () => {
    const item = getBookNewsItemBySlug("book-event-w-contributors", null);
    expect(item?.title).toContain("Key Contributors");
    expect(item?.defaultImage?.src).toContain("book-event-w-contributors");
  });

  it("includes gallery images for seminar-medanta", () => {
    const item = getBookNewsItemBySlug("seminar-medanta", null);
    expect(item?.defaultGalleryImages).toHaveLength(1);
    expect(item?.defaultGalleryImages?.[0]?.src).toBe("/images/news/seminar-medanta-2.png");
  });
});

describe("DEFAULT_BOOK_NEWS_ENTRIES", () => {
  it("defines stable slugs for static generation", () => {
    expect(DEFAULT_BOOK_NEWS_SLUGS).toEqual(
      DEFAULT_BOOK_NEWS_ENTRIES.map((entry) => entry.slug),
    );
  });
});
