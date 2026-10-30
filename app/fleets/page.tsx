import type { Metadata } from "next"
import FleetsContent from "@/components/fleets/fleets-content"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Our Chauffeur & Private Hire Fleet | Saloons, Executive & 8-Seat MPVs",
  description:
    "Explore the Luxelyne Transfers fleet for London airport transfers and private hire. Choose from modern saloons, executive Mercedes E-Class, S-Class, and spacious 8-seater V-Class MPVs.",
  alternates: {
    canonical: "https://luxelynetransfers.co.uk/fleets",
  },
  openGraph: {
    title: "Our Chauffeur & Private Hire Fleet | Luxelyne Transfers",
    description:
      "Modern saloons, executive business class cars, and spacious 8-seater MPVs for London airport transfers & UK private hire.",
    url: "https://luxelynetransfers.co.uk/fleets",
    images: ["/og-image.png"],
  },
}

export default function Page() {
  return <FleetsContent />
}
