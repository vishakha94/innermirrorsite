"use client";

import Link from "next/link";
import { useEffect, useId, useState } from "react";

import { HeroInnerMirrorMark } from "@/components/hero-inner-mirror-mark";
import { SocialNavLinks, type SocialNavUrls } from "@/components/social-nav-links";
import { MEDIUM_BLOG_PROFILE_URL } from "@/lib/site-externals";

type NavProps = {
  siteTitle: string;
  social?: SocialNavUrls;
};

function MenuIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 7h16M4 12h16M4 17h16"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M6 6l12 12M18 6L6 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function SiteHeader({ siteTitle, social = {} }: NavProps) {
  const [open, setOpen] = useState(false);
  const menuId = useId();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  const close = () => setOpen(false);

  const linkClass =
    "flex min-h-12 items-center rounded-lg px-3 text-base font-medium text-stone-800 transition-colors hover:bg-stone-100 hover:text-stone-900";

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-stone-200/70 bg-[#f9f7f2]/95 backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-4 px-4 sm:h-16 sm:px-6">
          <div className="flex min-w-0 shrink-0 items-center gap-2 sm:gap-2.5">
            <Link
              href="/"
              className="flex h-9 min-w-0 shrink-0 items-center sm:h-10"
              onClick={close}
              aria-label={siteTitle}
            >
              <HeroInnerMirrorMark compact markOnly />
            </Link>
            <SocialNavLinks urls={social} variant="desktop" />
          </div>

          <nav
            className="hidden items-center gap-5 text-sm font-medium text-stone-600 md:flex md:gap-6"
            aria-label="Main"
          >
            <Link href="/about-author" className="transition-colors hover:text-stone-900">
              Author
            </Link>
            <Link
              href={MEDIUM_BLOG_PROFILE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-stone-900"
            >
              Blog
            </Link>
            <Link href="/news" className="transition-colors hover:text-stone-900">
              Book news
            </Link>
            <Link
              href="/studio"
              className="rounded-full border border-stone-300 bg-white px-3 py-1.5 text-stone-700 shadow-sm transition-colors hover:border-amber-800/30 hover:text-stone-900"
            >
              Edit content
            </Link>
          </nav>

          <button
            type="button"
            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg text-stone-800 md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls={menuId}
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {open ? <CloseIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
          </button>
        </div>
      </header>

      {open ? (
        <div
          className="fixed inset-0 z-50 md:hidden"
          role="dialog"
          aria-modal="true"
          aria-labelledby={`${menuId}-label`}
          id={menuId}
        >
          <button
            type="button"
            className="absolute inset-0 bg-stone-900/40"
            aria-label="Close menu"
            onClick={close}
          />
          <div className="absolute inset-x-0 top-0 max-h-[min(100dvh,100vh)] overflow-y-auto bg-white shadow-lg">
            <div className="flex items-center justify-between gap-3 border-b border-stone-200 px-4 py-3">
              <div id={`${menuId}-label`} className="min-w-0 flex-1 text-[#a67c52]">
                <span className="sr-only">{siteTitle}</span>
                <HeroInnerMirrorMark compact markOnly />
              </div>
              <button
                type="button"
                className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg text-stone-800"
                onClick={close}
                aria-label="Close menu"
              >
                <CloseIcon className="h-6 w-6" />
              </button>
            </div>
            <nav className="flex flex-col gap-1 p-3 pb-8" aria-label="Mobile">
              <Link href="/" className={linkClass} onClick={close}>
                Home
              </Link>
              <Link href="/about-author" className={linkClass} onClick={close}>
                Author
              </Link>
              <Link
                href={MEDIUM_BLOG_PROFILE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={linkClass}
                onClick={close}
              >
                Blog
              </Link>
              <Link href="/news" className={linkClass} onClick={close}>
                Book news
              </Link>
              <SocialNavLinks urls={social} variant="mobile" onNavigate={close} />
              <Link
                href="/studio"
                className={`${linkClass} mt-2 border border-stone-200 bg-stone-50 justify-center`}
                onClick={close}
              >
                Edit content
              </Link>
            </nav>
          </div>
        </div>
      ) : null}
    </>
  );
}
