import type { Metadata } from "next";
import { Inter, Outfit, Roboto_Flex } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

const robotoFlex = Roboto_Flex({
  subsets: ["latin"],
  variable: "--font-roboto-flex",
});

export const metadata: Metadata = {
  title: "Transcend Frames | Future-Ready IT & Media",
  description: "Strategy, Design, and Technology in perfect sync.",
  icons: {
    icon: '/TF.png',
    apple: '/TF.png',
  },
};

import SocialBubble from "@/components/SocialBubble";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${outfit.variable} ${robotoFlex.variable}`}
      >
        {children}
        <SocialBubble />
      </body>
    </html>
  );
}
