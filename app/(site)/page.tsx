import Image from "next/image";
import Link from "next/link";

import { sanityFetch } from "@/sanity/lib/client";
import {
  blogPostsQuery,
  newsItemsQuery,
  siteSettingsQuery,
} from "@/sanity/lib/queries";
import { urlForImage } from "@/sanity/lib/image";

type SiteSettings = {
  siteTitle: string;
  authorName: string;
  bookTitle?: string;
  bookTagline?: string;
  heroHeadline?: string;
  heroSubphrase?: string;
  authorAbout?: string;
  authorPhoto?: { asset?: { _ref: string }; alt?: string };
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
  console.log('****Home Page content:', settings, posts, news);

  const authorName = settings?.authorName ?? "Vinay Singh";
  const siteTitle = settings?.siteTitle ?? "Inner Mirror";
  const bookTitle = settings?.bookTitle;
  const bookTagline = settings?.bookTagline;
  const heroHeadline = settings?.heroHeadline ?? "Know yourself. Transform your Life.";
  const heroSubphrase =
    settings?.heroSubphrase ??
    "Through introspection and timeless wisdom from the Inner Mirror.";
  const authorAbout = settings?.authorAbout?.trim();
  const aboutPhotoUrl = settings?.authorPhoto
    ? urlForImage(settings.authorPhoto)?.width(640).quality(85).url()
    : null;

  const latestPosts = posts?.slice(0, 3) ?? [];
  const latestNews = news?.slice(0, 4) ?? [];

  return (
    <main>
      <section className="border-b border-stone-200/80 bg-gradient-to-b from-amber-50/40 to-stone-50 px-4 py-20 sm:px-6 sm:py-28">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-md font-medium tracking-widest text-amber-900/70">
            {siteTitle}
          </p>
          {bookTitle ? (
            <h1 className="mt-4 font-serif text-4xl font-semibold tracking-tight text-stone-900 sm:text-5xl">
              {bookTitle}
            </h1>
          ) : (
            <h1 className="mt-4 font-serif text-4xl font-semibold tracking-tight text-stone-900 sm:text-5xl">
              {heroHeadline}
            </h1>
          )}
          {bookTagline ? (
            <p className="mt-4 text-lg text-stone-600 sm:text-xl">{bookTagline}</p>
          ) : null}
          <p className="mx-auto mt-8 max-w-xl text-pretty leading-relaxed text-stone-700">
            {heroSubphrase}
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/blog"
              className="rounded-full bg-stone-900 px-6 py-3 text-sm font-semibold text-stone-50 shadow-sm transition hover:bg-stone-800"
            >
              Explore the book
            </Link>
            <Link
              href="/news"
              className="rounded-full border border-stone-300 bg-white px-6 py-3 text-sm font-semibold text-stone-800 shadow-sm transition hover:border-stone-400"
            >
              Start Reflecting
            </Link>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-5xl space-y-20 px-4 py-16 sm:px-6">
        <section>
          <div className="mb-8 flex items-end justify-between gap-4">
            <h2 className="font-serif text-2xl font-semibold text-stone-900">From the blog</h2>
            <Link href="/blog" className="text-sm font-medium text-amber-900 hover:underline">
              View all
            </Link>
          </div>
          {latestPosts.length === 0 ? (
            <p className="rounded-xl border border-dashed border-stone-300 bg-white/60 p-8 text-center text-stone-600">
              Blog posts will appear here after they are added in{" "}
              <Link href="/studio" className="font-medium text-amber-900 underline">
                the editor
              </Link>
              .
            </p>
          ) : (
            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {latestPosts.map((post) => (
                <li key={post._id}>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="block h-full rounded-xl border border-stone-200/80 bg-white p-6 shadow-sm transition hover:border-amber-800/20 hover:shadow-md"
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
          )}
        </section>

        <section className="grid gap-12 lg:grid-cols-12 lg:gap-10 lg:items-start">
          <div className="lg:col-span-7">
            <div className="mb-8 flex items-end justify-between gap-4">
              <h2 className="font-serif text-2xl font-semibold text-stone-900">Book news</h2>
              <Link href="/news" className="text-sm font-medium text-amber-900 hover:underline">
                View all
              </Link>
            </div>
            {latestNews.length === 0 ? (
              <p className="rounded-xl border border-dashed border-stone-300 bg-white/60 p-8 text-center text-stone-600">
                Share launch dates, events, and milestones in{" "}
                <Link href="/studio" className="font-medium text-amber-900 underline">
                  Book news
                </Link>{" "}
                in the editor.
              </p>
            ) : (
              <ul className="space-y-4">
                {latestNews.map((item) => (
                  <li key={item._id}>
                    <Link
                      href={`/news/${item.slug}`}
                      className="flex flex-col gap-1 rounded-lg border border-stone-200/80 bg-white px-5 py-4 shadow-sm transition hover:border-amber-800/20 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <span className="font-medium text-stone-900">{item.title}</span>
                      <time
                        dateTime={item.publishedAt}
                        className="text-sm text-stone-500"
                      >
                        {new Date(item.publishedAt).toLocaleDateString()}
                      </time>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
