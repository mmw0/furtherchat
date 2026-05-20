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

const faviconSvg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect x='2' y='2' width='96' height='96' rx='20' fill='%2300C853'/><path d='M25 28h50c5.5 0 10 4.5 10 10v24c0 5.5-4.5 10-10 10H42l-10 12V72H25c-5.5 0-10-4.5-10-10V38c0-5.5 4.5-10 10-10z' fill='white'/></svg>`;

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
