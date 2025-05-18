import { apiServer } from "@/apiServer";
import { getSessionUser } from "@/getSessionUser";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const user = await getSessionUser();
  const period = req.nextUrl.searchParams.get('period');

  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const params = {
    regionId: user.branch?.regionId,
    areaId: user.branch?.areaId,
    branchId: user.branch?.id,
    period: period,
  };

  console.log("PARAMS", params);

  try {
    const res = await apiServer({
      method: "GET",
      url: "/analytics/staff-performances-trend",
      params,
    });

    return Response.json(res.data);
  } catch (err) {
    console.error(err);
    return new Response("Failed to fetch trends", { status: 500 });
  }
}