import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { cookies } from 'next/headers';
import React from 'react';
import { authOptions } from '@/lib/authOptions';
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import ClientSessionProvider from "./_app";
import { SessionProvider } from "next-auth/react"; // Ajoutez ceci

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

const RootLayout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect(`${process.env.NEXTAUTH_URL}`);
  }

  return (
    <SessionProvider session={session}>
      <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          {children}
        </body>
      </html>
    </SessionProvider>
  );
};

export default RootLayout;
