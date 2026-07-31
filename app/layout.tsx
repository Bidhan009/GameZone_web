import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers"; // import the wrapper
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
        <Providers>
          <main className="flex-grow">
            {children}
          </main>
          <ToastContainer position="top-right" autoClose={3000} />
        </Providers>
      </body>
    </html>
  );
}