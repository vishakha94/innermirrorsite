import { UserIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";

export const aboutAuthor = defineType({
  name: "aboutAuthor",
  title: "About the author page",
  type: "document",
  icon: UserIcon,
  fields: [
    defineField({
      name: "title",
      title: "Page title",
      type: "string",
      description: "Main heading (e.g. About the author).",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "lead",
      title: "Intro line",
      type: "text",
      rows: 3,
      description: "One or two sentences under the title.",
    }),
    defineField({
      name: "sections",
      title: "Sections",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "section",
          title: "Section",
          fields: [
            defineField({
              name: "heading",
              title: "Heading",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "body",
              title: "Body",
              type: "text",
              rows: 5,
            }),
          ],
          preview: {
            select: { title: "heading" },
            prepare({ title }) {
              return { title: title || "Section" };
            },
          },
        }),
      ],
    }),
  ],
  preview: {
    prepare() {
      return { title: "About the author" };
    },
  },
});
