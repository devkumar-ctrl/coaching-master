import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";
import { SessionProvider } from "next-auth/react";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AlmaBetter - Fast Forward Your Career in AI",
  description: "World-class AI education. MS in Computer Science degrees, IIT Patna & NASSCOM certifications, and 6000+ careers transformed with 5-40 LPA placements.",
  keywords: ["AlmaBetter", "AI", "data science", "machine learning", "full stack development", "agentic AI", "MS in Computer Science", "professional certification", "technical training", "placement", "career"],
  authors: [{ name: "AlmaBetter Edutech Private Limited" }],
  openGraph: {
    title: "AlmaBetter - Fast Forward Your Career in AI",
    description: "Degree programs, professional certifications and career outcomes in AI — 6000+ careers transformed.",
    type: "website",
    url: "https://www.almabetter.com",
  },
  icons: {
    icon: "/yuva/yuva-favicon.webp",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SessionProvider>{children}</SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
