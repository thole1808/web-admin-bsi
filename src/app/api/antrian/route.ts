import { buildUrl } from '@/utils/buildUrl';
import { NextRequest } from 'next/server';
import { apiServer } from "@/apiServer";

export async function GET(req: NextRequest) {
  try {
    const url = await buildUrl(req, "/queues/paginate");

    const res = await apiServer({
      method: "GET",
      url: url,
    });

    return Response.json(res.data);
  } catch (err) {
    console.error(err);
    return new Response("Failed", { status: 500 });
  }
}