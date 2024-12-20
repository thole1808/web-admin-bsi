import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const session = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    // Jika sesi tidak ditemukan, kembalikan error 401 (Unauthorized)
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        // Mengambil data approval matrix dari API eksternal
        const response = await fetch(`${process.env.API_URL}/master/approval-matrix`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.accessToken || ''}`,
            },
        });

        // Jika respons dari API gagal (status tidak OK), kembalikan error
        if (!response.ok) {
            const errorData = await response.json();
            return NextResponse.json({ error: errorData.error || 'Failed to fetch approval matrix API' }, { status: response.status });
        }

        // Mengambil data JSON dari respons API
        const data = await response.json();

        // Kembalikan data approval matrix
        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        // Tangani jika ada error saat melakukan fetch
        console.error("Error fetching approval matrix:", error);
        return NextResponse.json({ error: 'Failed to fetch approval matrix API' }, { status: 500 });
    }
}
