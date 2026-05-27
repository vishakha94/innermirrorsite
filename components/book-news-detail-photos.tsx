import type { ReactNode } from "react";
import Image from "next/image";

import { BookNewsItemImage } from "@/components/book-news-item-image";
import { bookNewsImageSource, type BookNewsItem, type BookNewsStaticImage } from "@/lib/book-news";

type BookNewsDetailPhotosProps = {
  item: BookNewsItem;
};

const detailSizes = "(max-width: 768px) 100vw, 48rem";

function GalleryPhoto({ image }: { image: BookNewsStaticImage }) {
  return (
    <figure className="overflow-hidden rounded-xl border border-stone-200/80 bg-white shadow-sm">
      <Image
        src={image.src}
        alt={image.alt}
        width={1400}
        height={933}
        className="h-auto w-full"
        sizes={detailSizes}
      />
      {image.caption ? (
        <figcaption className="border-t border-stone-100 px-4 py-3 text-center text-sm text-stone-600 sm:px-5">
          {image.caption}
        </figcaption>
      ) : null}
    </figure>
  );
}

function PhotoFrame({ children }: { children: ReactNode }) {
  return (
    <div className="overflow-hidden rounded-xl border border-stone-200/80 shadow-sm">
      {children}
    </div>
  );
}

/** Full-width photos for a book news detail page (hero + optional gallery). */
export function BookNewsDetailPhotos({ item }: BookNewsDetailPhotosProps) {
  const mainSource = bookNewsImageSource(item);
  const mainSrc = mainSource?.kind === "static" ? mainSource.src : null;
  const gallery = (item.defaultGalleryImages ?? []).filter((img) => img.src !== mainSrc);

  if (!mainSource && gallery.length === 0) {
    return null;
  }

  return (
    <div className="mt-10 space-y-6">
      {mainSource ? (
        <PhotoFrame>
          <BookNewsItemImage item={item} priority sizes={detailSizes} className="h-auto w-full" />
        </PhotoFrame>
      ) : null}
      {gallery.map((image) => (
        <GalleryPhoto key={image.src} image={image} />
      ))}
    </div>
  );
}
