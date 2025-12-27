import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "./(public)/_components/Header";
import Footer from "./(public)/_components/footer";

// Configure the Inter font
const inter = Inter({ subsets: ["latin"] });

// SEO Metadata
export const metadata: Metadata = {
  title: "GameZone | The Ultimate Gaming Store",
  description: "Shop the latest games, high-performance hardware, and gaming accessories.",
  keywords: ["Gaming", "Video Games", "PC Parts", "Consoles", "GameZone"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.className} bg-[#0f1218] text-white antialiased min-h-screen flex flex-col`}
      >
        <main className="flex-grow">
          {children}
        </main>

      </body>
    </html>
  );
}