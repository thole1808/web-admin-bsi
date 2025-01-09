import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const session = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {   
        const response = await fetch(`${process.env.API_URL}/master/service-types`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.accessToken || ''}`,
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            return NextResponse.json({ error: errorData.error || 'Failed to fetch services types API' }, { status: response.status });
        }

        const data = await response.json();
        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        console.error("Error fetching services types :", error);
        return NextResponse.json({ error: 'Failed to fetch services types API' }, { status: 500 });
    }
}


// export async function POST(req: NextRequest) {
//     const session = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

//     if (!session) {
//         return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     try {
//         const body = await req.json();

//         // const errors: string[] = [];

//         // if (!body.name || typeof body.name !== "string") {
//         //     errors.push("Field 'name' is required and must be a string.");
//         // }

//         // if (!body.slaMinDuration || typeof body.slaMinDuration !== "number") {
//         //     errors.push("Field 'slaMinDuration' is required and must be a number.");
//         // }

//         // if (!body.slaMaxDuration || typeof body.slaMaxDuration !== "string") {
//         //     errors.push("Field 'slaMaxDuration' is required and must be a string.");
//         // }

//         // if (!body.parentId || typeof body.parentId !== "string") {
//         //     errors.push("Field 'parentId' is required and must be a string.");
//         // }

//         // if (errors.length > 0) {
//         //     return NextResponse.json(
//         //         { error: "Validation errors", details: errors },
//         //         { status: 400 }
//         //     );
//         // }

//         const payload = {
//             code: body.code || "",
//             rsvCode: body.rsvCode || "",
//             productCode: body.productCode || "",
//             name: body.name,
//             prefix: body.prefix || "",
//             slaMinDuration: body.slaMinDuration,  
//             slaMaxDuration: body.slaMaxDuration,
//             parentId: body.parentId || 1,
//             formFields: body.formFields || null,
//         };

//         const response = await fetch(`${process.env.API_URL}/master/service-types`, {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
//                 Authorization: `Bearer ${session.accessToken || ""}`,
//             },
//             body: JSON.stringify(payload),
//         });

//         if (!response.ok) {
//             const errorData = await response.json();
//             return NextResponse.json(
//                 { error: errorData.error || "Failed to create service BACKEND." },
//                 { status: response.status }
//             );
//         }

//         const data = await response.json();
//         return NextResponse.json(data, { status: 201 });
//     } catch (error) {
//         console.error("Error creating service:", error);
//         return NextResponse.json({ error: "Failed to create service BACKEND." }, { status: 500 });
//     }
// }


// export async function POST(req: NextRequest) {
//     const session = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

//     if (!session) {
//         return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     try {
//         const body = await req.json();

//         // const errors: string[] = [];

//         // // Validate name
//         // if (!body.name || typeof body.name !== "string") {
//         //     errors.push("Field 'name' is required and must be a string.");
//         // }

//         // // Validate slaMinDuration
//         // if (body.slaMinDuration == null) {
//         //     errors.push("Field 'slaMinDuration' is required.");
//         // } else if (typeof body.slaMinDuration !== "number") {
//         //     errors.push("Field 'slaMinDuration' must be a number.");
//         // }

//         // // Validate slaMaxDuration
//         // if (body.slaMaxDuration == null) {
//         //     errors.push("Field 'slaMaxDuration' is required.");
//         // } else if (typeof body.slaMaxDuration !== "number") {
//         //     errors.push("Field 'slaMaxDuration' must be a number.");
//         // }

//         // // Validate parentId
//         // if (body.parentId == null) {
//         //     errors.push("Field 'parentId' is required.");
//         // } else if (typeof body.parentId !== "number") {
//         //     errors.push("Field 'parentId' must be a number.");
//         // }


//         // if (errors.length > 0) {
//         //     return NextResponse.json(
//         //         { error: "Validation errors", details: errors },
//         //         { status: 400 }
//         //     );
//         // }

//         const payload = {
//             code: body.code || "",
//             rsvCode: body.rsvCode || "",
//             productCode: body.productCode || "",
//             name: body.name,
//             prefix: body.prefix || "",
//             slaMinDuration: body.slaMinDuration,  
//             slaMaxDuration: body.slaMaxDuration,
//             parentId: body.parentId || 1,  // Default to 1 if not provided
//             formFields: body.formFields || null,
//         };
        

//         const response = await fetch(`${process.env.API_URL}/master/service-types`, {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
//                 Authorization: `Bearer ${session.accessToken || ""}`,
//             },
//             body: JSON.stringify(payload),
//         });

//         if (!response.ok) {
//             const errorData = await response.json();
//             console.error("Backend error response:", errorData);
//             return NextResponse.json(
//                 { error: errorData.error || "Failed to create service BACKEND." },
//                 { status: response.status }
//             );
//         }

//         const data = await response.json();
//         return NextResponse.json(data, { status: 201 });
//     } catch (error) {
//         console.error("Error creating service:", error);
//         return NextResponse.json({ error: "Failed to create service BACKEND." }, { status: 500 });
//     }
// }

export async function POST(req: NextRequest) {
    const session = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await req.json();
        const errors: string[] = [];

        if (!body.name || typeof body.name !== "string") {
            errors.push("Field 'name' is required and must be a string.");
        }
        if (body.slaMinDuration == null || typeof body.slaMinDuration !== "number") {
            errors.push("Field 'slaMinDuration' is required and must be a number.");
        }
        if (body.slaMaxDuration == null || typeof body.slaMaxDuration !== "number") {
            errors.push("Field 'slaMaxDuration' is required and must be a number.");
        }
        if (body.parentId == null || typeof body.parentId !== "number") {
            errors.push("Field 'parentId' is required and must be a number.");
        }

        if (errors.length > 0) {
            return NextResponse.json({ error: "Validation errors", details: errors }, { status: 400 });
        }

        const payload = {
            code: body.code || "",
            rsvCode: body.rsvCode || "",
            productCode: body.productCode || "",
            name: body.name,
            prefix: body.prefix || 1,
            slaMinDuration: body.slaMinDuration,
            slaMaxDuration: body.slaMaxDuration,
            parentId: body.parentId || 1,
            formFields: body.formFields || null,
        };

        const response = await fetch(`${process.env.API_URL}/master/service-types`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${session.accessToken || ""}`,
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Backend error response:", errorData);
            return NextResponse.json(
                { error: errorData.error || "Failed to create service BACKEND.", details: errorData.details || [] },
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data, { status: 201 });
    } catch (error) {
        console.error("Error creating service:", error);
        return NextResponse.json({ error: "Failed to create service BACKEND." }, { status: 500 });
    }
}
