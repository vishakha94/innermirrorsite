import type { SanityImageSource } from "@sanity/image-url";

export type BookNewsMainImage = {
  asset?: { _ref: string };
  alt?: string;
};

export type BookNewsStaticImage = {
  src: string;
  alt: string;
};

export type BookNewsItem = {
  _id: string;
  slug: string;
  title: string;
  publishedAt: string;
  excerpt?: string;
  body?: unknown;
  mainImage?: BookNewsMainImage | null;
  defaultImage?: BookNewsStaticImage;
  /** Extra full-width photos on the detail page (code defaults or Sanity). */
  defaultGalleryImages?: BookNewsStaticImage[];
};

type DefaultBookNewsEntry = BookNewsItem & {
  defaultImage: BookNewsStaticImage;
};

/** Default book news posts — image paths and copy live in the codebase. */
export const DEFAULT_BOOK_NEWS_ENTRIES = [
  {
    _id: "default-news-book-event-w-contributors",
    slug: "book-event-w-contributors",
    title:
      'With Key Contributors of the Book on the Book Launch of "Introspection: Your Inner Superpower Revealed"',
    excerpt:
      "Celebrating the book launch with contributors who helped bring Introspection to readers.",
    publishedAt: "2026-04-23T12:00:00.000Z",
    defaultImage: {
      src: "/images/news/book-event-w-contributors.png",
      alt: "Author and key contributors holding copies of Introspection at the book launch",
    },
  },
  {
    _id: "default-news-book-event-vinay-singh-w-anchor",
    slug: "book-event-vinay-singh-w-anchor",
    title: 'Speaking about "Introspection: Your Inner Superpower Revealed"',
    excerpt:
      "Vinay Singh in conversation about the book, introspection, and the Inner Mirror approach.",
    publishedAt: "2026-04-23T12:00:00.000Z",
    defaultImage: {
      src: "/images/news/book-event-vinay-singh-w-anchor.png",
      alt: "Vinay Singh speaking with an anchor about Introspection",
    },
  },
  {
    _id: "default-news-seminar-medanta",
    slug: "seminar-medanta",
    title: "Inner Mirror Event for Doctors and Nursing staff in Medanta Hospital",
    excerpt:
      'One hour workshop on "Living stress-free and productive life with Introspection".',
    publishedAt: "2026-05-08T12:00:00.000Z",
    defaultImage: {
      src: "/images/news/seminar-medanta-1.png",
      alt: "Workshop on work-life harmony and stress-free living at Medanta Hospital",
    },
    defaultGalleryImages: [
      {
        src: "/images/news/seminar-medanta-2.png",
        alt: "Vinay Singh leading the Inner Mirror workshop with Medanta doctors and nursing staff",
      },
    ],
  },
] as const satisfies readonly DefaultBookNewsEntry[];

export const DEFAULT_BOOK_NEWS_SLUGS = DEFAULT_BOOK_NEWS_ENTRIES.map((entry) => entry.slug);

export function resolveBookNewsItems(
  fromSanity: BookNewsItem[] | null | undefined,
): BookNewsItem[] {
  const bySlug = new Map<string, BookNewsItem>(
    DEFAULT_BOOK_NEWS_ENTRIES.map((entry) => [entry.slug, { ...entry }]),
  );

  for (const item of fromSanity ?? []) {
    const slug = item.slug?.trim();
    if (!slug) continue;

    const fallback = bySlug.get(slug);
    bySlug.set(slug, {
      ...fallback,
      ...item,
      _id: item._id || fallback?._id || `news-${slug}`,
      defaultImage: fallback?.defaultImage ?? item.defaultImage,
      defaultGalleryImages:
        item.defaultGalleryImages?.length
          ? item.defaultGalleryImages
          : fallback?.defaultGalleryImages,
    });
  }

  return [...bySlug.values()].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );
}

export function getBookNewsItemBySlug(
  slug: string,
  fromSanity: BookNewsItem[] | null | undefined,
  detail?: BookNewsItem | null,
): BookNewsItem | null {
  const item = resolveBookNewsItems(fromSanity).find((entry) => entry.slug === slug) ?? null;
  if (!item) return null;
  if (detail) {
    return {
      ...item,
      ...detail,
      defaultImage: item.defaultImage ?? detail.defaultImage,
      defaultGalleryImages: detail.defaultGalleryImages?.length
        ? detail.defaultGalleryImages
        : item.defaultGalleryImages,
    };
  }
  return item;
}

export function bookNewsImageSource(
  item: BookNewsItem,
): { kind: "sanity"; source: SanityImageSource; alt: string } | { kind: "static"; src: string; alt: string } | null {
  if (item.mainImage?.asset?._ref) {
    return {
      kind: "sanity",
      source: item.mainImage as SanityImageSource,
      alt: item.mainImage.alt ?? item.title,
    };
  }
  if (item.defaultImage?.src) {
    return {
      kind: "static",
      src: item.defaultImage.src,
      alt: item.defaultImage.alt,
    };
  }
  return null;
}
