import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { RichText } from "@/components/portable-text";
import { getSanityClient, sanityFetch } from "@/sanity/lib/client";
import { urlForImage } from "@/sanity/lib/image";
import { blogPostBySlugQuery } from "@/sanity/lib/queries";

type BlogPost = {
  title: string;
  slug: string;
  publishedAt: string;
  excerpt?: string;
  mainImage?: { asset?: { _ref: string }; alt?: string };
  body: unknown;
};

export async function generateStaticParams() {
  const client = getSanityClient();
  if (!client) {
    return [];
  }
  const slugs = await client.fetch<string[]>(
    `*[_type == "blogPost" && defined(slug.current)].slug.current`,
  );
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await sanityFetch<BlogPost | null>({
    query: blogPostBySlugQuery,
    params: { slug },
    revalidate: 60,
  });
  if (!post) {
    return { title: "Post not found" };
  }
  return {
    title: post.title,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await sanityFetch<BlogPost | null>({
    query: blogPostBySlugQuery,
    params: { slug },
    revalidate: 60,
  });

  if (!post) {
    notFound();
  }

  const imageUrl = post.mainImage ? urlForImage(post.mainImage)?.width(1400).quality(90).url() : null;

  return (
    <main className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <Link
        href="/blog"
        className="text-sm font-medium text-amber-900 hover:underline"
      >
        ← Back to blog
      </Link>
      <article className="mt-8">
        <time dateTime={post.publishedAt} className="text-sm text-stone-500">
          {new Date(post.publishedAt).toLocaleDateString(undefined, {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </time>
        <h1 className="mt-3 font-serif text-4xl font-semibold tracking-tight text-stone-900">
          {post.title}
        </h1>
        {post.excerpt ? (
          <p className="mt-4 text-lg leading-relaxed text-stone-600">{post.excerpt}</p>
        ) : null}
        {imageUrl ? (
          <div className="mt-10 overflow-hidden rounded-xl border border-stone-200/80 shadow-sm">
            <Image
              src={imageUrl}
              alt={post.mainImage?.alt ?? ""}
              width={1400}
              height={933}
              className="h-auto w-full"
              priority
              sizes="(max-width: 768px) 100vw, 48rem"
            />
          </div>
        ) : null}
        <div className="prose-custom mt-10">
          <RichText value={post.body} />
        </div>
      </article>
    </main>
  );
}
