import { describe, expect, it } from "vitest";

import {
  FALLBACK_MEDIUM_ARTICLE_URL,
  mediumFeedUrlFromArticleUrl,
  mediumPostIdFromInput,
  resolveFeaturedMediumArticleUrl,
} from "@/lib/medium-post-preview";
import { MEDIUM_BLOG_PROFILE_URL } from "@/lib/site-externals";

describe("Medium fallback URL (when Sanity featured article is unset)", () => {
  it("uses a stable default story URL for RSS post lookup", () => {
    expect(FALLBACK_MEDIUM_ARTICLE_URL).toBe("https://medium.com/p/4ef197334fff");
  });

  it("resolveFeaturedMediumArticleUrl falls back when Sanity value is missing or blank", () => {
    expect(resolveFeaturedMediumArticleUrl(null)).toBe(FALLBACK_MEDIUM_ARTICLE_URL);
    expect(resolveFeaturedMediumArticleUrl(undefined)).toBe(FALLBACK_MEDIUM_ARTICLE_URL);
    expect(resolveFeaturedMediumArticleUrl("")).toBe(FALLBACK_MEDIUM_ARTICLE_URL);
    expect(resolveFeaturedMediumArticleUrl("   ")).toBe(FALLBACK_MEDIUM_ARTICLE_URL);
  });

  it("resolveFeaturedMediumArticleUrl uses Sanity when non-empty after trim", () => {
    const custom = "https://medium.com/@Someone/some-post-abc123def456";
    expect(resolveFeaturedMediumArticleUrl(`  ${custom}  `)).toBe(custom);
  });

  it("derives the post id from the fallback URL for feed matching", () => {
    expect(mediumPostIdFromInput(FALLBACK_MEDIUM_ARTICLE_URL)).toBe("4ef197334fff");
  });

  it("uses the default @IntrospectionDaily RSS feed for /p/ links (no @handle in URL)", () => {
    expect(mediumFeedUrlFromArticleUrl(FALLBACK_MEDIUM_ARTICLE_URL)).toBeNull();
  });
});

describe("Medium blog profile URL (site-wide CTA / nav)", () => {
  it("keeps the Inner Mirror Medium profile as the default external blog link", () => {
    expect(MEDIUM_BLOG_PROFILE_URL).toBe("https://medium.com/@IntrospectionDaily");
  });
});
