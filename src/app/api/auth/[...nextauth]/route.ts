import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import Auth0Provider from "next-auth/providers/auth0";
import { jwtDecode } from "jwt-decode";

declare module "next-auth" {
  interface User {
    expiresAt?: string;
  }
  interface Session {
    expiresAt?: string;
  }
}

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
          params.append("username", email || "");
          params.append("password", password || "");

          const apiUrl = process.env.API_HOST;

          const res = await fetch(`${apiUrl}/ldap/authenticate`, {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
              Accept: "application/json",
            },
            body: params.toString(),
          });

          if (!res.ok) {
            console.error("Authentication failed:", res.statusText);
            return null;
          }

          const data = await res.json();
          const accessToken = data.access_token;
          const expiresAt = data.expires_at;

          if (!accessToken || !expiresAt) {
            console.error("Token or expiry missing in response");
            return null;
          }

          const decoded: any = jwtDecode(accessToken);
          const emailFromToken = decoded?.sub;
          const nameFromToken = decoded?.sub?.split("@")[0];

          if (emailFromToken) {
            return {
              id: emailFromToken,
              name: nameFromToken,
              email: emailFromToken,
              accessToken,
              expiresAt, // ✅ gunakan camelCase
            };
          }

          return null;
        } catch (error) {
          console.error("Login error:", error);
          return null;
        }
      },
    }),

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
        token.accessToken = user.accessToken;
        token.expiresAt = user.expiresAt; // ✅ betulkan properti
      }
      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user = {
          id: token.id as string,
          name: token.name as string,
          email: token.email as string,
          accessToken: token.accessToken as string,
        };
        session.expiresAt = token.expiresAt as string;
      }
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };