import "./globals.css";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import NavbarWrapper from "@/components/NavbarWrapper";
import type { Metadata } from 'next'
import { AuthProvider } from "@/contexts/AuthContext";

export const metadata: Metadata = {
  title: 'Artia - (Article: Informative and Actual)',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <body
        className={`antialiased`}
      >
        <ToastContainer />
        <AuthProvider>
          <NavbarWrapper />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}