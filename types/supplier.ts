export interface Supplier {
  id?: string;
  name: string;
  support_email?: string | null;
  username?: string | null;
  password?: string | null;
  phone?: string | null;
  notes?: string | null;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}
