import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.API_URL;

export async function GET(req: NextRequest) {
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

    const name = req.nextUrl.searchParams.get('name');
    const search = req.nextUrl.searchParams.get('search');
    const isActive = req.nextUrl.searchParams.get('isActive');
    const type = req.nextUrl.searchParams.get('type');
    const sortBy = req.nextUrl.searchParams.get('sortBy');
    const direction = req.nextUrl.searchParams.get('direction');
    const size = req.nextUrl.searchParams.get('size');
    const page = req.nextUrl.searchParams.get('page');

    const params = new URLSearchParams();

    if (name) params.append('name', name);
    if (search) params.append('search', search);
    if (isActive) params.append('isActive', isActive);
    if (type) params.append('type', type);
    if (sortBy) params.append('sortBy', sortBy);
    if (direction) params.append('direction', direction);
    if (size) params.append('size', size);
    if (page) params.append('page', page);

    const url = `${API_URL}/branches/paginate?${params.toString()}`;

    return url;
  }
}