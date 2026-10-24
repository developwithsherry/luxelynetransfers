import React from "react"

export function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Luxelyne Transfers LTD",
    "url": "https://luxelynetransfers.co.uk",
    "logo": "https://luxelynetransfers.co.uk/logo-main.png",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+44 7460 019129",
      "contactType": "customer service",
      "email": "info@luxelynetransfers.co.uk",
      "areaServed": "GB",
      "availableLanguage": ["en"]
    },
    "sameAs": [
      "https://www.facebook.com/luxelynetransfers",
      "https://www.instagram.com/luxelynetransfers/"
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
    "name": "Luxelyne Transfers",
    "provider": {
      "@type": "LocalBusiness",
      "name": "Luxelyne Transfers LTD",
      "image": "https://luxelynetransfers.co.uk/logo-main.png",
      "telephone": "+44 7460 019129",
      "email": "info@luxelynetransfers.co.uk",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "58 Peregrine Rd",
        "addressLocality": "Ilford",
        "postalCode": "IG6 3SZ",
        "addressCountry": "GB"
      },
      "priceRange": "$$"
    },
    "areaServed": [
      {
        "@type": "AdministrativeArea",
        "name": "London"
      },
      {
        "@type": "AdministrativeArea",
        "name": "Heathrow Airport (LHR)"
      },
      {
        "@type": "AdministrativeArea",
        "name": "Gatwick Airport (LGW)"
      },
      {
        "@type": "AdministrativeArea",
        "name": "Stansted Airport (STN)"
      },
      {
        "@type": "AdministrativeArea",
        "name": "Luton Airport (LTN)"
      },
      {
        "@type": "AdministrativeArea",
        "name": "London City Airport (LCY)"
      }
    ],
    "serviceType": "Airport Transfers, Private Hire Taxi & Chauffeur Services"
  }

  return (
    <script
      type="application/ld+json"
      id="taxi-service-schema"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
