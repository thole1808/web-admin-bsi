import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.API_URL;

export async function GET(req: NextRequest) {
  try {
    // Validate API_URL
    if (!API_URL) {
      console.error('API_URL is not defined in environment variables');
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }

    // Get the token
    const session = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!session || !session.accessToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Extract query parameters
    const start = req.nextUrl.searchParams.get('start');
    const end = req.nextUrl.searchParams.get('end');
    const prevStart = req.nextUrl.searchParams.get('prevStart');
    const prevEnd = req.nextUrl.searchParams.get('prevEnd');
    const branchId = req.nextUrl.searchParams.get('branchId');

    if (!start || !end || !prevStart || !prevEnd) {
      return NextResponse.json({ error: 'Missing required query parameters' }, { status: 400 });
    }

    // Fetch data from external API
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

  // Helper function to build the URL with query parameters
  function buildUrl() {
    const start = req.nextUrl.searchParams.get('start');
    const end = req.nextUrl.searchParams.get('end');
    const prevStart = req.nextUrl.searchParams.get('prevStart');
    const prevEnd = req.nextUrl.searchParams.get('prevEnd');
    const branchId = req.nextUrl.searchParams.get('branchId');

    const params = new URLSearchParams();
    if (start) params.append('start', start);
    if (end) params.append('end', end);
    if (prevStart) params.append('prevStart', prevStart);
    if (prevEnd) params.append('prevEnd', prevEnd);
    if (branchId) params.append('branchId', branchId);

    return `${API_URL}/reports/admin/queue-stats?${params.toString()}`;
  }
}
