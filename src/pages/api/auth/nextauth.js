// import { NextApiRequest, NextApiResponse } from "next";
// import { NextAuthOptions } from "next-auth";

// export default async function callback(req: NextApiRequest, res: NextApiResponse) {
//   // Extract the authorization code from the query
//   const { code } = req.query;

//   if (!code) {
//     return res.status(400).json({ error: "Authorization code not found" });
//   }

//   try {
//     // Step 2: Exchange the authorization code for an access token
//     const tokenRes = await fetch(process.env.NEXT_PUBLIC_OAUTH_ACCESS_TOKEN_URL!, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/x-www-form-urlencoded",
//       },
//       body: new URLSearchParams({
//         client_id: process.env.NEXT_PUBLIC_OAUTH_CLIENT_ID!,
//         client_secret: process.env.NEXT_PUBLIC_OAUTH_CLIENT_SECRET!,
//         redirect_uri: process.env.NEXT_PUBLIC_OAUTH_CALLBACK_URL!,
//         code: code as string,
//         grant_type: "authorization_code",
//       }),
//     });

//     const tokenData = await tokenRes.json();

//     if (tokenRes.ok) {
//       // Step 3: Save the access token in session or use it directly
//       // You can now access tokenData.access_token for API calls

//       // Redirect to your app or return the token
//       return res.redirect("/dashboard"); // Redirect ke dashboard atau halaman lain
//     } else {
//       return res.status(400).json({ error: "Failed to fetch access token" });
//     }
//   } catch (error) {
//     return res.status(500).json({ error: "Server error" });
//   }
// }


// export const authOptions = {
//   providers: [
//     {
//       id: "oauth",
//       name: "Custom OAuth",
//       type: "oauth",
//       clientId: process.env.NEXT_PUBLIC_OAUTH_CLIENT_ID!,
//       clientSecret: process.env.NEXT_PUBLIC_OAUTH_CLIENT_SECRET!,
//       wellKnown: `${process.env.NEXT_PUBLIC_OAUTH_AUTH_URL}/.well-known/openid-configuration`, // URL konfigurasi .well-known jika tersedia
//       authorization: { url: process.env.NEXT_PUBLIC_OAUTH_AUTH_URL!, params: { scope: process.env.NEXT_PUBLIC_OAUTH_SCOPE! } },
//       token: process.env.NEXT_PUBLIC_OAUTH_ACCESS_TOKEN_URL!,
//       userinfo: `${process.env.NEXT_PUBLIC_OAUTH_AUTH_URL}/userinfo`, // URL userinfo (opsional, sesuaikan dengan penyedia)
//     },
//   ],
//   callbacks: {
//     async jwt({ token, account }) {
//       console.log("Account:", account); // Debugging
//       if (account?.access_token) {
//         token.access_token = account.access_token;
//       }
//       return token;
//     },
//     async session({ session, token }) {
//       console.log("Token:", token); // Debugging
//       session.access_token = token.access_token;
//       return session;
//     },
//   },  
//   secret: process.env.NEXTAUTH_SECRET,
// };



// export const authOptions: NextAuthOptions = {
//   providers: [
//     {
//       id: "oauth",
//       name: "Custom OAuth",
//       type: "oauth",
//       clientId: process.env.NEXT_PUBLIC_OAUTH_CLIENT_ID!,
//       clientSecret: process.env.NEXT_PUBLIC_OAUTH_CLIENT_SECRET!,
//       wellKnown: `${process.env.NEXT_PUBLIC_OAUTH_AUTH_URL}/.well-known/openid-configuration`,
//       authorization: {
//         url: process.env.NEXT_PUBLIC_OAUTH_AUTH_URL!,
//         params: { scope: process.env.NEXT_PUBLIC_OAUTH_SCOPE! },
//       },
//       token: process.env.NEXT_PUBLIC_OAUTH_ACCESS_TOKEN_URL!,
//       userinfo: `${process.env.NEXT_PUBLIC_OAUTH_AUTH_URL}/userinfo`,
//       profile(profile) {
//         return {
//           id: profile.sub, // Gunakan field ID pengguna dari userinfo
//           name: profile.name || profile.preferred_username || "Anonymous",
//           email: profile.email || null,
//           image: profile.picture || null,
//         };
//       },
//     },
//   ],
//   callbacks: {
//     async jwt({ token, account }) {
//       if (account?.access_token) {
//         token.access_token = account.access_token;
//       }
//       return token;
//     },
//     async session({ session, token }) {
//       session.access_token = token.access_token;
//       return session;
//     },
//   },
//   secret: process.env.NEXTAUTH_SECRET,
// };


// import { NextAuthOptions } from "next-auth";
// import { JWT } from "next-auth/jwt";
// import { Session, User } from "next-auth";

// export const authOptions: NextAuthOptions = {
//   providers: [
//     {
//       id: "oauth",
//       name: "Custom OAuth",
//       type: "oauth",
//       clientId: process.env.NEXT_PUBLIC_OAUTH_CLIENT_ID!,
//       clientSecret: process.env.NEXT_PUBLIC_OAUTH_CLIENT_SECRET!,
//       wellKnown: `${process.env.NEXT_PUBLIC_OAUTH_AUTH_URL}/.well-known/openid-configuration`,
//       authorization: {
//         url: process.env.NEXT_PUBLIC_OAUTH_AUTH_URL!,
//         params: { scope: process.env.NEXT_PUBLIC_OAUTH_SCOPE! },
//       },
//       token: process.env.NEXT_PUBLIC_OAUTH_ACCESS_TOKEN_URL!,
//       userinfo: `${process.env.NEXT_PUBLIC_OAUTH_AUTH_URL}/userinfo`,
//       profile(profile) {
//         return {
//           id: profile.sub,
//           name: profile.name || "Anonymous",
//           email: profile.email || null,
//           image: profile.picture || null,
//         };
//       },
//     },
//   ],
//   callbacks: {
//     async jwt({ token, account }: { token: JWT; account?: any }) {
//       if (account?.access_token) {
//         token.access_token = account.access_token;
//       }
//       return token;
//     },
//     async session({ session, token }: { session: Session; token: JWT }) {
//       console.log("Token object:", token);
//       console.log("Session object before update:", session);
//       // session.access_token = token.access_token;
//       console.log("Session object after update:", session);
//       return session;
//     }
//   },
//   secret: process.env.NEXTAUTH_SECRET,
// };


// import NextAuth from "next-auth";
// import { NextAuthOptions } from "next-auth";
// import { NextAuthOptions } from "next-auth";
// import { JWT } from "next-auth/jwt";
// import { Session, User } from "next-auth";

// export const authOptions: NextAuthOptions = {
//   providers: [
//     {
//       id: "oauth",
//       name: "Custom OAuth",
//       type: "oauth",
//       clientId: process.env.NEXT_PUBLIC_OAUTH_CLIENT_ID!,
//       clientSecret: process.env.NEXT_PUBLIC_OAUTH_CLIENT_SECRET!,
//       wellKnown: `${process.env.NEXT_PUBLIC_OAUTH_AUTH_URL}/.well-known/openid-configuration`,
//       authorization: {
//         url: process.env.NEXT_PUBLIC_OAUTH_AUTH_URL!,
//         params: { scope: process.env.NEXT_PUBLIC_OAUTH_SCOPE! },
//       },
//       token: process.env.NEXT_PUBLIC_OAUTH_ACCESS_TOKEN_URL!,
//       userinfo: `${process.env.NEXT_PUBLIC_OAUTH_AUTH_URL}/userinfo`,
//       profile(profile) {
//         return {
//           id: profile.sub,
//           name: profile.name || "Anonymous",
//           email: profile.email || null,
//           image: profile.picture || null,
//         };
//       },
//     },
//   ],
//   callbacks: {
//     async jwt({ token, account }) {
//       if (account) {
//         token.access_token = account.access_token;
//       }
//       return token;
//     },
//     async session({ session, token }) {
//       session.access_token = token.access_token;
//       return session;
//     },
//   },
//   secret: process.env.NEXTAUTH_SECRET,
// };


// // pages/api/auth/[...nextauth].js
// import NextAuth from "next-auth";
// import Providers from "next-auth/providers";

// export default NextAuth({
//   providers: [
//     Providers.OAuth2({
//       id: "oauth2",
//       name: "Custom OAuth2",
//       authorization: process.env.NEXT_PUBLIC_OAUTH_AUTH_URL,
//       token: process.env.NEXT_PUBLIC_OAUTH_ACCESS_TOKEN_URL,
//       clientId: process.env.NEXT_PUBLIC_OAUTH_CLIENT_ID,
//       clientSecret: process.env.NEXT_PUBLIC_OAUTH_CLIENT_SECRET,
//       scope: process.env.NEXT_PUBLIC_OAUTH_SCOPE,
//       userinfo: process.env.NEXT_PUBLIC_OAUTH_CALLBACK_URL, // Optional: jika ada URL untuk userinfo
//       profile(profile) {
//         return {
//           id: profile.id,
//           name: profile.name,
//           email: profile.email,
//           image: profile.picture,
//         };
//       },
//     }),
//   ],
//   // callbacks: {
//   //   async redirect({ url, baseUrl }) {
//   //     return url.startsWith(baseUrl) ? url : baseUrl;
//   //   },
//   //   async session({ session, token }) {
//   //     session.accessToken = token.accessToken;
//   //     return session;
//   //   },
//   //   async jwt({ token, user, account }) {
//   //     if (account) {
//   //       token.accessToken = account.access_token;
//   //     }
//   //     return token;
//   //   },
//   // },
//   callbacks: {
//     async jwt({ token, account, user }) {
//       console.log("JWT Callback - token:", token);
//       console.log("JWT Callback - account:", account);
//       console.log("JWT Callback - user:", user);
//       if (account) {
//         token.accessToken = account.access_token;
//       }
//       return token;
//     },
//     async session({ session, token }) {
//       console.log("Session Callback - session:", session);
//       console.log("Session Callback - token:", token);
//       session.accessToken = token.accessToken;
//       return session;
//     },
//   },
//   pages: {
//     signIn: "/auth/signin", // Halaman login custom
//     error: "/auth/error",  // Halaman error custom
//   },
// });


// import NextAuth from "next-auth";
// import Providers from "next-auth/providers";

// export default NextAuth({
//   secret: process.env.NEXTAUTH_SECRET,  // Jangan lupa tentukan NEXTAUTH_SECRET
//   providers: [
//     Providers.OAuth2({
//       clientId: process.env.NEXT_PUBLIC_OAUTH_CALLBACK_URL,
//       clientSecret: process.env.NEXT_PUBLIC_OAUTH_CLIENT_SECRET,
//       authorizationUrl: process.env.NEXT_PUBLIC_OAUTH_AUTH_URL,
//       tokenUrl: process.env.NEXT_PUBLIC_OAUTH_ACCESS_TOKEN_URL,
//       scope: process.env.NEXT_PUBLIC_BACKOFFICE_SCOPE,
//       callbackUrl: process.env.NEXT_PUBLIC_OAUTH_CALLBACK_URL,
//     // NEXT_PUBLIC_OAUTH_AUTH_URL=http://178.128.121.255:8080/oauth2/authorize
//     // NEXT_PUBLIC_OAUTH_ACCESS_TOKEN_URL=http://178.128.121.255:8080/oauth2/token
//     // NEXT_PUBLIC_OAUTH_CLIENT_ID=c347b983-9cb7-45ad-9e07-ee6a741018c1
//     // NEXT_PUBLIC_OAUTH_CLIENT_SECRET=superSecretKey
//     // NEXT_PUBLIC_OAUTH_SCOPE=branch:read reservation:read reservation:write master:read queue:read
//     // NEXT_PUBLIC_OAUTH_CALLBACK_URL=http://localhost:3000/api/auth/callback/auth0
//     // NEXT_PUBLIC_BACKOFFICE_ID=ca566745-a24e-482a-81b0-5dc87d59e4aa
//     // NEXT_PUBLIC_BACKOFFICE_SCOPE= openid admin:all
//     // NEXT_PUBLIC_CALLBACK_URL=http://localhost:3000/api/auth/callback/auth0
//     }),
//   ],
//   callbacks: {
//     async jwt({ token, account }) {
//       if (account) {
//         token.accessToken = account.access_token;  // Simpan token ke dalam JWT
//       }
//       return token;
//     },
//     async session({ session, token }) {
//       session.accessToken = token.accessToken;  // Set token di session
//       return session;
//     },
//   },
// });


// pages/api/auth/[...nextauth].js

// import { NextAuth } from "next-auth";
// import { Providers } from "next-auth/providers";
// // import { Provider } from 'next-auth/providers';

// export default NextAuth({
//   providers: [
//     Providers.OAuth2({
//       id: "custom-oauth",
//       name: "OAuth",
//       clientId: process.env.NEXT_PUBLIC_BACKOFFICE_ID,
//       clientSecret: process.env.NEXT_PUBLIC_OAUTH_CLIENT_SECRET,
//       authorizationUrl: `${process.env.NEXT_PUBLIC_OAUTH_AUTH_URL}?response_type=code&scope=${process.env.NEXT_PUBLIC_BACKOFFICE_SCOPE}`,
//       tokenUrl: process.env.NEXT_PUBLIC_OAUTH_ACCESS_TOKEN_URL,
//       // clientSecret: process.env.NEXT_PUBLIC_OAUTH_CLIENT_SECRET,
//       redirectUri: process.env.NEXT_PUBLIC_OAUTH_CALLBACK_URL,
//     }),
//   ],
//   session: {
//     jwt: true, // Menggunakan JSON Web Token untuk sesi
//   },
//   callbacks: {
//     async jwt(token, user) {
//       // Menambahkan token akses ke dalam JWT token
//       if (user?.access_token) {
//         token.access_token = user.access_token;
//       }
//       return token;
//     },
//     async session(session, token) {
//       // Mengirimkan token akses ke sesi untuk digunakan di klien
//       session.access_token = token.access_token;
//       return session;
//     },
//   },
//   cookies: {
//     sessionToken: {
//       name: "next-auth.session-token",
//       options: {
//         httpOnly: true,
//         sameSite: "Lax",
//         path: "/",
//         secure: process.env.NODE_ENV === "production", // Secure hanya di production
//       },
//     },
//   },
// });


import NextAuth from "next-auth";
import OAuth2Provider from "next-auth/providers/oauth"; // Jika menggunakan OAuth2

export default NextAuth({
  providers: [
    OAuth2Provider({
      id: "custom-oauth",
      name: "OAuth",
      clientId: process.env.NEXT_PUBLIC_BACKOFFICE_ID,
      clientSecret: process.env.NEXT_PUBLIC_OAUTH_CLIENT_SECRET,
      authorizationUrl: `${process.env.NEXT_PUBLIC_OAUTH_AUTH_URL}`,
      tokenUrl: `${process.env.NEXT_PUBLIC_OAUTH_ACCESS_TOKEN_URL}`,
      scope: process.env.NEXT_PUBLIC_BACKOFFICE_SCOPE,
      redirectUri: process.env.NEXT_PUBLIC_OAUTH_CALLBACK_URL,
    }),
  ],
  session: {
    jwt: true, // Menggunakan JSON Web Token untuk sesi
  },
  callbacks: {
    async jwt(token, user) {
      if (user?.access_token) {
        token.access_token = user.access_token;
      }
      return token;
    },
    async session(session, token) {
      session.access_token = token.access_token;
      return session;
    },
  },
  cookies: {
    sessionToken: {
      name: "next-auth.session-token",
      options: {
        httpOnly: true,
        sameSite: "Lax",
        path: "/",
        secure: process.env.NODE_ENV === "production", // Secure hanya di production
      },
    },
  },
});
