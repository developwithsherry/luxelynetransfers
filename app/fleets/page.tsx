import type { Metadata } from "next"
import FleetsContent from "@/components/fleets/fleets-content"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Our Fleet",
  description:
    "Explore the Luxelyne Transfers premium fleet. Choose from our executive saloons, business class vehicles, and spacious MPVs for London airport transfers.",
  alternates: {
    canonical: "https://luxelynetransfers.co.uk/fleets",
  },
}

export default function Page() {
  return <FleetsContent />
}