"use client";

import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import ClientModal from "@/components/admin/clients/ClientModal";

type Client = {
    id: number;
    name: string;
    logo: string; // "/storage/clients/xxx.png"
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

export default function ClientsAdminPage() {
    const { data: session, status } = useSession();

    const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || "";
    const accessToken = (session as any)?.accessToken as string | undefined;

    const [items, setItems] = useState<Client[]>([]);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState<string | null>(null);

    // create/edit modal
    const [openModal, setOpenModal] = useState(false);
    const [mode, setMode] = useState<"create" | "edit">("create");
    const [editing, setEditing] = useState<Client | null>(null);

    // preview modal
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [previewTitle, setPreviewTitle] = useState<string>("");

    const nextOrder = useMemo(() => {
        const max = items.reduce((m, x) => Math.max(m, Number(x.order || 0)), 0);
        return max + 1;
    }, [items]);

    async function fetchList() {
        if (!apiBase) {
            setErr("NEXT_PUBLIC_API_BASE_URL belum di-set.");
            setLoading(false);
            return;
        }
        if (!accessToken) {
            setLoading(false);
            return;
        }

        setLoading(true);
        setErr(null);

        try {
            const res = await fetch(`${apiBase}/clients`, {
                headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
                cache: "no-store",
            });

            if (!res.ok) {
                const txt = await res.text();
                throw new Error(txt || `HTTP ${res.status}`);
            }

            const json = await res.json();
            const data = Array.isArray(json) ? json : json.data ?? json;

            const sorted = [...(data as Client[])].sort(
                (a, b) => Number(a.order || 0) - Number(b.order || 0)
            );

            setItems(sorted);
        } catch (e: any) {
            setErr(e?.message || "Gagal load data");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (status === "loading") return;
        if (!accessToken) return;
        fetchList();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [status, accessToken]);

    function openCreate() {
        setMode("create");
        setEditing(null);
        setOpenModal(true);
    }

    function openEdit(item: Client) {
        setMode("edit");
        setEditing(item);
        setOpenModal(true);
    }

    function openPreview(item: Client) {
        const url = toPublicAssetUrl(apiBase, item.logo);
        setPreviewUrl(url);
        setPreviewTitle(item.name);
    }

    async function onDelete(item: Client) {
        if (!accessToken) return;
        const ok = confirm(`Hapus client "${item.name}" ?`);
        if (!ok) return;

        try {
            const res = await fetch(`${apiBase}/clients/${item.id}`, {
                method: "DELETE",
                headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            if (!res.ok) {
                const txt = await res.text();
                throw new Error(txt || `HTTP ${res.status}`);
            }

            await fetchList();
        } catch (e: any) {
            alert(e?.message || "Gagal delete");
        }
    }

    return (
        <div className="w-full">
            {/* Header */}
            <div className="flex items-start justify-between gap-3 flex-wrap">
                <div>
                    <h1 className="text-3xl md:text-4xl font-bold">Clients</h1>
                    <p className="mt-2 text-white/60 text-sm">Manage clients (admin)</p>
                    <p className="mt-1 text-white/40 text-xs">Total: {items.length}</p>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={fetchList}
                        className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition text-sm border border-white/10"
                    >
                        Refresh
                    </button>
                    <button
                        onClick={openCreate}
                        className="px-4 py-2 rounded-lg bg-[#470000] hover:bg-[#5a0000] transition text-sm font-medium"
                    >
                        + Add
                    </button>
                </div>
            </div>

            {/* Error */}
            {err && (
                <div className="mt-4 p-3 rounded-xl border border-red-500/30 bg-red-500/10 text-red-200 text-sm">
                    {err}
                </div>
            )}

            {/* Loading */}
            {loading && (
                <div className="mt-6 p-6 rounded-2xl border border-white/10 bg-black/30 text-white/70">
                    Loading...
                </div>
            )}

            {/* Desktop table */}
            {!loading && !err && (
                <div className="mt-6 hidden md:block">
                    <div className="rounded-2xl border border-white/10 bg-black/30 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-[900px] w-full text-sm">
                                <thead className="bg-black/40">
                                    <tr className="text-white/70">
                                        <th className="py-4 px-4 text-center font-semibold w-[70px]">
                                            No
                                        </th>
                                        <th className="py-4 px-4 text-center font-semibold">
                                            Name
                                        </th>
                                        <th className="py-4 px-4 text-center font-semibold w-[160px]">
                                            Logo
                                        </th>
                                        <th className="py-4 px-4 text-center font-semibold w-[100px]">
                                            Order
                                        </th>
                                        <th className="py-4 px-4 text-center font-semibold w-[110px]">
                                            Active
                                        </th>
                                        <th className="py-4 px-4 text-center font-semibold w-[210px]">
                                            Action
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {items.map((item, idx) => {
                                        const logoUrl = toPublicAssetUrl(apiBase, item.logo);

                                        return (
                                            <tr
                                                key={item.id}
                                                className="border-t border-white/10 hover:bg-white/[0.03] transition"
                                            >
                                                <td className="py-4 px-4 text-center">{idx + 1}</td>

                                                <td className="py-4 px-4 text-center font-semibold">
                                                    {item.name}
                                                </td>

                                                <td className="py-4 px-4">
                                                    <div className="flex items-center justify-center">
                                                        {logoUrl ? (
                                                            <button
                                                                type="button"
                                                                onClick={() => openPreview(item)}
                                                                className="rounded-xl overflow-hidden border border-white/10 bg-white/5 hover:bg-white/10 transition"
                                                                title="Klik untuk preview"
                                                            >
                                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                                <img
                                                                    src={logoUrl}
                                                                    alt={item.name}
                                                                    className="h-14 w-14 object-cover"
                                                                />
                                                            </button>
                                                        ) : (
                                                            <div className="text-white/40 text-xs">
                                                                No logo
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>

                                                <td className="py-4 px-4 text-center">{item.order}</td>

                                                <td className="py-4 px-4 text-center">
                                                    <span
                                                        className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-xs border ${item.is_active
                                                                ? "bg-emerald-500/10 text-emerald-200 border-emerald-500/20"
                                                                : "bg-white/5 text-white/60 border-white/10"
                                                            }`}
                                                    >
                                                        {String(item.is_active)}
                                                    </span>
                                                </td>

                                                <td className="py-4 px-4">
                                                    <div className="flex items-center justify-center gap-2">
                                                        <button
                                                            onClick={() => openEdit(item)}
                                                            className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition border border-white/10"
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            onClick={() => onDelete(item)}
                                                            className="px-4 py-2 rounded-lg bg-[#470000] hover:bg-[#5a0000] transition"
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}

                                    {items.length === 0 && (
                                        <tr>
                                            <td
                                                colSpan={6}
                                                className="py-10 text-center text-white/50"
                                            >
                                                Belum ada data.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* Mobile cards */}
            {!loading && !err && (
                <div className="mt-6 md:hidden space-y-3">
                    {items.map((item, idx) => {
                        const logoUrl = toPublicAssetUrl(apiBase, item.logo);

                        return (
                            <div
                                key={item.id}
                                className="rounded-2xl border border-white/10 bg-black/30 p-4"
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div className="w-full">
                                        <div className="text-xs text-white/50">No. {idx + 1}</div>
                                        <div className="mt-1 text-lg font-semibold">{item.name}</div>
                                        <div className="mt-2 text-xs text-white/60">
                                            order: <span className="text-white">{item.order}</span> •
                                            active:{" "}
                                            <span className="text-white">
                                                {String(item.is_active)}
                                            </span>
                                        </div>
                                    </div>

                                    {logoUrl ? (
                                        <button
                                            type="button"
                                            onClick={() => openPreview(item)}
                                            className="rounded-xl overflow-hidden border border-white/10 bg-white/5"
                                            title="Klik untuk preview"
                                        >
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img
                                                src={logoUrl}
                                                alt={item.name}
                                                className="h-14 w-14 object-cover"
                                            />
                                        </button>
                                    ) : (
                                        <div className="h-14 w-14 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center text-[10px] text-white/40">
                                            No logo
                                        </div>
                                    )}
                                </div>

                                <div className="mt-4 flex items-center gap-2">
                                    <button
                                        onClick={() => openEdit(item)}
                                        className="flex-1 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition border border-white/10"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => onDelete(item)}
                                        className="flex-1 px-4 py-2 rounded-lg bg-[#470000] hover:bg-[#5a0000] transition"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        );
                    })}

                    {items.length === 0 && (
                        <div className="rounded-2xl border border-white/10 bg-black/30 p-6 text-center text-white/60">
                            Belum ada data.
                        </div>
                    )}
                </div>
            )}

            {/* Modal create/edit */}
            <ClientModal
                open={openModal}
                mode={mode}
                initialData={editing}
                nextOrder={nextOrder}
                onClose={() => setOpenModal(false)}
                onSaved={async () => {
                    setOpenModal(false);
                    await fetchList();
                }}
            />

            {/* Preview Modal */}
            {previewUrl && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 p-4">
                    <div className="w-full max-w-3xl rounded-2xl border border-white/10 bg-black/60 overflow-hidden">
                        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
                            <div className="text-sm text-white/70 truncate">
                                Preview: {previewTitle || "Client Logo"}
                            </div>
                            <button
                                onClick={() => setPreviewUrl(null)}
                                className="px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-sm"
                            >
                                Close
                            </button>
                        </div>
                        <div className="p-4 flex items-center justify-center">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={previewUrl}
                                alt="Preview"
                                className="max-h-[70vh] w-auto rounded-xl border border-white/10 bg-black/30"
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
