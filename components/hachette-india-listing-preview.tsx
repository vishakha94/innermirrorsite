type HachetteIndiaListingPreviewProps = {
  url: string;
};

/** Live embed of the Hachette India catalog page for this title. */
export function HachetteIndiaListingPreview({ url }: HachetteIndiaListingPreviewProps) {
  return (
    <div className="mb-10 overflow-hidden rounded-xl border border-stone-200/90 bg-white shadow-sm">
      <div className="border-b border-stone-100 bg-[#f9f7f2] px-5 py-4 sm:px-6">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-stone-500">
          Hachette India
        </p>
        <p className="mt-1 font-serif text-lg font-semibold text-stone-900">
          Publisher listing
        </p>
      </div>
      <div className="relative bg-stone-100">
        <iframe
          title="Hachette India: book details for Introspection — Your Inner Superpower Revealed"
          src={url}
          className="block h-[min(72vh,640px)] w-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
      <div className="flex justify-end border-t border-stone-100 px-5 py-3 sm:px-6">
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-semibold text-amber-900 hover:underline"
        >
          Open on Hachette India →
        </a>
      </div>
    </div>
  );
}
