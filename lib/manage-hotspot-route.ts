export const extractPostalCodeFromPlace = (place: any): string | null => {
  if (!place || !place.address_components) return null;
  const component = place.address_components.find((c: any) => c.types.includes("postal_code"));
  return component ? component.long_name.split(" ")[0].toUpperCase() : null;
};

export const extractPostalCode = (address: string): string | null => {
  const ukPostcodePattern = /[A-Z]{1,2}[0-9][0-9A-Z]?\s?[0-9][A-Z]{2}/i;
  const match = address.match(ukPostcodePattern);
  return match ? match[0].split(" ")[0].toUpperCase() : null;
};

export const getPostcodeFromGeocodeAPI = async (address: string): Promise<string | null> => {
  try {
    if (typeof window === "undefined" || !window.google || !window.google.maps) {
      return null;
    }
    const geocoder = new window.google.maps.Geocoder();
    const result = await new Promise<any>((resolve, reject) => {
      geocoder.geocode({ address }, (results, status) => {
        if (status === "OK" && results && results[0]) {
          resolve(results[0]);
        } else {
          reject(status);
        }
      });
    });
    return extractPostalCodeFromPlace(result);
  } catch (error) {
    console.error("Geocoding failed:", error);
    return null;
  }
};
