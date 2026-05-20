import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const faviconSvg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect x='5' y='5' width='90' height='90' rx='18' fill='%2310b981'/><path d='M20 22 H80 C86 22 88 25 88 30 V58 C88 63 86 66 80 66 H38 L26 80 V66 H20 C14 66 12 63 12 58 V30 C12 25 14 22 20 22Z' fill='none' stroke='white' stroke-width='5' stroke-linecap='round' stroke-linejoin='round'/></svg>`;

export const metadata: Metadata = {
  title: "FurtherChat",
  description: "End-to-end encrypted real-time chat application with Firebase authentication, block user support, and advanced security features.",
  keywords: ["chat", "messaging", "real-time", "encrypted", "secure", "Firebase", "Next.js"],
  icons: {
    icon: `data:image/svg+xml,${faviconSvg}`,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="icon" type="image/svg+xml" href={`data:image/svg+xml,${faviconSvg}`} />
        <link rel="preconnect" href="https://firestore.googleapis.com" />
        <link rel="preconnect" href="https://firebase.googleapis.com" />
        <link rel="preconnect" href="https://firebaseapp.com" />
        <link rel="preconnect" href="https://www.googleapis.com" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground overflow-hidden`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
