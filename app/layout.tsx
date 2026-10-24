import type React from "react"
import type { Metadata } from "next"
import Script from "next/script"
import "./globals.css"
import { Toaster } from "@/components/ui/sonner"
import Header from "@/components/header"
import { BookingProvider } from "@/context/booking-context"
import { VehicleProvider } from "@/context/vehicle-context"
import { AddonProvider } from "@/context/addon-context"
import { OrganizationSchema, TaxiServiceSchema } from "@/components/seo/schema-markup"

export const metadata: Metadata = {
  metadataBase: new URL("https://luxelynetransfers.co.uk"),
  title: {
    default: "Luxelyne Transfers | London Airport Transfers & Private Hire Taxi",
    template: "%s | Luxelyne Transfers",
  },
  description:
    "Luxelyne Transfers is a premier UK private hire & airport transfers supplier. Reliable taxi service serving Heathrow, Gatwick, Stansted, Luton, and London City airports.",
  keywords: [
    "Airport Transfers London",
    "Private Hire Taxi London",
    "Heathrow Airport Transfers",
    "Gatwick Airport Transfers",
    "Stansted Airport Taxi",
    "Luton Airport Transfers",
    "London City Airport Taxi",
    "UK Taxi Company",
    "Luxelyne Transfers",
  ],
  authors: [{ name: "Luxelyne Transfers" }],
  creator: "Luxelyne Transfers",
  publisher: "Luxelyne Transfers",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: "https://luxelynetransfers.co.uk",
    title: "Luxelyne Transfers | London Airport Transfers & Private Hire Taxi",
    description:
      "Luxelyne Transfers is a premier UK private hire & airport transfers supplier. Reliable taxi service serving Heathrow, Gatwick, Stansted, Luton, and London City airports.",
    siteName: "Luxelyne Transfers",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Luxelyne Transfers LTD - UK Private Hire & Airport Transfers",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Luxelyne Transfers | London Airport Transfers & Private Hire Taxi",
    description:
      "Luxelyne Transfers is a premier UK private hire & airport transfers supplier. Reliable taxi service serving Heathrow, Gatwick, Stansted, Luton, and London City airports.",
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
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        {/* ✅ Google Tag Manager Script */}
        <Script
          id="google-tag-manager"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-MXPFRM3G');
            `,
          }}
        />
      </head>

      <body className="font-sans">
        {/* ✅ Google Tag Manager (noscript) */}
        <noscript
          dangerouslySetInnerHTML={{
            __html: `
              <iframe src="https://www.googletagmanager.com/ns.html?id=GTM-MXPFRM3G"
              height="0" width="0" style="display:none;visibility:hidden"></iframe>
            `,
          }}
        />

        {/* ✅ Structured Schema Markup */}
        <OrganizationSchema />
        <TaxiServiceSchema />

        <AddonProvider>
          <BookingProvider>
            <VehicleProvider>
              <Header />
              <main>{children}</main>
              <Toaster />
            </VehicleProvider>
          </BookingProvider>
        </AddonProvider>
      </body>
    </html>
  )
}
