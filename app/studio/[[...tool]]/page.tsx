"use client";

import { NextStudio } from "next-sanity/studio";

import { projectId } from "@/sanity/env";

import config from "../../../sanity.config";

export default function StudioPage() {
  if (!projectId?.trim()) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-stone-50 px-6 text-center">
        <h1 className="font-serif text-xl font-semibold text-stone-900">Sanity project ID missing</h1>
        <p className="max-w-md text-sm leading-relaxed text-stone-600">
          Add your Sanity project ID to{" "}
          <code className="rounded bg-stone-200/80 px-1.5 py-0.5">.env.local</code> as{" "}
          <code className="rounded bg-stone-200/80 px-1.5 py-0.5">NEXT_PUBLIC_SANITY_PROJECT_ID</code>
          , then restart <code className="rounded bg-stone-200/80 px-1.5 py-0.5">npm run dev</code>.
          Copy the ID from{" "}
          <a
            href="https://www.sanity.io/manage"
            className="font-medium text-amber-900 underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            sanity.io/manage
          </a>{" "}
          → your project → Project ID.
        </p>
      </div>
    );
  }

  return <NextStudio config={config} />;
}
