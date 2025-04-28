import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.API_URL;
const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET;

export async function GET(req: NextRequest) {
  if (!API_URL || !NEXTAUTH_SECRET) {
    console.error('Environment variables API_URL or NEXTAUTH_SECRET are missing');
    return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
  }

  try {
    const session = await getToken({ req, secret: NEXTAUTH_SECRET });

    if (!session?.accessToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const response = await fetch(`${API_URL}/reports/admin/branch-stats`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.accessToken}`,
      },
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      console.error('API fetch error:', errorMessage);
      return NextResponse.json({ error: errorMessage || 'Failed to fetch data from API' }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 200 });

  } catch (error: any) {
    console.error('Unexpected error:', error?.message || error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}