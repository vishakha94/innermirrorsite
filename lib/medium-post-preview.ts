/** Default publication RSS when the article URL has no `@handle` (e.g. only `/p/{id}`). */
const DEFAULT_MEDIUM_FEED = "https://medium.com/feed/@IntrospectionDaily";

/** Used when Site settings “Featured Medium article” is empty. */
export const FALLBACK_MEDIUM_ARTICLE_URL = "https://medium.com/p/4ef197334fff";

/**
 * Story URL from Sanity when set; otherwise {@link FALLBACK_MEDIUM_ARTICLE_URL} for RSS lookup.
 */
export function resolveFeaturedMediumArticleUrl(
  articleUrl: string | null | undefined,
): string {
  return articleUrl?.trim() || FALLBACK_MEDIUM_ARTICLE_URL;
}

/**
 * Derive `https://medium.com/feed/@handle` from a story URL, or null to use the default feed.
 */
export function mediumFeedUrlFromArticleUrl(articleUrl: string): string | null {
  const m = articleUrl.trim().match(/medium\.com\/@([^/]+)/i);
  if (m?.[1]) return `https://medium.com/feed/@${m[1]}`;
  return null;
}

/**
 * Extract 12-char Medium post id from a pasted URL (or raw id).
 */
export function mediumPostIdFromInput(input: string | null | undefined): string | null {
  if (!input?.trim()) return null;
  const s = input.trim();
  const fromP = s.match(/\/p\/([a-f0-9]{12})(?:\?|$|\/)/i);
  if (fromP?.[1]) return fromP[1].toLowerCase();
  const fromTail = s.match(/-([a-f0-9]{12})(?:\?|$)/i);
  if (fromTail?.[1]) return fromTail[1].toLowerCase();
  if (/^[a-f0-9]{12}$/i.test(s)) return s.toLowerCase();
  return null;
}

function decodeBasicEntities(s: string): string {
  return s
    .replace(/&nbsp;/g, "\u00a0")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/gi, "'")
    .replace(/&mdash;/g, "\u2014")
    .replace(/&hellip;/g, "\u2026");
}

/** Turn Medium RSS HTML into readable plain text (no `dangerouslySetInnerHTML`). */
export function htmlToPlainText(html: string): string {
  let t = html.replace(/\r/g, "");
  t = t.replace(/<\/(p|div|h[1-6]|blockquote)>/gi, "\n\n");
  t = t.replace(/<br\s*\/?>/gi, "\n");
  t = t.replace(/<li>/gi, "• ");
  t = t.replace(/<\/li>/gi, "\n");
  t = t.replace(/<[^>]+>/g, "");
  t = decodeBasicEntities(t);
  t = t.replace(/\u00a0/g, " ");
  t = t.replace(/\n{3,}/g, "\n\n");
  return t.trim();
}

export type MediumPostPreview = {
  title: string;
  link: string;
  pubDate: string;
  author: string;
  excerptText: string;
};

/**
 * Loads one post from a public Medium RSS feed (item `<guid>` contains `/p/{postId}`).
 * Revalidates hourly so the home page stays fresh without hitting Medium on every request.
 */
export async function fetchMediumPostById(
  postId: string,
  feedUrl: string = DEFAULT_MEDIUM_FEED,
): Promise<MediumPostPreview | null> {
  try {
    const res = await fetch(feedUrl, {
      next: { revalidate: 3600 },
      headers: { "User-Agent": "InnerMirrorSite/1.0 (featured preview)" },
    });
    if (!res.ok) return null;
    const xml = await res.text();
    const blocks = xml.split("<item>");
    for (let i = 1; i < blocks.length; i++) {
      const block = blocks[i].split("</item>")[0];
      const guid = block.match(/<guid[^>]*>([^<]+)<\/guid>/)?.[1] ?? "";
      if (!guid.includes(`/p/${postId}`)) continue;

      const title =
        block.match(/<title><!\[CDATA\[([\s\S]*?)\]\]><\/title>/)?.[1]?.trim() ?? "";
      const linkRaw = block.match(/<link>([^<]+)<\/link>/)?.[1]?.trim() ?? "";
      const link = linkRaw.split("?")[0] || linkRaw;
      const author =
        block.match(/<dc:creator><!\[CDATA\[([\s\S]*?)\]\]><\/dc:creator>/)?.[1]?.trim() ??
        "";
      const pubDate = block.match(/<pubDate>([^<]+)<\/pubDate>/)?.[1]?.trim() ?? "";
      const html =
        block.match(
          /<content:encoded><!\[CDATA\[([\s\S]*?)\]\]><\/content:encoded>/,
        )?.[1] ?? "";
      const excerptText = htmlToPlainText(html);
      if (!title || !link) return null;
      return { title, link, pubDate, author, excerptText };
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Featured Medium preview: Site settings URL when set, otherwise {@link FALLBACK_MEDIUM_ARTICLE_URL}.
 * Returns null only if the feed cannot be loaded or the post is missing from RSS.
 */
export async function fetchMediumFeaturedFromSanity(
  articleUrl: string | null | undefined,
): Promise<MediumPostPreview | null> {
  const resolved = resolveFeaturedMediumArticleUrl(articleUrl);
  const postId = mediumPostIdFromInput(resolved);
  if (!postId) return null;
  const feed = mediumFeedUrlFromArticleUrl(resolved) ?? DEFAULT_MEDIUM_FEED;
  return fetchMediumPostById(postId, feed);
}
