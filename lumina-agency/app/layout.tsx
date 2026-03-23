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
  title: "Transcend Frames",
  description: "Strategy, Design, and Technology in perfect sync.",
  icons: {
    icon: '/TF.png',
    apple: '/TF.png',
  },
};

import SocialBubble from "@/components/SocialBubble";
import { Providers } from "@/components/Providers";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${inter.variable} ${outfit.variable} ${robotoFlex.variable}`}
      >
        <Providers>
          {children}
          <SocialBubble />
        </Providers>
      </body>
    </html>
  );
}
