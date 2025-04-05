import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

const fontSans = FontSans({ 
  subsets: ["latin"],
  variable: "--font-sans", 
});

export const metadata: Metadata = {
  title: "CohereBuilder - AI-Powered Component Generator",
  description: "Generate React components with AI using natural language prompts",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://coherebuilder.vercel.app"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://coherebuilder.vercel.app",
    title: "CohereBuilder - AI-Powered Component Generator",
    description: "Generate React components with AI using natural language prompts",
    siteName: "CohereBuilder",
  },
  twitter: {
    card: "summary_large_image",
    title: "CohereBuilder - AI-Powered Component Generator",
    description: "Generate React components with AI using natural language prompts",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(
        "min-h-screen bg-background font-sans antialiased",
        fontSans.variable
      )}>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
} 