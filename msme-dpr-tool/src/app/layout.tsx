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
  title: "AP MSME DPR Architect",
  description:
    "AI-powered Detailed Project Report architect for Andhra Pradesh MSME entrepreneurs with multilingual onboarding, financial intelligence, and policy-grade analytics.",
  metadataBase: new URL("https://agentic-5e11c7ed.vercel.app"),
  openGraph: {
    title: "AP MSME DPR Architect",
    description:
      "Designing the next-generation DPR preparation engine for financial inclusion and MSME growth in Andhra Pradesh.",
    type: "website",
    locale: "en_IN",
  },
  alternates: {
    canonical: "/",
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
        {children}
      </body>
    </html>
  );
}
