import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const session = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const response = await fetch(`${process.env.API_URL}/master/status-messages`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.accessToken || ''}`,
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            return NextResponse.json({ error: errorData.error || 'Failed to fetch status messages API' }, { status: response.status });
        }

        const data = await response.json();
        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        console.error("Error fetching status messages :", error);
        return NextResponse.json({ error: 'Failed to fetch status messages API' }, { status: 500 });
    }
}


export async function POST(req: NextRequest) {
    const session = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await req.json();

        const errors: string[] = [];

        if (!body.statusName || typeof body.statusName !== "string") {
            errors.push("Field 'status' is required and must be a string.");
        } else if (body.statusName !== body.statusName.toUpperCase()) {
            errors.push("Status Name must be in uppercase.");
        }

        if (!body.statusMessage || typeof body.statusMessage !== "string") {
            errors.push("Field 'message' is required and must be a string.");
        }

        if (errors.length > 0) {
            return NextResponse.json(
                { error: "Validation errors", details: errors },
                { status: 400 }
            );
        }

        const payload = {
            status: body.statusName.toUpperCase(),
            message: body.statusMessage,
        };

        const response = await fetch(`${process.env.API_URL}/master/status-messages`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${session.accessToken || ""}`,
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const errorData = await response.json();
            return NextResponse.json(
                { error: errorData.error || "Failed to create activity." },
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data, { status: 201 });
    } catch (error) {
        console.error("Error creating activity:", error);
        return NextResponse.json({ error: "Failed to create activity." }, { status: 500 });
    }
}

