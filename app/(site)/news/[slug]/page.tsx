import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { RichText } from "@/components/portable-text";
import { getSanityClient, sanityFetch } from "@/sanity/lib/client";
import { newsItemBySlugQuery } from "@/sanity/lib/queries";

type NewsItem = {
  title: string;
  slug: string;
  publishedAt: string;
  excerpt?: string;
  body: unknown;
};

export async function generateStaticParams() {
  const client = getSanityClient();
  if (!client) {
    return [];
  }
  const slugs = await client.fetch<string[]>(
    `*[_type == "newsItem" && defined(slug.current)].slug.current`,
  );
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const item = await sanityFetch<NewsItem | null>({
    query: newsItemBySlugQuery,
    params: { slug },
    revalidate: 60,
  });
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
  const item = await sanityFetch<NewsItem | null>({
    query: newsItemBySlugQuery,
    params: { slug },
    revalidate: 60,
  });

  if (!item) {
    notFound();
  }

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
        <div className="prose-custom mt-10">
          <RichText value={item.body} />
        </div>
      </article>
    </main>
  );
}
