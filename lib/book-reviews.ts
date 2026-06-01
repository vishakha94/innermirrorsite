import { CTA_COPY } from "@/lib/site-cta";

export type BookReviewItem = {
  _id: string;
  slug: string;
  quote: string;
  sourceName: string;
  reviewUrl: string;
  rating?: number;
  reviewerName?: string;
  publishedAt?: string;
};

type DefaultBookReviewEntry = BookReviewItem;

/** Default book reviews — Sanity documents with matching slugs override these fields. */
export const DEFAULT_BOOK_REVIEW_ENTRIES = [
  {
    _id: "default-review-deified-publications",
    slug: "deified-publications",
    quote:
      "Vinay Singh repeatedly asks readers to shift their attention inward. Not for self criticism. Not for guilt. But for understanding.",
    sourceName: "Deified Publications",
    rating: 4.3,
    reviewUrl:
      "https://deifiedpublications.com/introspection-book-review-a-workbook-that-asks-hard-questions/",
    publishedAt: "2026-05-29T12:00:00.000Z",
    reviewerName: "Priya Srivastava",
  },
] as const satisfies readonly DefaultBookReviewEntry[];

export const DEFAULT_BOOK_REVIEW_SLUGS = DEFAULT_BOOK_REVIEW_ENTRIES.map((entry) => entry.slug);

function normalizeRating(value: unknown): number | undefined {
  if (typeof value !== "number" || Number.isNaN(value)) return undefined;
  const clamped = Math.min(5, Math.max(0, value));
  return Math.round(clamped * 10) / 10;
}

function normalizeReview(entry: Partial<BookReviewItem>): BookReviewItem | null {
  const quote = typeof entry.quote === "string" ? entry.quote.trim() : "";
  const sourceName = typeof entry.sourceName === "string" ? entry.sourceName.trim() : "";
  const reviewUrl = typeof entry.reviewUrl === "string" ? entry.reviewUrl.trim() : "";
  const slug = typeof entry.slug === "string" ? entry.slug.trim() : "";

  if (!quote || !sourceName || !reviewUrl || !slug) return null;

  const reviewerName =
    typeof entry.reviewerName === "string" ? entry.reviewerName.trim() : "";

  return {
    _id: entry._id || `review-${slug}`,
    slug,
    quote,
    sourceName,
    reviewUrl,
    ...(normalizeRating(entry.rating) != null ? { rating: normalizeRating(entry.rating) } : {}),
    ...(reviewerName ? { reviewerName } : {}),
    ...(entry.publishedAt ? { publishedAt: entry.publishedAt } : {}),
  };
}

export function resolveBookReviewItems(
  fromSanity: BookReviewItem[] | null | undefined,
): BookReviewItem[] {
  const bySlug = new Map<string, BookReviewItem>(
    DEFAULT_BOOK_REVIEW_ENTRIES.map((entry) => [entry.slug, { ...entry }]),
  );

  for (const item of fromSanity ?? []) {
    const slug = item.slug?.trim();
    if (!slug) continue;

    const fallback = bySlug.get(slug);
    const merged = normalizeReview({ ...fallback, ...item, slug });
    if (merged) bySlug.set(slug, merged);
  }

  return [...bySlug.values()].sort((a, b) => {
    const aTime = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
    const bTime = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
    return bTime - aTime;
  });
}

export function resolveBookReviewsSectionHeadline(
  fromSanity: string | null | undefined,
): string {
  const headline = typeof fromSanity === "string" ? fromSanity.trim() : "";
  return headline || CTA_COPY.sections.bookReviews;
}
