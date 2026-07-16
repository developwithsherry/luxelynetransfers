import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://luxelynetransfers.com"

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admin",
        "/admin/*",
        "/booking-cancel",
        "/booking-success",
        "/select-vehicle",
        "/api/*",
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
