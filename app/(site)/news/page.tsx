import type { Metadata } from "next";

import { BookNewsSectionBody } from "@/components/book-news-section-body";
import { resolveBookNewsItems, type BookNewsItem } from "@/lib/book-news";
import { sanityFetch } from "@/sanity/lib/client";
import { newsItemsQuery } from "@/sanity/lib/queries";

export const metadata: Metadata = {
  title: "Book news",
};

export default async function NewsIndexPage() {
  const items = await sanityFetch<BookNewsItem[]>({
    query: newsItemsQuery,
    revalidate: 60,
  });

  const list = resolveBookNewsItems(items);

  return (
    <main className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <h1 className="font-serif text-4xl font-semibold tracking-tight text-stone-900">
        Book news
      </h1>
      <p className="mt-3 text-stone-600">
        Launch dates, pre-order links, events, and other milestones for readers.
      </p>
      <div className="mt-12">
        <BookNewsSectionBody items={list} />
      </div>
    </main>
  );
}
