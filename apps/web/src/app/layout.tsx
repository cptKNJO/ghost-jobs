import type { Metadata } from "next";
import { Hanken_Grotesk, Bitter, Fira_Code } from "next/font/google";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import "@repo/ui/globals.css";
import "./globals.css";

const fontSans = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fontSerif = Bitter({
  subsets: ["latin"],
  variable: "--font-serif",
});

const fontMono = Fira_Code({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "JobTracker - Modern Job Application Tracking",
  description:
    "Organize your job hunt with JobTracker. Built for software engineers.",
};

import { ThemeProvider } from "@/components/theme-provider";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${fontSans.variable} ${fontSerif.variable} ${fontMono.variable} antialiased`}
      suppressHydrationWarning
    >
      <body className="flex flex-col min-h-screen bg-background text-foreground font-sans">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />
          <main className="flex-1 container mx-auto px-4 py-8">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
