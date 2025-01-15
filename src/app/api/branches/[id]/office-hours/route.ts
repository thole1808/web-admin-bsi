import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.API_URL;

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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

      const id = (await params).id;
      const endpoint = `${API_URL}/branches/${id}/office-hours`;

      const response = await fetch(endpoint, {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${session.accessToken}`,
          },
      });

      if (!response.ok) {
          const errorMessage = await response.text();
          return NextResponse.json({ error: errorMessage || 'Failed to update resource' }, { status: response.status });
      }

      const data = await response.json();
      console.log(data);
      return NextResponse.json(data, { status: 200 });
  } catch (error) {
      console.error('Error processing request:', error);
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}