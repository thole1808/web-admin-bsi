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
        const response = await fetch(`${process.env.API_URL}/master/status-messages/${id}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${session.accessToken || ''}`,
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            return NextResponse.json(
                { error: errorData.message || 'Failed to status messages' },
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch status messages API ' },
            { status: 500 }
        );
    }
}


export async function PUT(req: NextRequest) {
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
        const requestBody = await req.json(); 

        const { status, message } = requestBody;

        if (!status || !message) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const response = await fetch(`${process.env.API_URL}/master/status-messages/${id}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${session.accessToken || ''}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                status,
                message
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            return NextResponse.json(
                { error: errorData.message || 'Failed to update status message' },
                { status: response.status }
            );
        }

        const updatedData = await response.json();
        return NextResponse.json(updatedData, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to update status message API' },
            { status: 500 }
        );
    }
}


export async function DELETE(req: NextRequest) {
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
        const response = await fetch(`${process.env.API_URL}/master/status-messages/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${session.accessToken || ''}`,
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            return NextResponse.json(
                { error: errorData.message || 'Failed to delete status message' },
                { status: response.status }
            );
        }
        return NextResponse.json({ message: "Status message deleted successfully" }, { status: 200 });

    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to delete status message' },
            { status: 500 }
        );
    }
}