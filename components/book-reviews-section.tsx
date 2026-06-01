import { CTA_COPY } from "@/lib/site-cta";
import type { BookReviewItem } from "@/lib/book-reviews";

type BookReviewsSectionProps = {
  headline: string;
  reviews: BookReviewItem[];
};

function StarRating({ rating }: { rating: number }) {
  const filledCount = Math.min(5, Math.max(0, Math.round(rating)));

  return (
    <div className="flex items-center gap-2">
      <div
        className="flex text-lg leading-none"
        role="img"
        aria-label={`${rating} out of 5 stars`}
      >
        {Array.from({ length: 5 }, (_, index) => (
          <span
            key={index}
            aria-hidden
            className={index < filledCount ? "text-amber-600" : "text-stone-300"}
          >
            ★
          </span>
        ))}
      </div>
      <span className="text-sm font-semibold tabular-nums text-stone-700">{rating}</span>
    </div>
  );
}

function ReviewCard({ review }: { review: BookReviewItem }) {
  return (
    <figure className="flex h-full flex-col rounded-xl border border-stone-200/90 bg-white p-6 shadow-sm sm:p-8">
      {review.rating != null ? (
        <div className="mb-5">
          <StarRating rating={review.rating} />
        </div>
      ) : null}
      <blockquote className="flex-1">
        <p className="font-serif text-lg leading-relaxed text-stone-800 sm:text-xl">
          <span className="text-amber-800/70" aria-hidden>
            “
          </span>
          {review.quote}
          <span className="text-amber-800/70" aria-hidden>
            ”
          </span>
        </p>
      </blockquote>
      <figcaption className="mt-6 border-t border-stone-100 pt-4">
        <cite className="not-italic">
          <span className="font-medium text-stone-900">{review.sourceName}</span>
          {review.reviewerName ? (
            <span className="text-stone-500"> · {review.reviewerName}</span>
          ) : null}
        </cite>
      </figcaption>
      <div className="mt-6 flex justify-end">
        <a
          href={review.reviewUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center rounded-full border border-stone-300 bg-[#f9f7f2] px-5 py-2.5 text-sm font-semibold text-stone-800 shadow-sm transition hover:border-amber-800/30 hover:text-stone-900"
          aria-label={`See more: review from ${review.sourceName} (opens in a new tab)`}
        >
          {CTA_COPY.bookReviews.seeMore}
        </a>
      </div>
    </figure>
  );
}

export function BookReviewsSection({ headline, reviews }: BookReviewsSectionProps) {
  if (reviews.length === 0) return null;

  return (
    <section aria-labelledby="book-reviews-heading">
      <h2
        id="book-reviews-heading"
        className="mb-8 font-serif text-2xl font-semibold text-stone-900 sm:text-3xl"
      >
        {headline}
      </h2>
      <ul
        className={
          reviews.length === 1
            ? "max-w-3xl"
            : "grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        }
      >
        {reviews.map((review) => (
          <li key={review._id}>
            <ReviewCard review={review} />
          </li>
        ))}
      </ul>
    </section>
  );
}
