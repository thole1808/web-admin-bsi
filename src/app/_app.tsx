import { SessionProvider } from "next-auth/react";  // Import SessionProvider
import React from "react";
import { AppProps } from "next/app";
import "@/css/style.css"; // Import style sesuai dengan kebutuhan
import { ToastContainer } from "react-toastify";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider>
      {/* Membungkus seluruh aplikasi dengan SessionProvider */}
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="light"
      />

      <Component {...pageProps} />
    </SessionProvider>
  );
}

export default MyApp;
