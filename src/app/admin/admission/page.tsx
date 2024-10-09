'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  useApplications, 
  useApplicationStatistics, 
  useAdmissionStats,
  usePrograms,
  useAcademicSessions,
  useCreateAnnouncement,
  useUpdateApplicationStatus,
  useApplicationStatuses
} from '@/hooks/useApi';
import ProtectedRoute from '@/components/ui/ProtectedRoute';
import RoleGuard from '@/components/ui/RoleGuard';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import StatusBadge from '@/components/ui/StatusBadge';
import { 
  FileText, 
  BarChart3, 
  Bell, 
  BookOpen, 
  Calendar, 
  MessageSquare 
} from 'lucide-react';

export default function AdmissionOfficerDashboardPage() {
  const router = useRouter();
  const { data: applications, isLoading: applicationsLoading } = useApplications();
  const { data: applicationStats, isLoading: statsLoading } = useApplicationStatistics();
  const { data: admissionStats, isLoading: admissionStatsLoading } = useAdmissionStats();
  const { data: programs, isLoading: programsLoading } = usePrograms();
  const { data: academicSessions, isLoading: sessionsLoading } = useAcademicSessions();
  const { data: applicationStatuses, isLoading: statusesLoading } = useApplicationStatuses();
  
  const [isAnnouncementModalOpen, setIsAnnouncementModalOpen] = useState(false);
  const [announcementData, setAnnouncementData] = useState({
    title: '',
    content: '',
    target_roles: [] as number[],
    is_active: true,
  });

  const createAnnouncement = useCreateAnnouncement();
  const updateApplicationStatus = useUpdateApplicationStatus();

  const isLoading = 
    applicationsLoading || 
    statsLoading || 
    admissionStatsLoading || 
    programsLoading || 
    sessionsLoading ||
    statusesLoading;

  const handleCreateAnnouncement = () => {
    setIsAnnouncementModalOpen(true);
  };

  const handleAnnouncementSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createAnnouncement.mutate({
      ...announcementData,
      target_roles: announcementData.target_roles.map(id => ({ id, role: '' }))
    });
    setIsAnnouncementModalOpen(false);
  };

  const handleStatusChange = (applicationId: number, statusId: number) => {
    updateApplicationStatus.mutate({
      id: applicationId,
      data: { status_id: statusId }
    });
  };

  return (
    <ProtectedRoute>
      <RoleGuard allowedRoles={['admin', 'admission_officer']}>
        <div className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-2xl font-semibold text-gray-900">Admission Officer Dashboard</h1>
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
            {isLoading ? (
              <div className="py-12 flex justify-center">
                <LoadingSpinner size="large" />
              </div>
            ) : (
              <>
                {/* Stats Overview */}
                <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                  {Array.isArray(applicationStats) && applicationStats.map((stat: any, index: number) => (
                    <div key={index} className="bg-white overflow-hidden shadow rounded-lg">
                      <div className="p-5">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <BarChart3 className="h-6 w-6 text-gray-400" />
                          </div>
                          <div className="ml-5 w-0 flex-1">
                            <dl>
                              <dt className="text-sm font-medium text-gray-500 truncate">{stat.status__name}</dt>
                              <dd>
                                <div className="text-lg font-medium text-gray-900">{stat.count}</div>
                              </dd>
                            </dl>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Quick Actions */}
                <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                  <button
                    onClick={() => router.push('/admin/programs')}
                    className="bg-white overflow-hidden shadow rounded-lg hover:bg-gray-50"
                  >
                    <div className="p-5">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <BookOpen className="h-6 w-6 text-gray-400" />
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate">Programs</dt>
                            <dd>
                              <div className="text-lg font-medium text-gray-900">Manage Programs</div>
                            </dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => router.push('/admin/sessions')}
                    className="bg-white overflow-hidden shadow rounded-lg hover:bg-gray-50"
                  >
                    <div className="p-5">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <Calendar className="h-6 w-6 text-gray-400" />
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate">Sessions</dt>
                            <dd>
                              <div className="text-lg font-medium text-gray-900">Academic Sessions</div>
                            </dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => router.push('/admin/applications')}
                    className="bg-white overflow-hidden shadow rounded-lg hover:bg-gray-50"
                  >
                    <div className="p-5">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <FileText className="h-6 w-6 text-gray-400" />
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate">Applications</dt>
                            <dd>
                              <div className="text-lg font-medium text-gray-900">Review Applications</div>
                            </dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={handleCreateAnnouncement}
                    className="bg-white overflow-hidden shadow rounded-lg hover:bg-gray-50"
                  >
                    <div className="p-5">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <Bell className="h-6 w-6 text-gray-400" />
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate">Announcements</dt>
                            <dd>
                              <div className="text-lg font-medium text-gray-900">Create Announcement</div>
                            </dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                  </button>
                </div>

                {/* Recent Applications */}
                <div className="mt-8">
                  <div className="bg-white shadow rounded-lg">
                    <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Applications</h3>
                      <button
                        onClick={() => router.push('/admin/applications')}
                        className="text-sm font-medium text-blue-600 hover:text-blue-500"
                      >
                        View all
                      </button>
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
                                Session
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
                            {Array.isArray(applications) && applications.slice(0, 5).map((application: any) => (
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
                                  <div className="text-sm text-gray-900">{application.session.session}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <StatusBadge status={application.status.code} />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                  <select
                                    className="text-sm text-gray-900 border-gray-300 rounded-md"
                                    value={application.status.id}
                                    onChange={(e) => handleStatusChange(application.id, parseInt(e.target.value))}
                                  >
                                    {Array.isArray(applicationStatuses) && applicationStatuses.map((status: any) => (
                                      <option key={status.id} value={status.id}>
                                        {status.name}
                                      </option>
                                    ))}
                                  </select>
                                  <button
                                    onClick={() => router.push(`/applications/${application.id}`)}
                                    className="ml-2 text-blue-600 hover:text-blue-900"
                                  >
                                    View
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Program Overview */}
                <div className="mt-8">
                  <div className="bg-white shadow rounded-lg">
                    <div className="px-4 py-5 sm:px-6 flex items-center">
                      <BookOpen className="h-5 w-5 text-gray-400 mr-2" />
                      <h3 className="text-lg leading-6 font-medium text-gray-900">Program Overview</h3>
                    </div>
                    <div className="border-t border-gray-200">
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Code
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Name
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Applications
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {Array.isArray(programs) && programs.map((program: any) => (
                              <tr key={program.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm text-gray-900">{program.code}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm font-medium text-gray-900">{program.name}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm text-gray-900">
                                    {applications?.filter(app => app.program.id === program.id).length || 0}
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                  <button
                                    onClick={() => router.push(`/programs/${program.id}`)}
                                    className="text-blue-600 hover:text-blue-900"
                                  >
                                    View
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Announcement Modal */}
        {isAnnouncementModalOpen && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Create Announcement</h3>
              <form onSubmit={handleAnnouncementSubmit}>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                      Title
                    </label>
                    <input
                      type="text"
                      id="title"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={announcementData.title}
                      onChange={(e) => setAnnouncementData({ ...announcementData, title: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                      Content
                    </label>
                    <textarea
                      id="content"
                      rows={4}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={announcementData.content}
                      onChange={(e) => setAnnouncementData({ ...announcementData, content: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:col-start-2 sm:text-sm"
                  >
                    Create
                  </button>
                  <button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                    onClick={() => setIsAnnouncementModalOpen(false)}
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