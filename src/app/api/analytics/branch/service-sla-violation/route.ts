import { NextResponse } from 'next/server';

export async function GET() {
  const data = [
    { serviceType: 'Teller', slaViolation: 35 },
    { serviceType: 'Customer Service', slaViolation: 22 },
    { serviceType: 'Konsultasi', slaViolation: 12 },
    { serviceType: 'Rekening Baru', slaViolation: 8 },
  ];

  return NextResponse.json({ data });
}