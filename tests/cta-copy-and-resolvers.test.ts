import { describe, expect, it } from "vitest";

import {
  CTA_COPY,
  DEFAULT_AUTHOR_NAME,
  DEFAULT_BOOK_TAGLINE,
  DEFAULT_BOOK_TITLE,
  resolveAuthorName,
  resolveBookTagline,
  resolveBookTitle,
  splitBookTitle,
} from "@/lib/site-cta";

describe("CTA_COPY", () => {
  it("lists every primary CTA string (single source of truth for UI tests)", () => {
    expect(CTA_COPY.home.exploreBook).toBe("Explore the Book");
    expect(CTA_COPY.home.getYourCopy).toBe("Get your copy");
    expect(CTA_COPY.sections.viewAll).toBe("View all");
    expect(CTA_COPY.medium.continueReading).toBe("Continue reading");
    expect(CTA_COPY.hachette.openOnPublisher).toBe("Open on Hachette India →");
    expect(CTA_COPY.exploreBookPage.innerMirrorBlog).toBe("Inner Mirror Blog");
    expect(CTA_COPY.exploreBookPage.youtubeChannel).toBe("YouTube channel");
    expect(CTA_COPY.exploreBookPage.footerHeadline).toBe("Ready to explore your inner world?");
    expect(CTA_COPY.studio.editContent).toBe("Edit content");
  });
});

describe("resolveBookTitle / tagline / author (Sanity vs fallback)", () => {
  it("uses Sanity when non-empty after trim", () => {
    expect(resolveBookTitle("  My Book Title  ")).toEqual({
      value: "My Book Title",
      source: "sanity",
    });
    expect(resolveBookTagline("  Tag here  ")).toEqual({
      value: "Tag here",
      source: "sanity",
    });
    expect(resolveAuthorName("  Ada Lovelace  ")).toEqual({
      value: "Ada Lovelace",
      source: "sanity",
    });
  });

  it("falls back when missing or whitespace-only", () => {
    expect(resolveBookTitle(null)).toEqual({
      value: DEFAULT_BOOK_TITLE,
      source: "fallback",
    });
    expect(resolveBookTitle(undefined)).toEqual({
      value: DEFAULT_BOOK_TITLE,
      source: "fallback",
    });
    expect(resolveBookTitle("   ")).toEqual({
      value: DEFAULT_BOOK_TITLE,
      source: "fallback",
    });

    expect(resolveBookTagline("")).toEqual({
      value: DEFAULT_BOOK_TAGLINE,
      source: "fallback",
    });
    expect(resolveAuthorName("")).toEqual({
      value: DEFAULT_AUTHOR_NAME,
      source: "fallback",
    });
  });
});

describe("splitBookTitle", () => {
  it("splits on first comma for default book title shape", () => {
    expect(splitBookTitle(DEFAULT_BOOK_TITLE)).toEqual({
      main: "Introspection",
      subtitle: "Your Inner Superpower Revealed",
    });
  });

  it("returns single main when no comma", () => {
    expect(splitBookTitle("Short Title")).toEqual({ main: "Short Title", subtitle: "" });
  });
});
