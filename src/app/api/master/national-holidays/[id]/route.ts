import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.API_URL;

export async function PUT(req: NextRequest) {
    try {
        if (!API_URL) {
            console.error('API_URL is not defined in environment variables');
            return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
        }

        const session = await getToken({
            req,
            secret: process.env.NEXTAUTH_SECRET,
        });

        if (!session || !session.accessToken) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const url = new URL(req.url);
        const id = Number(url.pathname.split('/').pop());
        const body = await req.json();
        const endpoint = `${API_URL}/master/checklists/${id}`;

        const response = await fetch(endpoint, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${session.accessToken}`,
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            return NextResponse.json({ error: errorMessage || 'Failed to update resource' }, { status: response.status });
        }

        const data = await response.json();
        console.log(data);
        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        console.error('Error processing request:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    try {
        if (!API_URL) {
            console.error('API_URL is not defined in environment variables');
            return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
        }

        const session = await getToken({
            req,
            secret: process.env.NEXTAUTH_SECRET,
        });

        if (!session || !session.accessToken) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const url = new URL(req.url);
        const id = Number(url.pathname.split('/').pop());
        const endpoint = `${API_URL}/master/checklists/${id}`;

        const response = await fetch(endpoint, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${session.accessToken}`,
            },
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            return NextResponse.json({ error: errorMessage || 'Failed to delete resource' }, { status: response.status });
        }

        const data = await response.json();
        console.log(data);
        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        console.error('Error processing request:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}