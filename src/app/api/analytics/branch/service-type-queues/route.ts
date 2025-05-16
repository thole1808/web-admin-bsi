import { NextResponse } from 'next/server';

export async function GET() {
  const data = [
    { serviceType: 'Teller', total: 120 },
    { serviceType: 'Customer Service', total: 95 },
    { serviceType: 'Konsultasi', total: 42 },
    { serviceType: 'Pembukaan Rekening', total: 68 },
    { serviceType: 'Pencairan Deposito Sebelum Jatuh Tempo', total: 168 },
  ];

  return NextResponse.json({ data });
}