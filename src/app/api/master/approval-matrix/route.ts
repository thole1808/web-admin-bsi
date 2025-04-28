import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req: NextRequest) {
    const session = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const response = await fetch(`${process.env.API_URL}/master/approval-matrix`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.accessToken || ''}`,
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            return NextResponse.json({ error: errorData.error || 'Failed to fetch approval matrix API' }, { status: response.status });
        }

        const data = await response.json();return NextResponse.json(data, { status: 200 });
    } catch (error) {
        console.error("Error fetching approval matrix:", error);
        return NextResponse.json({ error: 'Failed to fetch approval matrix API' }, { status: 500 });
    }
}

interface Session {
    user: {
        id: string;
    };
    accessToken?: string;
}

export async function POST(req: NextRequest) {
    try {
        const session = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
        if (!session) {
            console.error("Session not found");
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const user = session.user as Session['user'];
        if (!user || !user.id) {
            console.error("User or roleId not found in session");
            return NextResponse.json({ error: 'Role ID missing in session' }, { status: 401 });
        }

        const body = await req.json();
        const { modelType, event, nextApprovalId } = body;

        if (!modelType || !event) {
            return NextResponse.json({ error: 'Model Type and Event are required.' }, { status: 400 });
        }

        const roleId = 2;

        const payload = {
            modelType,
            event,
            roleId,
            nextApprovalId: nextApprovalId !== undefined ? nextApprovalId : null,
            // createdAt,
        };

        console.log("Payload sent to API:", payload);
        const response = await fetch(`${process.env.API_URL}/master/approval-matrix`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.accessToken || ''}`,
            },
            body: JSON.stringify(payload),
        });

        console.log('Response Status:', response.status);

        if (!response.ok) {
            const errorData = await response.json();
            console.log('Error Data:', errorData);

            return NextResponse.json({ error: errorData.message || 'Failed to create approval matrix' }, { status: response.status });
        }
        const data = await response.json();const { id, ...filteredData } = data;
        return NextResponse.json({ success: true, data: filteredData }, { status: 201 });

    } catch (error) {
        console.error('Error in POST /create approval matrix:', error);
        return NextResponse.json({ error: 'Failed to create approval matrix due to server issue.' }, { status: 500 });
    }
}
