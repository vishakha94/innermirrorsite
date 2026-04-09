import { createClient, type QueryParams } from "next-sanity";

import { apiVersion, dataset, projectId } from "../env";

export function getSanityClient() {
  if (!projectId) {
    return null;
  }
  return createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: true,
  });
}

export async function sanityFetch<T>({
  query,
  params = {},
  revalidate = 60,
}: {
  query: string;
  params?: QueryParams;
  revalidate?: number | false;
}): Promise<T | null> {
  const client = getSanityClient();
  if (!client) {
    return null;
  }
  return client.fetch<T>(query, params, {
    next: { revalidate: revalidate === false ? 0 : revalidate },
  });
}
