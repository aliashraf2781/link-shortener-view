import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "@/Providers/Providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SaaS Link Management - Shorten URLs with Advanced Analytics",
  description: "Professional URL shortening service with comprehensive analytics, click tracking, QR codes, and detailed insights into your link performance.",
  keywords: ["URL shortener", "link management", "analytics", "QR code", "link tracking"],
  authors: [{ name: "SaaS Link Management" }],
  creator: "SaaS Link Management",
  publisher: "SaaS Link Management",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_API_URL,
    siteName: "SaaS Link Management",
    title: "SaaS Link Management - Professional URL Shortening",
    description: "Shorten URLs and track every click with advanced analytics",
  },
  twitter: {
    card: "summary_large_image",
    title: "SaaS Link Management",
    description: "Professional URL shortening and link analytics platform",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
