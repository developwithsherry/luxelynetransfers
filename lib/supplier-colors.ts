import type React from "react"

export interface SupplierColorOption {
  hex: string
  name: string
}

export const SUPPLIER_COLOR_PALETTE: SupplierColorOption[] = [
  { hex: "#7c3aed", name: "Violet" },
  { hex: "#2563eb", name: "Royal Blue" },
  { hex: "#059669", name: "Emerald" },
  { hex: "#e11d48", name: "Rose" },
  { hex: "#d97706", name: "Amber" },
  { hex: "#0891b2", name: "Cyan" },
  { hex: "#4f46e5", name: "Indigo" },
  { hex: "#c026d3", name: "Fuchsia" },
  { hex: "#0d9488", name: "Teal" },
  { hex: "#ea580c", name: "Orange" },
  { hex: "#0284c7", name: "Sky Blue" },
  { hex: "#db2777", name: "Pink" },
  { hex: "#65a30d", name: "Lime" },
  { hex: "#dc2626", name: "Crimson" },
  { hex: "#9333ea", name: "Purple" },
  { hex: "#334155", name: "Slate" },
]

function normalizeHex(hex?: string | null): string | null {
  if (!hex) return null
  const trimmed = hex.trim()
  if (/^#[0-9a-fA-F]{6}$/.test(trimmed)) {
    return trimmed.toLowerCase()
  }
  return null
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const clean = hex.replace("#", "")
  const num = parseInt(clean, 16)
  if (isNaN(num)) {
    return { r: 124, g: 58, b: 237 }
  }
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  }
}

/**
 * Deterministically resolves a supplier's color:
 * 1. Uses the stored `supplier.color` hex if present.
 * 2. Otherwise deterministically maps `supplier.name` or `supplier.id` to a palette color.
 */
export function getSupplierColor(
  supplier?: { id?: string | null; name?: string | null; color?: string | null } | null
): string {
  const explicit = normalizeHex(supplier?.color)
  if (explicit) return explicit

  const seed = (supplier?.name || supplier?.id || "").trim().toLowerCase()
  if (!seed) return SUPPLIER_COLOR_PALETTE[0].hex

  let hash = 0
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0
  }

  return SUPPLIER_COLOR_PALETTE[hash % SUPPLIER_COLOR_PALETTE.length].hex
}

/**
 * Picks the next unused default color from the palette when adding a new supplier.
 * If all palette colors are already used, cycles cleanly based on total supplier count.
 */
export function pickNextSupplierColor(
  existingSuppliers: Array<{ id?: string | null; name?: string | null; color?: string | null }> = []
): string {
  const usedColors = new Set(
    existingSuppliers.map((s) => getSupplierColor(s).toLowerCase())
  )

  for (const option of SUPPLIER_COLOR_PALETTE) {
    if (!usedColors.has(option.hex.toLowerCase())) {
      return option.hex
    }
  }

  return SUPPLIER_COLOR_PALETTE[existingSuppliers.length % SUPPLIER_COLOR_PALETTE.length].hex
}

/**
 * Inline style for the supplier abbreviation avatar square (e.g., "O", "EC", "PR").
 */
export function getSupplierAvatarStyle(
  supplierOrColor?: { id?: string | null; name?: string | null; color?: string | null } | string | null
): React.CSSProperties {
  const color =
    typeof supplierOrColor === "string"
      ? normalizeHex(supplierOrColor) || SUPPLIER_COLOR_PALETTE[0].hex
      : getSupplierColor(supplierOrColor)

  return {
    backgroundColor: color,
    color: "#ffffff",
  }
}

/**
 * Inline style for supplier name pills/badges on bookings, calendar, and ledger rows.
 */
export function getSupplierBadgeStyle(
  supplierOrColor?: { id?: string | null; name?: string | null; color?: string | null } | string | null
): React.CSSProperties {
  const color =
    typeof supplierOrColor === "string"
      ? normalizeHex(supplierOrColor) || SUPPLIER_COLOR_PALETTE[0].hex
      : getSupplierColor(supplierOrColor)

  const { r, g, b } = hexToRgb(color)

  return {
    backgroundColor: `rgba(${r}, ${g}, ${b}, 0.12)`,
    color,
    borderColor: `rgba(${r}, ${g}, ${b}, 0.32)`,
  }
}

/**
 * Helper to extract up to 2 uppercase initials for a supplier name.
 */
export function getSupplierInitials(name?: string | null): string {
  if (!name || !name.trim()) return "SP"
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() || "")
    .join("")
}

