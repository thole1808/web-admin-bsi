import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req: NextRequest) {
    const session = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(req.url);
    const id = url.pathname.split('/').pop();

    if (!id) {
        return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    try {
        const response = await fetch(`${process.env.API_URL}/master/national-holidays/${id}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${session.accessToken || ''}`,
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            return NextResponse.json(
                { error: errorData.message || 'Failed to national holidays' },
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch national holidays API ' },
            { status: 500 }
        );
    }
}
