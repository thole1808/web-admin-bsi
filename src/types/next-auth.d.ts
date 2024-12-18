import { DefaultSession } from "next-auth";

// Menambahkan properti `accessToken` dan `refreshToken` pada `Session`
declare module "next-auth" {
  interface Session {
    accessToken: string;  // Menambahkan akses token
    refreshToken: string; // Menambahkan refresh token
  }
}
