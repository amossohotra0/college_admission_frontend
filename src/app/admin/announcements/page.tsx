'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAnnouncements, useCreateAnnouncement } from '@/hooks/useApi';
import ProtectedRoute from '@/components/ui/ProtectedRoute';
import RoleGuard from '@/components/ui/RoleGuard';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { Plus, Megaphone, Trash } from 'lucide-react';
import { dashboardService } from '@/lib/services';
import { useMutation } from '@tanstack/react-query';
import { queryClient } from '@/hooks/useApi';
import toast from 'react-hot-toast';

export default function AdminAnnouncementsPage() {
  const [showForm, setShowForm] = useState(false);
  const { data: announcements, isLoading } = useAnnouncements();
  const { register, handleSubmit, reset } = useForm();
  
  const createAnnouncement = useCreateAnnouncement();
  
  const deleteAnnouncementMutation = useMutation({
    mutationFn: (id: number) => dashboardService.deleteAnnouncement(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['announcements'] });
      toast.success('Announcement deleted successfully');
    },
    onError: () => {
      toast.error('Failed to delete announcement');
    }
  });

  const handleDeleteAnnouncement = (id: number) => {
    if (confirm('Are you sure you want to delete this announcement?')) {
      deleteAnnouncementMutation.mutate(id);
    }
  };

  return (
    <ProtectedRoute>
      <RoleGuard allowedRoles={['admin', 'admission_officer']}>
        <div className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-2xl font-semibold text-gray-900">Announcements Management</h1>
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
            {isLoading ? (
              <div className="py-12 flex justify-center">
                <LoadingSpinner size="large" />
              </div>
            ) : (
              <>
                <div className="mt-8">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium text-gray-900">All Announcements</h3>
                    <button
                      onClick={() => setShowForm(!showForm)}
                      className="btn-primary flex items-center"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      New Announcement
                    </button>
                  </div>
                </div>

                {showForm && (
                  <div className="mt-6 bg-white shadow rounded-lg p-6">
                    <h3 className="font-medium mb-4">Create Announcement</h3>
                    <form onSubmit={handleSubmit((data) => {
                      createAnnouncement.mutate(data);
                      if (!createAnnouncement.isError) {
                        reset();
                        setShowForm(false);
                      }
                    })} className="space-y-4">
                      <input
                        {...register('title', { required: true })}
                        className="input-field w-full"
                        placeholder="Announcement title"
                      />
                      <textarea
                        {...register('content', { required: true })}
                        className="input-field w-full"
                        rows={4}
                        placeholder="Announcement content"
                      />
                      <div className="flex space-x-2">
                        <button type="submit" disabled={createAnnouncement.isPending} className="btn-primary">
                          {createAnnouncement.isPending ? 'Creating...' : 'Create'}
                        </button>
                        <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                <div className="mt-6 bg-white shadow rounded-lg">
                  <div className="overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Title
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Content
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Created By
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {Array.isArray(announcements) && announcements.length > 0 ? (
                          announcements.map((announcement: any) => (
                            <tr key={announcement.id}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <Megaphone className="h-5 w-5 text-blue-600 mr-2" />
                                  <div className="text-sm font-medium text-gray-900">{announcement.title}</div>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="text-sm text-gray-900 max-w-xs truncate">{announcement.content}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">
                                  {announcement.created_by?.first_name} {announcement.created_by?.last_name}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">
                                  {new Date(announcement.created_at).toLocaleDateString()}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button
                                  onClick={() => handleDeleteAnnouncement(announcement.id)}
                                  className="text-red-600 hover:text-red-900"
                                >
                                  <Trash className="h-5 w-5" />
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                              No announcements found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </RoleGuard>
    </ProtectedRoute>
  );
}