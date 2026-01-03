"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

type Faq = {
    id: number;
    question: string;
    answer: string;
    order: number;
    is_active: boolean;
};

export default function FaqModal({
    open,
    mode,
    initialData,
    nextOrder,
    onClose,
    onSaved,
}: {
    open: boolean;
    mode: "create" | "edit";
    initialData: Faq | null;
    nextOrder: number;
    onClose: () => void;
    onSaved: () => void | Promise<void>;
}) {
    const { data: session } = useSession();

    const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || "";
    const accessToken = (session as any)?.accessToken as string | undefined;

    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState("");
    const [order, setOrder] = useState<number>(nextOrder);
    const [isActive, setIsActive] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!open) return;

        if (mode === "edit" && initialData) {
            setQuestion(initialData.question ?? "");
            setAnswer(initialData.answer ?? "");
            setOrder(Number(initialData.order ?? 0));
            setIsActive(Boolean(initialData.is_active));
        } else {
            setQuestion("");
            setAnswer("");
            setOrder(nextOrder);
            setIsActive(true);
        }
    }, [open, mode, initialData, nextOrder]);

    if (!open) return null;

    async function handleSave() {
        try {
            if (!apiBase) throw new Error("NEXT_PUBLIC_API_BASE_URL belum di-set");
            if (!accessToken) throw new Error("Kamu belum login");

            if (!question.trim()) throw new Error("Question wajib diisi");
            if (!answer.trim()) throw new Error("Answer wajib diisi");
            if (!Number.isFinite(Number(order))) throw new Error("Order tidak valid");

            setSaving(true);

            const payload = {
                question: question.trim(),
                answer: answer.trim(),
                order: Number(order),
                is_active: Boolean(isActive),
            };

            const url =
                mode === "create"
                    ? `${apiBase}/faqs`
                    : `${apiBase}/faqs/${initialData?.id}`;

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
            <div className="w-full max-w-2xl rounded-2xl border border-white/10 bg-[#0D0D0D] overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
                    <div>
                        <h2 className="text-xl font-semibold">
                            {mode === "create" ? "Add FAQ" : "Edit FAQ"}
                        </h2>
                        <p className="text-sm text-white/60 mt-1">
                            Isi question dan answer, lalu simpan.
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
                    <div>
                        <label className="block text-sm text-white/70 mb-2">Question</label>
                        <input
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            placeholder="Contoh: What services do you provide?"
                            className="w-full rounded-xl bg-black/30 border border-white/10 px-4 py-3 outline-none focus:border-white/20"
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-white/70 mb-2">Answer</label>
                        <textarea
                            value={answer}
                            onChange={(e) => setAnswer(e.target.value)}
                            placeholder="Jawabannya..."
                            rows={5}
                            className="w-full rounded-xl bg-black/30 border border-white/10 px-4 py-3 outline-none focus:border-white/20 resize-none"
                        />
                    </div>

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
                                id="isActiveFaq"
                                type="checkbox"
                                checked={isActive}
                                onChange={(e) => setIsActive(e.target.checked)}
                                className="h-5 w-5"
                            />
                            <label htmlFor="isActiveFaq" className="text-sm text-white/80">
                                Active
                            </label>
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
