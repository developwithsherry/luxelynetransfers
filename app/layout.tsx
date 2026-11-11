import type React from "react"
import type { Metadata } from "next"
import { Figtree, Syne } from "next/font/google"
import Script from "next/script"
import "./globals.css"
import { Toaster } from "@/components/ui/sonner"
import { BookingProvider } from "@/context/booking-context"
import { VehicleProvider } from "@/context/vehicle-context"
import { AddonProvider } from "@/context/addon-context"
import { OrganizationSchema, TaxiServiceSchema } from "@/components/seo/schema-markup"

const figtree = Figtree({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-figtree",
  weight: ["300", "400", "500", "600", "700", "800"],
})

const syne = Syne({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-syne",
  weight: ["400", "500", "600", "700", "800"],
})

export const metadata: Metadata = {
  metadataBase: new URL("https://luxelynetransfers.co.uk"),
  title: {
    default: "Luxelyne Transfers | London Airport Transfers & 24/7 Private Hire Taxi",
    template: "%s | Luxelyne Transfers",
  },
  description:
    "Luxelyne Transfers LTD (Company No. 16665396) is a premier UK private hire & airport transfers provider. Fixed-fare 24/7 taxi service for Heathrow, Gatwick, Stansted, Luton, London City, Southend & Greater London.",
  keywords: [
    "Airport Transfers London",
    "Private Hire Taxi London",
    "Heathrow Airport Transfers",
    "Gatwick Airport Transfers",
    "Stansted Airport Taxi",
    "Luton Airport Transfers",
    "London City Airport Taxi",
    "Southend Airport Transfers",
    "Ilford Private Hire Taxi",
    "East London Airport Taxi",
    "London Chauffeur Service",
    "UK Taxi Company",
    "Luxelyne Transfers",
  ],
  authors: [{ name: "Luxelyne Transfers LTD" }],
  creator: "Luxelyne Transfers LTD",
  publisher: "Luxelyne Transfers LTD",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: "https://luxelynetransfers.co.uk",
    title: "Luxelyne Transfers | London Airport Transfers & 24/7 Private Hire Taxi",
    description:
      "Book reliable fixed-fare London airport transfers & private hire taxis. Serving Heathrow, Gatwick, Stansted, Luton, London City, Southend, and all London boroughs 24/7.",
    siteName: "Luxelyne Transfers",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Luxelyne Transfers LTD - UK Private Hire & London Airport Transfers",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Luxelyne Transfers | London Airport Transfers & 24/7 Private Hire Taxi",
    description:
      "Book reliable fixed-fare London airport transfers & private hire taxis. Serving Heathrow, Gatwick, Stansted, Luton, London City, Southend, and Greater London 24/7.",
    images: ["/og-image.png"],
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
  icons: {
    icon: [
      { url: "/Luxelyne-Transfers-Icon.png", sizes: "any" },
      { url: "/Luxelyne-Transfers-Icon.png", sizes: "32x32", type: "image/png" },
      { url: "/Luxelyne-Transfers-Icon.png", sizes: "16x16", type: "image/png" },
    ],
    shortcut: "/Luxelyne-Transfers-Icon.png",
    apple: [
      { url: "/Luxelyne-Transfers-Icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en-GB" className={`${figtree.variable} ${syne.variable}`}>
      <head>
        {/* ✅ Google Tag (GTM-MJF64R88) — immediately after <head> */}
        <script async src="https://www.googletagmanager.com/gtm.js?id=GTM-MJF64R88"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
`,
          }}
        />

        {/* ✅ Favicon & Apple Touch Icon */}
        <link rel="icon" href="/Luxelyne-Transfers-Icon.png" sizes="any" />
        <link rel="icon" type="image/png" sizes="32x32" href="/Luxelyne-Transfers-Icon.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/Luxelyne-Transfers-Icon.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/Luxelyne-Transfers-Icon.png" />
        <link rel="shortcut icon" href="/Luxelyne-Transfers-Icon.png" />

        {/* ✅ Microsoft Clarity Tracking Script (deferred to idle after LCP) */}
        <Script
          id="microsoft-clarity"
          strategy="lazyOnload"
          dangerouslySetInnerHTML={{
            __html: `
              (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i+"?ref=bwt";
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "z5uyg3g7a1");
            `,
          }}
        />
      </head>

      <body className="font-sans">
        {/* ✅ Structured Schema Markup */}
        <OrganizationSchema />
        <TaxiServiceSchema />

        <AddonProvider>
          <BookingProvider>
            <VehicleProvider>
              {children}
              <Toaster />
            </VehicleProvider>
          </BookingProvider>
        </AddonProvider>
      </body>
    </html>
  )
}
