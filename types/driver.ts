export interface Driver {
  id?: string;
  name: string;
  phone: string;
  area_operates?: string | null;
  photo_url?: string | null;
  driving_license_url?: string | null;
  phv_license_url?: string | null;
  vehicle_model?: string | null;
  vehicle_reg?: string | null;
  vehicle_images?: string[];
  log_book_url?: string | null;
  insurance_url?: string | null;
  mot_url?: string | null;
  notes?: string | null;
  driving_license_expiry?: string | null;
  phv_license_expiry?: string | null;
  log_book_expiry?: string | null;
  insurance_expiry?: string | null;
  mot_expiry?: string | null;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export type DriverDocKey =
  | "driving_license"
  | "phv_license"
  | "log_book"
  | "insurance"
  | "mot"

export interface DriverDocumentAlert {
  driverId: string;
  driverName: string;
  driverPhone: string;
  driverPhoto?: string | null;
  docKey: DriverDocKey;
  docLabel: string;
  docUrl?: string | null;
  expiryDate: string; // YYYY-MM-DD
  isExpired: boolean;
  isExpiringSoon: boolean;
  daysDiff: number; // negative number indicates days passed since expiration
}
