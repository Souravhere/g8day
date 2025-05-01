import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Footer from "@/components/foother";
import Navbar from "@/components/navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "G8Day | AI + Web3 Astrology Platform",
  description:
    "G8Day is a Web3 platform combining Eastern astrology and AI to deliver personalized fortune readings stored on the blockchain using the G8D token.",
  keywords: [
    "G8D",
    "G8Day",
    "Web3 Astrology",
    "AI fortune reading",
    "Saju",
    "Four Pillars of Destiny",
    "Blockchain astrology",
    "G8D Token",
    "NFT fortune",
    "destiny analysis",
    "crypto astrology",
    "DAO",
    "Eastern metaphysics"
  ],
  authors: [{ name: "G8Day Team", url: "https://g8day.io" }],
  metadataBase: new URL("https://g8day.io"),
  openGraph: {
    title: "G8Day | AI-Powered Fortune Readings on Blockchain",
    description:
      "Discover your destiny with AI and Eastern astrology. Mint your results as NFTs and own your fate on the blockchain with G8D Token.",
    url: "https://g8day.io",
    siteName: "G8Day",
    images: [
      {
        url: "https://g8day.vercel.app/og-image.png",
        width: 1200,
        height: 630,
        alt: "G8Day Hero Image",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "G8Day | AI-Powered Web3 Astrology",
    description:
      "Experience personalized destiny readings via AI and blockchain. Powered by the G8D Token.",
    site: "@G8DayOfficial",
    creator: "@G8DayOfficial",
    images: ["https://g8day.io/assets/og-image.jpg"],
  },
  themeColor: "#000000",
  colorScheme: "dark",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
      <link rel="icon" href="/logo.png" type="image/x-icon" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
