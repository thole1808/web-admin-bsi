import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
    const token = await getToken({ req });
    console.log("Token yang didapat: ", token);

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
        "/roles",
        "/users"
    ];

    const isAllowed = allowedRoutes.some(route => req.nextUrl.pathname.startsWith(route));

    if (!isAllowed) {
        console.log("Rute tidak ditemukan, mengarahkan ke halaman 404...");
        return NextResponse.rewrite(new URL('/404', req.url));
    }

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
        "/roles/:path*",
        "/users/:path*"
    ],
};
