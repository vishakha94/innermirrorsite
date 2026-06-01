import { NewsletterSignupForm } from "@/components/newsletter-signup-form";
import {
  NEWSLETTER_SIGNUP_VISIBLE,
  type NewsletterCopy,
  type NewsletterSignupSource,
} from "@/lib/newsletter";

type NewsletterSignupSectionProps = {
  copy: NewsletterCopy;
  source?: NewsletterSignupSource;
};

export function NewsletterSignupSection({
  copy,
  source = "home",
}: NewsletterSignupSectionProps) {
  if (!NEWSLETTER_SIGNUP_VISIBLE) return null;

  return (
    <section
      className="rounded-2xl border border-stone-200/90 bg-[#f3efe8]/60 px-6 py-10 shadow-sm sm:px-10 sm:py-12"
      aria-labelledby="newsletter-heading"
    >
      <div className="mx-auto max-w-2xl text-center">
        <h2
          id="newsletter-heading"
          className="font-serif text-2xl font-semibold text-stone-900 sm:text-3xl"
        >
          {copy.headline}
        </h2>
        <p className="mt-3 text-base leading-relaxed text-stone-600 sm:text-lg">{copy.description}</p>
      </div>
      <div className="mt-8">
        <NewsletterSignupForm copy={copy} source={source} variant="section" />
      </div>
    </section>
  );
}
