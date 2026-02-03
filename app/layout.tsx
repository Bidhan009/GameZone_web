import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
// Import your AuthProvider
import { AuthProvider } from "@/app/context/AuthContext"; 

// Configure the Inter font
const inter = Inter({ subsets: ["latin"] });

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
        {/* Wrap children with AuthProvider so Header and Pages can use useAuth */}
        <AuthProvider>
          <main className="flex-grow">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}