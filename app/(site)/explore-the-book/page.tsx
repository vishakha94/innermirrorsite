import type { Metadata } from "next";
import Link from "next/link";

import { ExploreBookSections } from "@/components/explore-book-sections";
import { MEDIUM_BLOG_PROFILE_URL, resolveYoutubeUrl } from "@/lib/site-externals";
import { sanityFetch } from "@/sanity/lib/client";
import { siteSettingsQuery } from "@/sanity/lib/queries";

export const metadata: Metadata = {
  title: "Explore the Book",
  description:
    "Unlock the superpower within you—a guided workbook for deep reflection, structured self-discovery, and continuous growth.",
};

type SiteSettingsYoutube = { youtubeUrl?: string | null } | null;

function IconYoutube({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136c.502-1.883.502-5.814.502-5.814s0-3.931-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

const linkCtaClass =
  "font-medium text-[#8f6638] underline decoration-[#a67c52]/50 underline-offset-[0.2em] transition hover:text-stone-900 py-1.5 sm:py-1";

export default async function ExploreTheBookPage() {
  const settings = await sanityFetch<SiteSettingsYoutube>({
    query: siteSettingsQuery,
    revalidate: 60,
  });
  const youtubeUrl = resolveYoutubeUrl(settings?.youtubeUrl);

  return (
    <main className="bg-[#FCFAF7]">
      <div className="mx-auto max-w-6xl px-4 py-10 pb-12 sm:px-6 sm:py-16 sm:pb-16 lg:py-20">
        <header className="text-center">
          <h1 className="font-serif text-3xl font-semibold leading-tight tracking-tight text-stone-900 sm:text-4xl sm:leading-tight md:text-[2.75rem]">
            Explore the Book
          </h1>
          <div className="mx-auto mt-6 max-w-2xl space-y-4 text-[15px] leading-relaxed text-stone-700 text-pretty sm:mt-8 sm:space-y-5 sm:text-base md:text-lg">
            <p>
              Unlock the superpower within you. Understand yourself, reshape your thinking, and
              grow into a more intentional version of who you are.
            </p>
          </div>
        </header>

        <ExploreBookSections />

        <footer className="mt-12 flex flex-col items-center px-1 text-center sm:mt-14">
          <p className="font-serif text-lg font-semibold text-stone-900 sm:text-xl">
            Ready to explore your inner world?
          </p>
          <div
            className="mt-5 flex max-w-md flex-col items-center gap-3 text-[15px] leading-relaxed text-stone-700 sm:max-w-none sm:flex-row sm:flex-wrap sm:justify-center sm:gap-x-2 sm:gap-y-2 sm:text-base md:text-lg"
            role="group"
            aria-label="Subscribe to the blog or YouTube"
          >
            <span className="text-center">
              Subscribe to the{" "}
              <Link
                href={MEDIUM_BLOG_PROFILE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={linkCtaClass}
              >
                Inner Mirror Blog
              </Link>
            </span>
            <span className="text-stone-500 sm:shrink-0">or</span>
            <span className="inline-flex min-h-11 items-center justify-center gap-2 sm:min-h-0">
              <IconYoutube className="size-5 shrink-0 text-[#a67c52]" aria-hidden />
              <Link href={youtubeUrl} target="_blank" rel="noopener noreferrer" className={linkCtaClass}>
                YouTube channel
              </Link>
            </span>
          </div>
        </footer>
      </div>
    </main>
  );
}
