type User = {
  average_rating: string;
  business_name: null | string;
  contact_number: string;
  created_at: string;
  email: string;
  email_verified_at: null
  experience: string;
  id: number
  lat: string;
  lng: string;
  location_id: number;
  name: string;
  role: string;
  skills: string;
  status: string;
  updated_at: string;
} | null;

export default User;