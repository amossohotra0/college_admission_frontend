'use client';

import { useForm } from 'react-hook-form';
import { useQuery, useMutation, UseMutationResult } from '@tanstack/react-query';
import { studentService } from '@/lib/services';
import { PersonalInformation } from '@/types';
import toast from 'react-hot-toast';
import FileUpload from '@/components/forms/FileUpload';
import { useState } from 'react';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ProfileBreadcrumb from '@/components/ui/ProfileBreadcrumb';
import { queryClient } from '@/hooks/useApi';

export default function PersonalInfoPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['personal-info'],
    queryFn: studentService.getPersonalInfo,
    retry: false
  });
  const [cnicFrontFile, setCnicFrontFile] = useState<File | null>(null);
  const [cnicBackFile, setCnicBackFile] = useState<File | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<PersonalInformation>({
    defaultValues: data
  });

  const mutation = useMutation<PersonalInformation, Error, PersonalInformation>({
    mutationFn: (personalData: PersonalInformation) => 
      data ? studentService.updatePersonalInfo(personalData) : studentService.createPersonalInfo(personalData),
    onSuccess: () => {
      toast.success('Personal information saved!');
      queryClient.invalidateQueries({ queryKey: ['personal-info'] });
    },
    onError: () => toast.error('Failed to save information')
  });

  const onSubmit = (formData: PersonalInformation) => {
    // Create a copy of the form data
    const personalData = { ...formData };
    
    // Only update the image fields if files are selected
    if (cnicFrontFile) {
      personalData.cnic_front_img = cnicFrontFile;
    } else if (!data?.cnic_front_img) {
      // If no file is selected and no existing file, use an empty string
      personalData.cnic_front_img = '' as unknown as File;
    }
    
    if (cnicBackFile) {
      personalData.cnic_back_img = cnicBackFile;
    } else if (!data?.cnic_back_img) {
      // If no file is selected and no existing file, use an empty string
      personalData.cnic_back_img = '' as unknown as File;
    }
    
    mutation.mutate(personalData);
  };

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
          { label: 'Personal Information', current: true }
        ]} />
        <h1 className="text-2xl font-semibold text-gray-900">Personal Information</h1>
        <p className="mt-1 text-sm text-gray-500">
          Provide your personal details for admission purposes
        </p>

        <div className="mt-6 bg-white shadow overflow-hidden sm:rounded-lg p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="father_name" className="block text-sm font-medium text-gray-700 mb-1">Father's Name</label>
                <input
                  id="father_name"
                  {...register('father_name', { required: 'Father name required' })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
                {errors.father_name && <p className="text-red-600 text-sm mt-1">{errors.father_name.message}</p>}
              </div>

              <div>
                <label htmlFor="cnic" className="block text-sm font-medium text-gray-700 mb-1">CNIC</label>
                <input
                  id="cnic"
                  {...register('cnic', { required: 'CNIC required' })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="12345-1234567-1"
                />
                {errors.cnic && <p className="text-red-600 text-sm mt-1">{errors.cnic.message}</p>}
              </div>

              <div>
                <label htmlFor="registered_contact" className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
                <input
                  id="registered_contact"
                  {...register('registered_contact', { required: 'Contact required' })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
                {errors.registered_contact && <p className="text-red-600 text-sm mt-1">{errors.registered_contact.message}</p>}
              </div>

              <div>
                <label htmlFor="date_of_birth" className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                <input
                  id="date_of_birth"
                  {...register('date_of_birth', { required: 'Date of birth required' })}
                  type="date"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
                {errors.date_of_birth && <p className="text-red-600 text-sm mt-1">{errors.date_of_birth.message}</p>}
              </div>

              <div>
                <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                <select 
                  id="gender"
                  {...register('gender', { required: 'Gender required' })} 
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
                {errors.gender && <p className="text-red-600 text-sm mt-1">{errors.gender.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div>
                <FileUpload 
                  label="CNIC Front Image"
                  onChange={setCnicFrontFile}
                  accept="image/*"
                  value={data?.cnic_front_img}
                  required
                />
              </div>

              <div>
                <FileUpload 
                  label="CNIC Back Image"
                  onChange={setCnicBackFile}
                  accept="image/*"
                  value={data?.cnic_back_img}
                  required
                />
              </div>
            </div>

            <div className="pt-5">
              <div className="flex justify-end">
                <button 
                  type="submit" 
                  disabled={mutation.isPending} 
                  className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
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