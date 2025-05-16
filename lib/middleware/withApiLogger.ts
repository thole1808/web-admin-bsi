import { NextRequest, NextResponse } from 'next/server';
import { logToFile } from '@/lib/logger/logToFile';

export function withApiLogger(
  handler: (req: NextRequest & { id?: string }) => Promise<NextResponse>
) {

  return async function (req: NextRequest): Promise<NextResponse> {
    const start = Date.now();
    const timestamp = new Date().toISOString().replace('T', ' ').split('.')[0];
    const method = req.method;
    const url = req.nextUrl.pathname;
    const reqId = crypto.randomUUID();

    let reqBody: any = null;
    try {
      if (['POST', 'PUT', 'PATCH'].includes(method)) {
        const clone = req.clone();
        reqBody = await clone.json();
      }
    } catch {
      reqBody = '[Non-JSON or empty]';
    }

    try {
      const reqWithId = Object.assign(req, { id: reqId });
      const res = await handler(reqWithId);
      const duration = Date.now() - start;

      let resBody: any = '[Not JSON]';
      try {
        const resClone = res.clone();
        resBody = await resClone.json();
      } catch {}

      logToFile(
        `[${timestamp}] [${reqId}] ${method} ${url} ${res.status} in ${duration}ms\n` +
        `↳ Request: ${JSON.stringify(reqBody)}\n` +
        `↳ Response: ${JSON.stringify(resBody)}`
      );

      if (res.status === 401) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      return res;
    } catch (error: any) {
      const duration = Date.now() - start;
      logToFile(
        `[${timestamp}] [${reqId}] ${method} ${url} ERROR: ${error.message || error} in ${duration}ms\n` +
        `↳ Request: ${JSON.stringify(reqBody)}`
      );
      throw error;
    }
  };
}