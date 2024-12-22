import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

// Endpoint PUT untuk update/edit data approval matrix
export async function PUT(req: NextRequest) {
    const session = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Mengambil ID dari URL
    const url = new URL(req.url);
    const id = url.pathname.split('/').pop();

    // Mengecek apakah id valid dan data body ada
    const updateData = await req.json();
    if (!id || !updateData) {
        return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    try {
        const response = await fetch(`${process.env.API_URL}/master/approval-matrix/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.accessToken || ''}`,
            },
            body: JSON.stringify(updateData),
        });

        console.log('Response Status:', response.status);

        if (!response.ok) {
            // If the response is not OK, parse the error data
            const errorData = await response.json();
            console.log('Error Data:', errorData);

            // Returning the error message directly in the response
            return NextResponse.json(
                { error: errorData.message || 'Failed to update approval matrix' },
                { status: response.status }
            );
        }

        // If successful, return the data
        const data = await response.json();
        console.log('Response Data:', data);
        return NextResponse.json(data, { status: 200 });

    } catch (error) {
        console.error('Error in API request:', error);  // Log the error details
        return NextResponse.json(
            { error: 'Failed to update approval matrix API' },
            { status: 500 }
        );
    }
}


// // Fungsi untuk menghapus data berdasarkan id
// export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
//     const { id } = params;

//     try {
//         // Melakukan penghapusan data berdasarkan ID menggunakan Prisma (atau database lain)
//         const deletedMatrix = await prisma.approvalMatrix.delete({
//             where: {
//                 id: parseInt(id), // Menggunakan parseInt jika ID adalah angka
//             },
//         });

//         // Jika penghapusan berhasil
//         return NextResponse.json(
//             {
//                 success: true,
//                 message: "Approval matrix deleted successfully.",
//                 data: deletedMatrix,
//             },
//             { status: 200 }
//         );
//     } catch (error) {
//         console.error("Error deleting approval matrix:", error);
//         return NextResponse.json(
//             {
//                 success: false,
//                 message: "Failed to delete approval matrix. Please try again.",
//                 error: error.message,
//             },
//             { status: 500 }
//         );
//     }
// }
