/** Inner Mirror blog (Medium) — fallback when not overridden in CMS or env. */
export const MEDIUM_BLOG_PROFILE_URL = "https://medium.com/@IntrospectionDaily" as const;

/** Hachette India catalog page for this title (announcement / listing). */
export const HACHETTE_INDIA_BOOK_LISTING_URL =
  "https://www.hachetteindia.com/Home/bookdetails/Info/9789357315180/introspection-your-inner-superpower-revealed-%E2%80%93-a-workbook-for-enhancing-yourself" as const;

/** Amazon.in paperback — same ASIN as long storefront URLs (`…/dp/9357315187/…`). */
export const AMAZON_IN_BOOK_PURCHASE_URL =
  "https://www.amazon.in/dp/9357315187" as const;

/**
 * “Get the Book” hero CTA: Sanity Site settings → `NEXT_PUBLIC_AMAZON_BOOK_PURCHASE_URL` → {@link AMAZON_IN_BOOK_PURCHASE_URL}.
 */
export function resolveAmazonBookPurchaseUrl(
  fromSanity: string | null | undefined,
): string {
  const s = typeof fromSanity === "string" ? fromSanity.trim() : "";
  if (s) return s;
  const e = process.env.NEXT_PUBLIC_AMAZON_BOOK_PURCHASE_URL?.trim();
  if (e) return e;
  return AMAZON_IN_BOOK_PURCHASE_URL;
}

/** YouTube channel — fallback after Sanity Site settings and `NEXT_PUBLIC_SOCIAL_YOUTUBE_URL`. */
export const DEFAULT_YOUTUBE_CHANNEL_URL =
  "https://www.youtube.com/@IntrospectionDaily" as const;

/** Resolve YouTube: Sanity → env → {@link DEFAULT_YOUTUBE_CHANNEL_URL}. */
export function resolveYoutubeUrl(fromSanity: string | null | undefined): string {
  const s = typeof fromSanity === "string" ? fromSanity.trim() : "";
  if (s) return s;
  const e = process.env.NEXT_PUBLIC_SOCIAL_YOUTUBE_URL?.trim();
  if (e) return e;
  return DEFAULT_YOUTUBE_CHANNEL_URL;
}
