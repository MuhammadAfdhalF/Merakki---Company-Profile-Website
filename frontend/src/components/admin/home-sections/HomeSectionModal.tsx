"use client";

import { useEffect, useMemo, useState } from "react";

export type HomeSection = {
  id: number;
  title: string;
  background_image: string;
  order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
};

type Mode = "create" | "edit";

type Props = {
  open: boolean;
  mode: Mode;
  token: string;
  apiBase: string;

  // untuk edit
  initial?: Partial<HomeSection>;

  // untuk create auto order
  defaultOrder: number;

  onClose: () => void;
  onSaved: (row: HomeSection) => void;
};

export default function HomeSectionModal({
  open,
  mode,
  token,
  apiBase,
  initial,
  defaultOrder,
  onClose,
  onSaved,
}: Props) {
  const isEdit = mode === "edit";

  const [title, setTitle] = useState("");
  const [order, setOrder] = useState<number>(defaultOrder);
  const [isActive, setIsActive] = useState(true);
  const [file, setFile] = useState<File | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string>("");

  // preview existing bg
  const fileBase = useMemo(() => apiBase.replace(/\/api\/?$/, ""), [apiBase]);
  const existingImageUrl = initial?.background_image
    ? `${fileBase}${initial.background_image}`
    : "";

  useEffect(() => {
    if (!open) return;

    setError("");
    setFile(null);

    if (isEdit) {
      setTitle(initial?.title ?? "");
      setOrder(Number(initial?.order ?? defaultOrder));
      setIsActive(Boolean(initial?.is_active ?? true));
    } else {
      setTitle("");
      setOrder(defaultOrder);
      setIsActive(true);
    }
  }, [open, isEdit, initial, defaultOrder]);

  if (!open) return null;

  const uploadImage = async (picked: File) => {
    const fd = new FormData();
    fd.append("file", picked);
    fd.append("folder", "home-sections");

    const res = await fetch(`${apiBase}/upload`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: fd,
    });

    if (!res.ok) {
      throw new Error("Upload gagal");
    }

    const json = await res.json();
    if (!json?.path) throw new Error("Response upload tidak valid");
    return String(json.path) as string; // contoh: "/storage/home-sections/xxx.png"
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError("");

    try {
      if (!title.trim()) throw new Error("Title wajib diisi");
      if (!Number.isFinite(order)) throw new Error("Order tidak valid");

      // wajib ada gambar saat create
      if (!isEdit && !file) {
        throw new Error("Background image wajib diupload");
      }

      // background_image logic
      let background_image = initial?.background_image ?? "";
      if (file) {
        background_image = await uploadImage(file);
      }

      const payload = {
        title: title.trim(),
        background_image,
        order: Number(order),
        is_active: Boolean(isActive),
      };

      const url = isEdit
        ? `${apiBase}/home-sections/${initial?.id}`
        : `${apiBase}/home-sections`;

      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const t = await res.text();
        throw new Error(`Save gagal: ${t}`);
      }

      const json = await res.json();

      // kamu sebelumnya pakai format { message, data }
      const saved: HomeSection = json?.data ?? json;

      onSaved(saved);
      onClose();
    } catch (e: any) {
      setError(e?.message || "Terjadi error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* overlay */}
      <button
        onClick={onClose}
        className="absolute inset-0 bg-black/70"
        aria-label="Close modal overlay"
      />

      {/* modal */}
      <div className="relative w-[92vw] max-w-[820px] rounded-2xl border border-white/10 bg-[#0D0D0D] p-6 shadow-2xl">
        {/* header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold">
              {isEdit ? "Edit Home Section" : "Add Home Section"}
            </h2>
            <p className="text-sm text-white/60 mt-1">
              Upload background image {isEdit ? "(opsional saat edit)" : "(wajib)"} lalu simpan.
            </p>
          </div>

          <button
            onClick={onClose}
            className="h-9 w-9 rounded-xl bg-white/5 hover:bg-white/10 transition grid place-items-center"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* body */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* title */}
          <div className="md:col-span-2">
            <label className="text-sm text-white/70">Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-white/20"
              placeholder="Home 1"
            />
          </div>

          {/* order */}
          <div>
            <label className="text-sm text-white/70">Order</label>
            <input
              type="number"
              value={order}
              onChange={(e) => setOrder(Number(e.target.value))}
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-white/20"
            />
            <p className="text-xs text-white/45 mt-2">
              Default auto: {defaultOrder} (kamu masih bisa ubah manual)
            </p>
          </div>

          {/* active */}
          <div className="flex items-end">
            <label className="flex items-center gap-3 text-sm text-white/70 select-none">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="h-4 w-4"
              />
              Active
            </label>
          </div>

          {/* file */}
          <div className="md:col-span-2">
            <label className="text-sm text-white/70">
              Background Image {isEdit ? "(optional)" : "(wajib)"}
            </label>

            <div className="mt-2 rounded-2xl border border-white/10 bg-black/30 p-4">
              {isEdit && existingImageUrl && !file && (
                <div className="mb-3 text-xs text-white/55">
                  Current image:{" "}
                  <a
                    className="underline"
                    href={existingImageUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    preview
                  </a>
                </div>
              )}

              <input
                type="file"
                accept="image/png,image/jpg,image/jpeg,image/webp"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                className="block w-full text-sm text-white/70 file:mr-4 file:rounded-xl file:border-0 file:bg-white/10 file:px-4 file:py-2 file:text-white hover:file:bg-white/15"
              />

              {file && (
                <div className="mt-3 text-xs text-white/55">
                  Selected: {file.name}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* error */}
        {error && (
          <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {error}
          </div>
        )}

        {/* footer */}
        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 transition text-sm"
            disabled={submitting}
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="px-5 py-2 rounded-xl bg-[#470000] hover:bg-[#5a0000] transition text-sm font-medium"
          >
            {submitting ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}

/** modal kecil untuk preview gambar (dipakai page.tsx) */
export function ImagePreviewModal({
  open,
  url,
  title,
  onClose,
}: {
  open: boolean;
  url: string;
  title?: string;
  onClose: () => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      <button
        onClick={onClose}
        className="absolute inset-0 bg-black/80"
        aria-label="Close preview overlay"
      />
      <div className="relative w-[92vw] max-w-[980px] rounded-2xl border border-white/10 bg-[#0D0D0D] p-4 shadow-2xl">
        <div className="flex items-center justify-between gap-3 px-2 pb-3">
          <div className="text-sm text-white/70 truncate">
            {title ?? "Preview"}
          </div>
          <button
            onClick={onClose}
            className="h-9 w-9 rounded-xl bg-white/5 hover:bg-white/10 transition grid place-items-center"
            aria-label="Close preview"
          >
            ✕
          </button>
        </div>

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={url}
          alt={title ?? "Preview"}
          className="w-full max-h-[75vh] object-contain rounded-xl bg-black/30"
        />
      </div>
    </div>
  );
}
