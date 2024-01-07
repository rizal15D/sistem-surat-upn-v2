import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";
import { NextAuthOptions } from "next-auth";

import { User as NextAuthUser } from "next-auth";

export interface User extends NextAuthUser {
  accessToken?: string;
}

export const authOptions: NextAuthOptions = {
  // Configure one or more authentication providers
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: {},
        password: {},
      },
      async authorize(credentials, req) {
        const response = await axios.post(
          `${process.env.API_URL}/auth/login`,
          credentials
        );

        return {
          id: response.data.user.id,
          accessToken: response.data.token,
          user: response.data.user,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 2 * 60 * 60,
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.user = user;
      }

      return token;
    },
    async session({ session, token, user }) {
      session.user = token.user as {
        name?: string | null | undefined;
        email?: string | null | undefined;
        image?: string | null | undefined;
      };

      return session;
    },
  },
  pages: {
    signIn: "/login",
  },

  secret: process.env.NEXTAUTH_SECRET as string,
};
