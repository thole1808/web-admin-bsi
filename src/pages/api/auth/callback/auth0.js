// // OAuth Callback handling
// import { NextResponse } from 'next/server';
// import axios from 'axios';

// export async function handler(req) {
//   const { code } = req.query;

//   if (code) {
//     try {
//       // Exchange the code for an access token
//       const response = await axios.post(
//         process.env.NEXT_PUBLIC_OAUTH_ACCESS_TOKEN_URL, // Token URL for your OAuth provider
//         {
//           client_id: process.env.NEXT_PUBLIC_BACKOFFICE_ID,
//           client_secret: process.env.NEXT_PUBLIC_OAUTH_CLIENT_SECRET,
//           redirect_uri: process.env.NEXT_PUBLIC_OAUTH_CALLBACK_URL,
//           code,
//           grant_type: 'authorization_code',
//         }
//       );

//       const { access_token } = response.data;

//       // Set the access token in the cookie
//       req.cookies.set('access_token', access_token, {
//         httpOnly: true,
//         secure: process.env.NODE_ENV === 'production',  // Use secure cookies in production
//         sameSite: 'Strict',
//       });

//       // Redirect to a page after successful OAuth
//       return NextResponse.redirect('/dashboard'); // Or another page where the user should land after login
//     } catch (error) {
//       return new NextResponse('Authentication failed', { status: 500 });
//     }
//   } else {
//     // If no code in the query params, redirect to the OAuth provider
//     return new NextResponse('No authorization code found', { status: 400 });
//   }
// }


// import { NextResponse } from 'next/server';
// import axios from 'axios';

// export async function handler(req, res) {
//   const { code } = req.query;

//   if (!code) {
//     return res.status(400).json({ message: 'Authorization code is missing' });
//   }

//   try {
//     const {
//       NEXT_PUBLIC_BACKOFFICE_ID,
//       NEXT_PUBLIC_OAUTH_CLIENT_SECRET,
//       NEXT_PUBLIC_OAUTH_TOKEN_URL,
//       NEXT_PUBLIC_OAUTH_CALLBACK_URL
//     } = process.env;

//     // Exchange the authorization code for an access token
//     const response = await axios.post(NEXT_PUBLIC_OAUTH_TOKEN_URL, null, {
//       params: {
//         client_id: NEXT_PUBLIC_BACKOFFICE_ID,
//         client_secret: NEXT_PUBLIC_OAUTH_CLIENT_SECRET,
//         code,
//         redirect_uri: NEXT_PUBLIC_OAUTH_CALLBACK_URL,
//         grant_type: 'authorization_code',
//       }
//     });

//     const { access_token } = response.data;

//     if (access_token) {
//       // Set the access token in a cookie
//       res.setHeader('Set-Cookie', `access_token=${access_token}; Path=/; HttpOnly; SameSite=Lax`);
      
//       // Redirect the user to the homepage or desired route after successful login
//       return res.redirect(302, '/'); // Redirect to the homepage or protected route
//     } else {
//       return res.status(400).json({ message: 'Failed to obtain access token' });
//     }
//   } catch (error) {
//     console.error('Error during OAuth callback:', error);
//     return res.status(500).json({ message: 'An error occurred during the OAuth callback' });
//   }
// }

// export default handler;


// import { NextResponse } from 'next/server';

// export async function handler(req, res) {
//   const { code } = req.query;
//   console.log('Received Code:', code);

//   if (!code) {
//     console.log('No authorization code provided.');
//     return res.status(400).json({ message: 'Authorization code is missing' });
//   }

//   try {
//     const {
//       OAUTH_CLIENT_ID,
//       OAUTH_CLIENT_SECRET,
//       OAUTH_ACCESS_TOKEN_URL,
//       OAUTH_CALLBACK_URL,
//     } = process.env;

//     console.log('Exchanging code for access token...');

//     const response = await axios.post(OAUTH_ACCESS_TOKEN_URL, null, {
//       params: {
//         client_id: OAUTH_CLIENT_ID,
//         client_secret: OAUTH_CLIENT_SECRET,
//         code,
//         redirect_uri: OAUTH_CALLBACK_URL,
//         grant_type: 'authorization_code',
//       },
//     });

//     const { access_token } = response.data;
//     console.log('Access Token:', access_token);

//     if (access_token) {
//       res.setHeader('Set-Cookie', `access_token=${access_token}; Path=/; HttpOnly; SameSite=Lax`);
//       console.log('Redirecting to dashboard...');
//       return res.redirect(302, '/dashboard');
//     } else {
//       console.log('Access token missing in response.');
//       return res.status(400).json({ message: 'Failed to obtain access token' });
//     }
//   } catch (error) {
//     console.error('Error during OAuth callback:', error.response?.data || error.message);
//     return res.status(500).json({ message: 'An error occurred during the OAuth callback' });
//   }
// }


// export default async function handler(req, res) {
//   const { code } = req.query;

//   console.log('Incoming code:', code);

//   // Cek apakah akses token sudah ada
//   const token = req.cookies.get('access_token');
//   if (token) {
//     console.log('Access token already exists, skipping further processing.');
//     return res.redirect(302, '/dashboard');
//   }

//   // Jika tidak ada kode otorisasi, balas dengan error
//   if (!code) {
//     console.log('No authorization code found in query.');
//     return res.status(400).json({ message: 'Authorization code is missing' });
//   }

//   try {
//     const {
//       OAUTH_ACCESS_TOKEN_URL,
//       OAUTH_CLIENT_ID,
//       OAUTH_CLIENT_SECRET,
//       OAUTH_CALLBACK_URL,
//     } = process.env;

//     // Kirim permintaan untuk menukar kode dengan token akses
//     const response = await axios.post(OAUTH_ACCESS_TOKEN_URL, null, {
//       params: {
//         client_id: OAUTH_CLIENT_ID,
//         client_secret: OAUTH_CLIENT_SECRET,
//         redirect_uri: OAUTH_CALLBACK_URL,
//         code,
//         grant_type: 'authorization_code',
//       },
//     });

//     const { access_token } = response.data;

//     console.log('Access token received:', access_token);

//     // Simpan token di cookie
//     res.setHeader(
//       'Set-Cookie',
//       `access_token=${access_token}; Path=/; HttpOnly; SameSite=Lax`
//     );

//     // Redirect ke dashboard atau halaman tujuan
//     return res.redirect(302, '/dashboard');
//   } catch (error) {
//     console.error('Error exchanging authorization code:', error.response?.data || error.message);
//     return res.status(500).json({ message: 'Failed to process OAuth callback.' });
//   }
// }


// import { NextResponse } from 'next/server';
// import axios from 'axios';
// import { cookies } from 'next/headers'; // Import cookies API

// export default async function handler(req, res) {
//   const { code } = req.query;

//   // Akses cookies menggunakan API baru
//   const cookieStore = cookies(); 
//   const token = cookieStore.get('access_token')?.value;

//   if (token) {
//     console.log('Access token already exists, skipping further processing.');
//     return res.redirect(302, '/dashboard');
//   }

//   if (!code) {
//     console.log('No authorization code found in query.');
//     return res.status(400).json({ message: 'Authorization code is missing' });
//   }

//   try {
//     const {
//       OAUTH_ACCESS_TOKEN_URL,
//       OAUTH_CLIENT_ID,
//       OAUTH_CLIENT_SECRET,
//       OAUTH_CALLBACK_URL,
//     } = process.env;

//     const response = await axios.post(OAUTH_ACCESS_TOKEN_URL, null, {
//       params: {
//         client_id: OAUTH_CLIENT_ID,
//         client_secret: OAUTH_CLIENT_SECRET,
//         redirect_uri: OAUTH_CALLBACK_URL,
//         code,
//         grant_type: 'authorization_code',
//       },
//     });

//     const { access_token } = response.data;

//     console.log('Access token received:', access_token);

//     // Simpan token di cookie
//     res.setHeader(
//       'Set-Cookie',
//       `access_token=${access_token}; Path=/; HttpOnly; SameSite=Lax`
//     );

//     return res.redirect(302, '/dashboard');
//   } catch (error) {
//     console.error('Error exchanging authorization code:', error.response?.data || error.message);
//     return res.status(500).json({ message: 'Failed to process OAuth callback.' });
//   }
// }


// import axios from 'axios';

// export default async function handler(req, res) {
//   const { code } = req.query;

//   // Akses cookies dari header request
//   const cookies = req.headers.cookie || '';
//   const token = cookies
//     .split('; ')
//     .find((row) => row.startsWith('access_token='))
//     ?.split('=')[1];

//   if (token) {
//     console.log('Access token already exists, skipping further processing.');
//     return res.redirect(302, '/dashboard');
//   }

//   if (!code) {
//     console.log('No authorization code found in query.');
//     return res.status(400).json({ message: 'Authorization code is missing' });
//   }

//   try {
//     const {
//       OAUTH_ACCESS_TOKEN_URL,
//       OAUTH_CLIENT_ID,
//       OAUTH_CLIENT_SECRET,
//       OAUTH_CALLBACK_URL,
//     } = process.env;

//     const response = await axios.post(OAUTH_ACCESS_TOKEN_URL, null, {
//       params: {
//         client_id: OAUTH_CLIENT_ID,
//         client_secret: OAUTH_CLIENT_SECRET,
//         redirect_uri: OAUTH_CALLBACK_URL,
//         code,
//         grant_type: 'authorization_code',
//       },
//     });

//     const { access_token } = response.data;

//     console.log('Access token received:', access_token);

//     // Simpan token di cookie
//     res.setHeader(
//       'Set-Cookie',
//       `access_token=${access_token}; Path=/; HttpOnly; SameSite=Lax`
//     );

//     return res.redirect(302, '/dashboard');
//   } catch (error) {
//     console.error('Error exchanging authorization code:', error.response?.data || error.message);
//     return res.status(500).json({ message: 'Failed to process OAuth callback.' });
//   }
// }



// import axios from 'axios';

// export default async function handler(req, res) {
//   const { code } = req.query;

//   try {
//     const {
//       OAUTH_ACCESS_TOKEN_URL,
//       OAUTH_CLIENT_ID,
//       OAUTH_CLIENT_SECRET,
//       OAUTH_CALLBACK_URL,
//     } = process.env;

//     // Tukarkan authorization code dengan access token
//     const response = await axios.post(OAUTH_ACCESS_TOKEN_URL, null, {
//       params: {
//         client_id: OAUTH_CLIENT_ID,
//         client_secret: OAUTH_CLIENT_SECRET,
//         redirect_uri: OAUTH_CALLBACK_URL,
//         code,
//         grant_type: 'authorization_code',
//       },
//     });

//     const { access_token } = response.data;

//     console.log('Access token received:', access_token);

//     // Simpan token dalam cookie
//     res.setHeader('Set-Cookie', `access_token=${access_token}; Path=/; HttpOnly; SameSite=Lax`);

//     return res.redirect('/dashboard');
//   } catch (error) {
//     console.error('Error exchanging authorization code:', error.response?.data || error.message);
//     return res.status(500).json({ message: 'Failed to process OAuth callback.' });
//   }
// }


// import axios from 'axios';

// export default async function handler(req, res) {
//   const { code } = req.query;

//   if (!code) {
//     return res.status(400).json({ message: 'Authorization code missing' });
//   }

//   try {
//     // Mengambil variabel lingkungan dari process.env
//     const {
//       NEXT_PUBLIC_OAUTH_ACCESS_TOKEN_URL,
//       NEXT_PUBLIC_BACKOFFICE_ID,
//       NEXT_PUBLIC_OAUTH_CLIENT_SECRET,
//       NEXT_PUBLIC_OAUTH_CALLBACK_URL,
//     } = process.env;

//     // Tukarkan authorization code dengan access token
//     const response = await axios.post(NEXT_PUBLIC_OAUTH_ACCESS_TOKEN_URL, null, {
//       headers: {
//         'Content-Type': 'application/x-www-form-urlencoded', // Menyatakan bahwa kita mengirimkan data dalam bentuk x-www-form-urlencoded
//       },
//       params: {
//         client_id: NEXT_PUBLIC_BACKOFFICE_ID,
//         client_secret: NEXT_PUBLIC_OAUTH_CLIENT_SECRET,
//         redirect_uri: NEXT_PUBLIC_OAUTH_CALLBACK_URL,
//         code,  // Authorization code yang diterima
//         grant_type: 'authorization_code',  // Menunjukkan jenis grant type
//       },
//     });

//     // Mendapatkan access token dari response
//     const { access_token } = response.data;

//     if (!access_token) {
//       return res.status(500).json({ message: 'Failed to retrieve access token' });
//     }

//     console.log('Access token received:', access_token);

//     // Menyimpan token dalam cookie
//     res.setHeader('Set-Cookie', `access_token=${access_token}; Path=/; HttpOnly; SameSite=Lax; Secure`);

//     // Redirect ke halaman dashboard setelah berhasil login
//     return res.redirect('/dashboard');
//   } catch (error) {
//     console.error('Error exchanging authorization code:', error.response?.data || error.message);
//     return res.status(500).json({ message: 'Failed to process OAuth callback.' });
//   }
// }


// import axios from 'axios';

// export default async function handler(req, res) {
//   const { code } = req.query;

//   if (!code) {
//     return res.status(400).json({ message: 'Authorization code missing' });
//   }

//   try {
//     // Mengambil variabel lingkungan dari process.env
//     const {
//       NEXT_PUBLIC_OAUTH_ACCESS_TOKEN_URL,
//       NEXT_PUBLIC_BACKOFFICE_ID,
//       NEXT_PUBLIC_OAUTH_CLIENT_SECRET,
//       NEXT_PUBLIC_OAUTH_CALLBACK_URL,
//       NEXT_PUBLIC_BACKOFFICE_SCOPE,  // Menambahkan scope dari env
//     } = process.env;
    
//     // Tukarkan authorization code dengan access token
//     const response = await axios.post(NEXT_PUBLIC_OAUTH_ACCESS_TOKEN_URL, null, {
//       headers: {
//         'Content-Type': 'application/x-www-form-urlencoded', // Menyatakan bahwa kita mengirimkan data dalam bentuk x-www-form-urlencoded
//       },
//       params: {
//         client_id: NEXT_PUBLIC_BACKOFFICE_ID,
//         client_secret: NEXT_PUBLIC_OAUTH_CLIENT_SECRET,
//         redirect_uri: NEXT_PUBLIC_OAUTH_CALLBACK_URL,
//         code,  // Authorization code yang diterima
//         grant_type: 'authorization_code',  // Menunjukkan jenis grant type
//         scope: NEXT_PUBLIC_BACKOFFICE_SCOPE,  // Menambahkan scope ke permintaan
//       },
//     });

//     // Mendapatkan access token dari response
//     const { access_token } = response.data;

//     if (!access_token) {
//       return res.status(500).json({ message: 'Failed to retrieve access token' });
//     }

//     console.log('Access token received:', access_token);

//     // Menyimpan token dalam cookie
//     res.setHeader('Set-Cookie', `access_token=${access_token}; Path=/; HttpOnly; SameSite=Lax; Secure`);

//     // Redirect ke halaman dashboard setelah berhasil login
//     return res.redirect('/dashboard');
//   } catch (error) {
//     console.error('Error exchanging authorization code:', error.response?.data || error.message);
//     return res.status(500).json({ 
//       message: 'Failed to process OAuth callback.', 
//       error: error.response?.data || error.message  // Menampilkan detail error dari server OAuth
//     });
//   }
// }


// api/auth/callback/auth0.js

// import axios from 'axios';
// import { setToken } from "next-auth"; // Menyimpan token di sesi next-auth

// export default async function handler(req, res) {
//   const { code } = req.query;
  
//   if (!code) {
//     return res.status(400).json({ message: 'Authorization code missing' });
//   }

//   try {
//     const { 
//       NEXT_PUBLIC_OAUTH_ACCESS_TOKEN_URL,
//       NEXT_PUBLIC_BACKOFFICE_ID,
//       NEXT_PUBLIC_OAUTH_CLIENT_SECRET,
//       NEXT_PUBLIC_OAUTH_CALLBACK_URL 
//     } = process.env;

//     // Tukarkan kode otorisasi dengan access token
//     const response = await axios.post(NEXT_PUBLIC_OAUTH_ACCESS_TOKEN_URL, null, {
//       headers: {
//         'Content-Type': 'application/x-www-form-urlencoded',
//       },
//       params: {
//         client_id: NEXT_PUBLIC_BACKOFFICE_ID,
//         client_secret: NEXT_PUBLIC_OAUTH_CLIENT_SECRET,
//         redirect_uri: NEXT_PUBLIC_OAUTH_CALLBACK_URL,
//         code,
//         grant_type: 'authorization_code',
//       },
//     });

//     const { access_token } = response.data;

//     if (!access_token) {
//       return res.status(500).json({ message: 'Failed to retrieve access token' });
//     }

//     // Set token in next-auth session
//     await setToken(access_token);  // Sesuaikan dengan pengaturan sesi di next-auth


//     // Simpan token dalam cookie
//     res.setHeader('Set-Cookie', `access_token=${access_token}; Path=/; HttpOnly; SameSite=Lax; Secure`);

//     // Redirect setelah login sukses
//     return res.redirect('/dashboard');
//   } catch (error) {
//     console.error('OAuth callback error:', error.message);
//     return res.status(500).json({ message: 'Failed to process OAuth callback.' });
//   }
// }


// api/auth/callback/auth0.js
// import axios from 'axios';

// export default async function handler(req, res) {
//   const { code, state } = req.query;

//   // Verifikasi jika code tidak tersedia
//   if (!code) {
//     console.error('Authorization code is missing');
//     return res.status(400).json({ message: 'Authorization code missing' });
//   }

//   try {
//     const {
//       NEXT_PUBLIC_OAUTH_ACCESS_TOKEN_URL,
//       NEXT_PUBLIC_BACKOFFICE_ID,
//       NEXT_PUBLIC_OAUTH_CLIENT_SECRET,
//       NEXT_PUBLIC_OAUTH_CALLBACK_URL
//     } = process.env;

//     // Log untuk memverifikasi data yang dikirim
//     console.log('Authorization code:', code);
//     console.log('State:', state);

//     // Tukarkan authorization code dengan access token
//     const response = await axios.post(NEXT_PUBLIC_OAUTH_ACCESS_TOKEN_URL, null, {
//       headers: {
//         'Content-Type': 'application/x-www-form-urlencoded',
//       },
//       params: {
//         client_id: NEXT_PUBLIC_BACKOFFICE_ID,
//         client_secret: NEXT_PUBLIC_OAUTH_CLIENT_SECRET,
//         redirect_uri: NEXT_PUBLIC_OAUTH_CALLBACK_URL,
//         code,
//         grant_type: 'authorization_code',
//       },
//     });

//     // Log response dari token API
//     console.log('OAuth Response:', response.data);

//     const { access_token } = response.data;

//     // Verifikasi apakah token ada
//     if (!access_token) {
//       console.error('Failed to retrieve access token from OAuth provider');
//       return res.status(500).json({ message: 'Failed to retrieve access token' });
//     }

//     // Simpan token dalam cookie
//     res.setHeader('Set-Cookie', `access_token=${access_token}; Path=/; HttpOnly; SameSite=Lax; Secure`);

//     // Redirect setelah login sukses
//     return res.redirect('/dashboard');
//   } catch (error) {
//     console.error('OAuth callback error:', error.response?.data || error.message);
//     return res.status(500).json({ message: 'Failed to process OAuth callback.' });
//   }
// }


// import axios from 'axios';
// import qs from 'querystring'; // Untuk meng-encode parameters

// export default async function handler(req, res) {
//   const { code, state } = req.query;

//   // Verifikasi jika code tidak tersedia
//   if (!code) {
//     console.error('Authorization code is missing');
//     return res.status(400).json({ message: 'Authorization code missing' });
//   }

//   try {
//     const {
//       NEXT_PUBLIC_OAUTH_ACCESS_TOKEN_URL,
//       NEXT_PUBLIC_BACKOFFICE_ID,
//       NEXT_PUBLIC_OAUTH_CLIENT_SECRET,
//       NEXT_PUBLIC_OAUTH_CALLBACK_URL
//     } = process.env;

//     // Log untuk memverifikasi data yang dikirim
//     console.log('Authorization code:', code);
//     console.log('State:', state);

//     // Menyusun body dengan format x-www-form-urlencoded
//     const body = qs.stringify({
//       client_id: NEXT_PUBLIC_BACKOFFICE_ID,
//       client_secret: NEXT_PUBLIC_OAUTH_CLIENT_SECRET,
//       redirect_uri: NEXT_PUBLIC_OAUTH_CALLBACK_URL,
//       code,
//       grant_type: 'authorization_code',
//     });

//     // Tukarkan authorization code dengan access token
//     const response = await axios.post(NEXT_PUBLIC_OAUTH_ACCESS_TOKEN_URL, body, {
//       headers: {
//         'Content-Type': 'application/x-www-form-urlencoded',
//       },
//     });

//     // Log response dari token API
//     console.log('OAuth Response:', response.data);

//     const { access_token } = response.data;

//     // Verifikasi apakah token ada
//     if (!access_token) {
//       console.error('Failed to retrieve access token from OAuth provider');
//       return res.status(500).json({ message: 'Failed to retrieve access token' });
//     }

//     // Simpan token dalam cookie
//     res.setHeader('Set-Cookie', `access_token=${access_token}; Path=/; HttpOnly; SameSite=Lax; Secure`);

//     // Redirect setelah login sukses
//     return res.redirect('/dashboard');
//   } catch (error) {
//     console.error('OAuth callback error:', error.response?.data || error.message);
//     return res.status(500).json({ message: 'Failed to process OAuth callback.' });
//   }
// }

// import axios from 'axios';
// import qs from 'querystring'; // Untuk meng-encode parameters

// export default async function handler(req, res) {
//   const { code, state } = req.query;

//   // Verifikasi jika code tidak tersedia
//   if (!code) {
//     console.error('Authorization code is missing');
//     return res.status(400).json({ message: 'Authorization code missing' });
//   }

//   try {
//     const {
//       NEXT_PUBLIC_OAUTH_ACCESS_TOKEN_URL,
//       NEXT_PUBLIC_BACKOFFICE_ID,
//       NEXT_PUBLIC_OAUTH_CLIENT_SECRET,
//       NEXT_PUBLIC_OAUTH_CALLBACK_URL
//     } = process.env;

//     // Log untuk memverifikasi data yang dikirim
//     console.log('Authorization code:', code);
//     console.log('State:', state);

//     // Menyusun body dengan format x-www-form-urlencoded
//     const body = qs.stringify({
//       client_id: NEXT_PUBLIC_BACKOFFICE_ID,
//       client_secret: NEXT_PUBLIC_OAUTH_CLIENT_SECRET,
//       redirect_uri: NEXT_PUBLIC_OAUTH_CALLBACK_URL,
//       code,
//       grant_type: 'authorization_code',
//     });

//     // Tukarkan authorization code dengan access token
//     const response = await axios.post(NEXT_PUBLIC_OAUTH_ACCESS_TOKEN_URL, body, {
//       headers: {
//         'Content-Type': 'application/x-www-form-urlencoded',
//       },
//     });

//     // Log seluruh data respons dari API OAuth
//     console.log('Full OAuth Response:', response.data);

//     // Verifikasi apakah access_token ada dalam response
//     const { access_token, error, error_description } = response.data;

//     if (error) {
//       console.error(`OAuth Error: ${error} - ${error_description}`);
//       return res.status(500).json({ message: `OAuth Error: ${error_description}` });
//     }

//     if (!access_token) {
//       console.error('Failed to retrieve access token from OAuth provider');
//       return res.status(500).json({ message: 'Failed to retrieve access token' });
//     }

//     // Jika token berhasil diterima, log akses token
//     console.log('Access token received:', access_token);

//     // Simpan token dalam cookie atau response header
//     res.setHeader('Set-Cookie', `access_token=${access_token}; Path=/; HttpOnly; SameSite=Lax; Secure`);

//     // Redirect setelah login sukses
//     return res.redirect('/dashboard');
//   } catch (error) {
//     console.error('OAuth callback error:', error.response?.data || error.message);
//     return res.status(500).json({ message: 'Failed to process OAuth callback.' });
//   }
// }


import axios from 'axios';
import qs from 'querystring'; // Untuk encoding parameter x-www-form-urlencoded

export default async function handler(req, res) {
  const { code, state } = req.query;

  if (!code) {
    console.error('Authorization code is missing');
    return res.status(400).json({ message: 'Authorization code missing' });
  }

  try {
    const {
      NEXT_PUBLIC_OAUTH_ACCESS_TOKEN_URL,
      NEXT_PUBLIC_BACKOFFICE_ID,
      NEXT_PUBLIC_OAUTH_CLIENT_SECRET,
      NEXT_PUBLIC_OAUTH_CALLBACK_URL
    } = process.env;

    // Log untuk memverifikasi data yang dikirim
    console.log('Authorization code:', code);
    console.log('State:', state);

    // Menyusun body dengan format x-www-form-urlencoded
    const body = qs.stringify({
      client_id: NEXT_PUBLIC_BACKOFFICE_ID,
      client_secret: NEXT_PUBLIC_OAUTH_CLIENT_SECRET,
      redirect_uri: NEXT_PUBLIC_OAUTH_CALLBACK_URL,
      code,
      grant_type: 'authorization_code',
    });

    // Tukarkan authorization code dengan access token
    const response = await axios.post(NEXT_PUBLIC_OAUTH_ACCESS_TOKEN_URL, body, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    // Log seluruh data respons dari API OAuth
    console.log('Full OAuth Response:', response.data);

    // Verifikasi apakah access_token ada dalam response
    const { access_token, error, error_description } = response.data;

    if (error) {
      console.error(`OAuth Error: ${error} - ${error_description}`);
      return res.status(500).json({ message: `OAuth Error: ${error_description}` });
    }

    if (!access_token) {
      console.error('Failed to retrieve access token from OAuth provider');
      return res.status(500).json({ message: 'Failed to retrieve access token' });
    }

    // Jika token berhasil diterima, log akses token
    console.log('Access token received:', access_token);

    // Simpan token dalam cookie atau response header
    res.setHeader('Set-Cookie', `access_token=${access_token}; Path=/; HttpOnly; SameSite=Lax; Secure`);

    // Redirect setelah login sukses
    return res.redirect('/dashboard');
  } catch (error) {
    console.error('OAuth callback error:', error.response?.data || error.message);
    return res.status(500).json({ message: 'Failed to process OAuth callback.' });
  }
}

