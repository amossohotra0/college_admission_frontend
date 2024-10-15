'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery, useMutation } from '@tanstack/react-query';
import { studentService, lookupService } from '@/lib/services';
import { EducationalBackground } from '@/types';
import toast from 'react-hot-toast';
import { Plus, Trash2, BookOpen, Eye, X, Edit } from 'lucide-react';
import FileUpload from '@/components/forms/FileUpload';
import { queryClient } from '@/hooks/useApi';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ProfileBreadcrumb from '@/components/ui/ProfileBreadcrumb';

export default function EducationPage() {
  const [showForm, setShowForm] = useState(false);
  const [certificateFile, setCertificateFile] = useState<File | null>(null);
  const [viewCertificate, setViewCertificate] = useState<string | null>(null);
  const [editRecord, setEditRecord] = useState<EducationalBackground | null>(null);

  const { data: education } = useQuery({
    queryKey: ['education'],
    queryFn: studentService.getEducationalBackground,
    select: (data: any) => data?.results || data || []
  });

  const { data: degrees } = useQuery({
    queryKey: ['degrees'],
    queryFn: lookupService.getDegrees,
    select: (data: any) => data?.results || data || []
  });

  const { data: institutes } = useQuery({
    queryKey: ['institutes'],
    queryFn: lookupService.getInstitutes,
    select: (data: any) => data?.results || data || []
  });

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<EducationalBackground>();
  
  // Set form values when editing a record
  useEffect(() => {
    if (editRecord) {
      setValue('institution', editRecord.institution);
      setValue('degree', editRecord.degree);
      setValue('passing_year', editRecord.passing_year);
      setValue('total_marks', editRecord.total_marks);
      setValue('obtained_marks', editRecord.obtained_marks);
      setValue('grade', editRecord.grade || '');
      setShowForm(true);
    }
  }, [editRecord, setValue]);

  const addMutation = useMutation<EducationalBackground, Error, EducationalBackground>({
    mutationFn: (data) => studentService.createEducationalRecord(data),
    onSuccess: () => {
      toast.success('Education record added!');
      queryClient.invalidateQueries({ queryKey: ['education'] });
      reset();
      setCertificateFile(null);
      setShowForm(false);
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to add education record');
    }
  });
  
  const updateMutation = useMutation<EducationalBackground, Error, {id: number, data: EducationalBackground}>({
    mutationFn: ({id, data}) => studentService.updateEducationalRecord(id, data),
    onSuccess: () => {
      toast.success('Education record updated!');
      queryClient.invalidateQueries({ queryKey: ['education'] });
      reset();
      setCertificateFile(null);
      setEditRecord(null);
      setShowForm(false);
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to update education record');
    }
  });

  const deleteMutation = useMutation<void, Error, number>({
    mutationFn: studentService.deleteEducationalRecord,
    onSuccess: () => {
      toast.success('Record deleted!');
      queryClient.invalidateQueries({ queryKey: ['education'] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to delete record');
    }
  });

  if (!education || !degrees || !institutes) {
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
            { label: 'Educational Background', current: true }
          ]} />
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Educational Background</h1>
              <p className="mt-1 text-sm text-gray-500">
                Add your educational qualifications and certificates
              </p>
            </div>
            <button
                onClick={() => setShowForm(!showForm)}
                className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Education
            </button>
          </div>

          {showForm && (
              <div className="bg-white shadow rounded-lg p-6 mt-6 mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editRecord ? 'Edit Educational Record' : 'Add Educational Record'}
              </h3>
                <form
                    onSubmit={handleSubmit((data) => {
                      const educationData = { ...data };
                      if (certificateFile) {
                        educationData.certificate = certificateFile;
                      } else if (!editRecord?.certificate && !certificateFile) {
                        // If no file is selected and no existing file, use an empty string
                        educationData.certificate = '' as unknown as File;
                      }
                      
                      if (editRecord) {
                        updateMutation.mutate({
                          id: editRecord.id as number,
                          data: educationData
                        });
                      } else {
                        addMutation.mutate(educationData);
                      }
                    })}
                    className="space-y-4"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <select {...register('institution', { required: 'Institution required' })} className="input-field">
                        <option value="">Select Institution</option>
                        {institutes.map((inst: any) => (
                            <option key={inst.id} value={inst.id}>{inst.name}</option>
                        ))}
                      </select>
                      {errors.institution && <p className="text-red-600 text-sm mt-1">{errors.institution.message}</p>}
                    </div>
                    <div>
                      <select {...register('degree', { required: 'Degree required' })} className="input-field">
                        <option value="">Select Degree</option>
                        {degrees.map((deg: any) => (
                            <option key={deg.id} value={deg.id}>{deg.name}</option>
                        ))}
                      </select>
                      {errors.degree && <p className="text-red-600 text-sm mt-1">{errors.degree.message}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <input
                          type="number"
                          placeholder="Passing Year"
                          {...register('passing_year', { required: 'Year required' })}
                          className="input-field"
                      />
                      {errors.passing_year && <p className="text-red-600 text-sm mt-1">{errors.passing_year.message}</p>}
                    </div>
                    <div>
                      <input
                          type="number"
                          placeholder="Total Marks"
                          {...register('total_marks', { required: 'Total marks required' })}
                          className="input-field"
                      />
                      {errors.total_marks && <p className="text-red-600 text-sm mt-1">{errors.total_marks.message}</p>}
                    </div>
                    <div>
                      <input
                          type="number"
                          placeholder="Obtained Marks"
                          {...register('obtained_marks', { required: 'Obtained marks required' })}
                          className="input-field"
                      />
                      {errors.obtained_marks && <p className="text-red-600 text-sm mt-1">{errors.obtained_marks.message}</p>}
                    </div>
                  </div>

                  <input {...register('grade')} className="input-field" placeholder="Grade (Optional)" />

                  <div>
                    <FileUpload
                        label="Certificate Image"
                        onChange={setCertificateFile}
                        accept="image/*"
                        value={editRecord?.certificate || null}
                        required={!editRecord?.certificate}
                    />
                    <p className="text-xs text-gray-500 mt-1">Upload certificate image (JPG, PNG, GIF, etc.)</p>
                  </div>

                  <div className="flex space-x-2">
                    <button 
                      type="submit" 
                      disabled={addMutation.isPending || updateMutation.isPending} 
                      className="btn-primary"
                    >
                      {editRecord
                        ? (updateMutation.isPending ? 'Updating...' : 'Update Record')
                        : (addMutation.isPending ? 'Adding...' : 'Add Record')
                      }
                    </button>
                    <button 
                      type="button" 
                      onClick={() => {
                        setShowForm(false);
                        setEditRecord(null);
                        reset();
                      }} 
                      className="btn-secondary"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
          )}

          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                <BookOpen className="h-5 w-5 mr-2 text-gray-500" />
                Educational Records
              </h3>
              <p className="mt-1 text-sm text-gray-500">Your academic qualifications and certificates</p>
            </div>
            {education.length === 0 ? (
                <div className="px-4 py-5 text-center text-gray-500">
                  No educational records added yet. Click "Add Education" to get started.
                </div>
            ) : (
                <ul className="divide-y divide-gray-200">
                  {education.map((record: any) => (
                      <li key={record.id} className="px-4 py-4 sm:px-6">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-sm font-medium text-blue-600">{record.degree_name || record.degree?.name}</h3>
                            <p className="text-sm text-gray-600">{record.institution_name || record.institution?.name}</p>
                            <p className="text-sm text-gray-500 mt-1">
                              {record.passing_year} • {record.obtained_marks}/{record.total_marks} ({record.percentage}%)
                            </p>
                          </div>
                          <div className="flex space-x-2">
                            {record.certificate && (
                                <button
                                    onClick={() => setViewCertificate(record.certificate)}
                                    className="text-blue-600 hover:text-blue-800 p-1 rounded-full hover:bg-blue-50"
                                    title="View Certificate"
                                    type="button"
                                >
                                  <Eye className="h-4 w-4" />
                                </button>
                            )}
                            <button
                                onClick={() => setEditRecord(record)}
                                className="text-green-600 hover:text-green-800 p-1 rounded-full hover:bg-green-50"
                                title="Edit record"
                                type="button"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                                onClick={() => deleteMutation.mutate(record.id)}
                                className="text-red-600 hover:text-red-800 p-1 rounded-full hover:bg-red-50"
                                title="Delete record"
                                type="button"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </li>
                  ))}
                </ul>
            )}
          </div>
        </div>

        {/* Certificate Image Modal */}
        {viewCertificate && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                <div className="p-4 border-b flex justify-between items-center">
                  <h3 className="text-lg font-medium">Certificate Image</h3>
                  <button
                      onClick={() => setViewCertificate(null)}
                      className="text-gray-500 hover:text-gray-700"
                      type="button"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <div className="flex-1 overflow-auto p-4 flex items-center justify-center bg-gray-100">
                  <img
                      src={viewCertificate}
                      alt="Certificate"
                      className="max-w-full max-h-[70vh] object-contain"
                  />
                </div>
              </div>
            </div>
        )}
      </div>
  );
}
