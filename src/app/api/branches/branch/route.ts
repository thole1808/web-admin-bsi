import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

// Endpoint untuk GET data Branch (sudah ada)
// export async function GET(req: NextRequest) {
//     const session = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

//     if (!session) {
//         return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     try {   
//         const response = await fetch(`${process.env.API_URL}/branches`, {
//             method: 'GET',
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Authorization': `Bearer ${session.accessToken || ''}`,
//             },
//         });

//         if (!response.ok) {
//             const errorData = await response.json();
//             return NextResponse.json({ error: errorData.error || 'Failed to fetch branch API' }, { status: response.status });
//         }

//         const data = await response.json();
//         return NextResponse.json(data, { status: 200 });
//     } catch (error) {
//         console.error("Error fetching branch messages :", error);
//         return NextResponse.json({ error: 'Failed to fetch branch API' }, { status: 500 });
//     }
// }

// Endpoint untuk GET data Branch dengan paginasi manual
export async function GET(req: NextRequest) {
    const session = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        // Ambil query parameter dari URL
        const { searchParams } = new URL(req.url);
        const page = searchParams.get("page") || "1"; // Default page 1
        const size = searchParams.get("size") || "10"; // Default size 10
        const sortBy = searchParams.get("sortBy") || "code"; // Default sortBy "code"
        const direction = searchParams.get("direction") || "ASC"; // Default direction "ASC"
        // const type = searchParams.get("type") || ""; // Default type empty

        // Buat URL API dengan query parameter
        // const apiUrl = `${process.env.API_URL}/branches/paginate?type=${type}&page=${page}&size=${size}&sortBy=${sortBy}&direction=${direction}`;
        const apiUrl = `${process.env.API_URL}/branches/paginate?page=${page}&size=${size}&sortBy=${sortBy}&direction=${direction}`;

        // Fetch data dari API backend
        const response = await fetch(apiUrl, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${session.accessToken || ""}`,
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            return NextResponse.json({ error: errorData.error || "Failed to fetch branch API" }, { status: response.status });
        }

        const data = await response.json();
        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        console.error("Error fetching branch messages:", error);
        return NextResponse.json({ error: "Failed to fetch branch API" }, { status: 500 });
    }
}