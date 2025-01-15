// import NextAuth, { NextAuthOptions } from "next-auth";
// import Auth0Provider from "next-auth/providers/auth0";
// import { signOut } from "next-auth/react";

// declare module "next-auth" {
//   interface Session {
//     accessToken?: string;
//     refreshToken?: string;
//     user: {
//       id?: number;
//       username?: string;
//       name?: string;
//       email?: string;
//       phone?: string;
//       avatarUrl?: string;
//       role?: {
//         id: number;
//         name: string;
//       };
//       counter?: {
//         id: number;
//         num: number;
//         name: string;
//       };
//       forceChangePassword?: boolean;
//       failedLoginAttempt?: number;
//       active?: boolean;
//       branch?: {
//         id: number;
//         code: string;
//         name: string;
//       };
//       lastLoginAt?: string;
//     };
//   }

//   interface Token {
//     accessToken?: string;
//     refreshToken?: string;
//     expires?: number;
//     user?: any; // Createkan user ke token
//   }
// }

// export const authOptions: NextAuthOptions = {
//   providers: [
//     Auth0Provider({
//       clientId: process.env.AUTH0_ID as string,
//       clientSecret: process.env.AUTH0_SECRET as string,
//       issuer: process.env.AUTH0_DOMAIN as string,
//       authorization: {
//         params: {
//           scope: `${process.env.AUTH0_SCOPES}`,
//           response_type: "code",
//         },
//       },
//       token: `${process.env.AUTH0_DOMAIN}/oauth/token`,
//       profile(profile) {
//         return {
//           id: profile.sub,
//           name: profile.name,
//           email: profile.email,
//         };
//       },
//       httpOptions: {
//         headers: {
//           Authorization: `Basic ${Buffer.from(
//             `${process.env.AUTH0_ID}:${process.env.AUTH0_SECRET}`
//           ).toString("base64")}`,
//         },
//       },
//     }),
//   ],
//   pages: {
//     signIn: "/auth/signin",
//     error: "/auth/error",
//   },
//   callbacks: {
//     async jwt({ token, account, user }) {
//       console.log("JWT Callback - token:", token); // Debugging token before modification
//       if (account) {
//         token.accessToken = account.access_token;
//         token.refreshToken = account.refresh_token;
//         if (typeof account.expires_in === 'number') {
//           token.expires = Date.now() + account.expires_in * 1000;
//         }
//         console.log("JWT Callback - Updated token after account info:", token); // Log after updating
//       }

//       // Fetch profile only if the user is not in the token already
//       if (!token.user && token.accessToken) {
//         try {
//           const response = await fetch(`${process.env.API_URL}/profile`, {
//             headers: {
//               Authorization: `Bearer ${token.accessToken}`,
//             },
//           });

//           if (response.ok) {
//             const profileData = await response.json();
//             token.user = {
//               id: profileData.data.id,
//               username: profileData.data.username,
//               name: profileData.data.name,
//               email: profileData.data.email,
//               phone: profileData.data.phone,
//               avatarUrl: profileData.data.avatarUrl,
//               role: {
//                 id: profileData.data.role.id,
//                 name: profileData.data.role.name,
//               },
//               counter: {
//                 id: profileData.data.counter.id,
//                 num: profileData.data.counter.num,
//                 name: profileData.data.counter.name,
//               },
//               forceChangePassword: profileData.data.forceChangePassword,
//               failedLoginAttempt: profileData.data.failedLoginAttempt,
//               active: profileData.data.active,
//               branch: {
//                 id: profileData.data.branch.id,
//                 code: profileData.data.branch.code,
//                 name: profileData.data.branch.name,
//               },
//               lastLoginAt: profileData.data.lastLoginAt,
//             };
//           } else {
//             if (response.status === 401) {
//               await signOut();
//             }
//             console.error("Failed to fetch user profile:", response.status);
//           }
//         } catch (error) {
//           console.error("Error fetching user profile:", error);
//         }
//       }
      
//       console.log("JWT Callback - Final token:", token); // Final token after profile fetch
//       return token;
//     },
//     async session({ session, token }) {
//       console.log("Session Callback - token:", token); // Debugging token before modifying session
//       session.accessToken = token.accessToken as string;
//       session.refreshToken = token.refreshToken as string;

//       // Set user profile from token to session
//       if (token.user) {
//         session.user = token.user;
//       }
      
//       console.log("Session Callback - session:", session); // Final session object
//       return session;
//     },
//   },
//   session: {
//     strategy: "jwt",
//   },
// };

// export default NextAuth(authOptions);


// import NextAuth from 'next-auth';
// import Auth0Provider from 'next-auth/providers/auth0';

// export default NextAuth({
//   providers: [
//     Auth0Provider({
//       clientId: process.env.AUTH0_ID!,
//       clientSecret: process.env.AUTH0_SECRET!,
//       issuer: process.env.AUTH0_DOMAIN!,
//       callbackUrl: process.env.AUTH0_CALLBACK!,
//     }),
//     console.log('NEXTAUTH_SECRET:', process.env.NEXTAUTH_SECRET); // Check if it's available
//   ],
//   callbacks: {
//     async jwt({ token, account, user }) {
//       if (account) {
//         token.accessToken = account.access_token;
//         token.idToken = account.id_token;
//       }
//       return token;
//     },
//     async session({ session, token }) {
//       session.accessToken = token.accessToken;
//       session.idToken = token.idToken;
//       return session;
//     },
//   },
//   secret: process.env.NEXTAUTH_SECRET,  // Make sure NEXTAUTH_SECRET is correctly defined
// });



// AUTH0_DOMAIN='http://178.128.121.255:8080'
// AUTH0_ID=ca566745-a24e-482a-81b0-5dc87d59e4aa
// AUTH0_SECRET=superSecretKey
// AUTH0_SCOPES='openid admin:all'
// AUTH0_CALLBACK=http://localhost:3000/api/auth/callback/auth0
// API_URL='http://178.128.121.255:8080/api'
// NEXTAUTH_URL=http://localhost:3000



// src/app/api/auth/[...nextauth]/authOptions.ts

// BERHASIL BOS
// import NextAuth, { NextAuthOptions } from 'next-auth';
// import Auth0Provider from 'next-auth/providers/auth0';
// import { signOut } from 'next-auth/react';

// export const authOptions: NextAuthOptions = {
//   providers: [
//     Auth0Provider({
//       clientId: process.env.AUTH0_ID!, // ID aplikasi Auth0 Anda
//       clientSecret: process.env.AUTH0_SECRET!, // Secret aplikasi Auth0 Anda
//       issuer: process.env.AUTH0_DOMAIN!, // Domain Auth0 Anda
//       callbackUrl: process.env.AUTH0_CALLBACK!, // URL callback untuk Auth0
//       authorization: {
//         params: {
//           scope: process.env.AUTH0_SCOPES, // Scope untuk autentikasi
//           response_type: 'code',
//         },
//       },
//       token: `${process.env.AUTH0_DOMAIN}/oauth/token`, // Token URL
//       profile(profile) {
//         return {
//           id: profile.sub,
//           name: profile.name,
//           email: profile.email,
//         };
//       },
//       httpOptions: {
//         headers: {
//           Authorization: `Basic ${Buffer.from(
//             `${process.env.AUTH0_ID}:${process.env.AUTH0_SECRET}`
//           ).toString('base64')}`,
//         },
//       },
//     }),
//   ],
//   pages: {
//     signIn: '/auth/signin', // Halaman sign-in kustom
//     error: '/auth/error',   // Halaman error kustom
//   },
//   callbacks: {
//     // Callback untuk JWT
//     async jwt({ token, account, user }) {
//       if (account) {
//         token.accessToken = account.access_token;
//         token.refreshToken = account.refresh_token;
//         if (typeof account.expires_in === 'number') {
//           token.expires = Date.now() + account.expires_in * 1000;
//         }
//       }

//       // Fetch profil pengguna jika belum ada di token
//       if (!token.user && token.accessToken) {
//         try {
//           const response = await fetch(`${process.env.API_URL}/profile`, {
//             headers: {
//               Authorization: `Bearer ${token.accessToken}`,
//             },
//           });

//           if (response.ok) {
//             const profileData = await response.json();
//             token.user = {
//               id: profileData.data.id,
//               username: profileData.data.username,
//               name: profileData.data.name,
//               email: profileData.data.email,
//               phone: profileData.data.phone,
//               avatarUrl: profileData.data.avatarUrl,
//               role: {
//                 id: profileData.data.role.id,
//                 name: profileData.data.role.name,
//               },
//               counter: {
//                 id: profileData.data.counter.id,
//                 num: profileData.data.counter.num,
//                 name: profileData.data.counter.name,
//               },
//               forceChangePassword: profileData.data.forceChangePassword,
//               failedLoginAttempt: profileData.data.failedLoginAttempt,
//               active: profileData.data.active,
//               branch: {
//                 id: profileData.data.branch.id,
//                 code: profileData.data.branch.code,
//                 name: profileData.data.branch.name,
//               },
//               lastLoginAt: profileData.data.lastLoginAt,
//             };
//           } else {
//             if (response.status === 401) {
//               await signOut();
//             }
//             console.error('Failed to fetch user profile:', response.status);
//           }
//         } catch (error) {
//           console.error('Error fetching user profile:', error);
//         }
//       }

//       return token;
//     },

//     // Callback untuk session
//     async session({ session, token }) {
//       session.accessToken = token.accessToken as string;
//       session.refreshToken = token.refreshToken as string;

//       // Menyimpan profil pengguna dari token ke session
//       if (token.user) {
//         session.user = token.user;
//       }

//       return session;
//     },
//     async redirect({ url, baseUrl }) {
//       // Jika pengguna successfully login, arahkan mereka ke dashboard
//       if (url === baseUrl || url.startsWith(baseUrl)) {
//         return '/dashboard'; // Ganti dengan URL halaman dashboard Anda
//       }
//       return baseUrl;
//     },
//   },
//   session: {
//     strategy: 'jwt',
//   },
//   secret: process.env.NEXTAUTH_SECRET, // Secret untuk JWT dan session
//   // debug: true, // Debugging untuk melihat proses NextAuth
// };

// export default NextAuth(authOptions);
// BERHASIL BOS

// import NextAuth, { NextAuthOptions } from 'next-auth';
// import Auth0Provider from 'next-auth/providers/auth0';
// import { signOut } from 'next-auth/react';

// export const authOptions: NextAuthOptions = {
//   providers: [
//     Auth0Provider({
//       clientId: process.env.AUTH0_ID!, // ID aplikasi Auth0 Anda
//       clientSecret: process.env.AUTH0_SECRET!, // Secret aplikasi Auth0 Anda
//       issuer: process.env.AUTH0_DOMAIN!, // Domain Auth0 Anda
//       authorization: {
//         params: {
//           scope: process.env.AUTH0_SCOPES, // Scope untuk autentikasi
//           response_type: 'code',
//         },
//       },
//       token: `${process.env.AUTH0_DOMAIN}/oauth/token`, // Token URL
//       profile(profile) {
//         return {
//           id: profile.sub,
//           name: profile.name,
//           email: profile.email,
//         };
//       },
//       httpOptions: {
//         headers: {
//           Authorization: `Basic ${Buffer.from(
//             `${process.env.AUTH0_ID}:${process.env.AUTH0_SECRET}`
//           ).toString('base64')}`,
//         },
//       },
//     }),
//   ],
//   pages: {
//     signIn: '/auth/signin', // Halaman sign-in kustom
//     error: '/auth/error',   // Halaman error kustom
//   },
//   callbacks: {
//     async jwt({ token, account, user }) {
//       if (account) {
//         token.accessToken = account.access_token;
//         token.refreshToken = account.refresh_token;
//         if (typeof account.expires_in === 'number') {
//           token.expires = Date.now() + account.expires_in * 1000;
//         }
//       }

//       if (!token.user && token.accessToken) {
//         try {
//           const response = await fetch(`${process.env.API_URL}/profile`, {
//             headers: {
//               Authorization: `Bearer ${token.accessToken}`,
//             },
//           });

//           if (response.ok) {
//             const profileData = await response.json();
//             token.user = profileData.data;
//           } else {
//             if (response.status === 401) {
//               await signOut();
//             }
//             console.error('Failed to fetch user profile:', response.status);
//           }
//         } catch (error) {
//           console.error('Error fetching user profile:', error);
//         }
//       }

//       return token;
//     },

//     async session({ session, token }) {
//       session.accessToken = token.accessToken as string;
//       session.refreshToken = token.refreshToken as string;

//       if (token.user) {
//         session.user = token.user;
//       }

//       return session;
//     },

//     async redirect({ url, baseUrl }) {
//       if (url === baseUrl || url.startsWith(baseUrl)) {
//         return '/dashboard';
//       }
//       return baseUrl;
//     },
//   },
//   session: {
//     strategy: 'jwt',
//   },
//   secret: process.env.NEXTAUTH_SECRET,
//   debug: true,
// };

// export default NextAuth(authOptions);


import NextAuth, { NextAuthOptions } from 'next-auth';
import Auth0Provider from 'next-auth/providers/auth0';
import { signOut } from 'next-auth/react';

export const authOptions: NextAuthOptions = {
  providers: [
    Auth0Provider({
      clientId: process.env.AUTH0_ID!, // ID aplikasi Auth0 Anda
      clientSecret: process.env.AUTH0_SECRET!, // Secret aplikasi Auth0 Anda
      issuer: process.env.AUTH0_DOMAIN!, // Domain Auth0 Anda
      authorization: {
        params: {
          scope: process.env.AUTH0_SCOPES, // Scope untuk autentikasi
          response_type: 'code',
        },
      },
      token: `${process.env.AUTH0_DOMAIN}/oauth/token`, // Token URL
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
        };
      },
      httpOptions: {
        headers: {
          Authorization: `Basic ${Buffer.from(
            `${process.env.AUTH0_ID}:${process.env.AUTH0_SECRET}`
          ).toString('base64')}`,
        },
      },
    }),
  ],
  pages: {
    signIn: '/auth/signin', // Halaman sign-in kustom
    error: '/auth/error',   // Halaman error kustom
  },
  callbacks: {
    async jwt({ token, account, user }) {
      if (account) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        if (typeof account.expires_in === 'number') {
          token.expires = Date.now() + account.expires_in * 1000;
        }
      }

      if (!token.user && token.accessToken) {
        try {
          const response = await fetch(`${process.env.API_URL}/profile`, {
            headers: {
              Authorization: `Bearer ${token.accessToken}`,
            },
          });

          if (response.ok) {
            const profileData = await response.json();
            token.user = profileData.data;
          } else {
            if (response.status === 401) {
              await signOut();
            }
            console.error('Failed to fetch user profile:', response.status);
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
        }
      }

      return token;
    },

    async session({ session, token }) {
      // TypeScript tidak tahu bahwa accessToken ada pada session, jadi kita beri tipe yang benar
      session.accessToken = token.accessToken as string;
      session.refreshToken = token.refreshToken as string;

      if (token.user) {
        session.user = token.user;
      }

      return session;
    },

    async redirect({ url, baseUrl }) {
      if (url === baseUrl || url.startsWith(baseUrl)) {
        return '/dashboard';
      }
      return baseUrl;
    },
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: true,
};

export default NextAuth(authOptions);
