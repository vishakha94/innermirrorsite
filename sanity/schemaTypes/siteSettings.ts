import { CogIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";

import { DEFAULT_HOME_YOUTUBE_VIDEO_ENTRIES } from "@/lib/youtube-embed";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site settings",
  type: "document",
  icon: CogIcon,
  fields: [
    defineField({
      name: "siteTitle",
      title: "Site title",
      type: "string",
      description: "Shown in the browser tab and header.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "authorName",
      title: "Author name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "bookTitle",
      title: "Book title",
      type: "string",
    }),
    defineField({
      name: "bookTagline",
      title: "Book tagline",
      type: "string",
      description: "One line under the book title on the home page.",
    }),
    defineField({
      name: "heroHeadline",
      title: "Hero Headline",
      type: "text",
      rows: 4,
      description: "Headline on the Hero Section.",
    }),
    defineField({
      name: "heroSubphrase",
      title: "Hero Subphrase",
      type: "text",
      rows: 4,
      description: "Subphrase on the Hero Section.",
    }),
    defineField({
      name: "authorAbout",
      title: "About the author",
      type: "text",
      rows: 8,
      description: "Short bio shown beside Book news on the home page.",
    }),
    defineField({
      name: "authorPhoto",
      title: "Author photo",
      type: "image",
      options: { hotspot: true },
      fields: [{ name: "alt", type: "string", title: "Alt text" }],
    }),
    defineField({
      name: "instagramUrl",
      title: "Instagram URL",
      type: "url",
      description: "Shown in the header (desktop) and mobile menu.",
    }),
    defineField({
      name: "facebookUrl",
      title: "Facebook URL",
      type: "url",
    }),
    defineField({
      name: "youtubeUrl",
      title: "YouTube URL",
      type: "url",
    }),
    defineField({
      name: "youtubeShortsUrl",
      title: "YouTube Shorts URL (home)",
      type: "url",
      description:
        "Link for “View channel” under “From YouTube” on the home page (e.g. your channel’s Shorts tab). If empty, the site uses `NEXT_PUBLIC_YOUTUBE_SHORTS_URL` or the default Shorts link in code.",
    }),
    defineField({
      name: "homeYoutubeVideos",
      title: "Home page YouTube videos",
      type: "array",
      description:
        "Portrait videos embedded under “From YouTube.” Paste watch or Shorts URLs. If empty, the site uses default video links from the codebase.",
      initialValue: DEFAULT_HOME_YOUTUBE_VIDEO_ENTRIES.map(({ url, title, startSeconds }) => ({
        url,
        title,
        ...(startSeconds != null ? { startSeconds } : {}),
      })),
      of: [
        defineArrayMember({
          type: "object",
          name: "homeYoutubeVideo",
          title: "YouTube video",
          fields: [
            defineField({
              name: "url",
              title: "YouTube URL",
              type: "url",
              description: "Watch, Shorts, or youtu.be link.",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "title",
              title: "Accessible title",
              type: "string",
              description: "Short label for screen readers (e.g. video topic).",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "startSeconds",
              title: "Start at (seconds)",
              type: "number",
              description: "Optional. Overrides any start time in the URL.",
              validation: (Rule) => Rule.min(0).integer(),
            }),
          ],
          preview: {
            select: { title: "title", url: "url" },
            prepare({ title, url }) {
              return { title: title || "YouTube video", subtitle: url };
            },
          },
        }),
      ],
    }),
    defineField({
      name: "linkedinUrl",
      title: "LinkedIn URL",
      type: "url",
    }),
    defineField({
      name: "featuredMediumArticleUrl",
      title: "Featured Medium article (home)",
      type: "url",
      description:
        "Paste the full Medium article URL for the preview under “From the blog.” If empty, the site uses a default article from the codebase.",
    }),
    defineField({
      name: "amazonBookPurchaseUrl",
      title: "Amazon / book purchase URL",
      type: "url",
      description:
        "Full URL for the “Get the Book” button on the home page (e.g. Amazon.in product or storefront). If empty, the site uses `NEXT_PUBLIC_AMAZON_BOOK_PURCHASE_URL` or the default ASIN link in code.",
    }),
  ],
  preview: {
    prepare() {
      return { title: "Site settings" };
    },
  },
});
