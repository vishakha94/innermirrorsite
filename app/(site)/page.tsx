import Image from "next/image";
import Link from "next/link";

import { BookNewsSectionBody } from "@/components/book-news-section-body";
import { MediumPostTeaser } from "@/components/medium-post-teaser";
import { HeroInnerMirrorMark } from "@/components/hero-inner-mirror-mark";
import { fetchMediumFeaturedFromSanity } from "@/lib/medium-post-preview";
import {
  CTA_COPY,
  resolveAuthorName,
  resolveBookTagline,
  resolveBookTitle,
  splitBookTitle,
} from "@/lib/site-cta";
import { MEDIUM_BLOG_PROFILE_URL, resolveAmazonBookPurchaseUrl } from "@/lib/site-externals";
import { sanityFetch } from "@/sanity/lib/client";
import {
  blogPostsQuery,
  newsItemsQuery,
  siteSettingsQuery,
} from "@/sanity/lib/queries";

type SiteSettings = {
  siteTitle: string;
  authorName: string;
  bookTitle?: string;
  bookTagline?: string;
  heroHeadline?: string;
  heroSubphrase?: string;
  featuredMediumArticleUrl?: string | null;
  amazonBookPurchaseUrl?: string | null;
} | null;

type PostCard = {
  _id: string;
  title: string;
  slug: string;
  publishedAt: string;
  excerpt?: string;
};

export default async function HomePage() {
  const [settings, posts, news] = await Promise.all([
    sanityFetch<SiteSettings>({ query: siteSettingsQuery, revalidate: 60 }),
    sanityFetch<PostCard[]>({ query: blogPostsQuery, revalidate: 60 }),
    sanityFetch<PostCard[]>({ query: newsItemsQuery, revalidate: 60 }),
  ]);
  const mediumFeatured = await fetchMediumFeaturedFromSanity(
    settings?.featuredMediumArticleUrl,
  );

  const authorName = resolveAuthorName(settings?.authorName).value;
  const bookTitle = resolveBookTitle(settings?.bookTitle).value;
  const bookTagline = resolveBookTagline(settings?.bookTagline).value;
  const { main: titleMain, subtitle: titleSubtitle } = splitBookTitle(bookTitle);

  const latestPosts = posts?.slice(0, 3) ?? [];
  const bookPurchaseUrl = resolveAmazonBookPurchaseUrl(settings?.amazonBookPurchaseUrl);

  return (
    <main>
      <section className="border-b border-stone-200/60 bg-[#f9f7f2] px-4 py-12 sm:px-6 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-12 xl:gap-16">
            <div>
              <div className="flex justify-center">
                <HeroInnerMirrorMark />
              </div>
              <div className="mx-auto mt-6 max-w-xl text-center">
                <h1 className="font-serif tracking-tight text-stone-900">
                  <span className="block text-4xl font-bold leading-none sm:text-5xl lg:text-6xl">
                    {titleMain}
                  </span>
                  {titleSubtitle ? (
                    <span className="mt-3 block text-2xl font-semibold leading-snug text-stone-800 sm:text-3xl lg:text-[1.75rem]">
                      {titleSubtitle}
                    </span>
                  ) : null}
                </h1>
                <p className="mt-6 font-serif text-lg text-stone-700 sm:text-xl">by {authorName}</p>
              </div>
              <p className="mx-auto mt-5 max-w-xl text-center text-base leading-relaxed text-stone-600 sm:text-lg">
                {bookTagline}
              </p>
              <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
                <Link
                  href="/explore-the-book"
                  className="rounded-full bg-stone-900 px-7 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-stone-800"
                >
                  {CTA_COPY.home.exploreBook}
                </Link>
                <Link
                  href={bookPurchaseUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-stone-300 bg-white px-7 py-3.5 text-sm font-semibold text-stone-800 shadow-sm transition hover:border-stone-400"
                >
                  {CTA_COPY.home.getYourCopy}
                </Link>
              </div>
            </div>
            <div className="flex justify-center lg:justify-end">
              <div className="relative w-full max-w-[320px] sm:max-w-[380px] lg:max-w-[440px]">
                <Image
                  src="/images/book-cover.png"
                  alt={`Book cover: ${bookTitle}`}
                  width={880}
                  height={1320}
                  className="h-auto w-full rounded-2xl shadow-2xl ring-1 ring-stone-900/5"
                  priority
                  sizes="(max-width: 1024px) 85vw, 440px"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl space-y-20 px-4 py-16 sm:px-6">
        <section>
          <div className="mb-8 flex items-end justify-between gap-4">
            <h2 className="font-serif text-2xl font-semibold text-stone-900">From the blog</h2>
            <Link
              href={MEDIUM_BLOG_PROFILE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-amber-900 hover:underline"
            >
              {CTA_COPY.sections.viewAll}
            </Link>
          </div>
          {latestPosts.length > 0 ? (
            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {latestPosts.map((post) => (
                <li key={post._id}>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="block h-full rounded-xl border border-stone-200/90 bg-white p-6 shadow-sm transition hover:border-amber-800/25 hover:shadow-md"
                  >
                    <time
                      dateTime={post.publishedAt}
                      className="text-xs font-medium uppercase tracking-wide text-stone-500"
                    >
                      {new Date(post.publishedAt).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </time>
                    <h3 className="mt-2 font-serif text-lg font-semibold text-stone-900">
                      {post.title}
                    </h3>
                    {post.excerpt ? (
                      <p className="mt-2 line-clamp-3 text-sm text-stone-600">{post.excerpt}</p>
                    ) : null}
                  </Link>
                </li>
              ))}
            </ul>
          ) : null}
          {mediumFeatured ? (
            <MediumPostTeaser
              title={mediumFeatured.title}
              link={mediumFeatured.link}
              pubDate={mediumFeatured.pubDate}
              author={mediumFeatured.author}
              excerptText={mediumFeatured.excerptText}
            />
          ) : null}
        </section>

        <section>
          <div className="mb-8 flex items-end justify-between gap-4">
            <h2 className="font-serif text-2xl font-semibold text-stone-900">Book news</h2>
            <Link href="/news" className="text-sm font-medium text-amber-900 hover:underline">
              {CTA_COPY.sections.viewAll}
            </Link>
          </div>
          <BookNewsSectionBody items={news ?? []} maxItems={4} />
        </section>
      </div>
    </main>
  );
}
