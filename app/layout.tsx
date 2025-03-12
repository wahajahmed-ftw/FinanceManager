import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
} from "@clerk/nextjs";
import Sidebar from "./components/sidebar";
import { ThemeProvider } from "@/context/themeContext";
import LandingPage from "./components/HomePage/LandingPage";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
export const metadata = {
  title: "Finance Manager",
  icons: "/favicon.ico",

}

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
              <LandingPage />
            </SignedOut>
            <SignedIn>
              <div className="flex">
                <Sidebar />
                <main className="flex-1 p-4 overflow-hidden bg-[var(--background)] scroll-smooth">
                  {children}
                </main>
              </div>
            </SignedIn>
          </body>
        </html>
      </ThemeProvider>
    </ClerkProvider>
  );
}
