export function formatLocation(location?: string | null): string {
  if (!location) return "";
  return location.trim();
}
