"use client";

import { useId, useState } from "react";

import type { NewsletterCopy, NewsletterSignupSource } from "@/lib/newsletter";
import { CTA_COPY } from "@/lib/site-cta";

type NewsletterSignupFormProps = {
  copy: NewsletterCopy;
  source: NewsletterSignupSource;
  variant?: "section" | "compact";
};

type FormStatus = "idle" | "submitting" | "success" | "error";

export function NewsletterSignupForm({
  copy,
  source,
  variant = "section",
}: NewsletterSignupFormProps) {
  const formId = useId();
  const emailId = `${formId}-email`;
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<FormStatus>("idle");
  const [message, setMessage] = useState("");

  const isCompact = variant === "compact";

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setMessage("");

    try {
      const response = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source, website: "" }),
      });
      const data = (await response.json()) as { ok?: boolean; message?: string };

      if (data.ok) {
        setStatus("success");
        setMessage(data.message ?? CTA_COPY.newsletter.success);
        setEmail("");
        return;
      }

      setStatus("error");
      setMessage(data.message ?? CTA_COPY.newsletter.error);
    } catch {
      setStatus("error");
      setMessage(CTA_COPY.newsletter.error);
    }
  }

  const statusRole = status === "success" || status === "error" ? "status" : undefined;

  return (
    <form
      onSubmit={handleSubmit}
      className={isCompact ? "w-full max-w-md" : "mx-auto w-full max-w-xl"}
      noValidate
    >
      <div
        className={
          isCompact
            ? "flex flex-col gap-3 sm:flex-row sm:items-end"
            : "flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-center"
        }
      >
        <div className={isCompact ? "min-w-0 flex-1" : "w-full sm:max-w-sm"}>
          <label htmlFor={emailId} className="sr-only">
            {CTA_COPY.newsletter.emailLabel}
          </label>
          <input
            id={emailId}
            name="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder={CTA_COPY.newsletter.emailPlaceholder}
            disabled={status === "submitting" || status === "success"}
            className="w-full rounded-full border border-stone-300 bg-white px-5 py-3 text-sm text-stone-900 shadow-sm outline-none transition placeholder:text-stone-400 focus:border-amber-800/40 focus:ring-2 focus:ring-amber-800/15 disabled:opacity-60"
          />
        </div>
        <button
          type="submit"
          disabled={status === "submitting" || status === "success"}
          className={
            isCompact
              ? "shrink-0 rounded-full bg-stone-900 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-60"
              : "rounded-full bg-stone-900 px-7 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-60 sm:shrink-0"
          }
        >
          {status === "submitting" ? CTA_COPY.newsletter.submitting : CTA_COPY.newsletter.submit}
        </button>
      </div>

      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        className="sr-only"
        aria-hidden
      />

      <p className={`mt-3 text-xs leading-relaxed text-stone-500 ${isCompact ? "text-left" : "text-center"}`}>
        {copy.privacyNote}
      </p>

      {message ? (
        <p
          role={statusRole}
          className={`mt-3 text-sm ${
            status === "success" ? "text-amber-900" : "text-red-800"
          } ${isCompact ? "text-left" : "text-center"}`}
        >
          {message}
        </p>
      ) : null}
    </form>
  );
}
