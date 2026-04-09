import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { sanityFetch } from "@/sanity/lib/client";
import { siteSettingsQuery } from "@/sanity/lib/queries";

type Settings = {
  siteTitle: string;
  authorName: string;
} | null;

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

  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader siteTitle={siteTitle} />
      <div className="flex-1">{children}</div>
      <SiteFooter authorName={authorName} />
    </div>
  );
}
