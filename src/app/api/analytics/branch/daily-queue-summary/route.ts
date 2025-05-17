import { apiServer } from "@/apiServer";
import { getSessionUser } from "@/getSessionUser";

export async function GET() {
    const user = getSessionUser();

  try {
    const res = await apiServer({
      method: "GET",
      url: `/analytics/branch/${(await user).branch?.id}/daily-queue-summary`,
    });

    return Response.json(res.data);
  } catch (err) {
    console.error(err);
    return new Response("Failed", { status: 500 });
  }
}