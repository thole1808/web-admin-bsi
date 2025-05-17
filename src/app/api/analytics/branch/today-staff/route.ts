import { apiServer } from "@/apiServer";
import { getSessionUser } from "@/getSessionUser";
import { NextResponse } from "next/server";

// export async function GET() {
//     const user = getSessionUser();

//   try {
//     const res = await apiServer({
//       method: "GET",
//       url: `/analytics/branch/${(await user).branch?.id}/today-staff`,
//     });

//     return Response.json(res.data);
//   } catch (err) {
//     console.error(err);
//     return new Response("Failed", { status: 500 });
//   }
// }
export async function GET() {
  const todayStaffs = [
    {
      name: "Ahmad Rizki",
      role: "Customer Service",
      counter: "A1",
      shift: "Pagi",
      totalServed: 25,
      slaPerformance: 92, // Sangat baik
    },
    {
      name: "Dewi Lestari",
      role: "Teller",
      counter: "A2",
      shift: "Pagi",
      totalServed: 18,
      slaPerformance: 87, // Cukup
    },
    {
      name: "Budi Santoso",
      role: "Customer Service",
      counter: "B1",
      shift: "Siang",
      totalServed: 12,
      slaPerformance: 68, // Perlu ditingkatkan
    },
  ];

  return NextResponse.json({ data: todayStaffs });
}