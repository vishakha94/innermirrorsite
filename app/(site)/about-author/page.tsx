import Link from "next/link";
import type { Metadata } from "next";

import { sanityFetch } from "@/sanity/lib/client";
import { aboutAuthorQuery } from "@/sanity/lib/queries";

type AboutSection = {
  _key: string;
  heading: string;
  body?: string;
};

type AboutAuthor = {
  title: string;
  lead?: string;
  sections?: AboutSection[] | null;
} | null;

const FALLBACK = {
  title: "About Vinay Singh",
  lead: "Vinay Singh is a spiritual seeker, a lifelong experimenter, and a keen observer of human behaviour. A collector of real-life stories, he brings together experience, empathy, and insight in equal measure.",
  sections: [
    { _key: "background", heading: "Background", body: "Where you write from—your path, work, or what shaped your perspective." },
    { _key: "writing", heading: "Writing", body: "What this book or site is about, themes you explore, and how you hope it helps readers." },
    { _key: "connect", heading: "Connect", body: "How readers can follow your work (e.g. newsletter, social)—optional." },
  ],
};

export async function generateMetadata(): Promise<Metadata> {
  const data = await sanityFetch<AboutAuthor>({
    query: aboutAuthorQuery,
    revalidate: 60,
  });
  const title = data?.title?.trim() || FALLBACK.title;
  return { title };
}

export default async function AboutAuthorPage() {
  const data = await sanityFetch<AboutAuthor>({
    query: aboutAuthorQuery,
    revalidate: 60,
  });
  console.log('****About Author Page content:', data);

  const hasDoc = Boolean(data?.title?.trim());
  const title = data?.title?.trim() || FALLBACK.title;
  const lead =
    data && hasDoc && data.lead?.trim()
      ? data.lead.trim()
      : !hasDoc
        ? FALLBACK.lead
        : data?.lead?.trim() || "";

  const sections =
    data?.sections && data.sections.length > 0
      ? data.sections
      : !hasDoc
        ? FALLBACK.sections
        : [];

  return (
    <main className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <h1 className="font-serif text-4xl font-semibold tracking-tight text-stone-900">
        {title}
      </h1>
      {lead ? <p className="mt-3 text-stone-600">{lead}</p> : null}

      <article className="mt-12 space-y-12">
        {sections.length === 0 && hasDoc ? (
          <p className="rounded-xl border border-dashed border-stone-300 bg-white/60 p-10 text-center text-stone-600">
            Add sections in{" "}
            <Link href="/studio" className="font-medium text-amber-900 underline">
              About the author
            </Link>{" "}
            in the editor.
          </p>
        ) : (
          sections.map((section, index) => {
            const slug = section.heading
              .toLowerCase()
              .replace(/\s+/g, "-")
              .replace(/[^a-z0-9-]/g, "");
            const id = section._key || slug || `section-${index}`;
            return (
              <section key={section._key || index} aria-labelledby={`${id}-heading`}>
                <h2
                  id={`${id}-heading`}
                  className="font-serif text-2xl font-semibold text-stone-900"
                >
                  {section.heading}
                </h2>
                {section.body?.trim() ? (
                  <p className="mt-4 whitespace-pre-line leading-relaxed text-stone-700">
                    {section.body.trim()}
                  </p>
                ) : null}
              </section>
            );
          })
        )}
      </article>
    </main>
  );
}
