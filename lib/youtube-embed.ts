export type YoutubeEmbedVideo = {
  videoId: string;
  startSeconds?: number;
  /** Accessible iframe title — update when video titles are known. */
  title: string;
};

export type SanityHomeYoutubeVideo = {
  url?: string | null;
  title?: string | null;
  startSeconds?: number | null;
};

export type DefaultHomeYoutubeVideoEntry = {
  url: string;
  title: string;
  startSeconds?: number;
};

/** Default home page YouTube entries — full URLs, titles, and optional start overrides. */
export const DEFAULT_HOME_YOUTUBE_VIDEO_ENTRIES = [
  {
    url: "https://www.youtube.com/watch?v=sRL-BcxwEbA&t=35s",
    title: "Introspection Daily on YouTube",
  },
  {
    url: "https://www.youtube.com/shorts/pjJVt7QaPQQ",
    title: "Introspection Daily YouTube Short",
  },
] as const satisfies readonly DefaultHomeYoutubeVideoEntry[];

function parseStartSeconds(raw: string | null): number | undefined {
  if (!raw) return undefined;
  const match = raw.match(/^(\d+)/);
  if (!match) return undefined;
  const n = Number.parseInt(match[1], 10);
  return Number.isFinite(n) && n >= 0 ? n : undefined;
}

/** Extract video id and optional start time from common YouTube URL shapes. */
export function parseYoutubeVideoUrl(rawUrl: string): {
  videoId: string;
  startSeconds?: number;
} | null {
  try {
    const url = new URL(rawUrl.trim());
    const host = url.hostname.replace(/^www\./, "");

    let videoId: string | undefined;
    if (host === "youtu.be") {
      videoId = url.pathname.slice(1).split("/")[0];
    } else if (host === "youtube.com" || host === "m.youtube.com") {
      if (url.pathname === "/watch") {
        videoId = url.searchParams.get("v") ?? undefined;
      } else if (url.pathname.startsWith("/shorts/")) {
        videoId = url.pathname.split("/")[2];
      } else if (url.pathname.startsWith("/embed/")) {
        videoId = url.pathname.split("/")[2];
      }
    }

    if (!videoId) return null;

    const startFromParam =
      parseStartSeconds(url.searchParams.get("start")) ??
      parseStartSeconds(url.searchParams.get("t"));

    return {
      videoId,
      ...(startFromParam != null ? { startSeconds: startFromParam } : {}),
    };
  } catch {
    return null;
  }
}

function toEmbedVideo(entry: SanityHomeYoutubeVideo): YoutubeEmbedVideo | null {
  const url = typeof entry.url === "string" ? entry.url.trim() : "";
  const title = typeof entry.title === "string" ? entry.title.trim() : "";
  if (!url || !title) return null;

  const fromUrl = parseYoutubeVideoUrl(url);
  if (!fromUrl) return null;

  const explicitStart =
    typeof entry.startSeconds === "number" && entry.startSeconds >= 0
      ? entry.startSeconds
      : undefined;

  return {
    videoId: fromUrl.videoId,
    title,
    startSeconds: explicitStart ?? fromUrl.startSeconds,
  };
}

/** Embed-ready defaults derived from {@link DEFAULT_HOME_YOUTUBE_VIDEO_ENTRIES}. */
export function defaultHomeYoutubeVideos(): YoutubeEmbedVideo[] {
  return DEFAULT_HOME_YOUTUBE_VIDEO_ENTRIES.flatMap((entry) => {
    const video = toEmbedVideo(entry);
    return video ? [video] : [];
  });
}

export function resolveHomeYoutubeVideos(
  fromSanity: SanityHomeYoutubeVideo[] | null | undefined,
): YoutubeEmbedVideo[] {
  const parsed = (fromSanity ?? []).flatMap((item) => {
    const video = toEmbedVideo(item);
    return video ? [video] : [];
  });

  if (parsed.length > 0) return parsed;
  return defaultHomeYoutubeVideos();
}

export function buildYoutubeEmbedUrl({
  videoId,
  startSeconds,
}: Pick<YoutubeEmbedVideo, "videoId" | "startSeconds">): string {
  const params = new URLSearchParams();
  if (startSeconds != null && startSeconds > 0) {
    params.set("start", String(startSeconds));
  }
  const qs = params.toString();
  return `https://www.youtube.com/embed/${videoId}${qs ? `?${qs}` : ""}`;
}
