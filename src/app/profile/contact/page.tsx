'use client';

import { useForm } from 'react-hook-form';
import { useQuery, useMutation, UseMutationResult } from '@tanstack/react-query';
import { studentService } from '@/lib/services';
import { ContactInformation } from '@/types';
import toast from 'react-hot-toast';
import { queryClient } from '@/hooks/useApi';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ProfileBreadcrumb from '@/components/ui/ProfileBreadcrumb';

export default function ContactInfoPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['contact-info'],
    queryFn: studentService.getContactInfo,
    retry: false
  });
  
  const { register, handleSubmit, formState: { errors } } = useForm<ContactInformation>({
    defaultValues: data
  });

  const mutation = useMutation<ContactInformation, Error, ContactInformation>({
    mutationFn: (formData: ContactInformation) => 
      data ? studentService.updateContactInfo(formData) : studentService.createContactInfo(formData),
    onSuccess: () => {
      toast.success('Contact information saved!');
      queryClient.invalidateQueries({ queryKey: ['contact-info'] });
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
          { label: 'Contact Information', current: true }
        ]} />
        <h1 className="text-2xl font-semibold text-gray-900">Contact Information</h1>
        <p className="mt-1 text-sm text-gray-500">
          Provide your contact details for communication purposes
        </p>

        <div className="mt-6 bg-white shadow overflow-hidden sm:rounded-lg p-6">
          <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label htmlFor="district" className="block text-sm font-medium text-gray-700 mb-1">District</label>
                <input
                  id="district"
                  {...register('district', { required: 'District required' })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
                {errors.district && <p className="text-red-600 text-sm mt-1">{errors.district.message}</p>}
              </div>

              <div>
                <label htmlFor="tehsil" className="block text-sm font-medium text-gray-700 mb-1">Tehsil</label>
                <input
                  id="tehsil"
                  {...register('tehsil', { required: 'Tehsil required' })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
                {errors.tehsil && <p className="text-red-600 text-sm mt-1">{errors.tehsil.message}</p>}
              </div>

              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <input
                  id="city"
                  {...register('city', { required: 'City required' })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
                {errors.city && <p className="text-red-600 text-sm mt-1">{errors.city.message}</p>}
              </div>
            </div>

            <div>
              <label htmlFor="permanent_address" className="block text-sm font-medium text-gray-700 mb-1">Permanent Address</label>
              <textarea
                id="permanent_address"
                {...register('permanent_address', { required: 'Permanent address required' })}
                rows={3}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
              {errors.permanent_address && <p className="text-red-600 text-sm mt-1">{errors.permanent_address.message}</p>}
            </div>

            <div>
              <label htmlFor="current_address" className="block text-sm font-medium text-gray-700 mb-1">Current Address</label>
              <textarea
                id="current_address"
                {...register('current_address', { required: 'Current address required' })}
                rows={3}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
              {errors.current_address && <p className="text-red-600 text-sm mt-1">{errors.current_address.message}</p>}
            </div>

            <div>
              <label htmlFor="postal_address" className="block text-sm font-medium text-gray-700 mb-1">Postal Address</label>
              <textarea
                id="postal_address"
                {...register('postal_address', { required: 'Postal address required' })}
                rows={3}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
              {errors.postal_address && <p className="text-red-600 text-sm mt-1">{errors.postal_address.message}</p>}
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