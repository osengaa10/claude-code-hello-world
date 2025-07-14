import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navigation, Footer } from "@/components";
import GoogleAnalytics from "@/components/GoogleAnalytics";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "UnbiasedReviews - Honest Product Comparisons & Reviews",
    template: "%s | UnbiasedReviews"
  },
  description: "Find the best tech products with our honest, unbiased reviews and comparisons. We help you make informed decisions with expert analysis and transparent affiliate recommendations.",
  keywords: "unbiased reviews, product comparisons, honest recommendations, tech reviews, buying guides",
  authors: [{ name: "UnbiasedReviews Team" }],
  creator: "UnbiasedReviews",
  publisher: "UnbiasedReviews",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || "https://besttech-reviews.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "UnbiasedReviews - Honest Product Comparisons & Reviews",
    description: "Find the best tech products with our honest, unbiased reviews and comparisons. We help you make informed decisions with expert analysis and transparent affiliate recommendations.",
    siteName: "UnbiasedReviews",
  },
  twitter: {
    card: "summary_large_image",
    title: "UnbiasedReviews - Honest Product Comparisons & Reviews",
    description: "Find the best tech products with our honest, unbiased reviews and comparisons. We help you make informed decisions with expert analysis and transparent affiliate recommendations.",
    creator: "@unbiasedreviews",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <GoogleAnalytics />
        <Navigation />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
