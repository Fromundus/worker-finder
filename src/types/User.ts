type User = {
  id: number;
  name: string;
  contact_number?: string | null;
  area?: string | null;
  notes?: string | null;
  email: string;
  email_verified_at: string;
  role: string;
  status: string;
  created_at?: string;
} | null;

export default User;