// import { OAuthMiddleware } from './middleware/oauthMiddleware';

// export function middleware(req, res) {
//   return OAuthMiddleware(req, res, () => {
//     // Middleware OAuth sukses, lanjutkan request
//     return res.next();
//   });
// }

// export const config = {
//   matcher: ['/api/(.*)', '/protected/(.*)'], // Menggunakan regex untuk menangani semua sub-route
// };


// src/middleware.js or src/middleware.ts
// import { OAuthMiddleware } from './middleware/oauthMiddleware';

// export async function middleware(req) {
//   // Directly call OAuthMiddleware without the callback and res argument
//   return OAuthMiddleware(req);
// }

// export const config = {
//   matcher: ['/api/(.*)', '/protected/(.*)'], // Adjust the routes as needed
// };


// import { NextResponse } from 'next/server';
// import { cookies } from 'next/headers';

// export function middleware(req) {
//   const cookieStore = cookies(); // Memastikan dipanggil dalam middleware
//   const token = cookieStore.get('access_token')?.value;

//   if (token) {
//     console.log('Token ditemukan, izinkan akses.');
//     return NextResponse.next(); // Lanjutkan ke halaman berikutnya
//   }

//   console.log('Token tidak ditemukan, mengarahkan ke login.');
//   const loginUrl = new URL('/api/auth/login', req.url);
//   return NextResponse.redirect(loginUrl);
// }


// import { NextResponse } from 'next/server';
// import { cookies } from 'next/headers';

// export function middleware(req) {
//   const cookieStore = cookies();
//   const token = cookieStore.get('access_token')?.value;

//   if (token) {
//     console.log('Token ditemukan, mengarahkan ke dashboard.');
//     return NextResponse.redirect('/dashboard');
//   }

//   return NextResponse.next();
// }


// import { NextResponse } from 'next/server';

// export function middleware(req) {
//   const { nextUrl } = req;
//   const token = req.cookies.get('access_token');

//   // Log token for debugging
//   console.log('Access Token:', token);

//   if (token) {
//     const absoluteUrl = `${nextUrl.protocol}//${nextUrl.host}/dashboard`;
//     console.log('Redirecting to:', absoluteUrl);
//     return NextResponse.redirect(absoluteUrl);
//   }

//   return NextResponse.next();
// }


// import { NextResponse } from 'next/server';

// export function middleware(req) {
//   const cookiesHeader = req.headers.get('cookie');
//   const cookies = cookiesHeader ? Object.fromEntries(cookiesHeader.split('; ').map(c => c.split('='))) : {};
//   const token = cookies['access_token'];

//   // Log token for debugging
//   console.log('Access Token:', token);

//   if (token) {
//     const absoluteUrl = `${req.nextUrl.protocol}//${req.nextUrl.host}/dashboard`;
//     console.log('Redirecting to:', absoluteUrl);
//     return NextResponse.redirect(absoluteUrl);
//   }

//   return NextResponse.next();
// }


// import { NextResponse } from 'next/server';
// import { cookies } from 'next/headers';

// export function middleware(req) {
//   const cookieStore = cookies();
//   const token = cookieStore.get('access_token')?.value;

//   console.log('Access Token:', token); // Debugging

//   if (token) {
//     const absoluteUrl = `${req.nextUrl.protocol}//${req.nextUrl.host}/dashboard`;
//     console.log('Redirecting to:', absoluteUrl);
//     return NextResponse.redirect(absoluteUrl);
//   }

//   return NextResponse.next();
// }


// middleware.js
// import { getToken } from "next-auth/jwt";

// export default async function middleware(req) {
//   const token = await getToken({ req, secret: process.env.NEXT_PUBLIC_OAUTH_CLIENT_SECRET });

//   if (!token) {
//     return Response.redirect(new URL('/auth/signin', req.url));
//   }

//   return Response.next();
// }

// export const config = {
//   matcher: ["/protected-page/:path*"], // Ganti dengan path halaman yang ingin diproteksi
// };

// import { getToken } from "next-auth/jwt";

// export default async function middleware(req) {
//   const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
//   console.log("Middleware - Token:", token);

//   if (!token) {
//     return Response.redirect(new URL('/auth/signin', req.url));
//   }

//   return Response.next();
// }


// middleware.js
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export default async function middleware(req) {
  const token = await getToken({ req, secret: process.env.NEXT_PUBLIC_OAUTH_CLIENT_SECRET });

  console.log('TOKEB BOSKU',token);

  if (!token) {
    // Redirect pengguna ke halaman login di root (/) jika token tidak ada
    return NextResponse.redirect(new URL('/', req.url));
  }

  // Jika token ada, lanjutkan permintaan
  return NextResponse.next();
}

export const config = {
  matcher: ["/protected-page/:path*"], // Ganti dengan path yang ingin diproteksi
};




