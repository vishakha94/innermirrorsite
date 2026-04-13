import { render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import HomePage from "@/app/(site)/page";
import { HachetteIndiaListingPreview } from "@/components/hachette-india-listing-preview";
import { MediumPostTeaser } from "@/components/medium-post-teaser";
import { CTA_COPY, DEFAULT_BOOK_TITLE, splitBookTitle } from "@/lib/site-cta";
import { HACHETTE_INDIA_BOOK_LISTING_URL, MEDIUM_BLOG_PROFILE_URL } from "@/lib/site-externals";

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

function minimalSiteSettingsResponse() {
  return Promise.resolve({
    siteTitle: "Test Site",
    authorName: "Author",
  });
}

function customHeroSiteSettingsResponse() {
  return Promise.resolve({
    siteTitle: "Test Site",
    authorName: "Author",
    bookTitle: "Custom Title, Custom Sub",
    bookTagline: "Custom tagline from CMS",
  });
}

const sanityFetch = vi.hoisted(() =>
  vi.fn((opts: { query: string }) => {
    const q = opts.query;
    if (q.includes("siteSettings")) return minimalSiteSettingsResponse();
    if (q.includes("blogPost")) return Promise.resolve([]);
    if (q.includes("newsItem")) return Promise.resolve([]);
    return Promise.resolve(null);
  }),
);

vi.mock("@/sanity/lib/client", () => ({
  sanityFetch: (opts: { query: string }) => sanityFetch(opts),
}));

function resetSanityFetchDefault() {
  sanityFetch.mockImplementation((opts: { query: string }) => {
    const q = opts.query;
    if (q.includes("siteSettings")) return minimalSiteSettingsResponse();
    if (q.includes("blogPost")) return Promise.resolve([]);
    if (q.includes("newsItem")) return Promise.resolve([]);
    return Promise.resolve(null);
  });
}

describe("Home page CTAs (Sanity mock = minimal settings → fallbacks for hero copy)", () => {
  afterEach(() => {
    resetSanityFetchDefault();
  });

  it("renders hero CTAs and section “View all” links with CTA_COPY labels", async () => {
    const page = await HomePage();
    render(page);

    expect(
      screen.getByRole("link", { name: CTA_COPY.home.exploreBook }),
    ).toHaveAttribute("href", "/explore-the-book");

    const getCopy = screen.getByRole("link", { name: CTA_COPY.home.getYourCopy });
    expect(getCopy.getAttribute("href")).toMatch(/^https?:\/\//);

    const viewAllLinks = screen.getAllByRole("link", { name: CTA_COPY.sections.viewAll });
    expect(viewAllLinks).toHaveLength(2);
    expect(viewAllLinks[0]).toHaveAttribute("href", MEDIUM_BLOG_PROFILE_URL);
    expect(viewAllLinks[1]).toHaveAttribute("href", "/news");
  });

  it("shows fallback split hero title when bookTitle is absent from Sanity", async () => {
    const { main, subtitle } = splitBookTitle(DEFAULT_BOOK_TITLE);
    const page = await HomePage();
    render(page);
    const heroHeading = screen.getByRole("heading", { level: 1 });
    expect(within(heroHeading).getByText(main)).toBeInTheDocument();
    expect(within(heroHeading).getByText(subtitle)).toBeInTheDocument();
  });

  it("uses custom book title from Sanity when provided", async () => {
    sanityFetch.mockImplementation((opts: { query: string }) => {
      const q = opts.query;
      if (q.includes("siteSettings")) return customHeroSiteSettingsResponse();
      if (q.includes("blogPost")) return Promise.resolve([]);
      if (q.includes("newsItem")) return Promise.resolve([]);
      return Promise.resolve(null);
    });

    const page = await HomePage();
    render(page);
    expect(screen.getByText("Custom Title")).toBeInTheDocument();
    expect(screen.getByText("Custom Sub")).toBeInTheDocument();
    expect(screen.getByText("Custom tagline from CMS")).toBeInTheDocument();
  });
});

describe("Medium + Hachette CTA components", () => {
  it("MediumPostTeaser uses CTA_COPY for the button (visible label matches CTA_COPY)", () => {
    render(
      <MediumPostTeaser
        title="T"
        link="https://medium.com/p/x"
        pubDate="2020-01-01"
        author="A"
        excerptText="Body"
      />,
    );
    const cta = screen.getByRole("link", { name: /Continue reading on Medium/ });
    expect(cta).toHaveTextContent(CTA_COPY.medium.continueReading);
    expect(cta).toHaveAttribute("href", "https://medium.com/p/x");
  });

  it("HachetteIndiaListingPreview uses CTA_COPY for the footer link", () => {
    render(<HachetteIndiaListingPreview url={HACHETTE_INDIA_BOOK_LISTING_URL} />);
    expect(
      screen.getByRole("link", { name: CTA_COPY.hachette.openOnPublisher }),
    ).toHaveAttribute("href", HACHETTE_INDIA_BOOK_LISTING_URL);
  });
});
