// User & Authentication Types
export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  cnic: string;
  role: Role;
  is_verified: boolean;
}

export interface Role {
  id: number;
  role: string;
}

export interface RegisterData {
  email: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

// Student Profile Types
export interface StudentProfile {
  id: number;
  user: User;
  picture?: File | string;
  personal_info?: PersonalInformation;
  contact_info?: ContactInformation;
  relatives?: StudentRelative[];
  educational_records?: EducationalBackground[];
  medical_info?: MedicalInformation;
  profile_completion: number;
  created_at: string;
}

export interface PersonalInformation {
  id?: number;
  father_name: string;
  cnic: string;
  registered_contact: string;
  date_of_birth: string;
  gender: 'male' | 'female' | 'other';
  cnic_front_img: File | string;
  cnic_back_img: File | string;
}

export interface ContactInformation {
  id?: number;
  district: string;
  tehsil: string;
  city: string;
  permanent_address: string;
  current_address: string;
  postal_address: string;
}

export interface StudentRelative {
  id?: number;
  name: string;
  relationship: string;
  contact_one: string;
  contact_two?: string;
  address: string;
}

export interface EducationalBackground {
  id?: number;
  institution: number;
  institution_name?: string;
  degree: number;
  degree_name?: string;
  passing_year: number;
  total_marks: number;
  obtained_marks: number;
  percentage?: number;
  grade: string;
  certificate: File | string;
}

export interface BloodGroup {
  id: number;
  name: string;
}

export interface Disease {
  id: number;
  name: string;
}

export interface MedicalInformation {
  id?: number;
  blood_group: number;
  blood_group_name?: string;
  diseases: number[];
  diseases_list?: string[];
  is_disabled: boolean;
}

// Program Types
export interface Course {
  id: number;
  name: string;
  code: string;
  is_active: boolean;
}

export interface Program {
  id: number;
  name: string;
  code: string;
  courses: Course[];
  is_active: boolean;
}

export interface AcademicSession {
  id: number;
  session: string;
  start_date: string;
  end_date: string;
  is_current: boolean;
}

export interface OfferedProgram {
  id: number;
  program: Program;
  session: AcademicSession;
  total_seats: number;
  available_seats: number;
  is_active: boolean;
}

// Application Types
export interface ApplicationStatus {
  id: number;
  code: string;
  name: string;
  description: string;
}

export interface Application {
  id: number;
  student: StudentProfile;
  program: Program;
  session: AcademicSession;
  tracking_id: string;
  application_form_no: string;
  status: ApplicationStatus;
  applied_at: string;
  verification_hash: string;
  application_pdf?: string;
  application_qrcode?: string;
  can_apply: boolean;
  payment_status: string;
  additional_documents?: Array<{
    document_type: string;
    file_url: string | File;
  }>;
}

export interface ApplicationTracking {
  id: number;
  application: number;
  status: ApplicationStatus;
  remarks: string;
  changed_by: User;
  timestamp: string;
}

// Payment Types
export interface PaymentMethod {
  id: number;
  name: string;
  is_active: boolean;
}

export interface FeeStructure {
  id: number;
  program: Program;
  session: AcademicSession;
  application_fee: string;
  admission_fee: string;
  security_fee: string;
  is_active: boolean;
}

export interface Payment {
  id: number;
  application: Application;
  payment_type: 'application' | 'admission' | 'security';
  amount: string;
  payment_method: PaymentMethod;
  transaction_id: string;
  bank_reference?: string;
  status: 'pending' | 'paid' | 'failed' | 'refunded';
  paid_at?: string;
  verified_by?: User;
  receipt?: File | string;
  created_at: string;
}

// Dashboard Types
export interface Announcement {
  id: number;
  title: string;
  content: string;
  is_active: boolean;
  target_roles: Role[];
  created_by: User;
  created_at: string;
}

export interface AdmissionStats {
  id: number;
  session: AcademicSession;
  program: Program;
  total_applications: number;
  approved_applications: number;
  rejected_applications: number;
  pending_applications: number;
  last_updated: string;
}

// Lookup Types
export interface Degree {
  id: number;
  name: string;
}

export interface Institute {
  id: number;
  name: string;
}