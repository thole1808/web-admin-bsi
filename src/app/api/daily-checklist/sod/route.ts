import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.API_URL;

export async function POST(req: NextRequest) {
    try {
        // Validate API_URL
        if (!API_URL) {
            console.error('API_URL is not defined in environment variables');
            return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
        }

        // Get the token from NextAuth
        const session = await getToken({
            req,
            secret: process.env.NEXTAUTH_SECRET,
        });

        if (!session || !session.accessToken) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Extract the data from the request body
        const { activityDate, activityType, checklists, branchId } = await req.json();

        // Validate required data
        if (!activityDate || !activityType || !checklists || !branchId) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const url = `${API_URL}/daily-checklists`;

        // Make the request to the external API
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${session.accessToken}`,
            },
            body: JSON.stringify({
                activityDate,
                activityType,
                checklists,
                branchId,
            }),
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            return NextResponse.json({ error: errorMessage || 'Failed to fetch API' }, { status: response.status });
        }

        // Return the fetched data from the external API
        const data = await response.json();
        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        console.error('Error processing request:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
