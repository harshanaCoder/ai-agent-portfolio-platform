import type { Metadata, Viewport } from "next";
import { Sora, Space_Grotesk } from "next/font/google";

import "./globals.css";

const display = Sora({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"]
});

const body = Space_Grotesk({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "700"]
});

export const metadata: Metadata = {
  metadataBase: new URL("https://janith-harshana.vercel.app"),
  title: "Janith Harshana | AI and Robotics Engineer",
  description:
    "Software engineering portfolio for Janith Harshana featuring AI-powered web applications, robotics projects, voice agent experiences, and 3D project showcases.",
  icons: {
    icon: "/icon.svg",
    apple: "/apple-icon.png"
  },
  referrer: "strict-origin-when-cross-origin",
  keywords: [
    "Janith Harshana",
    "AI engineer",
    "robotics engineer",
    "embedded systems",
    "computer vision",
    "Next.js portfolio"
  ],
  openGraph: {
    title: "Janith Harshana | AI and Robotics Engineer",
    description:
      "Interactive portfolio with project case studies, voice agent features, and 3D model showcases.",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Janith Harshana | AI and Robotics Engineer",
    description:
      "Software engineering portfolio built with Next.js, Three.js, and Framer Motion."
  }
};

export const viewport: Viewport = {
  themeColor: "#050816",
  colorScheme: "dark"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${display.variable} ${body.variable} font-body text-white antialiased overflow-x-hidden`}
      >
        {children}
      </body>
    </html>
  );
}
