import { buildUrl } from '@/utils/buildUrl';
import { NextRequest } from 'next/server';
import { apiClient } from "@/apiClient";

export async function GET(req: NextRequest) {
  try {
    const url = await buildUrl(req, "/branches/paginate");

    const res = await apiClient({
      method: "GET",
      url: url,
    });

    return Response.json(res.data);
  } catch (err) {
    console.error(err);
    return new Response("Failed", { status: 500 });
  }
}