import { afterEach, describe, expect, it, vi } from "vitest";

import {
  AMAZON_IN_BOOK_PURCHASE_URL,
  DEFAULT_YOUTUBE_CHANNEL_URL,
  resolveAmazonBookPurchaseUrl,
  resolveAmazonBookPurchaseUrlWithSource,
  resolveYoutubeUrl,
  resolveYoutubeUrlWithSource,
} from "@/lib/site-externals";

describe("resolveAmazonBookPurchaseUrlWithSource", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("prefers Sanity URL when set", () => {
    expect(
      resolveAmazonBookPurchaseUrlWithSource("https://example.com/buy"),
    ).toEqual({
      url: "https://example.com/buy",
      source: "sanity",
    });
    expect(resolveAmazonBookPurchaseUrl("https://example.com/buy")).toBe(
      "https://example.com/buy",
    );
  });

  it("uses env when Sanity empty and NEXT_PUBLIC_AMAZON_BOOK_PURCHASE_URL is set", () => {
    vi.stubEnv("NEXT_PUBLIC_AMAZON_BOOK_PURCHASE_URL", "https://env.example/amazon");
    expect(resolveAmazonBookPurchaseUrlWithSource(null)).toEqual({
      url: "https://env.example/amazon",
      source: "env",
    });
    expect(resolveAmazonBookPurchaseUrl(null)).toBe("https://env.example/amazon");
  });

  it("uses default Amazon.in URL when Sanity and env are empty", () => {
    vi.stubEnv("NEXT_PUBLIC_AMAZON_BOOK_PURCHASE_URL", "");
    expect(resolveAmazonBookPurchaseUrlWithSource(undefined)).toEqual({
      url: AMAZON_IN_BOOK_PURCHASE_URL,
      source: "default",
    });
    expect(resolveAmazonBookPurchaseUrl(undefined)).toBe(AMAZON_IN_BOOK_PURCHASE_URL);
  });
});

describe("resolveYoutubeUrlWithSource", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("prefers Sanity URL when set", () => {
    expect(resolveYoutubeUrlWithSource("https://youtube.com/@custom")).toEqual({
      url: "https://youtube.com/@custom",
      source: "sanity",
    });
  });

  it("uses env when Sanity empty", () => {
    vi.stubEnv("NEXT_PUBLIC_SOCIAL_YOUTUBE_URL", "https://youtube.com/@fromenv");
    expect(resolveYoutubeUrlWithSource(null)).toEqual({
      url: "https://youtube.com/@fromenv",
      source: "env",
    });
  });

  it("uses default channel when Sanity and env are empty", () => {
    vi.stubEnv("NEXT_PUBLIC_SOCIAL_YOUTUBE_URL", "");
    expect(resolveYoutubeUrlWithSource(undefined)).toEqual({
      url: DEFAULT_YOUTUBE_CHANNEL_URL,
      source: "default",
    });
    expect(resolveYoutubeUrl(undefined)).toBe(DEFAULT_YOUTUBE_CHANNEL_URL);
  });
});
