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

const faviconSvg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><defs><linearGradient id='bg' x1='0' y1='0' x2='1' y2='1'><stop offset='0%25' stop-color='%2300E676'/><stop offset='100%25' stop-color='%2300BFA5'/></linearGradient><filter id='sh'><feDropShadow dx='0' dy='2' stdDeviation='3' flood-color='%23000' flood-opacity='0.15'/></filter></defs><circle cx='50' cy='50' r='50' fill='url(%23bg)'/><g filter='url(%23sh)'><path d='M50 20C33.4 20 20 31 20 45c0 7.8 4 14.7 10.2 19L26 80l15.2-6c2.8.7 5.7 1 8.8 1 16.6 0 30-11 30-25S66.6 20 50 20z' fill='white'/></g></svg>`;

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
