import GitHubProvider from "next-auth/providers/github";
import config from "@/lib/config";
import { NextAuthOptions } from "next-auth";

export const authConfig = {
  providers: [
    GitHubProvider({
      clientId: config.githubClientId,
      clientSecret: config.githubClientSecret,
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string;
      return session;
    },
  },
} satisfies NextAuthOptions;
