import { NewsletterSignupForm } from "@/components/newsletter-signup-form";
import type { NewsletterCopy } from "@/lib/newsletter";

type FooterProps = {
  authorName: string;
  newsletterCopy: NewsletterCopy;
};

export function SiteFooter({ authorName, newsletterCopy }: FooterProps) {
  return (
    <footer className="mt-auto border-t border-stone-200/70 bg-[#f3efe8]/80 py-10 sm:py-12">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-serif text-xl font-semibold text-stone-900 sm:text-2xl">
            {newsletterCopy.headline}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-stone-600 sm:text-base">
            {newsletterCopy.description}
          </p>
        </div>
        <div className="mt-6 flex justify-center">
          <NewsletterSignupForm copy={newsletterCopy} source="footer" variant="compact" />
        </div>
        <p className="mt-10 text-center text-sm text-stone-500">
          © {new Date().getFullYear()} {authorName}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
