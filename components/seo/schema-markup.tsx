import React from "react"

export function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": "https://luxelynetransfers.co.uk/#organization",
    "name": "Luxelyne Transfers",
    "legalName": "Luxelyne Transfers LTD",
    "url": "https://luxelynetransfers.co.uk",
    "logo": {
      "@type": "ImageObject",
      "url": "https://luxelynetransfers.co.uk/logo-main.png",
      "width": 288,
      "height": 64
    },
    "description": "Luxelyne Transfers LTD (UK Company No. 16665396) is a 24/7 London airport transfer and private hire taxi provider serving Heathrow, Gatwick, Stansted, Luton, London City, Southend, and Greater London.",
    "identifier": {
      "@type": "PropertyValue",
      "propertyID": "UK Companies House Number",
      "value": "16665396"
    },
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "58 Peregrine Rd",
      "addressLocality": "Ilford",
      "addressRegion": "Greater London",
      "postalCode": "IG6 3SZ",
      "addressCountry": "GB"
    },
    "contactPoint": [
      {
        "@type": "ContactPoint",
        "telephone": "+44-7460-019129",
        "contactType": "customer service",
        "email": "info@luxelynetransfers.co.uk",
        "areaServed": "GB",
        "availableLanguage": ["en"],
        "hoursAvailable": {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday"
          ],
          "opens": "00:00",
          "closes": "23:59"
        }
      }
    ],
    "sameAs": [
      "https://www.facebook.com/luxelynetransfers",
      "https://www.instagram.com/luxelynetransfers/",
      "https://wa.me/447460019129"
    ]
  }

  return (
    <script
      type="application/ld+json"
      id="organization-schema"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

export function TaxiServiceSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "TaxiService",
    "@id": "https://luxelynetransfers.co.uk/#taxiservice",
    "name": "Luxelyne Transfers — London Airport Transfers & Private Hire",
    "url": "https://luxelynetransfers.co.uk",
    "serviceType": "Airport Transfers, Private Hire Taxi & Executive Chauffeur Services",
    "provider": {
      "@type": "LocalBusiness",
      "@id": "https://luxelynetransfers.co.uk/#localbusiness",
      "name": "Luxelyne Transfers LTD",
      "legalName": "Luxelyne Transfers LTD",
      "url": "https://luxelynetransfers.co.uk",
      "image": "https://luxelynetransfers.co.uk/og-image.png",
      "logo": "https://luxelynetransfers.co.uk/logo-main.png",
      "telephone": "+44 7460 019129",
      "email": "info@luxelynetransfers.co.uk",
      "priceRange": "££",
      "currenciesAccepted": "GBP",
      "paymentAccepted": "Credit Card, Debit Card, Stripe, PayPal",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "58 Peregrine Rd",
        "addressLocality": "Ilford",
        "addressRegion": "Greater London",
        "postalCode": "IG6 3SZ",
        "addressCountry": "GB"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": 51.6056,
        "longitude": 0.1018
      },
      "openingHoursSpecification": {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday"
        ],
        "opens": "00:00",
        "closes": "23:59"
      }
    },
    "areaServed": [
      { "@type": "City", "name": "London" },
      { "@type": "Airport", "name": "London Heathrow Airport", "iataCode": "LHR" },
      { "@type": "Airport", "name": "London Gatwick Airport", "iataCode": "LGW" },
      { "@type": "Airport", "name": "London Stansted Airport", "iataCode": "STN" },
      { "@type": "Airport", "name": "London Luton Airport", "iataCode": "LTN" },
      { "@type": "Airport", "name": "London City Airport", "iataCode": "LCY" },
      { "@type": "Airport", "name": "London Southend Airport", "iataCode": "SEN" },
      { "@type": "AdministrativeArea", "name": "Ilford & Redbridge" },
      { "@type": "AdministrativeArea", "name": "Canary Wharf & East London" },
      { "@type": "AdministrativeArea", "name": "Central London & Westminster" }
    ],
    "potentialAction": {
      "@type": "ReserveAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://luxelynetransfers.co.uk/#book-now",
        "inLanguage": "en-GB",
        "actionPlatform": [
          "http://schema.org/DesktopWebPlatform",
          "http://schema.org/MobileWebPlatform"
        ]
      },
      "result": {
        "@type": "TaxiReservation",
        "name": "Book London Airport Transfer or Private Hire Taxi"
      }
    }
  }

  return (
    <script
      type="application/ld+json"
      id="taxi-service-schema"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

export function BreadcrumbSchema({
  items,
}: {
  items: { name: string; url: string }[]
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, idx) => ({
      "@type": "ListItem",
      "position": idx + 1,
      "name": item.name,
      "item": item.url,
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
