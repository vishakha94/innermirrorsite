import { Fragment } from "react";
import type { Metadata } from "next";

import { sanityFetch } from "@/sanity/lib/client";
import { aboutAuthorPageQuery } from "@/sanity/lib/queries";

type AboutSection = {
  _key: string;
  heading: string;
  body?: string;
};

type AboutAuthorDoc = {
  title: string;
  lead?: string;
  aboutThisWork?: string;
  sections?: AboutSection[] | null;
} | null;

type AboutAuthorPagePayload = {
  about: AboutAuthorDoc;
  bookTitle: string | null;
} | null;

/** Used when Site settings → Book title is empty (substituted for {{bookTitle}}). */
const DEFAULT_BOOK_TITLE = "Introspection, Your Inner Superpower Revealed";

const aboutThisWorkBoxClass =
  "mt-8 rounded-lg bg-gradient-to-br from-amber-50/80 to-stone-50/50 px-5 py-4 font-serif text-lg leading-relaxed text-stone-800 shadow-sm";

/** Renders plain text; `{{bookTitle}}` becomes the site book title in amber. */
function AboutThisWorkRichText({
  text,
  resolvedBookTitle,
}: {
  text: string;
  resolvedBookTitle: string;
}) {
  const parts = text.split("{{bookTitle}}");
  return (
    <p className="whitespace-pre-line">
      {parts.map((part, index) => (
        <Fragment key={index}>
          {index > 0 ? (
            <span className="font-semibold text-amber-900">{resolvedBookTitle}</span>
          ) : null}
          {part}
        </Fragment>
      ))}
    </p>
  );
}

const FALLBACK = {
  title: "About Vinay Singh",
  lead: "Vinay Singh is a spiritual seeker, a lifelong experimenter, and a keen observer of human behaviour. A collector of real-life stories, he brings together experience, empathy, and insight in equal measure.",
  aboutThisWork: `From a young age, I was inclined toward introspection, turning inward whenever things went wrong or patterns repeated. This habit helped me grow and navigate life more consciously.

As my spiritual journey deepened, introspection became more structured, strengthening my self-awareness. However, I later realized it was often reactive—triggered by challenges rather than practiced regularly.

Through my work as a spiritual trainer, I observed many people struggling with recurring behaviors, emotions, and relationship challenges. This revealed the need for a clear framework to guide self-reflection. Conversations with younger individuals especially highlighted the difficulty of managing relationships today.

I also came to see that for spiritual seekers, inner growth is essential—without it, there is a risk of stagnation.

These insights inspired me to write {{bookTitle}} with a simple aim: to make introspection more accessible, structured, and meaningful for everyone.`,
  sections: [
    {
      _key: "background",
      heading: "Background",
      body: "Where you write from—your path, work, or what shaped your perspective.",
    },
    {
      _key: "connect",
      heading: "Connect",
      body: "How readers can follow your work (e.g. newsletter, social)—optional.",
    },
  ],
};

export async function generateMetadata(): Promise<Metadata> {
  const payload = await sanityFetch<AboutAuthorPagePayload>({
    query: aboutAuthorPageQuery,
    revalidate: 60,
  });
  const title = payload?.about?.title?.trim() || FALLBACK.title;
  return { title };
}

export default async function AboutAuthorPage() {
  const payload = await sanityFetch<AboutAuthorPagePayload>({
    query: aboutAuthorPageQuery,
    revalidate: 60,
  });

  const data = payload?.about ?? null;
  const resolvedBookTitle = payload?.bookTitle?.trim() || DEFAULT_BOOK_TITLE;

  const hasDoc = Boolean(data?.title?.trim());
  const title = data?.title?.trim() || FALLBACK.title;
  const lead =
    data && hasDoc && data.lead?.trim()
      ? data.lead.trim()
      : !hasDoc
        ? FALLBACK.lead
        : data?.lead?.trim() || "";

  const aboutThisWorkBody =
    hasDoc && data?.aboutThisWork?.trim()
      ? data.aboutThisWork.trim()
      : !hasDoc
        ? FALLBACK.aboutThisWork
        : data?.aboutThisWork?.trim() || "";

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
      {lead ? <p className="mt-3 leading-relaxed text-stone-600">{lead}</p> : null}

      {aboutThisWorkBody ? (
        <div className={aboutThisWorkBoxClass} role="note">
          <AboutThisWorkRichText
            text={aboutThisWorkBody}
            resolvedBookTitle={resolvedBookTitle}
          />
        </div>
      ) : null}

      {sections.length > 0 ? (
        <article className="mt-14 space-y-12 border-t border-stone-200/80 pt-14">
          {sections.map((section, index) => {
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
          })}
        </article>
      ) : null}
    </main>
  );
}
