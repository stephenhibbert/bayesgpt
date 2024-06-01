import type { Metadata } from "next";
import { Open_Sans as FontSans } from 'next/font/google';
import "./globals.css";
import Footer from "@/components/footer"; // Ensure the path and file name are correct
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"

const font = FontSans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BayesGPT",
  description: "Geometric Bayes Theorem using Large Language Models",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${font.className} flex min-h-screen flex-col`}>
        <main className="flex-grow">{children}</main>
        <SpeedInsights />
        <Analytics />
        <Footer />
      </body>
    </html>
  );
}