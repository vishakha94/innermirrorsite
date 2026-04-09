import createImageUrlBuilder, { type SanityImageSource } from "@sanity/image-url";

import { dataset, projectId } from "../env";

const builder =
  projectId != null && projectId !== ""
    ? createImageUrlBuilder({ projectId, dataset })
    : null;

export function urlForImage(source: SanityImageSource) {
  if (!builder) {
    return null;
  }
  return builder.image(source);
}
