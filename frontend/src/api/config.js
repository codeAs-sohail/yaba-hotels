/**
 * Resolves the backend API base URL using Vite environment variables.
 * Prioritizes import.meta.env.VITE_API_URL, then falls back to VITE_API_BASE_URL.
 * Automatically normalizes trailing slashes and ensures the path routes to `/api/`.
 *
 * Supported formats:
 * - https://yaba-backend.onrender.com -> https://yaba-backend.onrender.com/api/
 * - https://yaba-backend.onrender.com/api -> https://yaba-backend.onrender.com/api/
 * - https://yaba-backend.onrender.com/api/ -> https://yaba-backend.onrender.com/api/
 * - /api/ -> /api/
 * - undefined / empty -> /api/ (defaults to relative proxy)
 */
export const getApiBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL;
  if (!envUrl) return "/api/";

  const trimmed = envUrl.trim().replace(/\/+$/, "");
  if (trimmed.endsWith("/api")) {
    return `${trimmed}/`;
  }
  if (trimmed === "/api" || trimmed === "") {
    return "/api/";
  }
  return `${trimmed}/api/`;
};

export const API_BASE_URL = getApiBaseUrl();
