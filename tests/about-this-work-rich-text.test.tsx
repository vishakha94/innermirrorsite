import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import {
  AboutThisWorkRichText,
  BOOK_TITLE_TOKEN,
} from "@/components/about-this-work-rich-text";

describe("AboutThisWorkRichText", () => {
  it("renders the book title in amber when token is present", () => {
    render(
      <AboutThisWorkRichText
        text={`Hello ${BOOK_TITLE_TOKEN} world`}
        resolvedBookTitle="My Book"
      />,
    );

    const title = screen.getByText("My Book");
    expect(title).toBeInTheDocument();
    expect(title).toHaveClass("text-amber-900");
  });

  it("renders the full text when token is absent", () => {
    render(
      <AboutThisWorkRichText text="No token here." resolvedBookTitle="Ignored" />,
    );

    expect(screen.getByText("No token here.")).toBeInTheDocument();
    expect(screen.queryByText("Ignored")).not.toBeInTheDocument();
  });

  it("renders the book title multiple times if token repeats", () => {
    render(
      <AboutThisWorkRichText
        text={`${BOOK_TITLE_TOKEN} + ${BOOK_TITLE_TOKEN}`}
        resolvedBookTitle="Repeat"
      />,
    );

    expect(screen.getAllByText("Repeat")).toHaveLength(2);
  });
});
