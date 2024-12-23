import { SessionProvider } from "next-auth/react";  // Import SessionProvider
import React from "react";
import { AppProps } from "next/app";
import "@/css/style.css"; // Import style sesuai dengan kebutuhan

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider>
      {/* Membungkus seluruh aplikasi dengan SessionProvider */}
      <Component {...pageProps} />
    </SessionProvider>
  );
}

export default MyApp;
