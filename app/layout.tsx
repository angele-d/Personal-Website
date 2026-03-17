import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.scss";
import { Top_Banner } from "./components/Top_Banner";
import { Providers } from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Angele · Personal website",
  description: "Personal information and projects of Angele",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Script src="/theme-toggle.js" strategy="afterInteractive" />

        <Providers>
          <Top_Banner />
          <main>
            {children}
          </main>
        </Providers>
        
      </body>
    </html>
  );
}
