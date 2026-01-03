"use client";

import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";

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

function guessTypeFromFile(file: File): string {
    const t = (file.type || "").toLowerCase();
    if (t.startsWith("image/")) return "image";
    if (t.startsWith("video/")) return "video";
    if (t === "application/pdf") return "pdf";
    return "file";
}

export default function PortfolioModal({
    open,
    mode,
    initialData,
    nextOrder,
    onClose,
    onSaved,
}: {
    open: boolean;
    mode: "create" | "edit";
    initialData: Portfolio | null;
    nextOrder: number;
    onClose: () => void;
    onSaved: () => void | Promise<void>;
}) {
    const { data: session } = useSession();

    const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || "";
    const accessToken = (session as any)?.accessToken as string | undefined;

    const [title, setTitle] = useState("");
    const [slug, setSlug] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState<Portfolio["category"]>("design");
    const [isFeatured, setIsFeatured] = useState(false);
    const [order, setOrder] = useState<number>(nextOrder);
    const [isActive, setIsActive] = useState(true);

    // existing media (edit)
    const existingMedia = useMemo<MediaItem[]>(() => {
        return initialData?.media || [];
    }, [initialData]);

    // new files to upload
    const [files, setFiles] = useState<File[]>([]);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!open) return;

        if (mode === "edit" && initialData) {
            setTitle(initialData.title ?? "");
            setSlug(initialData.slug ?? "");
            setDescription(initialData.description ?? "");
            setCategory(initialData.category ?? "design");
            setIsFeatured(Boolean(initialData.is_featured));
            setOrder(Number(initialData.order ?? 0));
            setIsActive(Boolean(initialData.is_active));
        } else {
            setTitle("");
            setSlug("");
            setDescription("");
            setCategory("design");
            setIsFeatured(false);
            setOrder(nextOrder);
            setIsActive(true);
        }

        setFiles([]);
    }, [open, mode, initialData, nextOrder]);

    if (!open) return null;

    async function uploadOne(file: File): Promise<MediaItem> {
        if (!apiBase) throw new Error("NEXT_PUBLIC_API_BASE_URL belum di-set");
        if (!accessToken) throw new Error("Kamu belum login");

        const fd = new FormData();
        fd.append("file", file);
        fd.append("folder", "portfolios");

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

        return {
            type: guessTypeFromFile(file),
            path: json.path as string,
        };
    }

    async function uploadAll(selected: File[]): Promise<MediaItem[]> {
        const out: MediaItem[] = [];
        for (const f of selected) {
            out.push(await uploadOne(f));
        }
        return out;
    }

    function normalizeSlug(s: string) {
        return s
            .toLowerCase()
            .trim()
            .replace(/\s+/g, "-")
            .replace(/[^a-z0-9\-]/g, "")
            .replace(/\-+/g, "-");
    }

    async function handleSave() {
        try {
            if (!apiBase) throw new Error("NEXT_PUBLIC_API_BASE_URL belum di-set");
            if (!accessToken) throw new Error("Kamu belum login");

            if (!title.trim()) throw new Error("Title wajib diisi");
            if (!slug.trim()) throw new Error("Slug wajib diisi");
            if (!Number.isFinite(Number(order))) throw new Error("Order tidak valid");

            const cleanSlug = normalizeSlug(slug);

            // media wajib: create -> harus upload minimal 1 file
            if (mode === "create" && files.length === 0) {
                throw new Error("Media wajib diupload minimal 1 file");
            }

            // edit: jika tidak upload apa-apa -> pakai existing
            // edit: jika upload -> REPLACE media dengan hasil upload
            let mediaPayload: MediaItem[] = existingMedia;
            if (files.length > 0) {
                mediaPayload = await uploadAll(files);
            }

            // tetap wajib ada media (sesuai request kamu)
            if (!Array.isArray(mediaPayload) || mediaPayload.length === 0) {
                throw new Error("Media wajib ada minimal 1 item");
            }

            setSaving(true);

            const payload = {
                title: title.trim(),
                slug: cleanSlug,
                description: description.trim() ? description.trim() : null,
                category,
                media: mediaPayload,
                is_featured: Boolean(isFeatured),
                order: Number(order),
                is_active: Boolean(isActive),
            };

            const url =
                mode === "create"
                    ? `${apiBase}/portfolios`
                    : `${apiBase}/portfolios/${initialData?.id}`;

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
                            {mode === "create" ? "Add Portfolio" : "Edit Portfolio"}
                        </h2>
                        <p className="text-sm text-white/60 mt-1">
                            {mode === "edit"
                                ? "Upload media baru untuk replace media lama."
                                : "Upload minimal 1 file media."}
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Title */}
                        <div>
                            <label className="block text-sm text-white/70 mb-2">Title</label>
                            <input
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Portfolio title"
                                className="w-full rounded-xl bg-black/30 border border-white/10 px-4 py-3 outline-none focus:border-white/20"
                            />
                        </div>

                        {/* Slug */}
                        <div>
                            <label className="block text-sm text-white/70 mb-2">Slug</label>
                            <input
                                value={slug}
                                onChange={(e) => setSlug(e.target.value)}
                                placeholder="portfolio-title"
                                className="w-full rounded-xl bg-black/30 border border-white/10 px-4 py-3 outline-none focus:border-white/20"
                            />
                            <p className="mt-1 text-xs text-white/40">
                                auto-normalize: {normalizeSlug(slug || "")}
                            </p>
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm text-white/70 mb-2">
                            Description (optional)
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={4}
                            placeholder="Optional description..."
                            className="w-full rounded-xl bg-black/30 border border-white/10 px-4 py-3 outline-none focus:border-white/20 resize-none"
                        />
                    </div>

                    {/* Category + Order */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-white/70 mb-2">Category</label>
                            <select
                                value={category}
                                onChange={(e) =>
                                    setCategory(e.target.value as Portfolio["category"])
                                }
                                className="w-full rounded-xl bg-black/30 border border-white/10 px-4 py-3 outline-none focus:border-white/20"
                            >
                                <option value="design">design</option>
                                <option value="photography">photography</option>
                                <option value="video">video</option>
                                <option value="branding">branding</option>
                            </select>
                        </div>

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
                    </div>

                    {/* Featured + Active */}
                    <div className="flex flex-col md:flex-row gap-4 md:items-center">
                        <label className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                checked={isFeatured}
                                onChange={(e) => setIsFeatured(e.target.checked)}
                                className="h-5 w-5"
                            />
                            <span className="text-sm text-white/80">Featured</span>
                        </label>

                        <label className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                checked={isActive}
                                onChange={(e) => setIsActive(e.target.checked)}
                                className="h-5 w-5"
                            />
                            <span className="text-sm text-white/80">Active</span>
                        </label>
                    </div>

                    {/* Media Upload */}
                    <div>
                        <label className="block text-sm text-white/70 mb-2">
                            Media{" "}
                            {mode === "create"
                                ? "(wajib, minimal 1 file)"
                                : "(upload jika mau replace)"}
                        </label>

                        <input
                            type="file"
                            multiple
                            accept="image/*,video/*,application/pdf"
                            onChange={(e) => setFiles(Array.from(e.target.files || []))}
                            className="w-full rounded-xl bg-black/30 border border-white/10 px-4 py-3"
                        />

                        <div className="mt-3 rounded-xl border border-white/10 bg-black/30 p-3">
                            <div className="text-xs text-white/60 mb-2">
                                {files.length > 0
                                    ? `Selected files (${files.length})`
                                    : mode === "edit"
                                        ? `Existing media (${existingMedia.length})`
                                        : "No file selected"}
                            </div>

                            {files.length > 0 ? (
                                <ul className="space-y-1 text-xs text-white/70">
                                    {files.map((f) => (
                                        <li key={f.name} className="flex justify-between gap-2">
                                            <span className="truncate">{f.name}</span>
                                            <span className="text-white/50">{guessTypeFromFile(f)}</span>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                mode === "edit" && (
                                    <ul className="space-y-1 text-xs text-white/70">
                                        {existingMedia.map((m, i) => (
                                            <li key={`${m.path}-${i}`} className="flex justify-between gap-2">
                                                <span className="truncate">{m.path}</span>
                                                <span className="text-white/50">{m.type}</span>
                                            </li>
                                        ))}
                                        {existingMedia.length === 0 && (
                                            <div className="text-xs text-white/50">
                                                Tidak ada media (tapi seharusnya ada).
                                            </div>
                                        )}
                                    </ul>
                                )
                            )}
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
