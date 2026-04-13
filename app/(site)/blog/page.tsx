import Link from "next/link";
import type { Metadata } from "next";

import { isNextDev } from "@/lib/is-next-dev";
import { CTA_COPY } from "@/lib/site-cta";
import { sanityFetch } from "@/sanity/lib/client";
import { blogPostsQuery } from "@/sanity/lib/queries";

export const metadata: Metadata = {
  title: "Blog",
};

type PostCard = {
  _id: string;
  title: string;
  slug: string;
  publishedAt: string;
  excerpt?: string;
};

export default async function BlogIndexPage() {
  const posts = await sanityFetch<PostCard[]>({
    query: blogPostsQuery,
    revalidate: 60,
  });

  const list = posts ?? [];

  return (
    <main className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <h1 className="font-serif text-4xl font-semibold tracking-tight text-stone-900">Blog</h1>
      <p className="mt-3 text-stone-600">
        Essays and notes for readers—maintained in the browser, no code required.
      </p>
      <ul className="mt-12 space-y-10">
        {list.length === 0 ? (
          <li className="rounded-xl border border-dashed border-stone-300 bg-white/60 p-10 text-center text-stone-600">
            {isNextDev ? (
              <>
                No posts yet. Add one in{" "}
                <Link href="/studio" className="font-medium text-amber-900 underline">
                  {CTA_COPY.studio.editContent}
                </Link>
                .
              </>
            ) : (
              "No posts yet."
            )}
          </li>
        ) : (
          list.map((post) => (
            <li key={post._id}>
              <article>
                <time
                  dateTime={post.publishedAt}
                  className="text-sm font-medium text-stone-500"
                >
                  {new Date(post.publishedAt).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
                <h2 className="mt-2">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="font-serif text-2xl font-semibold text-stone-900 hover:text-amber-950"
                  >
                    {post.title}
                  </Link>
                </h2>
                {post.excerpt ? (
                  <p className="mt-3 leading-relaxed text-stone-600">{post.excerpt}</p>
                ) : null}
                <Link
                  href={`/blog/${post.slug}`}
                  className="mt-4 inline-block text-sm font-semibold text-amber-900 hover:underline"
                >
                  Continue reading
                </Link>
              </article>
            </li>
          ))
        )}
      </ul>
    </main>
  );
}
