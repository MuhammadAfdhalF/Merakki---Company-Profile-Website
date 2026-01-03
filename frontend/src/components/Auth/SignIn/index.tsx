"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";
import { useContext, useState } from "react";
import Image from "next/image";
import AuthDialogContext from "@/app/context/AuthDialogContext";
import { useRouter, useSearchParams } from "next/navigation";

const Signin = ({ signInOpen }: { signInOpen?: any }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const authDialog = useContext(AuthDialogContext);
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    const result = await signIn("credentials", {
      redirect: false,
      username,
      password,
    });

    setLoading(false);

    if (result?.ok) {
      signInOpen?.(false);
      authDialog?.setIsSuccessDialogOpen(true);
      setTimeout(() => authDialog?.setIsSuccessDialogOpen(false), 1200);

      // ✅ ambil tujuan dari middleware (?next=/admin)
      const next = searchParams.get("next") || "/admin";

      // ✅ redirect ke admin setelah login sukses
      router.push(next);
      router.refresh(); // biar session kebaca di route admin/middleware
    } else {
      authDialog?.setIsFailedDialogOpen(true);
      setTimeout(() => authDialog?.setIsFailedDialogOpen(false), 1200);
    }
  };

  return (
    <section
      className="w-full h-[640px] flex items-center justify-center px-8 rounded-2xl"
      style={{
        background: "linear-gradient(180deg, #400000 0%, #0D0D0D 100%)",
      }}
    >
      <div className="w-full text-center text-white">
        <h2 className="text-2xl font-semibold mb-10">Meraki.</h2>

        <h1 className="text-5xl font-bold mb-3">Sign in</h1>
        <p className="text-sm text-white/70 mb-6">Meraki. Admin Only</p>

        <div className="w-20 h-px bg-white/30 mx-auto mb-10" />

        <form onSubmit={handleSubmit}>
          {/* EMAIL */}
          <div className="flex items-center gap-4 mb-5">
            <Image
              src="/images/footer/icon-gmail.png"
              alt="Email"
              width={22}
              height={22}
            />
            <input
              type="text"
              placeholder="Enter your Email"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="flex-1 rounded-full bg-white text-black px-6 py-4 text-sm outline-none placeholder:text-gray-500"
            />
          </div>

          {/* PASSWORD */}
          <div className="flex items-center gap-4 mb-6">
            <Image
              src="/images/footer/password.png"
              alt="Password"
              width={22}
              height={22}
            />

            <div className="relative flex-1">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-full bg-white text-black px-6 py-4 pr-12 text-sm outline-none placeholder:text-gray-500"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-5 top-1/2 -translate-y-1/2 flex items-center justify-center w-6 h-6 text-gray-500 hover:text-black transition"
                aria-label="Toggle password visibility"
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          {/* FORGOT */}
          <p className="text-xs text-white/60 text-center mb-8">
            Forget password?{" "}
            <Link href="/" className="underline hover:text-white">
              klik here
            </Link>
          </p>

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-[#7a0000] hover:bg-[#5a0000] py-5 font-semibold text-white transition disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default Signin;
