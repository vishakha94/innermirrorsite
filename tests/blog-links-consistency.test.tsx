import { render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import HomePage from "@/app/(site)/page";
import { SiteHeader } from "@/components/site-header";
import { MEDIUM_BLOG_PROFILE_URL } from "@/lib/site-externals";

vi.mock("next/image", () => ({
  default: function MockImage({
    src,
    alt,
    ...rest
  }: {
    src: string;
    alt: string;
    className?: string;
    width?: number;
    height?: number;
    sizes?: string;
    priority?: boolean;
  }) {
    // eslint-disable-next-line @next/next/no-img-element -- test double only
    return <img src={src} alt={alt} {...rest} />;
  },
}));

vi.mock("@/lib/medium-post-preview", () => ({
  fetchMediumFeaturedFromSanity: vi.fn(() => Promise.resolve(null)),
}));

vi.mock("@/sanity/lib/client", () => ({
  sanityFetch: vi.fn((opts: { query: string }) => {
    const q = opts.query;
    if (q.includes("siteSettings")) {
      return Promise.resolve({
        siteTitle: "Test Site",
        authorName: "Author",
      });
    }
    if (q.includes("blogPost")) return Promise.resolve([]);
    if (q.includes("newsItem")) return Promise.resolve([]);
    return Promise.resolve(null);
  }),
}));

describe("Medium blog links", () => {
  it("uses the same URL for header Blog and home “From the blog” View all", async () => {
    const { container: headerRoot } = render(<SiteHeader siteTitle="Test Site" />);
    const headerBlog = headerRoot.querySelector(
      `a[href="${MEDIUM_BLOG_PROFILE_URL}"]`,
    );
    expect(headerBlog).not.toBeNull();
    const headerHref = headerBlog!.getAttribute("href");

    const page = await HomePage();
    render(page);

    const fromBlogHeading = screen.getByRole("heading", { name: "From the blog" });
    const fromBlogSection = fromBlogHeading.closest("section");
    expect(fromBlogSection).not.toBeNull();

    const viewAll = within(fromBlogSection!).getByRole("link", { name: "View all" });
    const viewAllHref = viewAll.getAttribute("href");

    expect(headerHref).toBe(MEDIUM_BLOG_PROFILE_URL);
    expect(viewAllHref).toBe(MEDIUM_BLOG_PROFILE_URL);
    expect(headerHref).toBe(viewAllHref);
  });
});
