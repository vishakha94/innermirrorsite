import { groq } from "next-sanity";

// Newest `siteSettings` doc wins (covers singleton id `siteSettings` or a type-list doc with a UUID _id).
export const siteSettingsQuery = groq`
  *[_type == "siteSettings"] | order(_updatedAt desc)[0]{
    siteTitle,
    authorName,
    bookTitle,
    bookTagline,
    heroHeadline,
    heroSubphrase,
    authorAbout,
    authorPhoto,
    instagramUrl,
    facebookUrl,
    youtubeUrl,
    linkedinUrl
  }
`;

export const aboutAuthorQuery = groq`
  *[_type == "aboutAuthor"] | order(_updatedAt desc)[0]{
    title,
    lead,
    aboutThisWork,
    sections[]{
      _key,
      heading,
      body
    }
  }
`;

/** About-author doc plus book title from Site settings (for the auto-generated closing line). */
export const aboutAuthorPageQuery = groq`{
  "about": *[_type == "aboutAuthor"] | order(_updatedAt desc)[0]{
    title,
    lead,
    aboutThisWork,
    sections[]{
      _key,
      heading,
      body
    }
  },
  "bookTitle": *[_type == "siteSettings"] | order(_updatedAt desc)[0].bookTitle
}`;

export const blogPostsQuery = groq`
  *[_type == "blogPost"] | order(publishedAt desc) {
    _id,
    title,
    "slug": slug.current,
    publishedAt,
    excerpt,
    mainImage
  }
`;

export const blogPostBySlugQuery = groq`
  *[_type == "blogPost" && slug.current == $slug][0]{
    _id,
    title,
    "slug": slug.current,
    publishedAt,
    excerpt,
    mainImage,
    body
  }
`;

export const newsItemsQuery = groq`
  *[_type == "newsItem"] | order(publishedAt desc) {
    _id,
    title,
    "slug": slug.current,
    publishedAt,
    excerpt
  }
`;

export const newsItemBySlugQuery = groq`
  *[_type == "newsItem" && slug.current == $slug][0]{
    _id,
    title,
    "slug": slug.current,
    publishedAt,
    excerpt,
    body
  }
`;
