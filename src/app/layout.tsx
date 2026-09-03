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
  metadataBase: new URL("https://neethanursing.in"),
  title: {
    default: "Neetha Nursing Service | Certified Home Nursing & Elder Care in Hyderabad",
    template: "%s | Neetha Nursing Service",
  },
  description:
    "Neetha Nursing Service provides verified, professional home nursing, elderly care, patient attendants, ICU care at home, injection & wound dressing in Lingampally, Gachibowli, Kondapur, and across Hyderabad. Call 8341069693.",
  keywords: [
    "Neetha Nursing Service",
    "neethanursing",
    "home nursing Hyderabad",
    "elder care services Hyderabad",
    "patient caretaker Lingampally",
    "certified nurse at home Gachibowli",
    "home healthcare Hyderabad",
    "ICU setup at home Hyderabad",
    "bedridden patient care Hyderabad",
    "post operative care Hyderabad",
  ],
  authors: [{ name: "Neetha Nursing Service" }],
  creator: "Neetha Nursing Service",
  publisher: "Neetha Nursing Service",
  formatDetection: {
    telephone: true,
    address: true,
  },
  alternates: {
    canonical: "https://neethanursing.in",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://neethanursing.in",
    siteName: "Neetha Nursing Service",
    title: "Neetha Nursing Service | Certified Home Nursing & Elder Care in Hyderabad",
    description:
      "Compassionate, verified, certified nurses and patient caregivers available 24/7 at your home in Hyderabad. Quick booking with doorstep payment options.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Neetha Nursing Service | Home Nursing & Elder Care in Hyderabad",
    description:
      "Certified home nurses, elder caregivers, and medical attendants in Hyderabad. Fast booking & compassionate service.",
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

const jsonLd = {
  "@context": "https://schema.org",
  "@type": ["MedicalBusiness", "LocalBusiness"],
  "name": "Neetha Nursing Service",
  "alternateName": ["Neetha Nursing", "WithU Care"],
  "url": "https://neethanursing.in",
  "logo": "https://neethanursing.in/icon.png",
  "telephone": ["+91-8341069693", "+91-9397925412"],
  "priceRange": "₹₹",
  "description":
    "Neetha Nursing Service is a certified home healthcare provider in Hyderabad specializing in elderly care, 12hr/24hr bedside attendants, post-surgery nursing, wound dressing, and critical patient care at home.",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Hyderabad",
    "addressRegion": "Telangana",
    "postalCode": "500019",
    "addressCountry": "IN",
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 17.485,
    "longitude": 78.32,
  },
  "areaServed": [
    { "@type": "City", "name": "Hyderabad" },
    { "@type": "AdministrativeArea", "name": "Lingampally" },
    { "@type": "AdministrativeArea", "name": "Gachibowli" },
    { "@type": "AdministrativeArea", "name": "Kondapur" },
    { "@type": "AdministrativeArea", "name": "Madhapur" },
    { "@type": "AdministrativeArea", "name": "Miyapur" },
    { "@type": "AdministrativeArea", "name": "Chandanagar" },
  ],
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      "opens": "00:00",
      "closes": "23:59",
    },
  ],
  "medicalSpecialty": ["Nursing", "Geriatric"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${domine.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
