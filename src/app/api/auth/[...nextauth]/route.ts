import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import Auth0Provider from "next-auth/providers/auth0";
import { jwtDecode } from "jwt-decode";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const { email, password } = credentials as {
          email: string;
          password: string;
        };

        try {
          const params = new URLSearchParams();
          params.append("username", credentials?.email || "");
          params.append("password", credentials?.password || "");

          const apiUrl = process.env.API_HOST;

          console.log("API URL:", apiUrl);
          console.log("Params:", params.toString());

          const res = await fetch(`${apiUrl}/ldap/authenticate`, {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
              "Accept": "application/json",
            },
            body: params.toString(),
          });

          if (!res.ok) {
            return null;
          }
      
          const data = await res.json();
          const accessToken = data.access_token;

          console.log(data);
      
          // Decode token untuk dapatkan info user
          const decoded: any = jwtDecode(accessToken);
          console.log("Decoded Token:", decoded);
      
          const emailFromToken = decoded?.sub;
          const nameFromToken = decoded?.sub?.split("@")[0];
      
          if (emailFromToken) {
            return {
              id: emailFromToken,
              name: nameFromToken,
              email: emailFromToken,
              accessToken, // opsional: simpan token kalau perlu
            };
          }
      
          return null;
        } catch (error) {
          console.error("Login error:", error);
          return null;
        }
      },
    }),

    // Opsional, kalau kamu masih mau pakai Auth0
    Auth0Provider({
      clientId: process.env.AUTH0_CLIENT_ID!,
      clientSecret: process.env.AUTH0_CLIENT_SECRET!,
      issuer: process.env.AUTH0_ISSUER!,
    }),
  ],
  pages: {
    signIn: "/signin",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.accessToken = user.accessToken; // simpan di JWT
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          id: token.id as string,
          name: token.name as string,
          email: token.email as string,
          accessToken: token.accessToken as string, // Include accessToken here
        };
      }
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };