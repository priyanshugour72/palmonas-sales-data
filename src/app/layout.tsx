import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { SessionProvider } from "@/components/providers/SessionProvider";
import { ThemeProvider } from "@/context/ThemeContext";
import { AntdThemeProvider } from "@/components/providers/AntdThemeProvider";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ThemeScript } from "@/components/ThemeScript";
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
  title: "State-wise Sales Analytics",
  description: "Upload Excel, view state-wise sales charts, India map and filters",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>
          <SessionProvider>
            <AntdThemeProvider>
              <AntdRegistry>
                {children}
              </AntdRegistry>
            </AntdThemeProvider>
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
