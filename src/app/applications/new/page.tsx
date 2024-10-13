'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { usePrograms, useAcademicSessions, useSubmitApplication } from '@/hooks/useApi';
import ProtectedRoute from '@/components/ui/ProtectedRoute';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { useForm } from 'react-hook-form';

type ApplicationFormData = {
  program: number;
  academic_session: number;
};

export default function NewApplicationPage() {
  return (
    <ProtectedRoute>
      <NewApplicationContent />
    </ProtectedRoute>
  );
}

function NewApplicationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const programId = searchParams.get('programId');
  
  const { data: programs, isLoading: programsLoading } = usePrograms();
  const { data: sessions, isLoading: sessionsLoading } = useAcademicSessions();
  const submitMutation = useSubmitApplication();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ApplicationFormData>();

  useEffect(() => {
    if (programId && !isNaN(Number(programId))) {
      setValue('program', Number(programId));
    }
  }, [programId, setValue]);

  const onSubmit = async (data: ApplicationFormData) => {
    try {
      await submitMutation.mutateAsync(data);
      router.push('/applications');
    } catch (error) {
      console.error('Error submitting application:', error);
    }
  };

  const isLoading = programsLoading || sessionsLoading;

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
        <h1 className="text-2xl font-semibold text-gray-900">New Application</h1>
        <p className="mt-1 text-sm text-gray-500">
          Submit an application for admission
        </p>

        <div className="mt-6">
          <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
            <div className="md:grid md:grid-cols-3 md:gap-6">
              <div className="md:col-span-1">
                <h3 className="text-lg font-medium leading-6 text-gray-900">Application Details</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Select the program and academic session you want to apply for.
                </p>
              </div>
              <div className="mt-5 md:mt-0 md:col-span-2">
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="grid grid-cols-6 gap-6">
                    <div className="col-span-6 sm:col-span-3">
                      <label htmlFor="program" className="block text-sm font-medium text-gray-700">
                        Program
                      </label>
                      <select
                        id="program"
                        className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        {...register('program', { required: 'Program is required' })}
                      >
                        <option value="">Select a program</option>
                        {programs?.map((program) => (
                          <option key={program.id} value={program.id}>
                            {program.name}
                          </option>
                        ))}
                      </select>
                      {errors.program && (
                        <p className="mt-1 text-sm text-red-600">{errors.program.message}</p>
                      )}
                    </div>

                    <div className="col-span-6 sm:col-span-3">
                      <label htmlFor="academic_session" className="block text-sm font-medium text-gray-700">
                        Academic Session
                      </label>
                      <select
                        id="academic_session"
                        className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        {...register('academic_session', { required: 'Academic session is required' })}
                      >
                        <option value="">Select a session</option>
                        {sessions?.map((session) => (
                          <option key={session.id} value={session.id}>
                            {session.session} {session.is_current ? '(Current)' : ''}
                          </option>
                        ))}
                      </select>
                      {errors.academic_session && (
                        <p className="mt-1 text-sm text-red-600">{errors.academic_session.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end">
                    <button
                      type="button"
                      onClick={() => router.back()}
                      className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitMutation.isPending}
                      className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      {submitMutation.isPending ? <LoadingSpinner size="small" /> : 'Submit Application'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
