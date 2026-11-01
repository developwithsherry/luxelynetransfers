import { getDriverApplications } from "./action"
import { DriverHiringClient } from "@/components/admin/driver-hiring/client"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Driver Hiring | Luxelyne Transfers Admin",
  description:
    "Review and manage driver partner applications submitted via the website.",
}

export default async function DriverHiringPage() {
  const { data, error } = await getDriverApplications()

  return <DriverHiringClient initialApplications={data} dbError={error} />
}

