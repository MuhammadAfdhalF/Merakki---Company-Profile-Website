// src/lib/publicApi.ts
import { backendFileUrl } from "@/lib/backendUrl";

export type HeroItem = {
  id: number;
  title: string;
  background_image: string; // "/storage/..."
  order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
};

export type PublicHomeResponse = {
  heroes: HeroItem[];
  why_chooses?: any[];
  featured_portfolios?: any[];
  clients?: any[];
  faqs?: any[];
};

function getApiBase() {
  const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || "";
  if (!apiBase) throw new Error("NEXT_PUBLIC_API_BASE_URL belum di-set");
  return apiBase;
}

/**
 * Fetch public landing data from Laravel:
 * GET {API_BASE}/home
 */
export async function fetchPublicHome(): Promise<PublicHomeResponse> {
  const apiBase = getApiBase();

  const res = await fetch(`${apiBase}/home`, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
    // untuk client-side, cache hint ini aman dipakai
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`GET /home gagal (${res.status}). ${text}`.slice(0, 200));
  }

  const json = (await res
    .json()
    .catch(() => null)) as PublicHomeResponse | null;
  if (!json || !Array.isArray(json.heroes)) {
    return { heroes: [] };
  }
  return json;
}

/**
 * Convert heroes.background_image => usable image urls for DEV/PROD.
 * - input: "/storage/..."
 * - output (dev): "http://127.0.0.1:8000/storage/..."
 * - output (prod 1 domain): "https://domain.com/storage/..."
 */
export function getHeroSlideUrls(home: any): string[] {
  const heroes: any[] = Array.isArray(home?.heroes) ? home.heroes : [];

  const urls = heroes
    .map((h) => backendFileUrl(h?.background_image))
    .filter((x): x is string => typeof x === "string" && x.length > 0);

  // optional: unique (biar aman kalau ada duplikat)
  return Array.from(new Set(urls));
}

export async function fetchPublicPortfolios(category: string = "all") {
  const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!apiBase) throw new Error("NEXT_PUBLIC_API_BASE_URL belum di-set");

  const url = `${apiBase}/public/portfolios?category=${encodeURIComponent(category)}`;

  const res = await fetch(url, {
    method: "GET",
    headers: { Accept: "application/json" },
    cache: "no-store",
  });

  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(
      `Fetch portfolios gagal (${res.status}): ${txt}`.slice(0, 200),
    );
  }

  const json = await res.json().catch(() => null);
  const data = Array.isArray(json?.data) ? json.data : [];
  return data;
}
