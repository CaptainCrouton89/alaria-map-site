import type { Metadata } from "next";
import { Cinzel, Inter, EB_Garamond } from "next/font/google";
import "./globals.css";

const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-cinzel",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

// Reading serif for codex prose — a humanist old-style face that pairs with Cinzel.
const ebGaramond = EB_Garamond({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Alaria Interactive Map",
  description: "Explore the world of Alaria",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${cinzel.variable} ${inter.variable} ${ebGaramond.variable}`}>
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
