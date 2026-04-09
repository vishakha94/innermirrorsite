import type { SchemaTypeDefinition } from "sanity";

import { aboutAuthor } from "./aboutAuthor";
import { blockContent } from "./blockContent";
import { blogPost } from "./blogPost";
import { newsItem } from "./newsItem";
import { siteSettings } from "./siteSettings";

export const schemaTypes: SchemaTypeDefinition[] = [
  siteSettings,
  aboutAuthor,
  blogPost,
  newsItem,
  blockContent,
];
