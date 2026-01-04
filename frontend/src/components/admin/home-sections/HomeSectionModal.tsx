"use client";

import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";

export type HomeSection = {
  id: number;
  title: string;
  background_image: string;
  order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
};

function backendOriginFromApiBase(apiBase: string) {
  return apiBase.replace(/\/api\/?$/, "");
}

function toPublicAssetUrl(apiBase: string, path?: string) {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  const origin = backendOriginFromApiBase(apiBase);
  return `${origin}${path.startsWith("/") ? "" : "/"}${path}`;
}

export default function HomeSectionModal({
  open,
  mode,
  initialData,
  nextOrder,
  onClose,
  onSaved,
}: {
  open: boolean;
  mode: "create" | "edit";
  initialData: HomeSection | null;
  nextOrder: number;
  onClose: () => void;
  onSaved: () => void | Promise<void>;
}) {
  const { data: session } = useSession();

  const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || "";
  const accessToken = (session as any)?.accessToken as string | undefined;

  const [title, setTitle] = useState("");
  const [order, setOrder] = useState<number>(nextOrder);
  const [isActive, setIsActive] = useState(true);

  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  const existingImagePath = useMemo(() => {
    if (!initialData) return "";
    return initialData.background_image || "";
  }, [initialData]);

  const existingImageUrl = useMemo(() => {
    return toPublicAssetUrl(apiBase, existingImagePath);
  }, [apiBase, existingImagePath]);

  useEffect(() => {
    if (!open) return;

    if (mode === "edit" && initialData) {
      setTitle(initialData.title ?? "");
      setOrder(Number(initialData.order ?? 0));
      setIsActive(Boolean(initialData.is_active));
    } else {
      setTitle("");
      setOrder(nextOrder);
      setIsActive(true);
    }

    setFile(null);
  }, [open, mode, initialData, nextOrder]);

  if (!open) return null;

  async function uploadImage(): Promise<string> {
    if (!file) return "";
    if (!apiBase) throw new Error("NEXT_PUBLIC_API_BASE_URL belum di-set");
    if (!accessToken) throw new Error("Kamu belum login");

    const fd = new FormData();
    fd.append("file", file);
    fd.append("folder", "home-sections");

    const res = await fetch(`${apiBase}/upload`, {
      method: "POST",
      headers: { Authorization: `Bearer ${accessToken}` },
      body: fd,
    });

    if (!res.ok) {
      const txt = await res.text();
      throw new Error(txt || `Upload gagal (HTTP ${res.status})`);
    }

    const json = await res.json();
    if (!json?.path) throw new Error("Response upload tidak ada path");
    return String(json.path);
  }

  async function handleSave() {
    try {
      if (!apiBase) throw new Error("NEXT_PUBLIC_API_BASE_URL belum di-set");
      if (!accessToken) throw new Error("Kamu belum login");

      if (!title.trim()) throw new Error("Title wajib diisi");
      if (!Number.isFinite(Number(order))) throw new Error("Order tidak valid");

      // wajib ada gambar saat create
      if (mode === "create" && !file) {
        throw new Error("Background image wajib diupload untuk create");
      }

      setSaving(true);

      let background_image = existingImagePath;
      if (file) background_image = await uploadImage();

      const payload = {
        title: title.trim(),
        background_image,
        order: Number(order),
        is_active: Boolean(isActive),
      };

      const url =
        mode === "create"
          ? `${apiBase}/home-sections`
          : `${apiBase}/home-sections/${initialData?.id}`;

      const method = mode === "create" ? "POST" : "PATCH";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || `Save gagal (HTTP ${res.status})`);
      }

      await onSaved();
      onClose();
    } catch (e: any) {
      alert(e?.message || "Gagal simpan");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-3xl rounded-2xl border border-white/10 bg-[#0D0D0D] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
          <div>
            <h2 className="text-xl font-semibold">
              {mode === "create" ? "Add Home Section" : "Edit Home Section"}
            </h2>
            <p className="text-sm text-white/60 mt-1">
              Upload background image {mode === "edit" ? "(opsional)" : "(wajib)"}, lalu simpan.
            </p>
          </div>

          <button
            onClick={onClose}
            className="px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* Title */}
          <div>
            <label className="block text-sm text-white/70 mb-2">Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Home 1"
              className="w-full rounded-xl bg-black/30 border border-white/10 px-4 py-3 outline-none focus:border-white/20"
            />
          </div>

          {/* Order + Active */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-white/70 mb-2">Order</label>
              <input
                type="number"
                value={order}
                onChange={(e) => setOrder(Number(e.target.value))}
                className="w-full rounded-xl bg-black/30 border border-white/10 px-4 py-3 outline-none focus:border-white/20"
              />
              <p className="mt-1 text-xs text-white/40">
                Default otomatis: {nextOrder}
              </p>
            </div>

            <div className="flex items-center gap-3 md:mt-7">
              <input
                id="isActiveHomeSection"
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="h-5 w-5"
              />
              <label htmlFor="isActiveHomeSection" className="text-sm text-white/80">
                Active
              </label>
            </div>
          </div>

          {/* Background image */}
          <div>
            <label className="block text-sm text-white/70 mb-2">
              Background Image {mode === "create" ? "(wajib)" : "(opsional jika mau ganti)"}
            </label>

            <div className="flex flex-col md:flex-row gap-4 md:items-center">
              <input
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/webp"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                className="w-full md:flex-1 rounded-xl bg-black/30 border border-white/10 px-4 py-3"
              />

              <div className="flex items-center gap-3">
                {file ? (
                  <div className="text-xs text-white/60">
                    File: <span className="text-white">{file.name}</span>
                  </div>
                ) : existingImageUrl ? (
                  <div className="flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={existingImageUrl}
                      alt="Current background"
                      className="h-12 w-20 rounded-xl object-cover border border-white/10 bg-black/30"
                    />
                    <div className="text-xs text-white/60">Pakai gambar lama</div>
                  </div>
                ) : (
                  <div className="text-xs text-white/40">Belum ada gambar</div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-5 border-t border-white/10 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10"
            disabled={saving}
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            className="px-5 py-3 rounded-xl bg-[#470000] hover:bg-[#5a0000] transition font-medium disabled:opacity-60"
            disabled={saving}
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
