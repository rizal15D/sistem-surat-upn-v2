import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";
import { NextAuthOptions } from "next-auth";

import { User as NextAuthUser } from "next-auth";

export interface User extends NextAuthUser {
  accessToken?: string;
  user: {
    id: number;
    name: string;
    email: string;
    fakultas: {
      id: number;
      name: string;
    };
    role: {
      id: number;
      name: string;
    };
    prodi: {
      id: number;
      name: string;
    };
  };
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
          id: response.data.user_response.id,
          accessToken: response.data.token,
          user: response.data.user_response,
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
