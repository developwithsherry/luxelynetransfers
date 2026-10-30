import type { MetadataRoute } from "next"

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://luxelynetransfers.co.uk"
  const lastUpdated = new Date("2026-03-01T12:00:00Z")

  return [
    {
      url: `${baseUrl}/`,
      lastModified: lastUpdated,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    // Airport Landing Pages (High Commercial Intent)
    {
      url: `${baseUrl}/heathrow-airport-transfers`,
      lastModified: lastUpdated,
      changeFrequency: "weekly",
      priority: 0.95,
    },
    {
      url: `${baseUrl}/gatwick-airport-transfers`,
      lastModified: lastUpdated,
      changeFrequency: "weekly",
      priority: 0.95,
    },
    {
      url: `${baseUrl}/stansted-airport-transfers`,
      lastModified: lastUpdated,
      changeFrequency: "weekly",
      priority: 0.95,
    },
    {
      url: `${baseUrl}/luton-airport-transfers`,
      lastModified: lastUpdated,
      changeFrequency: "weekly",
      priority: 0.95,
    },
    {
      url: `${baseUrl}/london-city-airport-transfers`,
      lastModified: lastUpdated,
      changeFrequency: "weekly",
      priority: 0.95,
    },
    {
      url: `${baseUrl}/southend-airport-transfers`,
      lastModified: lastUpdated,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    // Inside London Private Hire Hub
    {
      url: `${baseUrl}/london-private-hire`,
      lastModified: lastUpdated,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    // Core Pages
    {
      url: `${baseUrl}/services`,
      lastModified: lastUpdated,
      changeFrequency: "monthly",
      priority: 0.85,
    },
    {
      url: `${baseUrl}/fleets`,
      lastModified: lastUpdated,
      changeFrequency: "monthly",
      priority: 0.85,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: lastUpdated,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: lastUpdated,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    // Blog & Guides
    {
      url: `${baseUrl}/blog`,
      lastModified: lastUpdated,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog/best-way-to-book-heathrow-airport-taxi`,
      lastModified: lastUpdated,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog/pre-booked-private-hire-vs-uber-heathrow`,
      lastModified: lastUpdated,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog/affordable-private-hire-ilford-east-london`,
      lastModified: lastUpdated,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    // Legal Pages
    {
      url: `${baseUrl}/policy`,
      lastModified: lastUpdated,
      changeFrequency: "yearly",
      priority: 0.4,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: lastUpdated,
      changeFrequency: "yearly",
      priority: 0.4,
    },
  ]
}
