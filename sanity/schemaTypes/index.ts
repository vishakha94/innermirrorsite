import type { SchemaTypeDefinition } from "sanity";

import { aboutAuthor } from "./aboutAuthor";
import { blockContent } from "./blockContent";
import { blogPost } from "./blogPost";
import { bookReview } from "./bookReview";
import { newsItem } from "./newsItem";
import { newsletterSubscriber } from "./newsletterSubscriber";
import { siteSettings } from "./siteSettings";

export const schemaTypes: SchemaTypeDefinition[] = [
  siteSettings,
  aboutAuthor,
  blogPost,
  bookReview,
  newsItem,
  newsletterSubscriber,
  blockContent,
];
