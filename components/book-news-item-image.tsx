import Image from "next/image";

import { bookNewsImageSource, type BookNewsItem } from "@/lib/book-news";
import { urlForImage } from "@/sanity/lib/image";

type BookNewsItemImageProps = {
  item: BookNewsItem;
  priority?: boolean;
  sizes?: string;
  className?: string;
};

export function BookNewsItemImage({
  item,
  priority = false,
  sizes = "(max-width: 768px) 100vw, 48rem",
  className = "h-auto w-full",
}: BookNewsItemImageProps) {
  const source = bookNewsImageSource(item);
  if (!source) return null;

  if (source.kind === "static") {
    return (
      <Image
        src={source.src}
        alt={source.alt}
        width={1400}
        height={933}
        className={className}
        priority={priority}
        sizes={sizes}
      />
    );
  }

  const imageUrl = urlForImage(source.source)?.width(1400).quality(90).url();
  if (!imageUrl) return null;

  return (
    <Image
      src={imageUrl}
      alt={source.alt}
      width={1400}
      height={933}
      className={className}
      priority={priority}
      sizes={sizes}
    />
  );
}
