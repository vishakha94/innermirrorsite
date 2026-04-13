/**
 * True when running `next dev` locally. False for production builds (including
 * `next start`, Vercel production, and preview deployments).
 */
export const isNextDev = process.env.NODE_ENV === "development";
