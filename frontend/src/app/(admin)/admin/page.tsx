"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";

type StatBlock = {
  total: number;
  active: number;
  featured?: number;
};

type DashboardStats = {
  portfolios: StatBlock;
  homeSections: StatBlock;
  whyChooses: StatBlock;
  clients: StatBlock;
  faqs: StatBlock;
};

type ApiListResponse<T> = {
  data?: T[] | any;
  message?: string;
};

function extractArray<T = any>(json: any): T[] {
  if (!json) return [];
  if (Array.isArray(json)) return json;
  if (Array.isArray(json.data)) return json.data;
  // jaga-jaga kalau nested
  if (json.data && Array.isArray(json.data.data)) return json.data.data;
  return [];
}

function countActive(items: any[]): number {
  return items.filter((x) => x?.is_active === true || x?.is_active === 1).length;
}

function countFeatured(items: any[]): number {
  return items.filter((x) => x?.is_featured === true || x?.is_featured === 1).length;
}

export default function AdminDashboardPage() {
  const { data: session, status } = useSession();

  const apiBase = useMemo(() => {
    // contoh: http://127.0.0.1:8000/api
    return process.env.NEXT_PUBLIC_API_BASE_URL || "";
  }, []);

  const accessToken = (session as any)?.accessToken as string | undefined;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [stats, setStats] = useState<DashboardStats | null>(null);

  const headers = useMemo(() => {
    const h: Record<string, string> = { "Content-Type": "application/json" };
    if (accessToken) h.Authorization = `Bearer ${accessToken}`;
    return h;
  }, [accessToken]);

  async function fetchList(path: string) {
    const res = await fetch(`${apiBase}${path}`, {
      method: "GET",
      headers,
      cache: "no-store",
    });

    // kalau token invalid / unauthorized, biasanya 401
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`GET ${path} gagal (${res.status}). ${text}`.slice(0, 180));
    }

    const json = (await res.json().catch(() => null)) as ApiListResponse<any>;
    return extractArray(json);
  }

  async function load() {
    if (!apiBase) {
      setError("NEXT_PUBLIC_API_BASE_URL belum di-set (cek .env.local).");
      return;
    }
    if (!accessToken) return;

    try {
      setError("");
      setLoading(true);

      const [
        portfolios,
        homeSections,
        whyChooses,
        clients,
        faqs,
      ] = await Promise.all([
        fetchList("/portfolios"),
        fetchList("/home-sections"),
        fetchList("/why-chooses"),
        fetchList("/clients"),
        fetchList("/faqs"),
      ]);

      const nextStats: DashboardStats = {
        portfolios: {
          total: portfolios.length,
          active: countActive(portfolios),
          featured: countFeatured(portfolios),
        },
        homeSections: {
          total: homeSections.length,
          active: countActive(homeSections),
        },
        whyChooses: {
          total: whyChooses.length,
          active: countActive(whyChooses),
        },
        clients: {
          total: clients.length,
          active: countActive(clients),
        },
        faqs: {
          total: faqs.length,
          active: countActive(faqs),
        },
      };

      setStats(nextStats);
    } catch (e: any) {
      setError(e?.message || "Gagal load dashboard.");
      setStats(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // tunggu session ready
    if (status === "authenticated") load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, accessToken]);

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold">Dashboard</h1>
          <p className="text-white/60 mt-1">
            Ringkasan data admin (Portfolios – FAQs)
          </p>
        </div>

        <button
          onClick={load}
          className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition text-sm"
          disabled={loading || status !== "authenticated"}
        >
          {loading ? "Loading..." : "Refresh"}
        </button>
      </div>

      {/* ERROR */}
      {error && (
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">
          {error}
        </div>
      )}

      {/* STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        <StatCard
          title="Portfolios"
          subtitle="Total / Active / Featured"
          value={
            stats
              ? `${stats.portfolios.total} / ${stats.portfolios.active} / ${stats.portfolios.featured ?? 0}`
              : loading
              ? "..."
              : "-"
          }
          href="/admin/portfolios"
        />

        <StatCard
          title="Home Sections"
          subtitle="Total / Active"
          value={
            stats
              ? `${stats.homeSections.total} / ${stats.homeSections.active}`
              : loading
              ? "..."
              : "-"
          }
          href="/admin/home-sections"
        />

        <StatCard
          title="Why Chooses"
          subtitle="Total / Active"
          value={
            stats
              ? `${stats.whyChooses.total} / ${stats.whyChooses.active}`
              : loading
              ? "..."
              : "-"
          }
          href="/admin/why-chooses"
        />

        <StatCard
          title="Clients"
          subtitle="Total / Active"
          value={
            stats
              ? `${stats.clients.total} / ${stats.clients.active}`
              : loading
              ? "..."
              : "-"
          }
          href="/admin/clients"
        />

        <StatCard
          title="FAQs"
          subtitle="Total / Active"
          value={
            stats
              ? `${stats.faqs.total} / ${stats.faqs.active}`
              : loading
              ? "..."
              : "-"
          }
          href="/admin/faqs"
        />
      </div>

      {/* QUICK ACTIONS */}
      <div className="rounded-2xl border border-white/10 bg-black/30 p-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-lg font-semibold">Quick Actions</div>
            <div className="text-white/60 text-sm mt-1">
              Lompat cepat ke halaman CRUD.
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <QuickLink href="/admin/portfolios" label="Manage Portfolios" />
          <QuickLink href="/admin/home-sections" label="Manage Home Sections" />
          <QuickLink href="/admin/why-chooses" label="Manage Why Chooses" />
          <QuickLink href="/admin/clients" label="Manage Clients" />
          <QuickLink href="/admin/faqs" label="Manage FAQs" />
        </div>
      </div>
    </div>
  );
}

function StatCard({
  title,
  subtitle,
  value,
  href,
}: {
  title: string;
  subtitle: string;
  value: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="group rounded-2xl border border-white/10 bg-black/30 p-5 hover:bg-black/40 hover:border-white/20 transition"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-white/70 text-sm">{title}</div>
          <div className="text-white/50 text-xs mt-1">{subtitle}</div>
        </div>
        <div className="text-xs text-white/50 group-hover:text-white/70 transition">
          Open →
        </div>
      </div>

      <div className="mt-4 text-2xl font-semibold tabular-nums">{value}</div>
    </Link>
  );
}

function QuickLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition text-sm"
    >
      {label}
    </Link>
  );
}
