import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req: NextRequest) {
    const session = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { searchParams } = new URL(req.url);
        const page = searchParams.get("page") || "1"; 
        const size = searchParams.get("size") || "10"; 
        const sortBy = searchParams.get("sortBy") || "code"; 
        const direction = searchParams.get("direction") || "ASC"; 
        // const type = searchParams.get("type") || ""; 

        // const apiUrl = `${process.env.API_URL}/branches/paginate?type=${type}&page=${page}&size=${size}&sortBy=${sortBy}&direction=${direction}`;
        const apiUrl = `${process.env.API_URL}/branches/paginate?page=${page}&size=${size}&sortBy=${sortBy}&direction=${direction}`;

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