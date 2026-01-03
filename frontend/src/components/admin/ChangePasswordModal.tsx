"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";

export default function ChangePasswordModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { data: session } = useSession();
  const accessToken = (session as any)?.accessToken as string | undefined;

  const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || "";

  const [currentPassword, setCurrentPassword] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (!open) return;
    setCurrentPassword("");
    setPassword("");
    setPasswordConfirmation("");
    setError("");
    setSaving(false);
  }, [open]);

  if (!open) return null;

  async function handleSave() {
    try {
      setError("");

      if (!apiBase) throw new Error("NEXT_PUBLIC_API_BASE_URL belum di-set");
      if (!accessToken) throw new Error("Kamu belum login");

      if (!currentPassword.trim()) throw new Error("Current password wajib diisi");
      if (!password.trim()) throw new Error("Password baru wajib diisi");
      if (password.length < 6) throw new Error("Password minimal 6 karakter");
      if (password !== passwordConfirmation)
        throw new Error("Konfirmasi password tidak sama");

      setSaving(true);

      const res = await fetch(`${apiBase}/auth/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          current_password: currentPassword,
          password,
          password_confirmation: passwordConfirmation,
        }),
      });

      const json = await res.json().catch(() => null);

      if (!res.ok) {
        // laravel validation biasanya 422 dengan message / errors
        const msg =
          json?.message ||
          (json?.errors
            ? Object.values(json.errors).flat().join(", ")
            : `Gagal (HTTP ${res.status})`);
        throw new Error(msg);
      }

      // sukses -> backend revoke token -> harus login ulang
      onClose();
      alert(json?.message || "Password berhasil diubah. Silakan login ulang.");
      await signOut({ callbackUrl: "/?login=1" });
    } catch (e: any) {
      setError(e?.message || "Gagal ubah password");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#0D0D0D] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
          <div>
            <h2 className="text-xl font-semibold text-white">Change Password</h2>
            <p className="text-sm text-white/60 mt-1">
              Masukkan password lama lalu set password baru.
            </p>
          </div>

          <button
            onClick={onClose}
            className="px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          {error && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm text-white/70 mb-2">
              Current Password
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full rounded-xl bg-black/30 border border-white/10 px-4 py-3 outline-none focus:border-white/20 text-white"
              placeholder="Password lama"
            />
          </div>

          <div>
            <label className="block text-sm text-white/70 mb-2">
              New Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl bg-black/30 border border-white/10 px-4 py-3 outline-none focus:border-white/20 text-white"
              placeholder="Password baru"
            />
            <p className="mt-1 text-xs text-white/40">Minimal 6 karakter</p>
          </div>

          <div>
            <label className="block text-sm text-white/70 mb-2">
              Confirm New Password
            </label>
            <input
              type="password"
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              className="w-full rounded-xl bg-black/30 border border-white/10 px-4 py-3 outline-none focus:border-white/20 text-white"
              placeholder="Ulangi password baru"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-5 border-t border-white/10 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            disabled={saving}
            className="px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white disabled:opacity-60"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-3 rounded-xl bg-[#470000] hover:bg-[#5a0000] transition font-medium text-white disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
