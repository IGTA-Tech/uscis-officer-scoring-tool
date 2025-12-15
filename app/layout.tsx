import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Xtra Odinary Research | Professional Visa Petition Scoring",
  description: "Get your visa petition evaluated from the perspective of a senior USCIS adjudications officer. AI-powered scoring for O-1A, O-1B, P-1A, and EB-1A petitions.",
  keywords: ["USCIS", "visa petition", "O-1A", "O-1B", "P-1A", "EB-1A", "immigration", "petition scoring", "Xtra Odinary Research"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
