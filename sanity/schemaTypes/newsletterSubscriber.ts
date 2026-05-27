import { EnvelopeIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const newsletterSubscriber = defineType({
  name: "newsletterSubscriber",
  title: "Newsletter subscriber",
  type: "document",
  icon: EnvelopeIcon,
  fields: [
    defineField({
      name: "email",
      title: "Email",
      type: "string",
      readOnly: true,
      validation: (Rule) => Rule.required().email(),
    }),
    defineField({
      name: "emailNormalized",
      title: "Email (normalized)",
      type: "string",
      readOnly: true,
      hidden: true,
    }),
    defineField({
      name: "subscribedAt",
      title: "Subscribed at",
      type: "datetime",
      readOnly: true,
    }),
    defineField({
      name: "source",
      title: "Signup source",
      type: "string",
      description: "Where on the site they subscribed (e.g. home, footer).",
      readOnly: true,
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: {
        list: [
          { title: "Active", value: "active" },
          { title: "Unsubscribed", value: "unsubscribed" },
        ],
        layout: "radio",
      },
      initialValue: "active",
    }),
  ],
  orderings: [
    {
      title: "Newest first",
      name: "subscribedAtDesc",
      by: [{ field: "subscribedAt", direction: "desc" }],
    },
  ],
  preview: {
    select: { title: "email", status: "status", source: "source" },
    prepare({ title, status, source }) {
      return {
        title: title || "Subscriber",
        subtitle: [status, source].filter(Boolean).join(" · "),
      };
    },
  },
});
