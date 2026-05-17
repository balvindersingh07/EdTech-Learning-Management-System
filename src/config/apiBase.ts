/**
 * API base URL resolution for Axios.
 * - Local dev (`npm run dev`): use `/api` (Vite embeds Express).
 * - Production (Vercel, etc.): if `VITE_API_URL` is unset, use the deployed backend below.
 *
 * Override anytime via Vercel / project env: `VITE_API_URL=https://your-host.azurewebsites.net/api`
 */
const DEPLOYED_LMS_API_BASE =
  "https://edtech-lms-api-balvinder-e8a7fze0fygqb7b8.centralindia-01.azurewebsites.net/api";

export function getApiBaseUrl(): string {
  const fromEnv = import.meta.env.VITE_API_URL?.trim();
  if (fromEnv) {
    return fromEnv.replace(/\/+$/, "");
  }
  if (import.meta.env.DEV) {
    return "/api";
  }
  return DEPLOYED_LMS_API_BASE.replace(/\/+$/, "");
}
