import { NextResponse } from 'next/server';

export async function GET() {
  const data = [
    { label: '08:00', total: 5 },
    { label: '09:00', total: 12 },
    { label: '10:00', total: 20 },
    { label: '11:00', total: 25 },
    { label: '12:00', total: 18 },
    { label: '13:00', total: 22 },
    { label: '14:00', total: 17 },
    { label: '15:00', total: 14 },
    { label: '16:00', total: 10 },
  ];

  return NextResponse.json({ data });
}