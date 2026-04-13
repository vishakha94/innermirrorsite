import Link from "next/link";

import { HachetteIndiaListingPreview } from "@/components/hachette-india-listing-preview";
import { HACHETTE_INDIA_BOOK_LISTING_URL } from "@/lib/site-externals";

export type BookNewsSectionItem = {
  _id: string;
  title: string;
  slug: string;
  publishedAt: string;
};

type BookNewsSectionBodyProps = {
  items: BookNewsSectionItem[];
  /** When set, only the first N items are listed (e.g. home page teaser). */
  maxItems?: number;
};

/** Hachette listing embed plus CMS news list — same block as the home page Book news section. */
export function BookNewsSectionBody({ items, maxItems }: BookNewsSectionBodyProps) {
  const visible =
    typeof maxItems === "number" ? items.slice(0, Math.max(0, maxItems)) : items;

  return (
    <>
      <HachetteIndiaListingPreview url={HACHETTE_INDIA_BOOK_LISTING_URL} />
      {visible.length > 0 ? (
        <ul className="space-y-4">
          {visible.map((item) => (
            <li key={item._id}>
              <Link
                href={`/news/${item.slug}`}
                className="flex flex-col gap-1 rounded-lg border border-stone-200/90 bg-white px-5 py-4 shadow-sm transition hover:border-amber-800/25 sm:flex-row sm:items-center sm:justify-between"
              >
                <span className="font-medium text-stone-900">{item.title}</span>
                <time dateTime={item.publishedAt} className="text-sm text-stone-500">
                  {new Date(item.publishedAt).toLocaleDateString()}
                </time>
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </>
  );
}
