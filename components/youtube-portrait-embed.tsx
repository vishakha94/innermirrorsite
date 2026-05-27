import { buildYoutubeEmbedUrl, type YoutubeEmbedVideo } from "@/lib/youtube-embed";

type YoutubePortraitEmbedProps = Pick<YoutubeEmbedVideo, "videoId" | "startSeconds" | "title">;

export function YoutubePortraitEmbed({ videoId, startSeconds, title }: YoutubePortraitEmbedProps) {
  const embedUrl = buildYoutubeEmbedUrl({ videoId, startSeconds });

  return (
    <div className="mx-auto w-full max-w-[280px] sm:max-w-[320px]">
      <div className="relative aspect-[9/16] overflow-hidden rounded-xl border border-stone-200/90 bg-stone-900 shadow-sm ring-1 ring-stone-900/5">
        <iframe
          src={embedUrl}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
          className="absolute inset-0 h-full w-full border-0"
        />
      </div>
    </div>
  );
}
