import type { Metadata, Viewport } from "next";
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

// Resolved at build time. Set NEXT_PUBLIC_SITE_URL in production so Open Graph /
// canonical URLs are absolute; falls back to the Vercel host, then localhost.
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3001");

const SITE_NAME = "The Codex of Alaria";
const SITE_DESCRIPTION =
  "An illustrated codex and interactive map of Alaria — explore its realms, peoples, powers, gods, and history, then travel the world by its connections.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: SITE_NAME,
    template: `%s · ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  // opengraph-image.jpg / twitter-image.jpg / icon.svg / apple-icon.png in this
  // directory are picked up automatically via Next's file conventions.
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
};

export const viewport: Viewport = {
  themeColor: "#1a1612",
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
