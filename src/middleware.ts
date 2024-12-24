// import { NextRequest, NextResponse } from 'next/server';
// import { getToken } from 'next-auth/jwt';

// export async function middleware(req: NextRequest) {
//     // Mengambil token JWT dari request
//     const token = await getToken({ req });

//     // Debugging token
//     console.log("Token yang didapat: ", token);

//     // Jika token tidak ada, arahkan ke halaman login
//     if (!token) {
//         console.log("Token tidak ditemukan, mengarahkan ke halaman login...");
//         return NextResponse.redirect(new URL('/login', req.url));
//     }

//     // Jika token ada, lanjutkan ke halaman yang dimint   a
//     console.log("Token ditemukan, melanjutkan permintaan...");
//     return NextResponse.next();
// }

// export const config = {
//     matcher: [
//         "/dashboard/:path*", "/dashboard/:path*",
//         "/cabang/:path*", "/master/approval-matrix:path*",
//         "/master/checklist:path*", "/master/services-types:path*",
//         "/master/status-messages:path*", "/master/national-holiday:path*",
//         "/branches/branch:path*", "/branches/service-types:path*",
//         "/branches/counters:path*", "/branches/office-hours:path*",
//         "/roles/:path*"
//     ],
// };




import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
    // Mengambil token JWT dari request
    const token = await getToken({ req });

    // Debugging token
    console.log("Token yang didapat: ", token);

    // Jika token tidak ada, arahkan ke halaman login
    if (!token) {
        console.log("Token tidak ditemukan, mengarahkan ke halaman login...");
        return NextResponse.redirect(new URL('/login', req.url));
    }

    // Daftar rute yang diizinkan
    const allowedRoutes = [
        "/dashboard",
        "/cabang",
        "/master/approval-matrix",
        "/master/checklist",
        "/master/services-types",
        "/master/status-messages",
        "/master/national-holiday",
        "/branches/branch",
        "/branches/service-types",
        "/branches/counters",
        "/branches/office-hours",
        "/roles"
    ];

    // Memeriksa apakah permintaan cocok dengan rute yang diizinkan
    const isAllowed = allowedRoutes.some(route => req.nextUrl.pathname.startsWith(route));

    // Jika rute tidak diizinkan, arahkan ke halaman 404
    if (!isAllowed) {
        console.log("Rute tidak ditemukan, mengarahkan ke halaman 404...");
        return NextResponse.rewrite(new URL('/404', req.url));
    }

    // Jika token ada dan rute diizinkan, lanjutkan ke halaman yang diminta
    console.log("Token ditemukan dan rute diizinkan, melanjutkan permintaan...");
    return NextResponse.next();
}

export const config = {
    matcher: [
        "/dashboard/:path*",
        "/cabang/:path*",
        "/master/approval-matrix:path*",
        "/master/checklist:path*",
        "/master/services-types:path*",
        "/master/status-messages:path*",
        "/master/national-holiday:path*",
        "/branches/branch:path*",
        "/branches/service-types:path*",
        "/branches/counters:path*",
        "/branches/office-hours:path*",
        "/roles/:path*"
    ],
};
