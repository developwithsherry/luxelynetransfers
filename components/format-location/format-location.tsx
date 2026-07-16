 export function formatLocation(location: string): string {
    if (!location) return "";
    const parts = location.split(",");
    return parts[0]?.trim() || location;
  }