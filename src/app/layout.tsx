import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FurtherChat - Secure Real-time Messaging",
  description: "End-to-end encrypted real-time chat application with Firebase authentication, block user support, and advanced security features.",
  keywords: ["chat", "messaging", "real-time", "encrypted", "secure", "Firebase", "Next.js"],
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><defs><linearGradient id='g' x1='0%25' y1='0%25' x2='100%25' y2='100%25'><stop offset='0%25' style='stop-color:%2310b981'/><stop offset='100%25' style='stop-color:%2314b8a6'/></linearGradient></defs><rect width='100' height='100' rx='22' fill='url(%23g)'/><path d='M25 35 L50 25 L75 35 L75 60 C75 75 50 85 50 85 C50 85 25 75 25 60Z' fill='white' opacity='0.95'/><path d='M38 50 L46 58 L62 42' stroke='%2310b981' stroke-width='5' fill='none' stroke-linecap='round' stroke-linejoin='round'/></svg>",
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
        <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><defs><linearGradient id='g' x1='0%25' y1='0%25' x2='100%25' y2='100%25'><stop offset='0%25' style='stop-color:%2310b981'/><stop offset='100%25' style='stop-color:%2314b8a6'/></linearGradient></defs><rect width='100' height='100' rx='22' fill='url(%23g)'/><path d='M25 35 L50 25 L75 35 L75 60 C75 75 50 85 50 85 C50 85 25 75 25 60Z' fill='white' opacity='0.95'/><path d='M38 50 L46 58 L62 42' stroke='%2310b981' stroke-width='5' fill='none' stroke-linecap='round' stroke-linejoin='round'/></svg>" />
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
