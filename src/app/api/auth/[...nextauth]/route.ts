// app/api/auth/[...nextauth]/route.ts

import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
  providers: [
    CredentialsProvider({
      // Nama provider yang muncul di UI
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      authorize: async (credentials) => {
        // Logika autentikasi - disesuaikan dengan aplikasi Anda
        if (credentials?.email === "admin@example.com" && credentials.password === "password") {
          return { id: 1, name: "Admin", email: "admin@example.com" };
        }
        // Return null jika kredensial tidak cocok
        return null;
      }
    })
  ],
  session: {
    strategy: "jwt",  // Menggunakan JWT untuk penyimpanan sesi
  },
  pages: {
    signIn: "/signin",  // Halaman login khusus
  },
};

const handler = NextAuth(authOptions);

// Ekspor handler untuk menangani metode GET dan POST
export { handler as GET, handler as POST };
