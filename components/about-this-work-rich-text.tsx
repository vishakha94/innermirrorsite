"use client";

import { Fragment } from "react";

export const BOOK_TITLE_TOKEN = "{{bookTitle}}";

/**
 * Render plain text while styling the book title token as amber.
 * The `text` can include newlines; whitespace is preserved.
 */
export function AboutThisWorkRichText({
  text,
  resolvedBookTitle,
}: {
  text: string;
  resolvedBookTitle: string;
}) {
  const parts = text.split(BOOK_TITLE_TOKEN);
  return (
    <p className="whitespace-pre-line">
      {parts.map((part, index) => (
        <Fragment key={index}>
          {index > 0 ? (
            <span className="font-semibold text-amber-900">{resolvedBookTitle}</span>
          ) : null}
          {part}
        </Fragment>
      ))}
    </p>
  );
}

