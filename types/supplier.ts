export interface Supplier {
  id?: string;
  name: string;
  color?: string | null;
  support_email?: string | null;
  username?: string | null;
  password?: string | null;
  phone?: string | null;
  notes?: string | null;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
  unpaid_completed_jobs_count?: number;
  unpaid_completed_amount?: number;
}
