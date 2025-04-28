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

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const url = new URL(req.url);
        const id = Number(url.pathname.split('/').pop());
        const body = await req.formData();
        const endpoint = `${API_URL}/app/caller/sounds/${id}`;

        console.log('Updating sound on:', endpoint);
        console.log('Request body:', body);

        const response = await fetch(endpoint, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${session.accessToken}`,
            },
            body: body
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            return NextResponse.json({ error: errorMessage || 'Failed to update resource' }, { status: response.status });
        }

        const data = await response.json();
        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        console.error('Error processing request:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}