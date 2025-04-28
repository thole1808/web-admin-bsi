import CredentialsProvider from "next-auth/providers/credentials";
import Auth0Provider from "next-auth/providers/auth0";
import { NextAuthOptions } from "next-auth";
import { jwtDecode } from "jwt-decode";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.error("Email or password missing.");
          return null;
        }

        try {
          const params = new URLSearchParams();
          params.append("username", credentials.email);
          params.append("password", credentials.password);

          const apiUrl = process.env.API_HOST;
          if (!apiUrl) {
            console.error("API_HOST is not defined.");
            return null;
          }

          const authRes = await fetch(`${apiUrl}/ldap/authenticate`, {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
              Accept: "application/json",
            },
            body: params.toString(),
          });

          if (!authRes.ok) {
            console.error("Authentication failed:", authRes.statusText);
            return null;
          }

          const authData = await authRes.json();
          const accessToken = authData.access_token;
          const expiresAt = authData.expires_at;

          if (!accessToken || !expiresAt) {
            console.error("Token or expiry missing in authentication response.");
            return null;
          }

          const decodedToken: any = jwtDecode(accessToken);
          const emailFromToken = decodedToken?.sub;
          const nameFromToken = emailFromToken?.split("@")[0] || "User";

          const profileRes = await fetch(`${apiUrl}/api/profile`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
          });

          const profileData = await profileRes.json();
          if (!profileData.success) {
            console.error("Failed to fetch user profile:", profileData.message);
            return null;
          }

          const userProfile = profileData.data;

          const roleRes = await fetch(`${apiUrl}/api/roles/${userProfile.role.id}`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
          });

          const roleData = await roleRes.json();
          if (!roleData.success) {
            console.error("Failed to fetch user role:", roleData.message);
            return null;
          }

          const userRole = roleData.data;

          if (!emailFromToken) {
            console.error("Email not found in token.");
            return null;
          }

          return {
            id: emailFromToken,
            name: nameFromToken,
            email: emailFromToken,
            accessToken,
            expiresAt,
            role: userRole,
            branch: userProfile.branch,
          };
        } catch (error) {
          console.error("Authorization error:", error);
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
        token.accessToken = (user as any).accessToken;
        token.expiresAt = (user as any).expiresAt;
        token.role = (user as any).role;
        token.branch = (user as any).branch;
      }
      return token;
    },

    async session({ session, token }) {
      if (token) {
        (session.user as any) = {
          id: token.id,
          name: token.name,
          email: token.email,
          accessToken: token.accessToken,
          role: token.role,
          branch: token.branch,
        };
        (session as any).expiresAt = token.expiresAt;
      }
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};