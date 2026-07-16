"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/util/supabase/client"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Copy } from "lucide-react"
import { toast } from "sonner"
import Loader from "@/components/loader"

type Contact = {
  id: number
  created_at: string
  name: string | null
  email: string | null
  phone: string | null
  message: string | null
  company: string | null
}

export default function ContactAdminPage() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchContacts = async () => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from("contact")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Error fetching contacts:", error)
      } else {
        setContacts(data || [])
      }
      setLoading(false)
    }
    fetchContacts()
  }, [])

  const copyToClipboard = (value: string | null) => {
    if (!value) return
    navigator.clipboard.writeText(value)
    toast.success("Copied")
  }

  if (loading) return <Loader text="Loading messages" />

  const placeholder = "—"

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Contact Messages</h1>

      {/* Table for desktop */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full border border-gray-200 text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Phone</th>
              <th className="p-2 border">Date</th>
              <th className="p-2 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {contacts.map((c) => (
              <tr key={c.id} className="hover:bg-gray-50">
                <td className="p-2 border">{c.name || placeholder}</td>

                <td className="p-2 border flex items-center gap-2">
                  {c.email || placeholder}
                  {c.email && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-6 w-6 p-0"
                      onClick={() => copyToClipboard(c.email)}
                    >
                      <Copy size={14} />
                    </Button>
                  )}
                </td>

                <td className="p-2 border flex items-center gap-2">
                  {c.phone || placeholder}
                  {c.phone && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-6 w-6 p-0"
                      onClick={() => copyToClipboard(c.phone)}
                    >
                      <Copy size={14} />
                    </Button>
                  )}
                </td>

                <td className="p-2 border">
                  {c.created_at ? new Date(c.created_at).toLocaleString() : placeholder}
                </td>

                <td className="p-2 border text-center">
                  {c.message ? (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm" variant="secondary">View</Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-lg">
                        <DialogHeader>
                          <DialogTitle>Message from {c.name || "Unknown"}</DialogTitle>
                        </DialogHeader>
                        <p className="mt-2 whitespace-pre-line">{c.message}</p>
                      </DialogContent>
                    </Dialog>
                  ) : (
                    placeholder
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Cards for mobile */}
      <div className="grid gap-4 md:hidden">
        {contacts.map((c) => (
          <div
            key={c.id}
            className="border rounded-lg p-4 bg-white shadow-sm space-y-2"
          >
            <div className="flex justify-between items-center">
              <h2 className="font-semibold">{c.name || placeholder}</h2>
              <span className="text-xs text-gray-500">
                {c.created_at ? new Date(c.created_at).toLocaleDateString() : placeholder}
              </span>
            </div>

            <div className="text-sm text-gray-700">
              <div className="flex justify-between items-center">
                <span>Email:</span>
                <div className="flex items-center gap-2">
                  <span>{c.email || placeholder}</span>
                  {c.email && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-6 w-6 p-0"
                      onClick={() => copyToClipboard(c.email)}
                    >
                      <Copy size={14} />
                    </Button>
                  )}
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span>Phone:</span>
                <div className="flex items-center gap-2">
                  <span>{c.phone || placeholder}</span>
                  {c.phone && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-6 w-6 p-0"
                      onClick={() => copyToClipboard(c.phone)}
                    >
                      <Copy size={14} />
                    </Button>
                  )}
                </div>
              </div>
            </div>

            <div className="pt-2">
              {c.message ? (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="sm" variant="secondary" className="w-full">
                      View Message
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-lg">
                    <DialogHeader>
                      <DialogTitle>Message from {c.name || "Unknown"}</DialogTitle>
                    </DialogHeader>
                    <p className="mt-2 whitespace-pre-line">{c.message}</p>
                  </DialogContent>
                </Dialog>
              ) : (
                <p className="text-gray-500 text-sm italic">{placeholder}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
