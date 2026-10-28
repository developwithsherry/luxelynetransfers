"use client"

import { useEffect, useState, useMemo } from "react"
import { Supplier } from "@/types/supplier"
import { getSuppliers } from "@/app/admin/suppliers/action"
import SuppliersHeader from "./header"
import SupplierCard from "./supplier-card"
import { SupplierList } from "./supplier-list"
import SupplierDialog from "./supplier-dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Building2,
  Search,
  Loader2,
  Users,
  ShieldCheck,
  Mail,
  KeyRound,
  AlertCircle,
  Database,
  Plus,
  Copy,
  Check,
  LayoutList,
  LayoutGrid,
} from "lucide-react"
import { toast } from "sonner"

export function SuppliersClient() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<"list" | "cards">("list")
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all")

  // Dialog State
  const [dialogOpen, setDialogOpen] = useState<boolean>(false)
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null)
  const [copiedSql, setCopiedSql] = useState<boolean>(false)

  const fetchSuppliers = async () => {
    setLoading(true)
    setErrorMessage(null)
    try {
      const res = await getSuppliers()
      if (res.error) {
        setErrorMessage(res.error)
      } else if (res.data) {
        setSuppliers(res.data)
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to load suppliers")
      toast.error("Failed to load suppliers")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSuppliers()
  }, [])

  const handleAddNew = () => {
    setSelectedSupplier(null)
    setDialogOpen(true)
  }

  const handleEdit = (supplier: Supplier) => {
    setSelectedSupplier(supplier)
    setDialogOpen(true)
  }

  const handleDeleted = (id: string) => {
    setSuppliers((prev) => prev.filter((s) => s.id !== id))
  }

  const handleStatusChange = (id: string, isActive: boolean) => {
    setSuppliers((prev) =>
      prev.map((s) => (s.id === id ? { ...s, is_active: isActive } : s))
    )
  }

  const handleDialogSuccess = (saved: Supplier) => {
    setSuppliers((prev) => {
      const existingIndex = prev.findIndex((s) => s.id === saved.id)
      if (existingIndex >= 0) {
        const copy = [...prev]
        copy[existingIndex] = saved
        return copy
      } else {
        return [saved, ...prev]
      }
    })
  }

  // Filtered suppliers
  const filteredSuppliers = useMemo(() => {
    return suppliers.filter((s) => {
      const query = searchQuery.toLowerCase().trim()
      const matchesSearch =
        !query ||
        s.name.toLowerCase().includes(query) ||
        (s.support_email && s.support_email.toLowerCase().includes(query)) ||
        (s.username && s.username.toLowerCase().includes(query)) ||
        (s.notes && s.notes.toLowerCase().includes(query))

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && (s.is_active ?? true)) ||
        (statusFilter === "inactive" && !(s.is_active ?? true))

      return matchesSearch && matchesStatus
    })
  }, [suppliers, searchQuery, statusFilter])

  // Summary Metrics
  const stats = useMemo(() => {
    const total = suppliers.length
    const active = suppliers.filter((s) => s.is_active ?? true).length
    const withEmail = suppliers.filter((s) => Boolean(s.support_email)).length
    const withCreds = suppliers.filter((s) => Boolean(s.username || s.password)).length
    return { total, active, withEmail, withCreds }
  }, [suppliers])

  const copySqlInstruction = async () => {
    try {
      await navigator.clipboard.writeText("suppliers.sql")
      setCopiedSql(true)
      toast.success("Filename copied. Find suppliers.sql in the project root.")
      setTimeout(() => setCopiedSql(false), 2000)
    } catch {
      toast.error("Failed to copy")
    }
  }

  return (
    <div className="container mx-auto px-4 py-6 sm:py-8">
      {/* Header */}
      <SuppliersHeader onAddNew={handleAddNew} totalCount={suppliers.length} />

      {/* Supabase Notice if table doesn't exist */}
      {errorMessage && (
        <div className="mb-6 p-4 rounded-xl border border-amber-300 bg-amber-50 text-amber-900 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-amber-200/70 rounded-lg text-amber-800 shrink-0">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm">Supabase Database Setup Required</h4>
              <p className="text-xs text-amber-800 mt-0.5 leading-relaxed">
                {errorMessage}
              </p>
              <p className="text-xs text-amber-700 mt-1">
                Open Supabase Dashboard → <strong>SQL Editor</strong> → Paste & Run the contents of{" "}
                <code className="bg-amber-100 font-mono px-1 py-0.5 rounded border border-amber-200 font-semibold">
                  suppliers.sql
                </code>{" "}
                (also located in <code className="bg-amber-100 font-mono px-1 py-0.5 rounded">schema/suppliers.sql</code>).
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={copySqlInstruction}
              className="bg-white border-amber-300 hover:bg-amber-100 text-xs"
            >
              {copiedSql ? (
                <>
                  <Check className="w-3.5 h-3.5 mr-1 text-emerald-600" /> Copied!
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 mr-1" /> Copy File Name
                </>
              )}
            </Button>
            <Button
              size="sm"
              onClick={fetchSuppliers}
              className="bg-amber-600 hover:bg-amber-700 text-white text-xs"
            >
              Retry Sync
            </Button>
          </div>
        </div>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              Total Suppliers
            </span>
            <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900 mt-2">{stats.total}</p>
          <span className="text-xs text-gray-400">Registered transport partners</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              Active Partners
            </span>
            <div className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900 mt-2">{stats.active}</p>
          <span className="text-xs text-gray-400">Currently active partners</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              Support Contacts
            </span>
            <div className="p-1.5 bg-purple-50 text-purple-600 rounded-lg">
              <Mail className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900 mt-2">{stats.withEmail}</p>
          <span className="text-xs text-gray-400">With support email saved</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              Portal Logins
            </span>
            <div className="p-1.5 bg-lime-100 text-lime-800 rounded-lg">
              <KeyRound className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900 mt-2">{stats.withCreds}</p>
          <span className="text-xs text-gray-400">With username/password saved</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-3 sm:p-4 rounded-xl border border-gray-200 shadow-sm mb-6 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search suppliers by name, support email, username, or notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-gray-50/50 border-gray-200 focus:bg-white text-sm"
          />
        </div>

        <div className="flex items-center gap-2">
          <div className="flex p-1 bg-gray-100 rounded-lg text-xs font-medium">
            <button
              onClick={() => setStatusFilter("all")}
              className={`px-3 py-1.5 rounded-md transition-all ${
                statusFilter === "all"
                  ? "bg-white text-gray-900 shadow-sm font-semibold"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              All ({suppliers.length})
            </button>
            <button
              onClick={() => setStatusFilter("active")}
              className={`px-3 py-1.5 rounded-md transition-all ${
                statusFilter === "active"
                  ? "bg-white text-gray-900 shadow-sm font-semibold"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              Active ({stats.active})
            </button>
            <button
              onClick={() => setStatusFilter("inactive")}
              className={`px-3 py-1.5 rounded-md transition-all ${
                statusFilter === "inactive"
                  ? "bg-white text-gray-900 shadow-sm font-semibold"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              Inactive ({suppliers.length - stats.active})
            </button>
          </div>

          {/* View Mode Switcher: List (default) vs Cards */}
          <div className="flex p-1 bg-gray-100 rounded-lg text-xs font-medium border border-gray-200/60 shrink-0">
            <button
              type="button"
              onClick={() => setViewMode("list")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all ${
                viewMode === "list"
                  ? "bg-white text-gray-900 shadow-xs font-bold"
                  : "text-gray-500 hover:text-gray-900"
              }`}
              title="List View"
            >
              <LayoutList className="w-3.5 h-3.5 text-purple-700" />
              <span>List</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("cards")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all ${
                viewMode === "cards"
                  ? "bg-white text-gray-900 shadow-xs font-bold"
                  : "text-gray-500 hover:text-gray-900"
              }`}
              title="Cards View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Cards</span>
            </button>
          </div>
        </div>
      </div>

      {/* Content Area */}
      {loading ? (
        <div className="flex flex-col items-center justify-center h-64 bg-white rounded-xl border border-gray-200 shadow-sm">
          <Loader2 className="w-8 h-8 animate-spin text-lime-600 mb-2" />
          <p className="text-gray-600 text-sm font-medium">Loading suppliers...</p>
        </div>
      ) : filteredSuppliers.length > 0 ? (
        viewMode === "list" ? (
          <SupplierList
            suppliers={filteredSuppliers}
            onEdit={handleEdit}
            onDeleted={handleDeleted}
            onStatusChange={handleStatusChange}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredSuppliers.map((supplier) => (
              <SupplierCard
                key={supplier.id}
                supplier={supplier}
                onEdit={handleEdit}
                onDeleted={handleDeleted}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
        )
      ) : (
        <div className="flex flex-col items-center justify-center py-16 px-4 bg-white rounded-xl border border-dashed border-gray-300 text-center">
          <div className="w-16 h-16 rounded-full bg-lime-50 text-lime-600 flex items-center justify-center mb-4">
            <Building2 className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">
            {searchQuery ? "No matching suppliers found" : "No suppliers added yet"}
          </h3>
          <p className="text-sm text-gray-500 max-w-md mb-6">
            {searchQuery
              ? `No suppliers matched your search query "${searchQuery}". Try searching with another term or reset your filters.`
              : "Keep track of all vehicle and chauffeur suppliers you work with, including support emails and portal logins."}
          </p>
          <Button
            onClick={handleAddNew}
            className="bg-lime-400 hover:bg-lime-500 text-black font-semibold"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Supplier
          </Button>
        </div>
      )}

      {/* Add / Edit Dialog Modal */}
      <SupplierDialog
        open={dialogOpen}
        setOpen={setDialogOpen}
        supplier={selectedSupplier}
        onSuccess={handleDialogSuccess}
      />
    </div>
  )
}
