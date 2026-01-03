"use client";

import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import FaqModal from "@/components/admin/faqs/FaqModal";

type Faq = {
    id: number;
    question: string;
    answer: string;
    order: number;
    is_active: boolean;
    created_at?: string;
    updated_at?: string;
};

export default function FaqsAdminPage() {
    const { data: session, status } = useSession();

    const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || "";
    const accessToken = (session as any)?.accessToken as string | undefined;

    const [items, setItems] = useState<Faq[]>([]);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState<string | null>(null);

    const [openModal, setOpenModal] = useState(false);
    const [mode, setMode] = useState<"create" | "edit">("create");
    const [editing, setEditing] = useState<Faq | null>(null);

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
            const res = await fetch(`${apiBase}/faqs`, {
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

            const sorted = [...(data as Faq[])].sort(
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

    function openEdit(item: Faq) {
        setMode("edit");
        setEditing(item);
        setOpenModal(true);
    }

    async function onDelete(item: Faq) {
        if (!accessToken) return;
        const ok = confirm(`Hapus FAQ:\n"${item.question}" ?`);
        if (!ok) return;

        try {
            const res = await fetch(`${apiBase}/faqs/${item.id}`, {
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
            <div className="flex items-start justify-between gap-3">
                <div>
                    <h1 className="text-3xl md:text-4xl font-bold">FAQs</h1>
                    <p className="mt-2 text-white/60 text-sm">Manage FAQs (admin)</p>
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
                            <table className="min-w-[1000px] w-full text-sm">
                                <thead className="bg-black/40">
                                    <tr className="text-white/70">
                                        <th className="py-4 px-4 text-center font-semibold w-[70px]">
                                            No
                                        </th>
                                        <th className="py-4 px-4 text-center font-semibold">
                                            Question
                                        </th>
                                        <th className="py-4 px-4 text-center font-semibold">
                                            Answer
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
                                    {items.map((item, idx) => (
                                        <tr
                                            key={item.id}
                                            className="border-t border-white/10 hover:bg-white/[0.03] transition"
                                        >
                                            <td className="py-4 px-4 text-center">{idx + 1}</td>

                                            <td className="py-4 px-4">
                                                <div className="text-center font-semibold line-clamp-2">
                                                    {item.question}
                                                </div>
                                            </td>

                                            <td className="py-4 px-4">
                                                <div className="text-center text-white/80 line-clamp-2">
                                                    {item.answer}
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
                                    ))}

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
                    {items.map((item, idx) => (
                        <div
                            key={item.id}
                            className="rounded-2xl border border-white/10 bg-black/30 p-4"
                        >
                            <div className="flex items-start justify-between gap-3">
                                <div className="w-full">
                                    <div className="text-xs text-white/50">No. {idx + 1}</div>

                                    <div className="mt-1 text-base font-semibold">
                                        {item.question}
                                    </div>

                                    <div className="mt-2 text-sm text-white/70">
                                        {item.answer}
                                    </div>

                                    <div className="mt-2 text-xs text-white/60">
                                        order: <span className="text-white">{item.order}</span> •
                                        active:{" "}
                                        <span className="text-white">
                                            {String(item.is_active)}
                                        </span>
                                    </div>
                                </div>
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
                    ))}

                    {items.length === 0 && (
                        <div className="rounded-2xl border border-white/10 bg-black/30 p-6 text-center text-white/60">
                            Belum ada data.
                        </div>
                    )}
                </div>
            )}

            {/* Modal create/edit */}
            <FaqModal
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
        </div>
    );
}
