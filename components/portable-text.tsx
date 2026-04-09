import Image from "next/image";
import { PortableText, type PortableTextComponents } from "next-sanity";

import { urlForImage } from "@/sanity/lib/image";

const components: PortableTextComponents = {
  block: {
    h2: ({ children }) => (
      <h2 className="mt-10 text-2xl font-semibold tracking-tight text-stone-900">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="mt-8 text-xl font-semibold text-stone-900">{children}</h3>
    ),
    blockquote: ({ children }) => (
      <blockquote className="my-6 border-l-4 border-amber-700/40 pl-5 italic text-stone-700">
        {children}
      </blockquote>
    ),
    normal: ({ children }) => (
      <p className="my-4 leading-relaxed text-stone-700">{children}</p>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="my-4 list-disc space-y-2 pl-6 text-stone-700">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="my-4 list-decimal space-y-2 pl-6 text-stone-700">{children}</ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => <li>{children}</li>,
    number: ({ children }) => <li>{children}</li>,
  },
  marks: {
    strong: ({ children }) => <strong className="font-semibold text-stone-900">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
    link: ({ children, value }) => {
      const href = value?.href;
      if (!href) return <>{children}</>;
      const isExternal = /^https?:\/\//.test(href);
      return (
        <a
          href={href}
          className="font-medium text-amber-900 underline decoration-amber-700/40 underline-offset-2 hover:decoration-amber-800"
          {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        >
          {children}
        </a>
      );
    },
  },
  types: {
    image: ({ value }) => {
      const url = urlForImage(value)?.width(1200).quality(85).url();
      if (!url) return null;
      return (
        <figure className="my-8">
          <Image
            src={url}
            alt={value.alt ?? ""}
            width={1200}
            height={800}
            className="h-auto w-full max-w-3xl rounded-lg border border-stone-200/80 shadow-sm"
            sizes="(max-width: 768px) 100vw, 48rem"
          />
          {value.alt ? (
            <figcaption className="mt-2 text-center text-sm text-stone-500">{value.alt}</figcaption>
          ) : null}
        </figure>
      );
    },
  },
};

export function RichText({ value }: { value: unknown }) {
  if (!value || !Array.isArray(value)) {
    return null;
  }
  return <PortableText value={value} components={components} />;
}
