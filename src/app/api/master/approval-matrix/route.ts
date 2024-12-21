import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

// Endpoint untuk GET data approval matrix (sudah ada)
export async function GET(req: NextRequest) {
    const session = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const response = await fetch(`${process.env.API_URL}/master/approval-matrix`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.accessToken || ''}`,
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            return NextResponse.json({ error: errorData.error || 'Failed to fetch approval matrix API' }, { status: response.status });
        }

        const data = await response.json();
        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        console.error("Error fetching approval matrix:", error);
        return NextResponse.json({ error: 'Failed to fetch approval matrix API' }, { status: 500 });
    }
}

// Definisikan tipe untuk session
interface Session {
    user: {
      id: string;
      // Add other properties of the user if needed
    };
    accessToken?: string;
  }
  
  export async function POST(req: NextRequest) {
    const session = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  
    // Periksa apakah session ada
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  
    // Assert tipe session.user ke tipe yang kita definisikan
    const user = session.user as Session['user'];
  
    try {
      const body = await req.json();
      const { modelType, event, nextApprovalId } = body;
  
      // Validasi fields yang diperlukan
      if (!modelType || !event) {
        return NextResponse.json({ error: 'Model Type and Event are required.' }, { status: 400 });
      }
  
      const roleId = user.id; // Menggunakan id dari user
  
      const createdAt = new Date().toISOString();
  
      const payload = {
        modelType,
        event,
        roleId,
        nextApprovalId: nextApprovalId !== undefined ? nextApprovalId : null,
        createdAt,
      };
  
      const response = await fetch(`${process.env.API_URL}/master/approval-matrix`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.accessToken || ''}`,
        },
        body: JSON.stringify(payload),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        return NextResponse.json({ error: errorData.error || 'Failed to create approval matrix' }, { status: response.status });
      }
  
      const data = await response.json();
      const { id, ...filteredData } = data;
  
      return NextResponse.json({ success: true, data: filteredData }, { status: 201 });
    } catch (error) {
      console.error("Error creating approval matrix:", error);
      return NextResponse.json({ error: 'Failed to create approval matrix' }, { status: 500 });
    }
  }
  