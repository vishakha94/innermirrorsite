/**
 * Inner · Mirror wordmark: thin outer circle + thick inner ring, single copper tone (sample style).
 */
type HeroInnerMirrorMarkProps = {
  /** Smaller type + mark for the site header. */
  compact?: boolean;
  /** Header-style: only the ring mark, no “Inner” / “Mirror” copy. */
  markOnly?: boolean;
};

function CircleMarkSvg({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <circle cx="24" cy="24" r="19.5" stroke="currentColor" strokeWidth={1.25} />
      <circle cx="24" cy="24" r="10.5" stroke="currentColor" strokeWidth={5.75} />
    </svg>
  );
}

export function HeroInnerMirrorMark({
  compact = false,
  markOnly = false,
}: HeroInnerMirrorMarkProps) {
  if (markOnly) {
    return (
      <span
        className="inline-flex shrink-0 items-center justify-center text-[#a67c52]"
        aria-hidden
      >
        <CircleMarkSvg
          className={compact ? "h-7 w-7 sm:h-7 sm:w-7" : "h-9 w-9 sm:h-10 sm:w-10"}
        />
      </span>
    );
  }

  return (
    <div
      className={
        compact
          ? "flex max-w-full items-center gap-1.5 font-sans text-[10px] font-medium uppercase tracking-[0.28em] text-[#a67c52] sm:gap-2 sm:text-xs"
          : "flex items-center gap-3 font-sans text-xs font-medium uppercase tracking-[0.32em] text-[#a67c52] sm:gap-3.5 sm:text-sm"
      }
    >
      <span>Inner</span>
      <span className="inline-flex shrink-0 items-center justify-center text-inherit" aria-hidden>
        <CircleMarkSvg
          className={compact ? "h-7 w-7 sm:h-7 sm:w-7" : "h-9 w-9 sm:h-10 sm:w-10"}
        />
      </span>
      <span>Mirror</span>
    </div>
  );
}
