import Link from "next/link";

import { YoutubePortraitEmbed } from "@/components/youtube-portrait-embed";
import { CTA_COPY } from "@/lib/site-cta";
import type { YoutubeEmbedVideo } from "@/lib/youtube-embed";

type HomeYoutubeSectionProps = {
  viewChannelUrl: string;
  videos: YoutubeEmbedVideo[];
};

export function HomeYoutubeSection({ viewChannelUrl, videos }: HomeYoutubeSectionProps) {
  if (videos.length === 0) return null;

  return (
    <section>
      <div className="mb-8 flex items-end justify-between gap-4">
        <h2 className="font-serif text-2xl font-semibold text-stone-900">From YouTube</h2>
        <Link
          href={viewChannelUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium text-amber-900 hover:underline"
        >
          {CTA_COPY.sections.viewChannel}
        </Link>
      </div>
      <div className="flex flex-wrap items-start justify-center gap-8 sm:gap-10 lg:gap-12">
        {videos.map((video, index) => (
          <YoutubePortraitEmbed key={`${video.videoId}-${index}`} {...video} />
        ))}
      </div>
    </section>
  );
}
