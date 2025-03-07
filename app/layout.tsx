import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/nextjs";
import Sidebar from "./components/sidebar";
import { MainLanding } from "./components/HomePage/mainLanding";
import Footer from "./components/HomePage/footer";
import { Separator } from "@/components/ui/separator";
import { Scroll } from "lucide-react";
import LandingSection from "./components/HomePage/manageFiance";
import { Marquee } from "@/components/magicui/marquee";
import MarqueeDemo from "./components/HomePage/reviews";
import { GlobeDemo } from "./components/HomePage/globe";
import { ThemeProvider } from "@/context/themeContext";
import ThemeToggle from "./components/themeSelector";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider>
      <ThemeProvider>
        <html lang="en">
          <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
          >          
            <SignedOut>
              <ThemeToggle/>
              <MainLanding />
              <Separator />
              <LandingSection />
              <Separator />
              <MarqueeDemo />
              <Separator />
              <GlobeDemo />
              <Separator />
              <Footer />
            </SignedOut>
            <SignedIn>
              <div className="flex">
                <Sidebar />
                <main className="flex-1 p-4 overflow-hidden">{children}</main>
              </div>
            </SignedIn>
          </body>
        </html>
      </ThemeProvider>
    </ClerkProvider>
  );
}
