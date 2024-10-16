'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { applicationService } from '@/lib/services';
import toast from 'react-hot-toast';
import ProtectedRoute from '@/components/ui/ProtectedRoute';
import RoleGuard from '@/components/ui/RoleGuard';
import { Eye, CheckCircle, XCircle, Clock } from 'lucide-react';

function ReviewContent() {
  const [selectedApp, setSelectedApp] = useState<any>(null);
  const [statusUpdate, setStatusUpdate] = useState({ status_id: '', remarks: '' });
  const queryClient = useQueryClient();
  
  const { data: applications } = useQuery({
    queryKey: ['review-applications'],
    queryFn: applicationService.getApplications,
    select: (data: any) => data?.results || data || []
  });
  const { data: statuses } = useQuery({
    queryKey: ['application-statuses'],
    queryFn: applicationService.getApplicationStatuses,
    select: (data: any) => data?.results || data || []
  });
  
  const updateStatusMutation = useMutation<any, Error, { id: number; data: any }>({
    mutationFn: ({ id, data }: { id: number; data: any }) => applicationService.updateApplicationStatus(id, data),
    onSuccess: () => {
      toast.success('Application status updated!');
      queryClient.invalidateQueries({ queryKey: ['review-applications'] });
      setSelectedApp(null);
      setStatusUpdate({ status_id: '', remarks: '' });
    }
  });

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'approved': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'rejected': return <XCircle className="h-5 w-5 text-red-500" />;
      default: return <Clock className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Application Review</h1>
      
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          {Array.isArray(applications) && applications.map((app: any) => (
            <div key={app.id} className="card hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    {getStatusIcon(app.status?.name)}
                    <h3 className="font-medium">{app.program.name}</h3>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                    <div>
                      <p><strong>Student:</strong> {app.student.user.first_name} {app.student.user.last_name}</p>
                      <p><strong>Email:</strong> {app.student.user.email}</p>
                    </div>
                    <div>
                      <p><strong>ID:</strong> {app.tracking_id}</p>
                      <p><strong>Applied:</strong> {new Date(app.applied_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  
                  <div className="mt-3">
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(app.status?.name)}`}>
                      {app.status?.name || 'Pending'}
                    </span>
                  </div>
                </div>
                
                <button
                  onClick={() => setSelectedApp(app)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                >
                  <Eye className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="card">
          {selectedApp ? (
            <div className="space-y-4">
              <h3 className="font-medium">Review Application</h3>
              
              <div className="space-y-2 text-sm">
                <p><strong>Student:</strong> {selectedApp.student.user.first_name} {selectedApp.student.user.last_name}</p>
                <p><strong>Program:</strong> {selectedApp.program.name}</p>
                <p><strong>Session:</strong> {selectedApp.academic_session.session}</p>
                <p><strong>Status:</strong> {selectedApp.status?.name || 'Pending'}</p>
              </div>
              
              <div className="space-y-3">
                <select
                  value={statusUpdate.status_id}
                  onChange={(e) => setStatusUpdate({ ...statusUpdate, status_id: e.target.value })}
                  className="input-field"
                >
                  <option value="">Select Status</option>
                  {Array.isArray(statuses) && statuses.map((status: any) => (
                    <option key={status.id} value={status.id}>{status.name}</option>
                  ))}
                </select>
                
                <textarea
                  value={statusUpdate.remarks}
                  onChange={(e) => setStatusUpdate({ ...statusUpdate, remarks: e.target.value })}
                  className="input-field"
                  rows={3}
                  placeholder="Add remarks"
                />
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => updateStatusMutation.mutate({
                      id: selectedApp.id,
                      data: statusUpdate
                    } as any)}
                    disabled={!statusUpdate.status_id || updateStatusMutation.isPending}
                    className="btn-primary flex-1"
                  >
                    {updateStatusMutation.isPending ? 'Updating...' : 'Update'}
                  </button>
                  <button
                    onClick={() => setSelectedApp(null)}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-500 py-8">
              <Eye className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>Select an application to review</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ReviewPage() {
  return (
    <ProtectedRoute>
      <RoleGuard allowedRoles={['admin', 'admission_officer', 'reviewer']}>
        <ReviewContent />
      </RoleGuard>
    </ProtectedRoute>
  );
}