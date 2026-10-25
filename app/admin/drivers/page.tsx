export const dynamic = "force-dynamic"

import { DriversClient } from "@/components/admin/drivers/client"

export const metadata = {
  title: "Drivers Management | Luxelyne Transfers Admin",
  description: "Manage driver roster, PHV licensing, contact details, and vehicle compliance documents.",
}

export default function DriversPage() {
  return <DriversClient />
}
