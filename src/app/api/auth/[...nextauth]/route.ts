import { api } from "@/lib/axios";
import axios from "axios";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { type: "text", placeholder: "Email" },
        password: { type: "password", placeholder: "Password" },
      },
      authorize: async (credentials) => {
        try {
          const res = await api.post("/login", {
            email: credentials?.email,
            password: credentials?.password,
          });

          if (!res.data?.data?.access_token) return null;

          return {
            id: res?.data?.data.user?.email ?? null,
            name: res?.data?.data?.user?.name ?? null,
            email: res?.data?.data?.user?.email ?? null,
            token: res?.data?.data?.access_token ?? null,
          };
        } catch (err) {
          if (axios.isAxiosError(err) && err.response?.status === 401) {
            return null;
          }
          throw new Error(err instanceof Error ? err.message : "Login failed");
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.email as string;
        token.role = "user";
        token.accessToken = user.token as string;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.accessToken = token.accessToken as string;
      }
      return session;
    },
  },

  pages: {
    signIn: "/auth/login",
    error: "/auth/login",
  },

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
