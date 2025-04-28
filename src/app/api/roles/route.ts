import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const session = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const response = await fetch(`${process.env.API_URL}/roles`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.accessToken || ''}`,
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            return NextResponse.json({ error: errorData.error || 'Failed to fetch roles API' }, { status: response.status });
        }

        const data = await response.json();return NextResponse.json(data, { status: 200 });
    } catch (error) {
        console.error("Error fetching roles :", error);
        return NextResponse.json({ error: 'Failed to fetch roles API' }, { status: 500 });
    }
}