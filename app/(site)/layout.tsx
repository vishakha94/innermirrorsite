import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { resolveYoutubeUrl } from "@/lib/site-externals";
import { sanityFetch } from "@/sanity/lib/client";
import { siteSettingsQuery } from "@/sanity/lib/queries";

type Settings = {
  siteTitle: string;
  authorName: string;
  instagramUrl?: string | null;
  facebookUrl?: string | null;
  youtubeUrl?: string | null;
  linkedinUrl?: string | null;
} | null;

/** Sanity wins; optional `.env.local` fallbacks so links show without republishing. */
function resolvedSocialUrl(
  fromSanity: string | null | undefined,
  envKey:
    | "NEXT_PUBLIC_SOCIAL_INSTAGRAM_URL"
    | "NEXT_PUBLIC_SOCIAL_FACEBOOK_URL"
    | "NEXT_PUBLIC_SOCIAL_YOUTUBE_URL"
    | "NEXT_PUBLIC_SOCIAL_LINKEDIN_URL",
) {
  const s = typeof fromSanity === "string" ? fromSanity.trim() : "";
  if (s) return s;
  const e = process.env[envKey]?.trim();
  return e || undefined;
}

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await sanityFetch<Settings>({
    query: siteSettingsQuery,
    revalidate: 60,
  });

  const siteTitle = settings?.siteTitle ?? "Inner Mirror";
  const authorName = settings?.authorName ?? "Author";
  const social = {
    instagramUrl: resolvedSocialUrl(
      settings?.instagramUrl,
      "NEXT_PUBLIC_SOCIAL_INSTAGRAM_URL",
    ),
    facebookUrl: resolvedSocialUrl(settings?.facebookUrl, "NEXT_PUBLIC_SOCIAL_FACEBOOK_URL"),
    youtubeUrl: resolveYoutubeUrl(settings?.youtubeUrl),
    linkedinUrl: resolvedSocialUrl(settings?.linkedinUrl, "NEXT_PUBLIC_SOCIAL_LINKEDIN_URL"),
  };

  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader siteTitle={siteTitle} social={social} />
      <div className="flex-1">{children}</div>
      <SiteFooter authorName={authorName} />
    </div>
  );
}
