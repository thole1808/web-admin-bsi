// src/app/api/service-type/route.tsx
import { NextResponse } from 'next/server';

export async function GET() {
  const responseData = {
    code: 200,
    status: "success",
    message: "Success",
    data: [
      { rn: "1", id: 441, code: "BT", name: "Tabungan Perorangan", type: "REGISTRATION", frontliner: "CS", sla: "600", active: "1" },
      { rn: "2", id: 442, code: "BA", name: "Tabungan Anak", type: "REGISTRATION", frontliner: "CS", sla: "600", active: "1" },
      { rn: "3", id: 443, code: "BI", name: "Tabungan Investasi", type: "REGISTRATION", frontliner: "CS", sla: "600", active: "1" },
      { rn: "4", id: 444, code: "ST", name: "Transaksi Setor Tunai", type: "TRANSACTION", frontliner: "TELLER", sla: "600", active: "1" },
      { rn: "5", id: 445, code: "TR", name: "Transaksi Tarik Tunai", type: "TRANSACTION", frontliner: "TELLER", sla: "600", active: "1" },
      { rn: "6", id: 446, code: "TF", name: "Transaksi Pindah Buku", type: "TRANSACTION", frontliner: "TELLER", sla: "600", active: "1" },
      { rn: "7", id: 447, code: "SK", name: "Transaksi SKN", type: "TRANSACTION", frontliner: "TELLER", sla: "600", active: "1" },
      { rn: "8", id: 448, code: "RG", name: "Transaksi RTGS", type: "TRANSACTION", frontliner: "TELLER", sla: "600", active: "1" },
      { rn: "9", id: 449, code: "BF", name: "Transaksi BIFAST", type: "TRANSACTION", frontliner: "TELLER", sla: "600", active: "1" },
      { rn: "10", id: 450, code: "MB", name: "Mobile Banking", type: "OTHER", frontliner: "CS", sla: "600", active: "1" },
      { rn: "11", id: 451, code: "KA", name: "Kartu ATM", type: "OTHER", frontliner: "CS", sla: "600", active: "1" },
      { rn: "12", id: 452, code: "IB", name: "Internet Banking", type: "OTHER", frontliner: "CS", sla: "600", active: "1" },
      { rn: "13", id: 453, code: "CM", name: "Cetak Mutasi", type: "OTHER", frontliner: "CS", sla: "600", active: "1" },
      { rn: "14", id: 454, code: "BR", name: "Blokir/Buka Blokir Rekening", type: "OTHER", frontliner: "CS", sla: "600", active: "1" },
      { rn: "15", id: 455, code: "DP", name: "Pencairan Deposito Sebelum Jatuh Tempo", type: "OTHER", frontliner: "CS", sla: "600", active: "1" },
      { rn: "16", id: 456, code: "PD", name: "Perubahan Data", type: "OTHER", frontliner: "CS", sla: "600", active: "1" },
      { rn: "17", id: 457, code: "PR", name: "Penutupan Rekening", type: "OTHER", frontliner: "CS", sla: "600", active: "1" },
      { rn: "18", id: 458, code: "PP", name: "Pengaduan", type: "OTHER", frontliner: "CS", sla: "600", active: "1" },
      { rn: "19", id: 459, code: "CL", name: "Layanan CS Lainnya", type: "OTHER", frontliner: "CS", sla: "600", active: "1" },
      { rn: "20", id: 460, code: "TV", name: "Transaksi Valas", type: "OTHER", frontliner: "TELLER", sla: "600", active: "1" },
      { rn: "21", id: 461, code: "PH", name: "Pelunasan Haji", type: "OTHER", frontliner: "TELLER", sla: "600", active: "1" },
      { rn: "22", id: 462, code: "WU", name: "Western Union", type: "OTHER", frontliner: "TELLER", sla: "600", active: "1" },
      { rn: "23", id: 463, code: "TL", name: "Layanan Teller Lainnya", type: "OTHER", frontliner: "TELLER", sla: "600", active: "1" }
    ],
    meta: {
      current_page: 1,
      per_page: 100,
      total: 23,
      last_page: 1
    },
    links: {
      first: "https://webform-dev.bankbsi.co.id/api/service-type?page=1",
      last: "https://webform-dev.bankbsi.co.id/api/service-type?page=1",
      prev: null,
      next: null
    }
  };

  return NextResponse.json(responseData);
}