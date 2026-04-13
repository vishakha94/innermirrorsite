"use client";

import { useSyncExternalStore, useState } from "react";

const LG_MEDIA = "(min-width: 1024px)";

function subscribeLg(cb: () => void) {
  const mq = window.matchMedia(LG_MEDIA);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}

function getLgSnapshot() {
  return window.matchMedia(LG_MEDIA).matches;
}

function getLgServerSnapshot() {
  return false;
}

function useIsLargeScreen() {
  return useSyncExternalStore(subscribeLg, getLgSnapshot, getLgServerSnapshot);
}

function IconCompass({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 3v3M12 18v3M3 12h3M18 12h3" />
      <path d="m12 8 2 4-4 2 2-4z" fill="currentColor" stroke="none" />
    </svg>
  );
}

function IconList({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M8 6h13M8 12h13M8 18h13" />
      <path d="M4 6h.01M4 12h.01M4 18h.01" />
    </svg>
  );
}

/**
 * Pen — “Relatable Stories…”.
 * Classic edit-pen silhouette; 24×24, stroke 1.5 (same language as {@link IconLightbulb}).
 */
function IconStoryPen({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
    </svg>
  );
}

function Chevron({ open, className }: { open: boolean; className?: string }) {
  return (
    <svg
      className={`shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""} ${className ?? ""}`}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

/** Closed book — tile mark for “What’s Inside the Book” (reads clearly at tile size vs. twin rounded spreads). */
function IconBookTile({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M6 4.5h12a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-11a2 2 0 0 1 2-2z" />
      <path d="M9.75 4.5v15" />
    </svg>
  );
}

/** Shared tile mark box — both icons use the full box (same apparent size as the book). */
const tileMarkSizeClass = "size-9 shrink-0 sm:size-10";

const bookTileClass = `${tileMarkSizeClass} text-[#a67c52]`;

/** Growth green — saturated enough to read as “alive,” not sage-gray; pairs with copper book mark. */
const sproutTileClass = `${tileMarkSizeClass} text-[#2d6b52]`;

/**
 * Sprout mark — same SVG rules as {@link IconBookTile}: 24×24, stroke 1.5, no raster background.
 * Two clear leaves from one stem; no muted/opacity strokes (reads as gray on white tiles).
 */
function IconSproutTile({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M12 20.5V11" />
      <path d="M12 11.25C9 10 6.25 7 6.5 4.25 6.75 1.75 9.5 2 11.25 5.5c.85 1.75 1 4.75.75 5.75" />
      <path d="M12 11.25C15 10 17.75 7 17.5 4.25 17.25 1.75 14.5 2 12.75 5.5c-.85 1.75-1 4.75-.75 5.75" />
    </svg>
  );
}

/**
 * Magnifying glass — “Deep Self-Awareness (Your True Starting Point)”.
 * Stroke-only: 24×24, stroke 1.5.
 */
function IconMagnifyingGlass({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16.5 16.5 5 5" />
    </svg>
  );
}

/**
 * Lightbulb — “Clarity in Thoughts & Decisions”.
 * Stroke-only like {@link IconCompass}: 24×24, stroke 1.5.
 */
function IconLightbulb({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M12 3C8.5 3 5.5 6 5.5 9.5C5.5 13 8 15.5 9 16.5V17.5H15V16.5C16 15.5 18.5 13 18.5 9.5C18.5 6 15.5 3 12 3z" />
      <path d="M9 19.5h6" />
      <path d="M10 21h4" />
    </svg>
  );
}

/**
 * Heart — “Stronger, Healthier Relationships”.
 * Single-path outline: 24×24, stroke 1.5 (same language as {@link IconLightbulb}).
 */
function IconHeart({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

/**
 * Balance scales (⚖️-like) — “Emotional Balance & Inner Stability”.
 * Open frame + solid pans (matches compass/lights: stroke structure, fill accent).
 */
function IconBalance({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M12 5.75V19.25" />
      <path d="M8.5 19.75h7" />
      <path d="M4.75 5.75h14.5" />
      <path d="M6.5 5.75V8.75" />
      <path d="M17.5 5.75V8.75" />
      <path d="M3.5 8.75h6l-3 4.25z" fill="currentColor" stroke="none" />
      <path d="M14.5 8.75h6l-3 4.25z" fill="currentColor" stroke="none" />
    </svg>
  );
}

/**
 * Leaf & stem — “Life” in “A More Peaceful & Purposeful Life”.
 * Simple life / vitality mark (not the sprout tile). 24×24, stroke 1.5.
 */
function IconLife({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M12 4.5C8 6 6 10 6.5 14C7 17.5 9.2 19.8 12 20.5C14.8 19.8 17 17.5 17.5 14C18 10 16 6 12 4.5z" />
      <path d="M12 6.25v11.25" />
      <path d="M12 18v3.25" />
    </svg>
  );
}

/**
 * Trending up — “Continuous Personal Growth”.
 * Stroke-only: 24×24, stroke 1.5.
 */
function IconTrendingUp({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M22 7 13.5 15.5 8.5 10.5 2 17" />
      <path d="M16 7h6v6" />
    </svg>
  );
}

const cardClass =
  "rounded-xl border border-stone-200/80 bg-white p-5 shadow-sm sm:rounded-2xl sm:p-8 lg:p-10";

/** Matches accordion panels: rule under the tile title, then body (all breakpoints). */
const sectionBodyBelowHeadingClass = "border-t border-stone-100 pt-5";

const subsectionTitleClass =
  "mt-6 flex items-start gap-2.5 font-serif text-base font-semibold leading-snug text-stone-900 first:mt-0 sm:mt-8 sm:gap-3 sm:text-lg";

const h2Class = "font-serif text-xl font-semibold leading-snug text-stone-900 sm:text-2xl";

function InsideBody() {
  return (
    <>
      <div>
        <h3 className={subsectionTitleClass}>
          <IconCompass className="mt-0.5 size-5 shrink-0 text-[#a67c52] sm:size-6" />
          <span className="min-w-0">A Structured Journey Within</span>
        </h3>
        <ul className="mt-4 list-disc space-y-2 pl-4 text-[15px] text-stone-600 sm:pl-5 sm:text-base">
          <li>Why you think the way you do</li>
          <li>Why emotions arise the way they do</li>
          <li>Why certain patterns repeat in your life</li>
        </ul>
      </div>

      <div className="mt-8">
        <h3 className={subsectionTitleClass}>
          <IconList className="mt-0.5 size-5 shrink-0 text-[#a67c52] sm:size-6" />
          <span className="min-w-0">A powerful framework of 74 human attributes</span>
        </h3>
        <p className="mt-3 text-[15px] leading-relaxed text-stone-600 sm:text-base">
          Each attribute includes a simple 0–5 self-assessment scale.
        </p>
        <ul className="mt-4 list-disc space-y-2 pl-4 text-[15px] text-stone-600 sm:pl-5 sm:text-base">
          <li>Where you are today</li>
          <li>What patterns keep repeating</li>
          <li>What truly needs attention</li>
        </ul>
      </div>

      <div className="mt-8">
        <h3 className={subsectionTitleClass}>
          <IconStoryPen className="mt-0.5 size-5 shrink-0 text-[#a67c52] sm:size-6" />
          <span className="min-w-0">Relatable Stories That Feel Like Your Own Life</span>
        </h3>
      </div>
    </>
  );
}

function WhyBody() {
  return (
    <>
      <div>
        <h3 className={subsectionTitleClass}>
          <IconMagnifyingGlass className="mt-0.5 size-5 shrink-0 text-[#a67c52] sm:size-6" />
          <span className="min-w-0">Deep Self-Awareness (Your True Starting Point)</span>
        </h3>
        <h3 className={subsectionTitleClass}>
          <IconLightbulb className="mt-0.5 size-5 shrink-0 text-[#a67c52] sm:size-6" />
          <span className="min-w-0">Clarity in Thoughts &amp; Decisions</span>
        </h3>
        <h3 className={subsectionTitleClass}>
          <IconHeart className="mt-0.5 size-5 shrink-0 text-[#a67c52] sm:size-6" />
          <span className="min-w-0">Stronger, Healthier Relationships</span>
        </h3>
        <h3 className={subsectionTitleClass}>
          <IconBalance className="mt-0.5 size-5 shrink-0 text-[#a67c52] sm:size-6" />
          <span className="min-w-0">Emotional Balance &amp; Inner Stability</span>
        </h3>
        <h3 className={subsectionTitleClass}>
          <IconLife className="mt-0.5 size-5 shrink-0 text-[#a67c52] sm:size-6" />
          <span className="min-w-0">A More Peaceful &amp; Purposeful Life</span>
        </h3>
        <h3 className={subsectionTitleClass}>
          <IconTrendingUp className="mt-0.5 size-5 shrink-0 text-[#a67c52] sm:size-6" />
          <span className="min-w-0">Continuous Personal Growth</span>
        </h3>
      </div>
    </>
  );
}

const tileTriggerClass =
  "flex w-full min-h-[3.25rem] items-center justify-between gap-3 rounded-lg text-left font-inherit outline-none ring-offset-2 transition-colors hover:bg-stone-50/80 focus-visible:ring-2 focus-visible:ring-[#a67c52]/35";

const mobileTileShellClass =
  "rounded-xl border border-stone-200/80 bg-white shadow-sm sm:rounded-2xl";

export function ExploreBookSections() {
  const isLargeScreen = useIsLargeScreen();
  const [insideOpen, setInsideOpen] = useState(false);
  const [whyOpen, setWhyOpen] = useState(false);

  if (isLargeScreen) {
    return (
      <div className="mt-10 grid gap-6 sm:mt-14 sm:gap-8 lg:grid-cols-2 lg:gap-10">
        <section className={cardClass} aria-labelledby="inside-heading">
          <h2 id="inside-heading" className={`flex items-center gap-3 ${h2Class}`}>
            <IconBookTile className={bookTileClass} />
            <span>What&apos;s Inside the Book</span>
          </h2>
          <div className={sectionBodyBelowHeadingClass}>
            <InsideBody />
          </div>
        </section>

        <section className={cardClass} aria-labelledby="why-heading">
          <h2 id="why-heading" className={`flex items-center gap-3 ${h2Class}`}>
            <IconSproutTile className={sproutTileClass} />
            <span>Why Introspection Changes Everything</span>
          </h2>
          <div className={sectionBodyBelowHeadingClass}>
            <WhyBody />
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="mt-10 flex flex-col gap-4 sm:mt-14">
      <section className={mobileTileShellClass} aria-labelledby="inside-heading">
        <div className="p-5 sm:p-8">
          <h2 id="inside-heading" className={`m-0 ${h2Class}`}>
            <button
              type="button"
              className={tileTriggerClass}
              aria-expanded={insideOpen}
              aria-controls="inside-panel"
              onClick={() => setInsideOpen((o) => !o)}
            >
              <span className="flex min-w-0 flex-1 items-center gap-3 text-left">
                <IconBookTile className={bookTileClass} />
                <span className="min-w-0">What&apos;s Inside the Book</span>
              </span>
              <Chevron open={insideOpen} className="shrink-0 text-stone-500" />
            </button>
          </h2>
          {insideOpen ? (
            <div id="inside-panel" className={sectionBodyBelowHeadingClass}>
              <InsideBody />
            </div>
          ) : null}
        </div>
      </section>

      <section className={mobileTileShellClass} aria-labelledby="why-heading">
        <div className="p-5 sm:p-8">
          <h2 id="why-heading" className={`m-0 ${h2Class}`}>
            <button
              type="button"
              className={tileTriggerClass}
              aria-expanded={whyOpen}
              aria-controls="why-panel"
              onClick={() => setWhyOpen((o) => !o)}
            >
              <span className="flex min-w-0 flex-1 items-center gap-3 text-left">
                <IconSproutTile className={sproutTileClass} />
                <span className="min-w-0">Why Introspection Changes Everything</span>
              </span>
              <Chevron open={whyOpen} className="shrink-0 text-stone-500" />
            </button>
          </h2>
          {whyOpen ? (
            <div id="why-panel" className={sectionBodyBelowHeadingClass}>
              <WhyBody />
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}
