type User = {
  average_rating: string;
  barangay_clearance_photo: string;
  bir_certificate_photo: null | string;
  birth_day: string;
  business_name: null | string;
  business_permit_photo: null | string;
  civil_status: string;
  contact_number: string;
  created_at: string;
  disabilities: null | string;
  disability_specify: null | string;
  email: string;
  email_verified_at: null | string;
  employer_type: null | string;
  experience: string;
  first_name: string;
  has_disability: number;
  height: string;
  id: number;
  last_name: string;
  lat: string;
  lng: string;
  location_id: number;
  middle_name: string;
  religion: string;
  role: string;
  selfie_with_id_photo: string;
  sex: string;
  skill_specify: string;
  skills: string;
  status: string;
  suffix: string;
  updated_at: string;
  valid_id_photo: string;

  educations: {
    course: string;
    created_at: string;
    id: number;
    level: string;
    school_name: string;
    updated_at: string;
    user_id: number;
    year_graduated: string;
  } [];

  certificates: {
    certificate_photo: string;
    created_at: string;
    date_issued: string;
    id: number;
    issuing_organization: string;
    title: string;
    updated_at: string;
    user_id: number;
  } []
} | null;

export default User;