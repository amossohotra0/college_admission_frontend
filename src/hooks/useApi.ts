import { useQuery, useMutation, QueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import {
  authService,
  studentService,
  programService,
  applicationService,
  paymentService,
  dashboardService,
  lookupService,
  userManagementService,
} from '@/lib/services';
import { User } from '@/types';

// Create a client
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// Auth hooks
export const useUserProfile = () => {
  return useQuery({
    queryKey: ['userProfile'],
    queryFn: authService.getUserProfile,
  });
};

// Student Profile hooks
export const useStudentProfile = () => {
  return useQuery({
    queryKey: ['studentProfile'],
    queryFn: studentService.getMyProfile,
  });
};

export const usePersonalInfo = () => {
  return useQuery({
    queryKey: ['personalInfo'],
    queryFn: studentService.getPersonalInfo,
    retry: false,
  });
};

export const useContactInfo = () => {
  return useQuery({
    queryKey: ['contactInfo'],
    queryFn: studentService.getContactInfo,
    retry: false,
  });
};

export const useEducationalBackground = () => {
  return useQuery({
    queryKey: ['educationalBackground'],
    queryFn: studentService.getEducationalBackground,
  });
};

export const useMedicalInfo = () => {
  return useQuery({
    queryKey: ['medicalInfo'],
    queryFn: studentService.getMedicalInfo,
    retry: false,
  });
};

export const useRelatives = () => {
  return useQuery({
    queryKey: ['relatives'],
    queryFn: studentService.getRelatives,
  });
};

// Program hooks
export const usePrograms = () => {
  return useQuery({
    queryKey: ['programs'],
    queryFn: programService.getPrograms,
  });
};

export const useCourses = () => {
  return useQuery({
    queryKey: ['courses'],
    queryFn: programService.getCourses,
  });
};

export const useAcademicSessions = () => {
  return useQuery({
    queryKey: ['academicSessions'],
    queryFn: programService.getAcademicSessions,
  });
};

export const useOfferedPrograms = () => {
  return useQuery({
    queryKey: ['offeredPrograms'],
    queryFn: programService.getOfferedPrograms,
  });
};

// Application hooks
export const useApplications = () => {
  return useQuery({
    queryKey: ['applications'],
    queryFn: applicationService.getApplications,
  });
};

export const useApplication = (id: number) => {
  return useQuery({
    queryKey: ['application', id],
    queryFn: () => applicationService.getApplication(id),
    enabled: !!id,
  });
};

export const useApplicationTracking = (id: number) => {
  return useQuery({
    queryKey: ['applicationTracking', id],
    queryFn: () => applicationService.getApplicationTracking(id),
    enabled: !!id,
  });
};

export const useApplicationStatuses = () => {
  return useQuery({
    queryKey: ['applicationStatuses'],
    queryFn: applicationService.getApplicationStatuses,
  });
};

// Payment hooks
export const usePayments = () => {
  return useQuery({
    queryKey: ['payments'],
    queryFn: paymentService.getPayments,
  });
};

export const usePaymentMethods = () => {
  return useQuery({
    queryKey: ['paymentMethods'],
    queryFn: paymentService.getPaymentMethods,
  });
};

export const useFeeStructures = () => {
  return useQuery({
    queryKey: ['feeStructures'],
    queryFn: paymentService.getFeeStructures,
  });
};

// Dashboard hooks
export const useAnnouncements = () => {
  return useQuery({
    queryKey: ['announcements'],
    queryFn: dashboardService.getAnnouncements,
  });
};

export const useAdmissionStats = () => {
  return useQuery({
    queryKey: ['admissionStats'],
    queryFn: dashboardService.getAdmissionStats,
  });
};

// Lookup hooks
export const useDegrees = () => {
  return useQuery({
    queryKey: ['degrees'],
    queryFn: lookupService.getDegrees,
  });
};

export const useInstitutes = () => {
  return useQuery({
    queryKey: ['institutes'],
    queryFn: lookupService.getInstitutes,
  });
};

export const useBloodGroups = () => {
  return useQuery({
    queryKey: ['bloodGroups'],
    queryFn: lookupService.getBloodGroups,
  });
};

export const useDiseases = () => {
  return useQuery({
    queryKey: ['diseases'],
    queryFn: lookupService.getDiseases,
  });
};

// Mutation hooks
export const useCreatePersonalInfo = () => {
  return useMutation({
    mutationFn: studentService.createPersonalInfo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['personalInfo'] });
      queryClient.invalidateQueries({ queryKey: ['studentProfile'] });
      toast.success('Personal information saved successfully');
    },
    onError: () => {
      toast.error('Failed to save personal information');
    },
  });
};

export const useUpdatePersonalInfo = () => {
  return useMutation({
    mutationFn: studentService.updatePersonalInfo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['personalInfo'] });
      queryClient.invalidateQueries({ queryKey: ['studentProfile'] });
      toast.success('Personal information updated successfully');
    },
    onError: () => {
      toast.error('Failed to update personal information');
    },
  });
};

export const useCreateContactInfo = () => {
  return useMutation({
    mutationFn: studentService.createContactInfo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contactInfo'] });
      queryClient.invalidateQueries({ queryKey: ['studentProfile'] });
      toast.success('Contact information saved successfully');
    },
    onError: () => {
      toast.error('Failed to save contact information');
    },
  });
};

export const useUpdateContactInfo = () => {
  return useMutation({
    mutationFn: studentService.updateContactInfo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contactInfo'] });
      queryClient.invalidateQueries({ queryKey: ['studentProfile'] });
      toast.success('Contact information updated successfully');
    },
    onError: () => {
      toast.error('Failed to update contact information');
    },
  });
};

export const useCreateEducationalRecord = () => {
  return useMutation({
    mutationFn: studentService.createEducationalRecord,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['educationalBackground'] });
      queryClient.invalidateQueries({ queryKey: ['studentProfile'] });
      toast.success('Educational record saved successfully');
    },
    onError: () => {
      toast.error('Failed to save educational record');
    },
  });
};

export const useCreateMedicalInfo = () => {
  return useMutation({
    mutationFn: studentService.createMedicalInfo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medicalInfo'] });
      queryClient.invalidateQueries({ queryKey: ['studentProfile'] });
      toast.success('Medical information saved successfully');
    },
    onError: () => {
      toast.error('Failed to save medical information');
    },
  });
};

export const useUpdateMedicalInfo = () => {
  return useMutation({
    mutationFn: studentService.updateMedicalInfo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medicalInfo'] });
      queryClient.invalidateQueries({ queryKey: ['studentProfile'] });
      toast.success('Medical information updated successfully');
    },
    onError: () => {
      toast.error('Failed to update medical information');
    },
  });
};

export const useSubmitApplication = () => {
  return useMutation({
    mutationFn: applicationService.submitApplication,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      toast.success('Application submitted successfully');
    },
    onError: () => {
      toast.error('Failed to submit application');
    },
  });
};

export const useUpdateApplicationStatus = () => {
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: { status_id: number; remarks?: string } }) => 
      applicationService.updateApplicationStatus(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      toast.success('Application status updated successfully');
    },
    onError: () => {
      toast.error('Failed to update application status');
    },
  });
};

export const useCreatePayment = () => {
  return useMutation({
    mutationFn: paymentService.createPayment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      toast.success('Payment submitted successfully');
    },
    onError: () => {
      toast.error('Failed to submit payment');
    },
  });
};

export const useVerifyPayment = () => {
  return useMutation({
    mutationFn: paymentService.verifyPayment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      toast.success('Payment verified successfully');
    },
    onError: () => {
      toast.error('Failed to verify payment');
    },
  });
};

export const useCreateAnnouncement = () => {
  return useMutation({
    mutationFn: dashboardService.createAnnouncement,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['announcements'] });
      toast.success('Announcement created successfully');
    },
    onError: () => {
      toast.error('Failed to create announcement');
    },
  });
};

// User Management Hooks
export const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: userManagementService.getUsers,
  });
};

export const useRoles = () => {
  return useQuery({
    queryKey: ['roles'],
    queryFn: lookupService.getRoles,
  });
};

export const useApplicationStatistics = () => {
  return useQuery({
    queryKey: ['applicationStatistics'],
    queryFn: applicationService.getApplicationStatistics,
  });
};

export const useUser = (id: number) => {
  return useQuery({
    queryKey: ['user', id],
    queryFn: () => userManagementService.getUser(id),
    enabled: !!id,
  });
};

export const useCreateUser = () => {
  return useMutation({
    mutationFn: userManagementService.createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('User created successfully');
    },
    onError: () => {
      toast.error('Failed to create user');
    },
  });
};

export const useUpdateUser = () => {
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<User> }) =>
      userManagementService.updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('User updated successfully');
    },
    onError: () => {
      toast.error('Failed to update user');
    },
  });
};

export const useDeleteUser = () => {
  return useMutation({
    mutationFn: userManagementService.deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('User deleted successfully');
    },
    onError: () => {
      toast.error('Failed to delete user');
    },
  });
};

export const useActivateUser = () => {
  return useMutation({
    mutationFn: userManagementService.activateUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('User activated successfully');
    },
    onError: () => {
      toast.error('Failed to activate user');
    },
  });
};

export const useDeactivateUser = () => {
  return useMutation({
    mutationFn: userManagementService.deactivateUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('User deactivated successfully');
    },
    onError: () => {
      toast.error('Failed to deactivate user');
    },
  });
};

export const useChangeUserRole = () => {
  return useMutation({
    mutationFn: ({ id, roleId }: { id: number; roleId: number }) =>
      userManagementService.changeUserRole(id, roleId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('User role changed successfully');
    },
    onError: () => {
      toast.error('Failed to change user role');
    },
  });
};