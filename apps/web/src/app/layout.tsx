import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { Button } from "@repo/ui/components/button";
import "@repo/ui/globals.css";
import "./globals.css";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "JobTracker - Modern Job Application Tracking",
  description:
    "Organize your job hunt with JobTracker. Built for software engineers.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <Navbar>
          {user ? (
            <form action="/auth/signout" method="post">
              <Button type="submit">Logout</Button>
            </form>
          ) : (
            <Link href="/login">
              <Button>Login</Button>
            </Link>
          )}
        </Navbar>
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
