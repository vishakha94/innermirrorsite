import { CTA_COPY } from "@/lib/site-cta";

type MediumPostTeaserProps = {
  title: string;
  link: string;
  pubDate: string;
  author: string;
  excerptText: string;
  /** Plain-text character budget before truncation (ellipsis). */
  excerptMaxChars?: number;
};

export function MediumPostTeaser({
  title,
  link,
  pubDate,
  author,
  excerptText,
  excerptMaxChars = 920,
}: MediumPostTeaserProps) {
  const excerpt =
    excerptText.length > excerptMaxChars
      ? `${excerptText.slice(0, excerptMaxChars).replace(/\s+\S*$/, "")}…`
      : excerptText;

  const dateLabel = pubDate
    ? new Date(pubDate).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  return (
    <div className="mt-10 rounded-xl border border-stone-200/90 bg-white p-6 shadow-sm sm:p-8">
      <p className="text-xs font-medium uppercase tracking-[0.2em] text-stone-500">
        From Medium
      </p>
      <h3 className="mt-3 font-serif text-xl font-semibold leading-snug text-stone-900 sm:text-2xl">
        {title}
      </h3>
      <p className="mt-2 text-sm text-stone-600">
        {[author, dateLabel].filter(Boolean).join(" · ")}
      </p>

      <div className="relative mt-5">
        <div className="max-h-[13rem] overflow-hidden sm:max-h-[14rem]">
          <p className="whitespace-pre-line text-pretty text-[0.95rem] leading-relaxed text-stone-700 sm:text-base">
            {excerpt}
          </p>
        </div>
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-white via-white/90 to-transparent"
          aria-hidden
        />
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-end gap-4 border-t border-stone-100 pt-5">
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center rounded-full border border-stone-300 bg-[#f9f7f2] px-5 py-2.5 text-sm font-semibold text-stone-800 shadow-sm transition hover:border-amber-800/30 hover:text-stone-900"
          aria-label="Continue reading on Medium (opens in a new tab)"
        >
          {CTA_COPY.medium.continueReading}
        </a>
      </div>
    </div>
  );
}
