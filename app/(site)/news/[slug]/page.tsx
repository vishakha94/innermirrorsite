import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { BookNewsDetailPhotos } from "@/components/book-news-detail-photos";
import { RichText } from "@/components/portable-text";
import {
  DEFAULT_BOOK_NEWS_SLUGS,
  getBookNewsItemBySlug,
  type BookNewsItem,
} from "@/lib/book-news";
import { getSanityClient, sanityFetch } from "@/sanity/lib/client";
import { newsItemBySlugQuery, newsItemsQuery } from "@/sanity/lib/queries";

export async function generateStaticParams() {
  const client = getSanityClient();
  const slugs = new Set<string>(DEFAULT_BOOK_NEWS_SLUGS);

  if (client) {
    const cmsSlugs = await client.fetch<string[]>(
      `*[_type == "newsItem" && defined(slug.current)].slug.current`,
    );
    for (const slug of cmsSlugs) {
      slugs.add(slug);
    }
  }

  return [...slugs].map((slug) => ({ slug }));
}

async function loadNewsItem(slug: string): Promise<BookNewsItem | null> {
  const [allCms, detail] = await Promise.all([
    sanityFetch<BookNewsItem[]>({ query: newsItemsQuery, revalidate: 60 }),
    sanityFetch<BookNewsItem | null>({
      query: newsItemBySlugQuery,
      params: { slug },
      revalidate: 60,
    }),
  ]);

  return getBookNewsItemBySlug(slug, allCms, detail);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const item = await loadNewsItem(slug);
  if (!item) {
    return { title: "News not found" };
  }
  return {
    title: item.title,
    description: item.excerpt,
  };
}

export default async function NewsItemPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = await loadNewsItem(slug);

  if (!item) {
    notFound();
  }

  const hasBody = Array.isArray(item.body) && item.body.length > 0;

  return (
    <main className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <Link href="/news" className="text-sm font-medium text-amber-900 hover:underline">
        ← All book news
      </Link>
      <article className="mt-8">
        <time dateTime={item.publishedAt} className="text-sm text-stone-500">
          {new Date(item.publishedAt).toLocaleDateString(undefined, {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </time>
        <h1 className="mt-3 font-serif text-4xl font-semibold tracking-tight text-stone-900">
          {item.title}
        </h1>
        {item.excerpt ? (
          <p className="mt-4 text-lg leading-relaxed text-stone-600">{item.excerpt}</p>
        ) : null}
        <BookNewsDetailPhotos item={item} />
        {hasBody ? (
          <div className="prose-custom mt-10">
            <RichText value={item.body} />
          </div>
        ) : null}
      </article>
    </main>
  );
}
