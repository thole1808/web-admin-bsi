// import { getToken } from "next-auth/jwt";
// import { NextRequest, NextResponse } from "next/server";


// export async function GET(req: NextRequest) {
//     const session = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

//     if (!session) {
//         return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     try {
//         const { searchParams } = new URL(req.url);
//         const page = searchParams.get("page") || "1"; 
//         const size = searchParams.get("size") || "10"; 
//         const sortBy = searchParams.get("sortBy") || "code"; 
//         const direction = searchParams.get("direction") || "ASC"; 
//         // const type = searchParams.get("type") || ""; 

//         // const apiUrl = `${process.env.API_URL}/branches/paginate?type=${type}&page=${page}&size=${size}&sortBy=${sortBy}&direction=${direction}`;
//         const apiUrl = `${process.env.API_URL}/reservations/paginate?page=${page}&size=${size}&sortBy=${sortBy}&direction=${direction}`;

//         const response = await fetch(apiUrl, {
//             method: "GET",
//             headers: {
//                 "Content-Type": "application/json",
//                 Authorization: `Bearer ${session.accessToken || ""}`,
//             },
//         });

//         if (!response.ok) {
//             const errorData = await response.json();
//             return NextResponse.json({ error: errorData.error || "Failed to fetch reservations API" }, { status: response.status });
//         }

//         const data = await response.json();
//         return NextResponse.json(data, { status: 200 });
//     } catch (error) {
//         console.error("Error fetching reservations messages:", error);
//         return NextResponse.json({ error: "Failed to fetch reservations API" }, { status: 500 });
//     }
// }


// import { getToken } from "next-auth/jwt";
// import { NextRequest, NextResponse } from "next/server";

// export async function GET(req: NextRequest) {
//     // Retrieve session token from next-auth
//     const session = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

//     if (!session) {
//         return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     try {
//         const { searchParams } = new URL(req.url);
        
//         // Extract query parameters with fallback values
//         const page = searchParams.get("page") || "1"; 
//         const size = searchParams.get("size") || "10"; 
//         const sortBy = searchParams.get("sortBy") || "date"; // Use "date" by default
//         const direction = searchParams.get("direction") || "ASC"; 

//         // Construct the API URL with query parameters
//         const apiUrl = `${process.env.API_URL}/reservations/paginate?page=${page}&size=${size}&sortBy=${sortBy}&direction=${direction}`;

//         // Fetch data from external API with session token
//         const response = await fetch(apiUrl, {
//             method: "GET",
//             headers: {
//                 "Content-Type": "application/json",
//                 Authorization: `Bearer ${session.accessToken || ""}`, // Ensure access token is passed
//             },
//         });

//         if (!response.ok) {
//             const errorData = await response.json();
//             return NextResponse.json({ error: errorData.error || "Failed to fetch reservations data" }, { status: response.status });
//         }

//         const data = await response.json();
//         return NextResponse.json(data, { status: 200 });
//     } catch (error) {
//         console.error("Error fetching reservation data:", error);
//         return NextResponse.json({ error: "Failed to fetch reservation data" }, { status: 500 });
//     }
// }


import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        // Retrieve session token from next-auth
        const session = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

        // If no session, return Unauthorized response
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const page = searchParams.get("page") || "1"; 
        const size = searchParams.get("size") || "10"; 
        const sortBy = searchParams.get("sortBy") || "code"; // Default to "date"
        const direction = searchParams.get("direction") || "ASC"; 

        // Construct the API URL
        const apiUrl = `${process.env.API_URL}/reservations/paginate?page=${page}&size=${size}&sortBy=${sortBy}&direction=${direction}`;

        // Fetch data from the external API
        const response = await fetch(apiUrl, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${session.accessToken || ""}`,
            },
        });

        // If response is not OK, log and return the error response
        if (!response.ok) {
            const errorData = await response.json();
            console.error("API Error:", errorData); // Log detailed error
            return NextResponse.json({ error: errorData.error || "Failed to fetch reservations data" }, { status: response.status });
        }

        // Parse and return the successful response
        const data = await response.json();
        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        // General error handling with more detailed logging
        console.error("Error fetching reservations data:", error);
        return NextResponse.json({ error: "Internal Server Error", details: error.message }, { status: 500 });
    }
}
