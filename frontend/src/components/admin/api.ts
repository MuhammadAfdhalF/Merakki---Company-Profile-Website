export const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

// path contoh: "/home-sections" (tanpa /api karena API_BASE kamu sudah .../api)
export async function apiFetch<T>(
  token: string,
  path: string,
  options: RequestInit = {}
): Promise<T> {
  if (!API_BASE) throw new Error("NEXT_PUBLIC_API_BASE_URL belum di-set");

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Request failed: ${res.status}`);
  }

  return res.json();
}

export async function uploadFile(token: string, file: File, folder = "home-sections") {
  if (!API_BASE) throw new Error("NEXT_PUBLIC_API_BASE_URL belum di-set");

  const form = new FormData();
  form.append("file", file);
  form.append("folder", folder);

  const res = await fetch(`${API_BASE}/upload`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
    body: form,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Upload failed: ${res.status}`);
  }

  const json = await res.json();
  // Laravel UploadController balikin: { path: "/storage/..." }
  return json.path as string;
}
