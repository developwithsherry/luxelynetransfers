export const dynamic = "force-dynamic"

import { SuppliersClient } from "@/components/admin/suppliers/client"

export const metadata = {
  title: "Suppliers Management | Luxelyne Transfers Admin",
  description: "Manage suppliers, transport partners, support contacts, and portal credentials.",
}

export default function SuppliersPage() {
  return <SuppliersClient />
}
