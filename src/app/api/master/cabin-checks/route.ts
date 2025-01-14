import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const session = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const response = await fetch(`${process.env.API_URL}/master/checklists`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.accessToken || ''}`,
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            return NextResponse.json({ error: errorData.error || 'Failed to fetch checklists API' }, { status: response.status });
        }

        const data = await response.json();
        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        console.error("Error fetching checklists :", error);
        return NextResponse.json({ error: 'Failed to fetch checklists API' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    const session = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await req.json();

        // Validasi field wajib
        const errors: string[] = [];

        if (!body.activityName || typeof body.activityName !== "string") {
            errors.push("Field 'activityName' is required and must be a string.");
        }

        if (!body.activityType || !["SOD", "EOD"].includes(body.activityType)) {
            errors.push(
                "Field 'activityType' is required and must be either 'SOD' or 'EOD'."
            );
        }

        if (body.isRequired !== undefined && typeof body.isRequired !== "boolean") {
            errors.push("Field 'isRequired' must be a boolean.");
        }

        if (body.isActive !== undefined && typeof body.isActive !== "boolean") {
            errors.push("Field 'isActive' must be a boolean.");
        }

        if (errors.length > 0) {
            return NextResponse.json(
                { error: "Validation errors", details: errors },
                { status: 400 }
            );
        }

        const payload = {
            activityName: body.activityName,
            activityType: body.activityType,
            isRequired: body.isRequired || true,
            isActive: body.isActive || true,
        };

        const response = await fetch(`${process.env.API_URL}/master/checklists`, {
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