// // import { getToken } from "next-auth/jwt";
// // import { NextRequest, NextResponse } from "next/server";

// // // Endpoint PUT untuk update/edit data approval matrix
// // export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
// //   const session = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

// //   if (!session) {
// //     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
// //   }

// //   const { id } = params; // Access the `id` from the dynamic route
// //   const updateData = await req.json();

// //   if (!id || !updateData) {
// //     return NextResponse.json({ error: "Invalid data" }, { status: 400 });
// //   }

// //   try {
// //     // Send the PUT request to the external API to update the data
// //     const response = await fetch(`${process.env.API_URL}/master/approval-matrix/${id}`, {
// //       method: 'PUT',
// //       headers: {
// //         'Content-Type': 'application/json',
// //         'Authorization': `Bearer ${session.accessToken || ''}`,
// //       },
// //       body: JSON.stringify(updateData),
// //     });

// //     if (!response.ok) {
// //       const errorData = await response.json();
// //       return NextResponse.json({ error: errorData.error || 'Failed to update approval matrix' }, { status: response.status });
// //     }

// //     const data = await response.json();
// //     return NextResponse.json(data, { status: 200 });
// //   } catch (error) {
// //     console.error("Error updating approval matrix:", error);
// //     return NextResponse.json({ error: 'Failed to update approval matrix API' }, { status: 500 });
// //   }
// // }


// import { getToken } from "next-auth/jwt";
// import { NextRequest, NextResponse } from "next/server";

// // Endpoint PUT untuk update/edit data approval matrix
// export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
//   const session = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

//   if (!session) {
//     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//   }

//   const { id } = params; // Akses `id` dari URL dinamis
//   const updateData = await req.json();

//   if (!id || !updateData) {
//     return NextResponse.json({ error: "Invalid data" }, { status: 400 });
//   }

//   try {
//     // Mengirimkan PUT request ke API eksternal untuk memperbarui data
//     const response = await fetch(`${process.env.API_URL}/master/approval-matrix/${id}`, {
//       method: 'PUT',
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${session.accessToken || ''}`,
//       },
//       body: JSON.stringify(updateData),
//     });

//     if (!response.ok) {
//       const errorData = await response.json();
//       return NextResponse.json({ error: errorData.error || 'Failed to update approval matrix' }, { status: response.status });
//     }

//     const data = await response.json();
//     return NextResponse.json(data, { status: 200 });
//   } catch (error) {
//     console.error("Error updating approval matrix:", error);
//     return NextResponse.json({ error: 'Failed to update approval matrix API' }, { status: 500 });
//   }
// }


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
    // Mengirim PUT request ke API eksternal untuk memperbarui data
    const response = await fetch(`${process.env.API_URL}/master/approval-matrix/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.accessToken || ''}`,
      },
      body: JSON.stringify(updateData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json({ error: errorData.error || 'Failed to update approval matrix' }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Error updating approval matrix:", error);
    return NextResponse.json({ error: 'Failed to update approval matrix API' }, { status: 500 });
  }
}
