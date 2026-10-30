import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://luxelynetransfers.co.uk"
  const disallowedPaths = [
    "/admin",
    "/admin/*",
    "/login",
    "/booking",
    "/booking-cancel",
    "/booking-success",
    "/select-vehicle",
    "/api/*",
  ]

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: disallowedPaths,
      },
      {
        userAgent: [
          "GPTBot",
          "OAI-SearchBot",
          "ChatGPT-User",
          "PerplexityBot",
          "ClaudeBot",
          "Claude-Web",
          "Google-Extended",
          "Applebot-Extended",
          "CCBot",
        ],
        allow: [
          "/",
          "/llms.txt",
          "/llms-full.txt",
          "/heathrow-airport-transfers",
          "/gatwick-airport-transfers",
          "/stansted-airport-transfers",
          "/luton-airport-transfers",
          "/london-city-airport-transfers",
          "/southend-airport-transfers",
          "/london-private-hire",
          "/services",
          "/fleets",
          "/about",
          "/blog",
        ],
        disallow: disallowedPaths,
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  }
}
