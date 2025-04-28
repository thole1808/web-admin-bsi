import NextAuth, { NextAuthOptions, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import Auth0Provider from "next-auth/providers/auth0";
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

          // Fetch user profile
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

          console.log("User profile:", userProfile);

          // Fetch user role
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
        const customUser = user as User; // ✅ Casting user
        token.id = customUser.id;
        token.name = customUser.name;
        token.email = customUser.email;
        token.accessToken = customUser.accessToken;
        token.expiresAt = customUser.expiresAt;
        token.role = customUser.role;
        token.branch = customUser.branch;
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
          role: token.role as { id: string; name: string; code?: string },
          branch: token.branch as { id: string; code: string; name: string; type: string },
        };
        session.expiresAt = token.expiresAt as string;
      }
      return session;
    },
  },


  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
