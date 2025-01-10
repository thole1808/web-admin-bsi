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
    const roleName = req.nextUrl.searchParams.get('roleName');
    const active = req.nextUrl.searchParams.get('active');
    const search = req.nextUrl.searchParams.get('search');
    const sortBy = req.nextUrl.searchParams.get('sortBy');
    const direction = req.nextUrl.searchParams.get('direction');
    const size = req.nextUrl.searchParams.get('size');
    const page = req.nextUrl.searchParams.get('page');

    const params = new URLSearchParams();

    if (branchId) params.append('branchId', branchId);
    if (roleName) params.append('roleName', roleName);
    if (active) params.append('active', active);
    if (sortBy) params.append('sortBy', sortBy);
    if (direction) params.append('direction', direction);
    if (size) params.append('size', size);
    if (page) params.append('page', page);
    if (search) params.append('search', search);

    const url = `${API_URL}/users/paginate?${params.toString()}`;

    return url;
  }
}