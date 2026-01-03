"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";

import HomeSectionModal from "@/components/admin/home-sections/HomeSectionModal";

type HomeSection = {
  id: number;
  title: string;
  background_image: string; // ex: "/storage/home-sections/xxx.png"
  order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
};

function getFileBase(apiBase: string) {
  // contoh: http://127.0.0.1:8000/api  -> http://127.0.0.1:8000
  return apiBase.replace(/\/api\/?$/, "");
}

function toAbsoluteUrl(fileBase: string, path?: string | null) {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${fileBase}${path.startsWith("/") ? "" : "/"}${path}`;
}

export default function AdminHomeSectionsPage() {
  const { data: session } = useSession();
  const accessToken = (session as any)?.accessToken as string | undefined;

  const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || "";
  const fileBase = useMemo(() => getFileBase(apiBase), [apiBase]);

  const [rows, setRows] = useState<HomeSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<HomeSection | null>(null);

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const nextOrder = useMemo(() => {
    const maxOrder = rows.reduce((m, r) => Math.max(m, Number(r.order ?? 0)), 0);
    return maxOrder + 1;
  }, [rows]);

  async function fetchRows() {
    if (!apiBase) {
      setErrorMsg("NEXT_PUBLIC_API_BASE_URL belum di-set");
      setLoading(false);
      return;
    }
    if (!accessToken) {
      // page ini sudah dijaga middleware, tapi jaga-jaga
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setErrorMsg(null);

      const res = await fetch(`${apiBase}/home-sections`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        cache: "no-store",
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || "Gagal mengambil data");
      }

      const json = await res.json();

      // dukung 2 bentuk: array langsung atau {data:[...]}
      const data: HomeSection[] = Array.isArray(json) ? json : json?.data ?? [];

      // urut by order biar konsisten
      data.sort((a, b) => Number(a.order ?? 0) - Number(b.order ?? 0));

      setRows(data);
    } catch (e: any) {
      setErrorMsg(e?.message || "Error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchRows();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiBase, accessToken]);

  function openAdd() {
    setEditing(null);
    setIsModalOpen(true);
  }

  function openEdit(row: HomeSection) {
    setEditing(row);
    setIsModalOpen(true);
  }

  async function handleDelete(id: number) {
    if (!accessToken) return;

    const ok = confirm("Yakin mau hapus Home Section ini?");
    if (!ok) return;

    try {
      const res = await fetch(`${apiBase}/home-sections/${id}`, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || "Gagal hapus data");
      }

      await fetchRows();
    } catch (e: any) {
      alert(e?.message || "Gagal hapus");
    }
  }

  return (
    <div className="space-y-5">
      {/* HEADER ROW */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Home Sections</h1>
          <p className="text-white/60 mt-1">List hero/home sections (admin)</p>
        </div>

        <button
          onClick={openAdd}
          className="px-4 py-2 rounded-xl bg-[#470000] hover:bg-[#5a0000] transition text-sm font-semibold"
        >
          + Add
        </button>
      </div>

      {/* INFO */}
      <div className="text-sm text-white/60">
        Total: <span className="text-white">{rows.length}</span>
      </div>

      {/* ERROR */}
      {errorMsg && (
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {errorMsg}
        </div>
      )}

      {/* DESKTOP TABLE */}
      <div className="hidden md:block rounded-3xl border border-white/10 bg-black/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-[980px] w-full">
            <thead className="bg-black/30 text-white/70">
              <tr className="[&>th]:py-4 [&>th]:px-4">
                <th className="text-center w-[80px]">No</th>
                <th className="text-center w-[240px]">Title</th>
                <th className="text-center w-[220px]">Background</th>
                <th className="text-center w-[120px]">Order</th>
                <th className="text-center w-[120px]">Active</th>
                <th className="text-center w-[220px]">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-white/10">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-white/60">
                    Loading...
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-white/60">
                    Belum ada data.
                  </td>
                </tr>
              ) : (
                rows.map((row, idx) => {
                  const imgUrl = toAbsoluteUrl(fileBase, row.background_image);
                  return (
                    <tr key={row.id} className="[&>td]:py-5 [&>td]:px-4">
                      <td className="text-center text-white/70">{idx + 1}</td>

                      <td className="text-center font-semibold">{row.title}</td>

                      <td className="text-center">
                        <button
                          type="button"
                          onClick={() => setPreviewUrl(imgUrl)}
                          className="inline-flex items-center justify-center"
                          title="Preview"
                        >
                          <div className="relative h-12 w-20 overflow-hidden rounded-xl border border-white/10 bg-white/5">
                            {imgUrl ? (
                              <Image
                                src={imgUrl}
                                alt={row.title}
                                fill
                                className="object-cover"
                                unoptimized
                              />
                            ) : null}
                          </div>
                        </button>
                      </td>

                      <td className="text-center">{row.order}</td>

                      <td className="text-center">
                        <span
                          className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold border ${
                            row.is_active
                              ? "bg-green-500/15 text-green-200 border-green-500/25"
                              : "bg-white/10 text-white/70 border-white/10"
                          }`}
                        >
                          {String(row.is_active)}
                        </span>
                      </td>

                      <td className="text-center">
                        <div className="inline-flex items-center justify-center gap-2">
                          <button
                            onClick={() => openEdit(row)}
                            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 transition text-sm"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(row.id)}
                            className="px-4 py-2 rounded-xl bg-[#470000] hover:bg-[#5a0000] transition text-sm"
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
      </div>

      {/* MOBILE CARDS */}
      <div className="md:hidden space-y-3">
        {loading ? (
          <div className="rounded-2xl border border-white/10 bg-black/20 p-4 text-white/60">
            Loading...
          </div>
        ) : rows.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-black/20 p-4 text-white/60">
            Belum ada data.
          </div>
        ) : (
          rows.map((row, idx) => {
            const imgUrl = toAbsoluteUrl(fileBase, row.background_image);
            return (
              <div
                key={row.id}
                className="rounded-2xl border border-white/10 bg-black/20 p-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-xs text-white/50 mb-1">No. {idx + 1}</div>
                    <div className="font-semibold truncate">{row.title}</div>
                    <div className="text-xs text-white/60 mt-1">
                      order: <span className="text-white">{row.order}</span> • active:{" "}
                      <span className="text-white">{String(row.is_active)}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setPreviewUrl(imgUrl)}
                    className="shrink-0"
                    title="Preview"
                  >
                    <div className="relative h-12 w-20 overflow-hidden rounded-xl border border-white/10 bg-white/5">
                      {imgUrl ? (
                        <Image
                          src={imgUrl}
                          alt={row.title}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      ) : null}
                    </div>
                  </button>
                </div>

                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => openEdit(row)}
                    className="flex-1 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 transition text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(row.id)}
                    className="flex-1 px-4 py-2 rounded-xl bg-[#470000] hover:bg-[#5a0000] transition text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* CREATE/EDIT MODAL */}
      {isModalOpen && (
        <HomeSectionModal
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSaved={async () => {
            setIsModalOpen(false);
            await fetchRows();
          }}
          // mode add/edit
          initial={editing}
          defaultOrder={nextOrder}
          apiBase={apiBase}
          accessToken={accessToken || ""}
        />
      )}

      {/* IMAGE PREVIEW MODAL */}
      {previewUrl && (
        <div
          className="fixed inset-0 z-[9999] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setPreviewUrl(null)}
        >
          <div
            className="relative w-full max-w-3xl rounded-2xl border border-white/10 bg-black/60 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
              <div className="text-sm text-white/80">Preview</div>
              <button
                onClick={() => setPreviewUrl(null)}
                className="h-9 w-9 rounded-xl bg-white/10 hover:bg-white/15 transition"
                aria-label="Close preview"
              >
                ✕
              </button>
            </div>

            <div className="relative w-full aspect-[16/9] bg-black">
              <Image
                src={previewUrl}
                alt="Preview"
                fill
                className="object-contain"
                unoptimized
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
