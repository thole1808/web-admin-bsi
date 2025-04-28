import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.API_URL;

export async function GET(req: NextRequest) {
  try {
    if (!API_URL) {
      console.error('API_URL is not defined in environment variables');
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }

    const session = await getToken({req, secret: process.env.NEXTAUTH_SECRET});

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const response = await fetch(buildUrl(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.accessToken}`,
      },
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      return NextResponse.json({ error: errorMessage || 'Failed to fetch API' }, { status: response.status });
    }

    // Return the fetched data
    const data = await response.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }

  function buildUrl() {

    const username = req.nextUrl.searchParams.get('search');
    const eventType = req.nextUrl.searchParams.get('eventType');
    const startOfDay = req.nextUrl.searchParams.get('startOfDay');
    const endOfDay = req.nextUrl.searchParams.get('endOfDay');
    const sortBy = req.nextUrl.searchParams.get('sortBy') || 'id';
    const direction = req.nextUrl.searchParams.get('direction') || 'desc';
    const size = req.nextUrl.searchParams.get('size');
    const page = req.nextUrl.searchParams.get('page');

    const params = new URLSearchParams();

    if (username) params.append('username', username);
    if (eventType) params.append('eventType', eventType);
    if (startOfDay) params.append('startOfDay', startOfDay + 'T00:00:00');
    if (endOfDay) params.append('endOfDay', endOfDay + 'T23:59:59');
    if (sortBy) params.append('sortBy', sortBy);
    if (direction) params.append('direction', direction);
    if (size) params.append('size', size);
    if (page) params.append('page', page);

    const url = `${API_URL}/sys/audits/paginate?${params.toString()}`;

    return url;
  }
}