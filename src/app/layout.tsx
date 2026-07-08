import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
