import { createClient } from "next-sanity";

import { apiVersion, dataset, projectId } from "../env";

/** Server-only Sanity client with write access. Requires `SANITY_API_WRITE_TOKEN`. */
export function getSanityWriteClient() {
  const token = process.env.SANITY_API_WRITE_TOKEN?.trim();
  if (!projectId || !token) {
    return null;
  }
  return createClient({
    projectId,
    dataset,
    apiVersion,
    token,
    useCdn: false,
  });
}
