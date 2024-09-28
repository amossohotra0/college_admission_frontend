import { api } from './api';
import {
  // Auth types
  RegisterData,
  LoginData,
  AuthTokens,
  User,
  
  // Student profile types
  StudentProfile,
  PersonalInformation,
  ContactInformation,
  StudentRelative,
  EducationalBackground,
  MedicalInformation,
  
  // Program types
  Program,
  Course,
  AcademicSession,
  OfferedProgram,
  
  // Application types
  Application,
  ApplicationStatus,
  ApplicationTracking,
  
  // Payment types
  Payment,
  PaymentMethod,
  FeeStructure,
  
  // Dashboard types
  Announcement,
  AdmissionStats,
  
  // Lookup types
  Degree,
  Institute,
  BloodGroup,
  Disease,
} from '@/types';

// Authentication Services
export const authService = {
  async register(data: RegisterData) {
    const response = await api.post('/auth/register/', data);
    return response.data;
  },

  async login(data: LoginData): Promise<AuthTokens> {
    const response = await api.post('/auth/login/', data);
    return response.data;
  },

  async refreshToken(refreshToken: string): Promise<AuthTokens> {
    const response = await api.post('/auth/refresh/', { refresh: refreshToken });
    return response.data;
  },

  async getUserProfile(): Promise<User> {
    const response = await api.get('/auth/profile/');
    return response.data;
  },

  async updateUserProfile(data: Partial<User>): Promise<User> {
    const response = await api.put('/auth/profile/', data);
    return response.data;
  },
};

// Student Profile Services
export const studentService = {
  // Student Profile
  async getMyProfile(): Promise<StudentProfile> {
    const response = await api.get('/students/my_profile/');
    return response.data;
  },

  async createProfile(data: Partial<StudentProfile>): Promise<StudentProfile> {
    const formData = new FormData();
    if (data.picture instanceof File) {
      formData.append('picture', data.picture);
    }
    const response = await api.post('/students/my_profile/', formData);
    return response.data;
  },

  async updateProfile(data: Partial<StudentProfile>): Promise<StudentProfile> {
    const formData = new FormData();
    if (data.picture instanceof File) {
      formData.append('picture', data.picture);
    }
    const response = await api.put('/students/my_profile/', formData);
    return response.data;
  },

  // Personal Information
  async getPersonalInfo(): Promise<PersonalInformation> {
    const response = await api.get('/profile/personal-info/');
    return response.data;
  },

  async createPersonalInfo(data: PersonalInformation): Promise<PersonalInformation> {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (value instanceof File) {
          formData.append(key, value);
        } else {
          formData.append(key, value.toString());
        }
      }
    });
    const response = await api.post('/profile/personal-info/', formData);
    return response.data;
  },

  async updatePersonalInfo(data: PersonalInformation): Promise<PersonalInformation> {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (value instanceof File) {
          formData.append(key, value);
        } else {
          formData.append(key, value.toString());
        }
      }
    });
    const response = await api.put('/profile/personal-info/', formData);
    return response.data;
  },

  // Contact Information
  async getContactInfo(): Promise<ContactInformation> {
    const response = await api.get('/profile/contact-info/');
    return response.data;
  },

  async createContactInfo(data: ContactInformation): Promise<ContactInformation> {
    const response = await api.post('/profile/contact-info/', data);
    return response.data;
  },

  async updateContactInfo(data: ContactInformation): Promise<ContactInformation> {
    const response = await api.put('/profile/contact-info/', data);
    return response.data;
  },

  // Student Relatives
  async getRelatives(): Promise<StudentRelative[]> {
    const response = await api.get('/student-relatives/');
    return response.data.results || response.data;
  },

  async createRelative(data: StudentRelative): Promise<StudentRelative> {
    const response = await api.post('/student-relatives/', data);
    return response.data;
  },

  async updateRelative(id: number, data: StudentRelative): Promise<StudentRelative> {
    const response = await api.put(`/student-relatives/${id}/`, data);
    return response.data;
  },

  async deleteRelative(id: number): Promise<void> {
    await api.delete(`/student-relatives/${id}/`);
  },

  // Educational Background
  async getEducationalBackground(): Promise<EducationalBackground[]> {
    const response = await api.get('/educational-background/');
    return response.data.results || response.data;
  },

  async createEducationalRecord(data: EducationalBackground): Promise<EducationalBackground> {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (value instanceof File) {
          formData.append(key, value);
        } else {
          formData.append(key, value.toString());
        }
      }
    });
    const response = await api.post('/educational-background/', formData);
    return response.data;
  },

  async updateEducationalRecord(id: number, data: EducationalBackground): Promise<EducationalBackground> {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (value instanceof File) {
          formData.append(key, value);
        } else {
          formData.append(key, value.toString());
        }
      }
    });
    const response = await api.put(`/educational-background/${id}/`, formData);
    return response.data;
  },

  async deleteEducationalRecord(id: number): Promise<void> {
    await api.delete(`/educational-background/${id}/`);
  },

  // Medical Information
  async getMedicalInfo(): Promise<MedicalInformation> {
    const response = await api.get('/profile/medical-info/');
    return response.data;
  },

  async createMedicalInfo(data: MedicalInformation): Promise<MedicalInformation> {
    const response = await api.post('/profile/medical-info/', data);
    return response.data;
  },

  async updateMedicalInfo(data: MedicalInformation): Promise<MedicalInformation> {
    const response = await api.put('/profile/medical-info/', data);
    return response.data;
  },
};

// Program Services
export const programService = {
  // Programs
  async getPrograms(): Promise<Program[]> {
    const response = await api.get('/programs/');
    return response.data.results || response.data;
  },

  async getProgram(id: number): Promise<Program> {
    const response = await api.get(`/programs/${id}/`);
    return response.data;
  },

  async createProgram(data: Partial<Program>): Promise<Program> {
    const response = await api.post('/programs/', data);
    return response.data;
  },

  async updateProgram(id: number, data: Partial<Program>): Promise<Program> {
    const response = await api.put(`/programs/${id}/`, data);
    return response.data;
  },

  async deleteProgram(id: number): Promise<void> {
    await api.delete(`/programs/${id}/`);
  },

  // Courses
  async getCourses(): Promise<Course[]> {
    const response = await api.get('/courses/');
    return response.data.results || response.data;
  },

  async createCourse(data: Partial<Course>): Promise<Course> {
    const response = await api.post('/courses/', data);
    return response.data;
  },

  // Academic Sessions
  async getAcademicSessions(): Promise<AcademicSession[]> {
    const response = await api.get('/academic-sessions/');
    return response.data.results || response.data;
  },

  async createAcademicSession(data: Partial<AcademicSession>): Promise<AcademicSession> {
    const response = await api.post('/academic-sessions/', data);
    return response.data;
  },

  // Offered Programs
  async getOfferedPrograms(): Promise<OfferedProgram[]> {
    const response = await api.get('/offered-programs/');
    return response.data.results || response.data;
  },

  async createOfferedProgram(data: Partial<OfferedProgram>): Promise<OfferedProgram> {
    const response = await api.post('/offered-programs/', data);
    return response.data;
  },
};

// Application Services
export const applicationService = {
  async getApplications(): Promise<Application[]> {
    const response = await api.get('/applications/');
    return response.data.results || response.data;
  },

  async getApplication(id: number): Promise<Application> {
    const response = await api.get(`/applications/${id}/`);
    return response.data;
  },

  async submitApplication(data: { program: number; academic_session: number }): Promise<Application> {
    const response = await api.post('/applications/', data);
    return response.data;
  },

  async updateApplicationStatus(id: number, data: { status_id: number; remarks?: string }): Promise<any> {
    const response = await api.post(`/applications/${id}/update_status/`, data);
    return response.data;
  },

  async getApplicationTracking(id: number): Promise<ApplicationTracking[]> {
    const response = await api.get(`/applications/${id}/tracking/`);
    return response.data.results || response.data;
  },

  async getApplicationStatistics(): Promise<any> {
    const response = await api.get('/applications/statistics/');
    return response.data.results || response.data;
  },

  async getApplicationStatuses(): Promise<ApplicationStatus[]> {
    const response = await api.get('/application-statuses/');
    return response.data.results || response.data;
  },
};

// Payment Services
export const paymentService = {
  async getPayments(): Promise<Payment[]> {
    const response = await api.get('/payments/');
    // Handle paginated response
    return response.data.results || response.data;
  },

  async getPayment(id: number): Promise<Payment> {
    const response = await api.get(`/payments/${id}/`);
    return response.data;
  },

  async createPayment(data: {
    application: number;
    payment_type: string;
    amount: string;
    payment_method: number;
    bank_reference?: string;
    receipt?: File;
  }): Promise<Payment> {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (value instanceof File) {
          formData.append(key, value);
        } else {
          formData.append(key, value.toString());
        }
      }
    });
    const response = await api.post('/payments/', formData);
    return response.data;
  },

  async verifyPayment(id: number): Promise<any> {
    const response = await api.post(`/payments/${id}/verify_payment/`);
    return response.data;
  },

  async getFeeStructures(): Promise<FeeStructure[]> {
    const response = await api.get('/fee-structures/');
    // Handle paginated response
    return response.data.results || response.data;
  },

  async createFeeStructure(data: Partial<FeeStructure>): Promise<FeeStructure> {
    const response = await api.post('/fee-structures/', data);
    return response.data;
  },

  async getPaymentMethods(): Promise<PaymentMethod[]> {
    const response = await api.get('/payment-methods/');
    return response.data.results || response.data;
  },
};

// Dashboard Services
export const dashboardService = {
  async getAnnouncements(): Promise<Announcement[]> {
    const response = await api.get('/announcements/');
    return response.data.results || response.data;
  },

  async getAnnouncement(id: number): Promise<Announcement> {
    const response = await api.get(`/announcements/${id}/`);
    return response.data;
  },

  async createAnnouncement(data: Partial<Announcement>): Promise<Announcement> {
    const response = await api.post('/announcements/', data);
    return response.data;
  },

  async updateAnnouncement(id: number, data: Partial<Announcement>): Promise<Announcement> {
    const response = await api.put(`/announcements/${id}/`, data);
    return response.data;
  },

  async deleteAnnouncement(id: number): Promise<void> {
    await api.delete(`/announcements/${id}/`);
  },

  async getAdmissionStats(): Promise<AdmissionStats[]> {
    const response = await api.get('/admission-stats/');
    return response.data.results || response.data;
  },
};

// Lookup Services
export const lookupService = {
  async getDegrees(): Promise<Degree[]> {
    const response = await api.get('/degrees/');
    return response.data.results || response.data;
  },

  async createDegree(data: Partial<Degree>): Promise<Degree> {
    const response = await api.post('/degrees/', data);
    return response.data;
  },

  async getInstitutes(): Promise<Institute[]> {
    const response = await api.get('/institutes/');
    return response.data.results || response.data;
  },

  async createInstitute(data: Partial<Institute>): Promise<Institute> {
    const response = await api.post('/institutes/', data);
    return response.data;
  },

  async getBloodGroups(): Promise<BloodGroup[]> {
    const response = await api.get('/blood-groups/');
    return response.data.results || response.data;
  },

  async getDiseases(): Promise<Disease[]> {
    const response = await api.get('/diseases/');
    return response.data.results || response.data;
  },

  async getRoles(): Promise<any[]> {
    const response = await api.get('/roles/');
    return response.data.results || response.data;
  },
};

// User Management Services
export const userManagementService = {
  async getUsers(): Promise<User[]> {
    const response = await api.get('/users/');
    // Handle paginated response
    return response.data.results || (Array.isArray(response.data) ? response.data : []);
  },

  async getUser(id: number): Promise<User> {
    const response = await api.get(`/users/${id}/`);
    return response.data;
  },

  async createUser(data: Partial<User>): Promise<User> {
    const response = await api.post('/users/', data);
    return response.data;
  },

  async updateUser(id: number, data: Partial<User>): Promise<User> {
    const response = await api.put(`/users/${id}/`, data);
    return response.data;
  },

  async deleteUser(id: number): Promise<void> {
    await api.delete(`/users/${id}/`);
  },

  async activateUser(id: number): Promise<any> {
    const response = await api.post(`/users/${id}/activate/`);
    return response.data;
  },

  async deactivateUser(id: number): Promise<any> {
    const response = await api.post(`/users/${id}/deactivate/`);
    return response.data;
  },

  async changeUserRole(id: number, roleId: number): Promise<any> {
    const response = await api.post(`/users/${id}/change_role/`, { role_id: roleId });
    return response.data;
  },
};