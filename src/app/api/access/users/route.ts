import { apiGet } from '@/apiServer';
import { getDefaultFilter } from '@/getDefaultFilter';
import { buildUrl } from '@/utils/buildUrl';
import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.API_URL;

export async function GET(req: NextRequest) {
  try {
    const url = buildUrl(req, 'users/paginate');

    const response = await apiGet(await url);

    return NextResponse.json(response.data, { status: response.status });
  } catch (error: any) {
    console.error("Error processing request:", error);
    const status = error.response?.status || 500;
    const message = error.response?.data?.error || error.message || "Internal Server Error";
    return NextResponse.json({ error: message }, { status });
  }
}

export async function POST(req: NextRequest) {
  try {
    if (!API_URL) {
      console.error('API_URL is not defined in environment variables');
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }

    const session = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const endpoint = `${API_URL}/users`;

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.accessToken}`,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      return NextResponse.json({ error: errorMessage || 'Failed to create resource' }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}