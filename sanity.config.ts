import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";

import { apiVersion, dataset, projectId } from "./sanity/env";
import { schemaTypes } from "./sanity/schemaTypes";

const resolvedProjectId = projectId ?? "";

export default defineConfig({
  name: "innermirrorsite",
  title: "Inner Mirror",
  projectId: resolvedProjectId,
  dataset,
  schema: { types: schemaTypes },
  plugins: [
    structureTool((S) =>
      S.list()
        .title("Content")
        .items([
          S.listItem()
            .title("Site settings")
            .id("siteSettings")
            .child(S.document().schemaType("siteSettings").documentId("siteSettings")),
          S.listItem()
            .title("About the author")
            .id("aboutAuthor")
            .child(S.document().schemaType("aboutAuthor").documentId("aboutAuthor")),
          S.divider(),
          S.documentTypeListItem("blogPost").title("Blog posts"),
          S.documentTypeListItem("newsItem").title("Book news"),
        ]),
    ),
    visionTool({ defaultApiVersion: apiVersion }),
  ],
});
