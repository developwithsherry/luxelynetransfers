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
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}
