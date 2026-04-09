import Link from "next/link";
import type { Metadata } from "next";

import { sanityFetch } from "@/sanity/lib/client";
import { newsItemsQuery } from "@/sanity/lib/queries";

export const metadata: Metadata = {
  title: "Book news",
};

type NewsCard = {
  _id: string;
  title: string;
  slug: string;
  publishedAt: string;
  excerpt?: string;
};

export default async function NewsIndexPage() {
  const items = await sanityFetch<NewsCard[]>({
    query: newsItemsQuery,
    revalidate: 60,
  });

  const list = items ?? [];

  return (
    <main className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <h1 className="font-serif text-4xl font-semibold tracking-tight text-stone-900">
        Book news
      </h1>
      <p className="mt-3 text-stone-600">
        Launch dates, pre-order links, events, and other milestones for readers.
      </p>
      <ul className="mt-12 space-y-6">
        {list.length === 0 ? (
          <li className="rounded-xl border border-dashed border-stone-300 bg-white/60 p-10 text-center text-stone-600">
            No updates yet. Add items under{" "}
            <Link href="/studio" className="font-medium text-amber-900 underline">
              Book news
            </Link>{" "}
            in the editor.
          </li>
        ) : (
          list.map((item) => (
            <li key={item._id}>
              <Link
                href={`/news/${item.slug}`}
                className="block rounded-xl border border-stone-200/80 bg-white p-6 shadow-sm transition hover:border-amber-800/20 hover:shadow-md"
              >
                <time
                  dateTime={item.publishedAt}
                  className="text-sm font-medium text-stone-500"
                >
                  {new Date(item.publishedAt).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
                <h2 className="mt-2 font-serif text-xl font-semibold text-stone-900">
                  {item.title}
                </h2>
                {item.excerpt ? (
                  <p className="mt-2 text-stone-600">{item.excerpt}</p>
                ) : null}
              </Link>
            </li>
          ))
        )}
      </ul>
    </main>
  );
}
