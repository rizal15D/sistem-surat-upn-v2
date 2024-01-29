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
    aktif: boolean;
    jabatan: {
      id: number;
      name: string;
      permission: [];
    };
    fakultas: {
      id: number;
      name: string;
    };
    prodi: {
      id: number;
      name: string;
    };
  };
  jabatan: {
    id: number;
    name: string;
    jabatan_atas_id: null | number;
    permision: {
      id: number;
      buat_surat: boolean;
      download_surat: boolean;
      generate_nomor_surat: boolean;
      upload_tandatangan: boolean;
      persetujuan: boolean;
      akses_master: {
        id: number;
        prodi: boolean;
        template: boolean;
        periode: boolean;
        fakultas: boolean;
        jabatan: boolean;
        jenis_surat: boolean;
      };
    };
    jabatan_atas: {
      id: number;
      name: string;
      jabatan_atas_id: null | number;
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
          jabatan: response.data.jabatan,
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
