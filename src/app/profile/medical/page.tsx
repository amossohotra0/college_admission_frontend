'use client';

import { useForm } from 'react-hook-form';
import { useQuery, useMutation, UseMutationResult } from '@tanstack/react-query';
import { studentService, lookupService } from '@/lib/services';
import { MedicalInformation } from '@/types';
import toast from 'react-hot-toast';
import { queryClient } from '@/hooks/useApi';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ProfileBreadcrumb from '@/components/ui/ProfileBreadcrumb';

export default function MedicalInfoPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['medical-info'],
    queryFn: studentService.getMedicalInfo,
    retry: false
  });
  const { data: bloodGroups } = useQuery({
    queryKey: ['blood-groups'],
    queryFn: lookupService.getBloodGroups,
    select: (data: any) => data?.results || data || []
  });
  const { data: diseases } = useQuery({
    queryKey: ['diseases'],
    queryFn: lookupService.getDiseases,
    select: (data: any) => data?.results || data || []
  });
  
  const { register, handleSubmit, formState: { errors } } = useForm<MedicalInformation>({
    defaultValues: data
  });

  const mutation = useMutation<MedicalInformation, Error, MedicalInformation>({
    mutationFn: (formData: MedicalInformation) => 
      data ? studentService.updateMedicalInfo(formData) : studentService.createMedicalInfo(formData),
    onSuccess: () => {
      toast.success('Medical information saved!');
      queryClient.invalidateQueries({ queryKey: ['medical-info'] });
    },
    onError: () => toast.error('Failed to save information')
  });

  if (isLoading) {
    return (
      <div className="py-12 flex justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ProfileBreadcrumb items={[
          { label: 'Profile', href: '/profile' },
          { label: 'Medical Information', current: true }
        ]} />
        <h1 className="text-2xl font-semibold text-gray-900">Medical Information</h1>
        <p className="mt-1 text-sm text-gray-500">
          Provide your medical details for health and safety purposes
        </p>

        <div className="mt-6 bg-white shadow overflow-hidden sm:rounded-lg p-6">
          <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="blood_group" className="block text-sm font-medium text-gray-700 mb-1">Blood Group</label>
                <select 
                  id="blood_group"
                  {...register('blood_group')} 
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="">Select Blood Group</option>
                  {Array.isArray(bloodGroups) && bloodGroups.map((bg: any) => (
                    <option key={bg.id} value={bg.id}>{bg.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Disability Status</label>
                <div className="mt-2">
                  <label className="inline-flex items-center">
                    <input
                      {...register('is_disabled')}
                      type="checkbox"
                      className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 h-4 w-4"
                    />
                    <span className="ml-2 text-sm text-gray-700">I have a disability</span>
                  </label>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Medical Conditions</label>
              <p className="text-xs text-gray-500 mb-2">Select all that apply</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-60 overflow-y-auto border border-gray-300 rounded-md p-3 bg-gray-50">
                {Array.isArray(diseases) && diseases.map((disease: any) => (
                  <label key={disease.id} className="flex items-center space-x-2 hover:bg-gray-100 p-1 rounded">
                    <input
                      {...register('diseases')}
                      type="checkbox"
                      value={disease.id}
                      className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 h-4 w-4"
                    />
                    <span className="text-sm text-gray-700">{disease.name}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="pt-5">
              <div className="flex justify-end">
                <button 
                  type="submit" 
                  disabled={mutation.isPending} 
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  {mutation.isPending ? 'Saving...' : 'Save Information'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}