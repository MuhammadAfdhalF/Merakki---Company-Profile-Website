export function getBackendOrigin() {
  const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || "";
  // contoh: http://127.0.0.1:8000/api  ->  http://127.0.0.1:8000
  return apiBase.replace(/\/api\/?$/, "");
}

export function backendFileUrl(path?: string | null) {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  const origin = getBackendOrigin();
  return `${origin}${path.startsWith("/") ? "" : "/"}${path}`;
}
