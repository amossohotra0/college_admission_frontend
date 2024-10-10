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
import ApplicationDetailModal from '@/components/applications/ApplicationDetailModal';
import { 
  FileText, 
  Filter,
  Search,
  Download,
  FileDown,
  Eye
} from 'lucide-react';
import { generateApplicationPDF } from '@/utils/pdfGenerator';

export default function ApplicationsPage() {
  const router = useRouter();
  const { data: applications, isLoading: applicationsLoading } = useApplications();
  const { data: applicationStatuses, isLoading: statusesLoading } = useApplicationStatuses();
  
  const [statusFilter, setStatusFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedApplication, setSelectedApplication] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const updateApplicationStatus = useUpdateApplicationStatus();

  const isLoading = applicationsLoading || statusesLoading;

  const handleStatusChange = (applicationId: number, statusId: number) => {
    updateApplicationStatus.mutate({
      id: applicationId,
      data: { 
        status_id: statusId 
      }
    });
  };

  // Filter applications based on status and search term
  const filteredApplications = Array.isArray(applications) ? applications.filter((app: any) => {
    const matchesStatus = statusFilter === '' || app.status.code === statusFilter;
    
    const matchesSearch = searchTerm === '' || 
      app.tracking_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.student.user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.student.user.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.student.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.program.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesStatus && matchesSearch;
  }) : [];

  return (
    <ProtectedRoute>
      <RoleGuard allowedRoles={['admin', 'admission_officer']}>
        <div className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-2xl font-semibold text-gray-900">Applications Management</h1>
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
            {isLoading ? (
              <div className="py-12 flex justify-center">
                <LoadingSpinner size="large" />
              </div>
            ) : (
              <>
                {/* Search and Filter */}
                <div className="mt-8">
                  <div className="bg-white shadow rounded-lg p-4">
                    <div className="flex flex-wrap items-center gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="relative rounded-md shadow-sm">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            type="text"
                            className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                            placeholder="Search applications..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                          />
                        </div>
                      </div>
                      
                      <div className="w-full sm:w-auto">
                        <div className="flex items-center">
                          <Filter className="h-5 w-5 text-gray-400 mr-2" />
                          <select
                            className="block w-full sm:w-auto border-gray-300 rounded-md shadow-sm text-sm"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                          >
                            <option value="">All Statuses</option>
                            <option value="submitted">Submitted</option>
                            <option value="under_review">Under Review</option>
                            <option value="approved">Approved</option>
                            <option value="rejected">Rejected</option>
                            <option value="waitlisted">Waitlisted</option>
                          </select>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => setStatusFilter('')}
                        className="px-3 py-1 border border-gray-300 rounded-md text-xs font-medium text-gray-700 bg-white hover:bg-gray-50"
                      >
                        Clear Filters
                      </button>
                    </div>
                  </div>
                </div>

                {/* Applications List */}
                <div className="mt-8">
                  <div className="bg-white shadow rounded-lg">
                    <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">Applications</h3>
                      <span className="text-sm text-gray-500">
                        {filteredApplications.length} applications
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
                            {filteredApplications.map((application: any) => (
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
                                  <div className="flex space-x-2">
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
                                      onClick={() => {
                                        // First set the selected application, then open the modal
                                        console.log('Opening modal for application:', application.tracking_id);
                                        setSelectedApplication(application);
                                        setIsModalOpen(true);
                                      }}
                                      className="text-blue-600 hover:text-blue-900 flex items-center"
                                      title="View Details"
                                    >
                                      <Eye className="h-4 w-4 mr-1" />
                                      View
                                    </button>
                                    <button
                                      onClick={() => generateApplicationPDF(application)}
                                      className="text-green-600 hover:text-green-900 flex items-center"
                                      title="Generate PDF"
                                    >
                                      <FileDown className="h-4 w-4" />
                                    </button>
                                    {application.application_pdf && (
                                      <a
                                        href={application.application_pdf}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-green-600 hover:text-green-900"
                                        title="Download PDF"
                                      >
                                        <Download className="h-4 w-4" />
                                      </a>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            ))}
                            {filteredApplications.length === 0 && (
                              <tr>
                                <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                                  No applications found
                                </td>
                              </tr>
                            )}
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
        
        {/* Application Detail Modal */}
        <ApplicationDetailModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          application={selectedApplication}
        />
      </RoleGuard>
    </ProtectedRoute>
  );
}