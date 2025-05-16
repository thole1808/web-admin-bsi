import { getDefaultFilter } from "@/getDefaultFilter";
import { buildQueryString, combineParams } from "@/utils/url";

export async function buildUrl(req: Request, basePath: string): Promise<string> {
  const API_URL = process.env.API_URL as string;
  if (!API_URL) throw new Error("API_URL is not defined");

  const filter = await getDefaultFilter();
  const { searchParams } = new URL(req.url);

  let combinedParams = combineParams(filter, searchParams);

  const today = new Date().toISOString().split('T')[0];

  const queryString = buildQueryString(combinedParams);

  return `${basePath}?${queryString}`;
}