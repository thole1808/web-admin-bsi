import { NextResponse } from 'next/server';

export async function GET() {
  const data = [
    { serviceType: 'Tabungan Perorangan', total: 112 },
    { serviceType: 'Tabungan Anak', total: 76 },
    { serviceType: 'Tabungan Investasi', total: 54 },
    { serviceType: 'Transaksi Setor Tunai', total: 128 },
    { serviceType: 'Transaksi Tarik Tunai', total: 134 },
    { serviceType: 'Transaksi Pindah Buku', total: 98 },
    { serviceType: 'Transaksi SKN', total: 63 },
    { serviceType: 'Transaksi RTGS', total: 45 },
    { serviceType: 'Transaksi BIFAST', total: 72 },
    { serviceType: 'Mobile Banking', total: 89 },
  ];

  return NextResponse.json({ data });
}