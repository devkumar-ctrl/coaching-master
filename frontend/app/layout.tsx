import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";
import { SessionProvider } from "next-auth/react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "YuvaBot Lab - Technology Education, Industrial Solutions & Career Development",
  description: "Empowering innovation through technology. Hands-on training in IoT, Embedded Systems, Robotics, AI, Cyber Security and skill-based programs with placement support.",
  keywords: ["YuvaBot", "LazySkool", "IoT", "embedded systems", "robotics", "AI", "machine learning", "cyber security", "data science", "STEM education", "technical training", "placement", "career"],
  authors: [{ name: "YuvaBot Lab Pvt. Ltd." }],
  openGraph: {
    title: "YuvaBot Lab - Innovate with Future Tech",
    description: "Technology education, industrial solutions and career development. Training programs in IoT, Robotics, AI, Cyber Security and more.",
    type: "website",
    url: "https://yuvabot.com",
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
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
