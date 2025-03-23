import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      accessToken: string; // 🟡 ← ini wajib, jadi harus disertakan saat assign
    };
  }

  interface User {
    id: string;
    name: string;
    email: string;
    accessToken: string;
  }
}