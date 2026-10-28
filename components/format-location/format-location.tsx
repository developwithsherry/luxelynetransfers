export function formatLocation(location?: string | null): string {
  if (!location) return "";
  const parts = location.split(",");
  return parts[0]?.trim() || location;
}