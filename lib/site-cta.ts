/**
 * User-visible CTA copy and home-hero text defaults. URLs stay in {@link ./site-externals}.
 * Use these exports in components so tests can assert a single source of truth.
 */
export const CTA_COPY = {
  home: {
    exploreBook: "Explore the Book",
    getYourCopy: "Get your copy",
  },
  sections: {
    viewAll: "View all",
  },
  medium: {
    continueReading: "Continue reading",
  },
  hachette: {
    openOnPublisher: "Open on Hachette India →",
  },
  exploreBookPage: {
    innerMirrorBlog: "Inner Mirror Blog",
    youtubeChannel: "YouTube channel",
    footerHeadline: "Ready to explore your inner world?",
  },
  studio: {
    editContent: "Edit content",
  },
} as const;

/** Shown when Site settings → Book title is empty. */
export const DEFAULT_BOOK_TITLE = "Introspection, Your Inner Superpower Revealed" as const;

/** Shown when Site settings → Book tagline is empty. */
export const DEFAULT_BOOK_TAGLINE =
  "A guide to mastering introspection through the Inner Mirror." as const;

/** Shown when Site settings → Author name is empty. */
export const DEFAULT_AUTHOR_NAME = "Vinay Singh" as const;

export type HomeHeroCopySource = "sanity" | "fallback";

export function resolveBookTitle(fromSanity: string | null | undefined): {
  value: string;
  source: HomeHeroCopySource;
} {
  const t = typeof fromSanity === "string" ? fromSanity.trim() : "";
  if (t) return { value: t, source: "sanity" };
  return { value: DEFAULT_BOOK_TITLE, source: "fallback" };
}

export function resolveBookTagline(fromSanity: string | null | undefined): {
  value: string;
  source: HomeHeroCopySource;
} {
  const t = typeof fromSanity === "string" ? fromSanity.trim() : "";
  if (t) return { value: t, source: "sanity" };
  return { value: DEFAULT_BOOK_TAGLINE, source: "fallback" };
}

export function resolveAuthorName(fromSanity: string | null | undefined): {
  value: string;
  source: HomeHeroCopySource;
} {
  const t = typeof fromSanity === "string" ? fromSanity.trim() : "";
  if (t) return { value: t, source: "sanity" };
  return { value: DEFAULT_AUTHOR_NAME, source: "fallback" };
}

/** Split "Introspection, Your Inner Superpower Revealed" into main + subtitle lines. */
export function splitBookTitle(full: string): { main: string; subtitle: string } {
  const idx = full.indexOf(",");
  if (idx === -1) {
    return { main: full.trim(), subtitle: "" };
  }
  return {
    main: full.slice(0, idx).trim(),
    subtitle: full.slice(idx + 1).trim(),
  };
}
