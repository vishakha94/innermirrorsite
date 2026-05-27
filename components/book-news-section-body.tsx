import Link from "next/link";

import { BookNewsItemImage } from "@/components/book-news-item-image";
import { type BookNewsItem } from "@/lib/book-news";

export type BookNewsSectionItem = BookNewsItem;

type BookNewsSectionBodyProps = {
  items: BookNewsSectionItem[];
  /** When set, only the first N items are listed (e.g. home page teaser). */
  maxItems?: number;
};

/** Book news list with full-width photos — used on the home page and /news. */
export function BookNewsSectionBody({ items, maxItems }: BookNewsSectionBodyProps) {
  const visible =
    typeof maxItems === "number" ? items.slice(0, Math.max(0, maxItems)) : items;

  if (visible.length === 0) {
    return null;
  }

  return (
    <ul className="space-y-8">
      {visible.map((item) => (
        <li key={item._id}>
          <Link
            href={`/news/${item.slug}`}
            className="block overflow-hidden rounded-xl border border-stone-200/90 bg-white shadow-sm transition hover:border-amber-800/25 hover:shadow-md"
          >
            <BookNewsItemImage
              item={item}
              className="h-auto w-full"
              sizes="(max-width: 768px) 100vw, (max-width: 1152px) 66vw, 48rem"
            />
            <div className="px-5 py-4 sm:px-6 sm:py-5">
              <span className="font-medium text-stone-900">{item.title}</span>
              {item.excerpt ? (
                <p className="mt-2 text-sm leading-relaxed text-stone-600">{item.excerpt}</p>
              ) : null}
              <time dateTime={item.publishedAt} className="mt-3 block text-sm text-stone-500">
                {new Date(item.publishedAt).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
