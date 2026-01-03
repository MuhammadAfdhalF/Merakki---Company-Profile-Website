import Credentials from "next-auth/providers/credentials";
import type { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },

  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        username: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL;

        if (!apiBase) throw new Error("NEXT_PUBLIC_API_BASE_URL belum di-set");
        if (!credentials?.username || !credentials?.password) return null;

        const res = await fetch(`${apiBase}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: credentials.username,
            password: credentials.password,
          }),
        });

        if (!res.ok) return null;

        const json = await res.json();
        if (!json?.token || !json?.user) return null;

        return {
          id: String(json.user.id),
          name: json.user.name,
          email: json.user.email,
          role: json.user.role,
          accessToken: json.token,
        } as any;
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = (user as any).accessToken;
        token.user = {
          id: (user as any).id,
          name: (user as any).name,
          email: (user as any).email,
          role: (user as any).role,
        };
      }
      return token;
    },

    async session({ session, token }) {
      (session as any).accessToken = token.accessToken;
      (session as any).user = token.user;
      return session;
    },
  },
};
