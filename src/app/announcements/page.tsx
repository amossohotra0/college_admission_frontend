'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient } from '@/hooks/useApi';
import { api } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import toast from 'react-hot-toast';
import ProtectedRoute from '@/components/ui/ProtectedRoute';
import { Plus, Megaphone } from 'lucide-react';

function AnnouncementsContent() {
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);
  // queryClient is imported from useApi
  
  const { data: announcements } = useQuery({queryKey: ['announcements'], queryFn: async () => {
    const response = await api.get('/announcements/');
    return response.data.results || response.data;
  }, select: (data) => Array.isArray(data) ? data : []});
  
  const { register, handleSubmit, reset } = useForm();
  
  const createMutation = useMutation({
    mutationFn: (data: any) => api.post('/announcements/', data),
    onSuccess: () => {
      toast.success('Announcement created!');
      queryClient.invalidateQueries({ queryKey: ['announcements'] });
      reset();
      setShowForm(false);
    }
  });

  const canCreate = ['admin', 'admission_officer'].includes(user?.role?.role || '');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Announcements</h1>
        {canCreate && (
          <button onClick={() => setShowForm(!showForm)} className="btn-primary">
            <Plus className="h-4 w-4 mr-2" />
            New Announcement
          </button>
        )}
      </div>

      {showForm && (
        <div className="card">
          <h3 className="font-medium mb-4">Create Announcement</h3>
          <form onSubmit={handleSubmit((data) => createMutation.mutate(data))} className="space-y-4">
            <input
              {...register('title', { required: true })}
              className="input-field"
              placeholder="Announcement title"
            />
            <textarea
              {...register('content', { required: true })}
              className="input-field"
              rows={4}
              placeholder="Announcement content"
            />
            <div className="flex space-x-2">
              <button type="submit" disabled={createMutation.isPending} className="btn-primary">
                {createMutation.isPending ? 'Creating...' : 'Create'}
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-4">
        {Array.isArray(announcements) && announcements.map((announcement: any) => (
          <div key={announcement.id} className="card">
            <div className="flex items-start space-x-3">
              <Megaphone className="h-6 w-6 text-blue-600 mt-1" />
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">{announcement.title}</h3>
                <p className="text-gray-700 mt-2">{announcement.content}</p>
                <div className="flex items-center space-x-4 mt-3 text-sm text-gray-500">
                  <span>By: {announcement.created_by?.first_name} {announcement.created_by?.last_name}</span>
                  <span>{new Date(announcement.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AnnouncementsPage() {
  return (
    <ProtectedRoute>
      <AnnouncementsContent />
    </ProtectedRoute>
  );
}