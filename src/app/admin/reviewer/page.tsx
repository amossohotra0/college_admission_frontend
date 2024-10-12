'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  useApplications, 
  useApplicationStatuses,
  useUpdateApplicationStatus
} from '@/hooks/useApi';
import ProtectedRoute from '@/components/ui/ProtectedRoute';
import RoleGuard from '@/components/ui/RoleGuard';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import StatusBadge from '@/components/ui/StatusBadge';
import { 
  FileText, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Filter 
} from 'lucide-react';

export default function ReviewerDashboardPage() {
  const router = useRouter();
  const { data: applications, isLoading: applicationsLoading } = useApplications();
  const { data: applicationStatuses, isLoading: statusesLoading } = useApplicationStatuses();
  
  const [statusFilter, setStatusFilter] = useState('');
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<any>(null);
  const [reviewData, setReviewData] = useState({
    status_id: '' as string | number,
    remarks: '',
  });

  const updateApplicationStatus = useUpdateApplicationStatus();

  const isLoading = applicationsLoading || statusesLoading;

  const handleReviewApplication = (application: any) => {
    setSelectedApplication(application);
    setReviewData({
      status_id: application.status.id,
      remarks: '',
    });
    setIsReviewModalOpen(true);
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateApplicationStatus.mutate({
      id: selectedApplication.id,
      data: {
        status_id: typeof reviewData.status_id === 'string' ? parseInt(reviewData.status_id) : reviewData.status_id,
        remarks: reviewData.remarks
      }
    });
    setIsReviewModalOpen(false);
  };

  const filteredApplications = statusFilter && Array.isArray(applications)
    ? applications.filter(app => app.status.code === statusFilter)
    : applications;

  return (
    <ProtectedRoute>
      <RoleGuard allowedRoles={['admin', 'admission_officer', 'reviewer']}>
        <div className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-2xl font-semibold text-gray-900">Application Reviewer Dashboard</h1>
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
            {isLoading ? (
              <div className="py-12 flex justify-center">
                <LoadingSpinner size="large" />
              </div>
            ) : (
              <>
                {/* Status Filters */}
                <div className="mt-8">
                  <div className="bg-white shadow rounded-lg p-4">
                    <div className="flex items-center">
                      <Filter className="h-5 w-5 text-gray-400 mr-2" />
                      <h3 className="text-lg leading-6 font-medium text-gray-900 mr-4">Filter by Status:</h3>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setStatusFilter('')}
                          className={`px-3 py-1 rounded-md text-sm font-medium ${
                            statusFilter === '' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          All
                        </button>
                        <button
                          onClick={() => setStatusFilter('submitted')}
                          className={`px-3 py-1 rounded-md text-sm font-medium ${
                            statusFilter === 'submitted' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          Submitted
                        </button>
                        <button
                          onClick={() => setStatusFilter('under_review')}
                          className={`px-3 py-1 rounded-md text-sm font-medium ${
                            statusFilter === 'under_review' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          Under Review
                        </button>
                        <button
                          onClick={() => setStatusFilter('approved')}
                          className={`px-3 py-1 rounded-md text-sm font-medium ${
                            statusFilter === 'approved' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          Approved
                        </button>
                        <button
                          onClick={() => setStatusFilter('rejected')}
                          className={`px-3 py-1 rounded-md text-sm font-medium ${
                            statusFilter === 'rejected' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          Rejected
                        </button>
                        <button
                          onClick={() => setStatusFilter('waitlisted')}
                          className={`px-3 py-1 rounded-md text-sm font-medium ${
                            statusFilter === 'waitlisted' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          Waitlisted
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Applications List */}
                <div className="mt-8">
                  <div className="bg-white shadow rounded-lg">
                    <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">Applications to Review</h3>
                      <span className="text-sm text-gray-500">
                        {filteredApplications?.length || 0} applications
                      </span>
                    </div>
                    <div className="border-t border-gray-200">
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                ID
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Student
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Program
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Submitted
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {Array.isArray(filteredApplications) && filteredApplications.map((application: any) => (
                              <tr key={application.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm text-gray-900">{application.tracking_id}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm font-medium text-gray-900">
                                    {application.student.user.first_name} {application.student.user.last_name}
                                  </div>
                                  <div className="text-sm text-gray-500">{application.student.user.email}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm text-gray-900">{application.program.name}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm text-gray-900">
                                    {new Date(application.applied_at).toLocaleDateString()}
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <StatusBadge status={application.status.code} />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                  <div className="flex space-x-2">
                                    <button
                                      onClick={() => router.push(`/applications/${application.id}`)}
                                      className="text-blue-600 hover:text-blue-900"
                                    >
                                      View
                                    </button>
                                    <button
                                      onClick={() => handleReviewApplication(application)}
                                      className="text-green-600 hover:text-green-900"
                                    >
                                      Review
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-3">
                  <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <Clock className="h-6 w-6 text-yellow-400" />
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate">Pending Review</dt>
                            <dd>
                              <div className="text-lg font-medium text-gray-900">
                                {Array.isArray(applications) ? applications.filter(app => app.status.code === 'submitted').length : 0}
                              </div>
                            </dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <CheckCircle className="h-6 w-6 text-green-400" />
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate">Approved</dt>
                            <dd>
                              <div className="text-lg font-medium text-gray-900">
                                {Array.isArray(applications) ? applications.filter(app => app.status.code === 'approved').length : 0}
                              </div>
                            </dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <XCircle className="h-6 w-6 text-red-400" />
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate">Rejected</dt>
                            <dd>
                              <div className="text-lg font-medium text-gray-900">
                                {Array.isArray(applications) ? applications.filter(app => app.status.code === 'rejected').length : 0}
                              </div>
                            </dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Review Modal */}
        {isReviewModalOpen && selectedApplication && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Review Application: {selectedApplication.tracking_id}
              </h3>
              <form onSubmit={handleReviewSubmit}>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                      Status
                    </label>
                    <select
                      id="status"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={reviewData.status_id}
                      onChange={(e) => setReviewData({ ...reviewData, status_id: parseInt(e.target.value) })}
                      required
                    >
                      {Array.isArray(applicationStatuses) && applicationStatuses.map((status: any) => (
                        <option key={status.id} value={status.id}>
                          {status.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="remarks" className="block text-sm font-medium text-gray-700">
                      Remarks
                    </label>
                    <textarea
                      id="remarks"
                      rows={4}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={reviewData.remarks}
                      onChange={(e) => setReviewData({ ...reviewData, remarks: e.target.value })}
                      placeholder="Add your review comments here..."
                    />
                  </div>
                </div>
                <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:col-start-2 sm:text-sm"
                  >
                    Submit Review
                  </button>
                  <button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                    onClick={() => setIsReviewModalOpen(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </RoleGuard>
    </ProtectedRoute>
  );
}