import type { Metadata } from "next";
import { Inter, Domine } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const domine = Domine({
  subsets: ["latin"],
  variable: "--font-serif",
});

export const metadata: Metadata = {
  title: "Neetha Nursing Service at Home",
  description: "Certified Nursing & Elder Care at Your Doorstep in Lingampally, Hyderabad",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${domine.variable}`}>
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
