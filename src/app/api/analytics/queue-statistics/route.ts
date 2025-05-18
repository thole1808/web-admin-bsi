import { apiServer } from "@/apiServer";
import { getSessionUser } from "@/getSessionUser";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const user = await getSessionUser();
  const period = req.nextUrl.searchParams.get('period');

  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const now = new Date();
  let startOfDay: Date;
  let endOfDay: Date;

  switch (period) {
    case 'today':
      startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
      break;

    case 'this_week': {
      const day = now.getDay(); // 0 = Sunday
      const diffToMonday = day === 0 ? -6 : 1 - day;
      const monday = new Date(now);
      monday.setDate(now.getDate() + diffToMonday);
      startOfDay = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate());
      endOfDay = new Date(startOfDay);
      endOfDay.setDate(startOfDay.getDate() + 7);
      break;
    }

    case 'this_month':
      startOfDay = new Date(now.getFullYear(), now.getMonth(), 1);
      endOfDay = new Date(now.getFullYear(), now.getMonth() + 1, 1);
      break;

    case 'this_year':
      startOfDay = new Date(now.getFullYear(), 0, 1);
      endOfDay = new Date(now.getFullYear() + 1, 0, 1);
      break;

    default:
      return new Response("Invalid period", { status: 400 });
  }

  const params = {
    regionId: user.branch?.regionId,
    areaId: user.branch?.areaId,
    branchId: user.branch?.id,
    startOfDay: startOfDay.toISOString(),
    endOfDay: endOfDay.toISOString(),
  };

  try {
    const res = await apiServer({
      method: "GET",
      url: "/analytics/queue-statistics",
      params,
    });

    return Response.json(res.data);
  } catch (err) {
    console.error(err);
    return new Response("Failed to fetch statistics", { status: 500 });
  }
}