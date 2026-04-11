import Link from "next/link";

/** Same copper as `HeroInnerMirrorMark` rings. */
const innerMirrorCopper = "text-[#a67c52]";
const innerMirrorCopperHover = "hover:text-[#8f6638]";

export type SocialNavUrls = {
  instagramUrl?: string | null;
  facebookUrl?: string | null;
  youtubeUrl?: string | null;
  linkedinUrl?: string | null;
};

type SocialNavLinksProps = {
  urls: SocialNavUrls;
  variant: "desktop" | "mobile";
  /** Close mobile menu after following a link. */
  onNavigate?: () => void;
};

function IconInstagram({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.35"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function IconFacebook({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function IconYoutube({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136c.502-1.883.502-5.814.502-5.814s0-3.931-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

function IconLinkedin({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function trimmed(u: string | null | undefined) {
  return typeof u === "string" ? u.trim() : "";
}

function hasAnyUrl(urls: SocialNavUrls) {
  return Boolean(
    trimmed(urls.instagramUrl) ||
      trimmed(urls.facebookUrl) ||
      trimmed(urls.youtubeUrl) ||
      trimmed(urls.linkedinUrl),
  );
}

export function SocialNavLinks({ urls, variant, onNavigate }: SocialNavLinksProps) {
  if (!hasAnyUrl(urls)) return null;

  /**
   * Ring + stroke-style icons: ~39/48 of the header’s `h-7` (28px) box ≈ 22.75px.
   * Filled brand marks read larger at the same bbox, so they get a smaller draw size.
   */
  const iconClassOutline = "size-[22.75px] shrink-0";
  const iconClassFilled = "size-[19px] shrink-0";
  const desktopLink = `inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md ${innerMirrorCopper} ${innerMirrorCopperHover} transition-colors hover:bg-stone-200/40 sm:h-10 sm:w-10`;
  const mobileLink = `inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg ${innerMirrorCopper} ${innerMirrorCopperHover} transition-colors hover:bg-stone-100`;

  const linkClass = variant === "desktop" ? desktopLink : mobileLink;
  const wrapClass =
    variant === "desktop"
      ? `hidden h-9 items-center gap-0.5 sm:h-10 ${innerMirrorCopper} md:flex`
      : `mt-2 flex flex-wrap items-center gap-1 border-t border-stone-200 px-3 pb-1 pt-3 ${innerMirrorCopper}`;

  const afterClick = () => {
    onNavigate?.();
  };

  const Tag = variant === "desktop" ? "nav" : "div";
  const groupProps =
    variant === "desktop"
      ? { "aria-label": "Social media" as const }
      : { role: "group" as const, "aria-label": "Social media" as const };

  return (
    <Tag className={wrapClass} {...groupProps}>
      {trimmed(urls.instagramUrl) ? (
        <Link
          href={trimmed(urls.instagramUrl)}
          target="_blank"
          rel="noopener noreferrer"
          className={linkClass}
          aria-label="Instagram (opens in a new tab)"
          onClick={afterClick}
        >
          <IconInstagram className={iconClassOutline} />
        </Link>
      ) : null}
      {trimmed(urls.facebookUrl) ? (
        <Link
          href={trimmed(urls.facebookUrl)}
          target="_blank"
          rel="noopener noreferrer"
          className={linkClass}
          aria-label="Facebook (opens in a new tab)"
          onClick={afterClick}
        >
          <IconFacebook className={iconClassFilled} />
        </Link>
      ) : null}
      {trimmed(urls.youtubeUrl) ? (
        <Link
          href={trimmed(urls.youtubeUrl)}
          target="_blank"
          rel="noopener noreferrer"
          className={linkClass}
          aria-label="YouTube (opens in a new tab)"
          onClick={afterClick}
        >
          <IconYoutube className={iconClassFilled} />
        </Link>
      ) : null}
      {trimmed(urls.linkedinUrl) ? (
        <Link
          href={trimmed(urls.linkedinUrl)}
          target="_blank"
          rel="noopener noreferrer"
          className={linkClass}
          aria-label="LinkedIn (opens in a new tab)"
          onClick={afterClick}
        >
          <IconLinkedin className={iconClassFilled} />
        </Link>
      ) : null}
    </Tag>
  );
}
