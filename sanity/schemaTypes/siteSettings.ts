import { CogIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

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
  ],
  preview: {
    prepare() {
      return { title: "Site settings" };
    },
  },
});
