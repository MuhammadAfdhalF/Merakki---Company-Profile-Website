"use client";

import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { Icon } from "@iconify/react";
import PortfolioModal from "@/components/admin/portfolios/PortfolioModal";

type MediaItem = { type: string; path: string };

type Portfolio = {
  id: number;
  title: string;
  slug: string;
  description?: string | null;
  category: "design" | "photography" | "video" | "branding";
  media: MediaItem[];
  is_featured: boolean;
  order: number;
  is_active: boolean;
};

function stripTrailingSlash(s: string) {
  return s.endsWith("/") ? s.slice(0, -1) : s;
}

// apiBase biasanya: http://127.0.0.1:8000/api
// fileBase harus:  http://127.0.0.1:8000
function getFileBaseFromApiBase(apiBase: string) {
  const clean = stripTrailingSlash(apiBase);
  if (clean.endsWith("/api")) return clean.slice(0, -4);
  return clean;
}

function buildFileUrl(fileBase: string, path: string) {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  if (!fileBase) return path;
  return `${stripTrailingSlash(fileBase)}${path.startsWith("/") ? "" : "/"}${path}`;
}

function getFirstMedia(p: Portfolio): MediaItem | null {
  if (!Array.isArray(p.media) || p.media.length === 0) return null;
  return p.media[0];
}

function normalizeType(t?: string) {
  return (t || "").toLowerCase().trim();
}

export default function AdminPortfoliosPage() {
  const { data: session } = useSession();
  const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || "";
  const fileBase = useMemo(() => getFileBaseFromApiBase(apiBase), [apiBase]);
  const accessToken = (session as any)?.accessToken as string | undefined;

  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<Portfolio[]>([]);
  const [error, setError] = useState<string | null>(null);

  // filter category
  const [category, setCategory] = useState<
    "all" | "design" | "photography" | "video" | "branding"
  >("all");

  // modal create/edit
  const [openModal, setOpenModal] = useState(false);
  const [mode, setMode] = useState<"create" | "edit">("create");
  const [editData, setEditData] = useState<Portfolio | null>(null);

  // preview modal
  const [previewOpen, setPreviewOpen] = useState(false);
  const [preview, setPreview] = useState<{
    type: "image" | "video" | "pdf" | "file";
    url: string;
    title: string;
  } | null>(null);

  async function fetchPortfolios() {
    try {
      setError(null);
      setLoading(true);

      if (!apiBase) throw new Error("NEXT_PUBLIC_API_BASE_URL belum di-set");
      if (!accessToken) throw new Error("Kamu belum login");

      const res = await fetch(`${stripTrailingSlash(apiBase)}/portfolios`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || `Fetch gagal (HTTP ${res.status})`);
      }

      const json = await res.json();
      const data = (json?.data || []) as Portfolio[];
      setItems(Array.isArray(data) ? data : []);
    } catch (e: any) {
      setError(e?.message || "Gagal fetch portfolios");
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!accessToken) return;
    fetchPortfolios();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken]);

  const filtered = useMemo(() => {
    if (category === "all") return items;
    return items.filter((x) => x.category === category);
  }, [items, category]);

  const nextOrder = useMemo(() => {
    const maxOrder = items.reduce((m, x) => Math.max(m, Number(x.order || 0)), 0);
    return maxOrder + 1;
  }, [items]);

  function openCreate() {
    setMode("create");
    setEditData(null);
    setOpenModal(true);
  }

  function openEdit(p: Portfolio) {
    setMode("edit");
    setEditData(p);
    setOpenModal(true);
  }

  async function handleDelete(p: Portfolio) {
    const ok = confirm(`Hapus portfolio "${p.title}"?`);
    if (!ok) return;

    try {
      if (!apiBase) throw new Error("NEXT_PUBLIC_API_BASE_URL belum di-set");
      if (!accessToken) throw new Error("Kamu belum login");

      const res = await fetch(
        `${stripTrailingSlash(apiBase)}/portfolios/${p.id}`,
        {
          method: "DELETE",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || `Delete gagal (HTTP ${res.status})`);
      }

      await fetchPortfolios();
    } catch (e: any) {
      alert(e?.message || "Gagal delete");
    }
  }

  function openPreview(p: Portfolio) {
    const m = getFirstMedia(p);
    if (!m?.path) return;

    const t = normalizeType(m.type);
    const url = buildFileUrl(fileBase, m.path);

    let type: "image" | "video" | "pdf" | "file" = "file";
    if (t === "image") type = "image";
    else if (t === "video") type = "video";
    else if (t === "pdf") type = "pdf";
    else type = "file";

    setPreview({
      type,
      url,
      title: p.title,
    });
    setPreviewOpen(true);
  }

  function closePreview() {
    setPreviewOpen(false);
    setPreview(null);
  }

  function MediaThumb({ p }: { p: Portfolio }) {
    const m = getFirstMedia(p);

    if (!m) {
      return (
        <div className="w-20 h-20 rounded-2xl bg-black/30 border border-white/10 flex items-center justify-center text-xs text-white/40">
          —
        </div>
      );
    }

    const t = normalizeType(m.type);
    const url = buildFileUrl(fileBase, m.path);

    // IMAGE
    if (t === "image") {
      return (
        <button
          type="button"
          onClick={() => openPreview(p)}
          className="group w-20 h-20 rounded-2xl overflow-hidden border border-white/10 bg-black/30 flex items-center justify-center"
          title="Klik untuk preview"
        >
          {/* pakai img biar gak ribet next/image domain */}
          <img
            src={url}
            alt={p.title}
            className="w-full h-full object-cover group-hover:opacity-90 transition"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = "none";
            }}
          />
        </button>
      );
    }

    // VIDEO / PDF / FILE ICON
    const icon =
      t === "video"
        ? "mdi:video"
        : t === "pdf"
        ? "mdi:file-pdf-box"
        : "mdi:file";

    const label = t === "video" ? "video" : t === "pdf" ? "pdf" : "file";

    return (
      <button
        type="button"
        onClick={() => openPreview(p)}
        className="w-20 h-20 rounded-2xl bg-black/30 border border-white/10 flex flex-col items-center justify-center gap-1 hover:bg-white/5 transition"
        title="Klik untuk preview"
      >
        <Icon icon={icon} className="text-2xl text-white/80" />
        <span className="text-[11px] text-white/60 uppercase">{label}</span>
      </button>
    );
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="text-4xl font-bold">Portfolios</h1>
          <p className="text-white/60 mt-2">Manage portfolios (admin)</p>
          <p className="text-white/50 text-sm mt-1">Total: {filtered.length}</p>

          {error && (
            <div className="mt-3 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
              {error}
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3 justify-end">
          {/* FILTER */}
          <div className="flex items-center gap-3">
            <span className="text-sm text-white/60">Category</span>
            <select
              value={category}
              onChange={(e) =>
                setCategory(
                  e.target.value as
                    | "all"
                    | "design"
                    | "photography"
                    | "video"
                    | "branding"
                )
              }
              className="rounded-xl bg-black/30 border border-white/10 px-4 py-3 outline-none focus:border-white/20"
            >
              <option value="all">all</option>
              <option value="design">design</option>
              <option value="photography">photography</option>
              <option value="video">video</option>
              <option value="branding">branding</option>
            </select>
          </div>

          <button
            onClick={fetchPortfolios}
            className="px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition"
          >
            Refresh
          </button>

          <button
            onClick={openCreate}
            className="px-5 py-3 rounded-xl bg-[#470000] hover:bg-[#5a0000] transition font-medium"
          >
            + Add
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="rounded-3xl border border-white/10 bg-black/20 overflow-x-auto">
        <table className="w-full min-w-[980px]">
          <thead>
            <tr className="text-white/70 text-sm border-b border-white/10">
              <th className="py-5 px-6 text-center">No</th>
              <th className="py-5 px-6 text-center">Title</th>
              <th className="py-5 px-6 text-center">Category</th>
              <th className="py-5 px-6 text-center">Media</th>
              <th className="py-5 px-6 text-center">Featured</th>
              <th className="py-5 px-6 text-center">Order</th>
              <th className="py-5 px-6 text-center">Active</th>
              <th className="py-5 px-6 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} className="py-10 text-center text-white/50">
                  Loading...
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-10 text-center text-white/50">
                  No data
                </td>
              </tr>
            ) : (
              filtered.map((p, idx) => {
                const m = getFirstMedia(p);
                const badge = (val: boolean) => (
                  <span
                    className={`inline-flex items-center justify-center px-4 py-1 rounded-full text-xs border ${
                      val
                        ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/20"
                        : "bg-white/5 text-white/60 border-white/10"
                    }`}
                  >
                    {String(val)}
                  </span>
                );

                return (
                  <tr key={p.id} className="border-b border-white/5">
                    <td className="py-7 px-6 text-center">{idx + 1}</td>

                    <td className="py-7 px-6 text-center">
                      <div className="font-semibold">{p.title}</div>
                      <div className="text-xs text-white/40">/{p.slug}</div>
                    </td>

                    <td className="py-7 px-6 text-center">
                      <span className="inline-flex items-center justify-center px-4 py-1 rounded-full text-xs border border-white/10 bg-white/5">
                        {p.category}
                      </span>
                    </td>

                    <td className="py-7 px-6 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <MediaThumb p={p} />

                        {/* Preview button tetap ada */}
                        {m?.path ? (
                          <button
                            onClick={() => openPreview(p)}
                            className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition text-sm"
                          >
                            Preview
                          </button>
                        ) : null}
                      </div>
                    </td>

                    <td className="py-7 px-6 text-center">{badge(p.is_featured)}</td>
                    <td className="py-7 px-6 text-center">{p.order}</td>
                    <td className="py-7 px-6 text-center">{badge(p.is_active)}</td>

                    <td className="py-7 px-6 text-center">
                      <div className="flex items-center justify-center gap-3">
                        <button
                          onClick={() => openEdit(p)}
                          className="px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => handleDelete(p)}
                          className="px-5 py-3 rounded-xl bg-[#470000] hover:bg-[#5a0000] transition"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL CREATE/EDIT */}
      <PortfolioModal
        open={openModal}
        mode={mode}
        initialData={editData}
        nextOrder={nextOrder}
        onClose={() => setOpenModal(false)}
        onSaved={async () => {
          setOpenModal(false);
          await fetchPortfolios();
        }}
      />

      {/* PREVIEW MODAL */}
      {previewOpen && preview && (
        <div className="fixed inset-0 z-[9999] bg-black/70 flex items-center justify-center p-4">
          <div className="w-full max-w-4xl rounded-2xl border border-white/10 bg-[#0D0D0D] overflow-hidden">
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
              <div>
                <div className="text-lg font-semibold">{preview.title}</div>
                <div className="text-sm text-white/50">
                  Preview: {preview.type.toUpperCase()}
                </div>
              </div>

              <button
                onClick={closePreview}
                className="px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10"
              >
                ✕
              </button>
            </div>

            <div className="p-6">
              {preview.type === "image" && (
                <img
                  src={preview.url}
                  alt={preview.title}
                  className="w-full max-h-[70vh] object-contain rounded-xl border border-white/10"
                />
              )}

              {preview.type === "video" && (
                <video
                  src={preview.url}
                  controls
                  className="w-full max-h-[70vh] rounded-xl border border-white/10 bg-black"
                />
              )}

              {preview.type === "pdf" && (
                <iframe
                  src={preview.url}
                  className="w-full h-[70vh] rounded-xl border border-white/10 bg-black"
                />
              )}

              {preview.type === "file" && (
                <div className="rounded-xl border border-white/10 bg-black/30 p-6 text-center">
                  <div className="text-white/60">
                    File tidak bisa dipreview langsung.
                  </div>
                  <a
                    href={preview.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex mt-4 px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition"
                  >
                    Open file
                  </a>
                </div>
              )}
            </div>

            <div className="px-6 py-5 border-t border-white/10 flex items-center justify-end">
              <button
                onClick={closePreview}
                className="px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
