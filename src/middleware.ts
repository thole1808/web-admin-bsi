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

    // Jika token ada, lanjutkan ke halaman yang dimint   a
    console.log("Token ditemukan, melanjutkan permintaan...");
    return NextResponse.next();
}

export const config = {
    matcher: [
        "/dashboard/:path*", "/dashboard/:path*",
        "/cabang/:path*", "/master/approval-matrix:path*",
        "/master/checklist:path*", "/master/services-types:path*",
        "/master/status-messages:path*", "/master/national-holiday:path*",
        "/branches/branch:path*", "/branches/service-types:path*",
        "/branches/counters:path*", "/branches/office-hours:path*",
        "/roles/:path*"
    ],
};


