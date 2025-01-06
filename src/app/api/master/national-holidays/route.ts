import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const session = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {   
        const response = await fetch(`${process.env.API_URL}/master/national-holidays`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.accessToken || ''}`,
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            return NextResponse.json({ error: errorData.error || 'Failed to fetch national holiday API' }, { status: response.status });
        }

        const data = await response.json();
        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        console.error("Error fetching national holiday :", error);
        return NextResponse.json({ error: 'Failed to fetch national holiday API' }, { status: 500 });
    }
}


export async function POST(req: NextRequest) {
    try {
        const session = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

        if (!session) {
            console.error("Session not found");
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { name, date } = body

        if (!name || typeof name !== "string") {
            return NextResponse.json({ error: "Field 'name' is required and must be a string." }, { status: 400 });
        }

        if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
            return NextResponse.json({ error: "Field 'date' is required and must be in YYYY-MM-DD format." }, { status: 400 });
        }

        const payload = {
            name,
            date,
        };

        console.log("Payload sent to API:", payload);

        const response = await fetch(`${process.env.API_URL}/master/national-holidays`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.accessToken || ''}`,
            },
            body: JSON.stringify(payload),
        });

        console.log('Response Status:', response.status);

        if (!response.ok) {
            const errorData = await response.json();
            console.log('Error Data:', errorData);

            if (errorData?.data) {
                const errorMessage = errorData.data.date || errorData.message;
                return NextResponse.json({ error: errorMessage }, { status: response.status });
            }

            return NextResponse.json({ error: errorData.message || 'Failed to create holiday' }, { status: response.status });
        }
        const data = await response.json();
        const { id, ...filteredData } = data;

        return NextResponse.json({ success: true, data: filteredData }, { status: 201 });

    } catch (error) {
        console.error('Error in POST /create holiday:', error);
        return NextResponse.json({ error: 'Failed to create holiday due to server issue.' }, { status: 500 });
    }
}
