import { StarIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const bookReview = defineType({
  name: "bookReview",
  title: "Book review",
  type: "document",
  icon: StarIcon,
  fields: [
    defineField({
      name: "title",
      title: "Label",
      type: "string",
      description: "Internal label for Studio (e.g. “Deified Publications review”).",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "quote",
      title: "Quote",
      type: "text",
      rows: 4,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "sourceName",
      title: "Source",
      type: "string",
      description: "Publication or reviewer shown after the quote (e.g. “Deified Publications”).",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "reviewerName",
      title: "Reviewer name",
      type: "string",
      description: "Optional — e.g. “Priya Srivastava”.",
    }),
    defineField({
      name: "rating",
      title: "Rating",
      type: "number",
      description: "Optional star rating out of 5 (e.g. 4.3).",
      validation: (Rule) => Rule.min(0).max(5),
    }),
    defineField({
      name: "reviewUrl",
      title: "Review URL",
      type: "url",
      description: "External link for “See more”.",
      validation: (Rule) => Rule.required().uri({ scheme: ["http", "https"] }),
    }),
    defineField({
      name: "publishedAt",
      title: "Published",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
    }),
  ],
  preview: {
    select: { title: "title", source: "sourceName", rating: "rating", date: "publishedAt" },
    prepare({ title, source, rating, date }) {
      const ratingLabel = typeof rating === "number" ? `${rating} ★ · ` : "";
      return {
        title: title || source || "Book review",
        subtitle: `${ratingLabel}${source || ""}${date ? ` · ${new Date(date).toLocaleDateString()}` : ""}`,
      };
    },
  },
  orderings: [
    {
      title: "Published, new",
      name: "publishedAtDesc",
      by: [{ field: "publishedAt", direction: "desc" }],
    },
  ],
});
