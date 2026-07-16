import { Vehicle } from "@/types/vehicle"

const vehicleTypes = [
  { value: "Economy", label: "Economy" },
  { value: "People Carrier", label: "People Carrier" },
  { value: "Minibus", label: "Minibus" },
  { value: "Executive", label: "Executive" },
  { value: "Executive Minibus", label: "Executive Minibus" },
  { value: "Minibus", label: "Minibus" }, // duplicate
];

const sortOrder = [
  "Economy",
  "People Carrier",
  "Minibus",
  "Executive",
  "Executive Minibus",
];

export function sortVehiclesByType(vehicles:Vehicle[]) {
   
  return vehicles.sort((a, b) => {
    const indexA = sortOrder.indexOf(a.type);
    const indexB = sortOrder.indexOf(b.type);

    return indexA - indexB; // this keeps the correct forward order
  });
}

// Usage
