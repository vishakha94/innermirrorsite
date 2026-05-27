import { describe, expect, it } from "vitest";

import {
  buildYoutubeEmbedUrl,
  DEFAULT_HOME_YOUTUBE_VIDEO_ENTRIES,
  defaultHomeYoutubeVideos,
  parseYoutubeVideoUrl,
  resolveHomeYoutubeVideos,
} from "@/lib/youtube-embed";

describe("buildYoutubeEmbedUrl", () => {
  it("builds a plain embed URL", () => {
    expect(buildYoutubeEmbedUrl({ videoId: "abc123" })).toBe(
      "https://www.youtube.com/embed/abc123",
    );
  });

  it("includes start time when provided", () => {
    expect(buildYoutubeEmbedUrl({ videoId: "sRL-BcxwEbA", startSeconds: 35 })).toBe(
      "https://www.youtube.com/embed/sRL-BcxwEbA?start=35",
    );
  });
});

describe("DEFAULT_HOME_YOUTUBE_VIDEO_ENTRIES", () => {
  it("stores the default watch and Shorts links in codebase", () => {
    expect(DEFAULT_HOME_YOUTUBE_VIDEO_ENTRIES.map((entry) => entry.url)).toEqual([
      "https://www.youtube.com/watch?v=sRL-BcxwEbA&t=35s",
      "https://www.youtube.com/shorts/pjJVt7QaPQQ",
    ]);
  });
});

describe("parseYoutubeVideoUrl", () => {
  it("parses watch URLs with start time", () => {
    expect(parseYoutubeVideoUrl("https://www.youtube.com/watch?v=sRL-BcxwEbA&t=35s")).toEqual({
      videoId: "sRL-BcxwEbA",
      startSeconds: 35,
    });
  });

  it("parses Shorts URLs", () => {
    expect(parseYoutubeVideoUrl("https://www.youtube.com/shorts/pjJVt7QaPQQ")).toEqual({
      videoId: "pjJVt7QaPQQ",
    });
  });

  it("parses youtu.be links", () => {
    expect(parseYoutubeVideoUrl("https://youtu.be/abc123?t=12")).toEqual({
      videoId: "abc123",
      startSeconds: 12,
    });
  });

  it("returns null for unsupported URLs", () => {
    expect(parseYoutubeVideoUrl("https://example.com/not-youtube")).toBeNull();
  });
});

describe("defaultHomeYoutubeVideos", () => {
  it("derives embed data from default URL entries", () => {
    expect(defaultHomeYoutubeVideos().map((video) => video.videoId)).toEqual([
      "sRL-BcxwEbA",
      "pjJVt7QaPQQ",
    ]);
    expect(defaultHomeYoutubeVideos()[0].startSeconds).toBe(35);
  });
});

describe("resolveHomeYoutubeVideos", () => {
  it("uses Sanity videos when valid entries are provided", () => {
    expect(
      resolveHomeYoutubeVideos([
        {
          url: "https://www.youtube.com/watch?v=custom123",
          title: "Custom video",
          startSeconds: 10,
        },
      ]),
    ).toEqual([
      {
        videoId: "custom123",
        title: "Custom video",
        startSeconds: 10,
      },
    ]);
  });

  it("skips invalid entries and falls back when none remain", () => {
    expect(
      resolveHomeYoutubeVideos([
        { url: "https://example.com/nope", title: "Bad URL" },
        { url: "https://www.youtube.com/watch?v=abc", title: "" },
      ]),
    ).toEqual(defaultHomeYoutubeVideos());
  });

  it("falls back to default URL entries when Sanity list is empty", () => {
    expect(resolveHomeYoutubeVideos([])).toEqual(defaultHomeYoutubeVideos());
    expect(resolveHomeYoutubeVideos(null)).toEqual(defaultHomeYoutubeVideos());
  });
});
