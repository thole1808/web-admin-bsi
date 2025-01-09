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
    console.log(data);
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }

  function buildUrl() {
    const branchId = req.nextUrl.searchParams.get('branchId');
    const serviceTypeId = req.nextUrl.searchParams.get('serviceTypeId');
    const status = req.nextUrl.searchParams.get('status');
    const type = req.nextUrl.searchParams.get('type');
    const priority = req.nextUrl.searchParams.get('priority');
    const sortBy = req.nextUrl.searchParams.get('sortBy');
    const direction = req.nextUrl.searchParams.get('direction');
    const size = req.nextUrl.searchParams.get('size');
    const page = req.nextUrl.searchParams.get('page');
    const start = req.nextUrl.searchParams.get('start');
    const end = req.nextUrl.searchParams.get('end');
    const search = req.nextUrl.searchParams.get('search');

    const params = new URLSearchParams();

    if (branchId) params.append('branchId', branchId);
    if (serviceTypeId) params.append('serviceTypeId', serviceTypeId);
    if (status) params.append('status', status);
    if (type) params.append('type', type);
    if (priority) params.append('priority', priority);
    if (start) params.append('startOfDay', start + 'T00:00:00');
    if (end) params.append('endOfDay', end + 'T23:59:59');
    if (sortBy) params.append('sortBy', sortBy);
    if (direction) params.append('direction', direction);
    if (size) params.append('size', size);
    if (page) params.append('page', page);
    if (search) params.append('search', search);

    params.append('withInactive', 'true');

    const url = `${API_URL}/queues/paginate?${params.toString()}`;

    return url;
  }
}