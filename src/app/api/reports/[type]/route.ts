import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.API_URL;

export async function GET(req: NextRequest, { params }: { params: Promise<{ type: string }> }) {
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

    const type = (await params).type;

    const response = await fetch(`${API_URL}/reports/${type}?${getParams()}`, {
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
    console.log(data);
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }

  function getParams() {
    const sortBy = req.nextUrl.searchParams.get('sortBy');
    const direction = req.nextUrl.searchParams.get('direction');
    const size = req.nextUrl.searchParams.get('size');
    const page = req.nextUrl.searchParams.get('page');
    const start = req.nextUrl.searchParams.get('start');
    const end = req.nextUrl.searchParams.get('end');
    const search = req.nextUrl.searchParams.get('search');

    const params = new URLSearchParams();

    if (start) params.append('startOfDay', start + 'T00:00:00');
    if (end) params.append('endOfDay', end + 'T23:59:59');
    if (sortBy) params.append('sortBy', sortBy);
    if (direction) params.append('direction', direction);
    if (size) params.append('size', size);
    if (page) params.append('page', page);
    if (search) params.append('search', search);

    return params.toString();
  }
}