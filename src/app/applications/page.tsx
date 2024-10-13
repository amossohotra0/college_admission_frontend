'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApplications } from '@/hooks/useApi';
import ProtectedRoute from '@/components/ui/ProtectedRoute';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import StatusBadge from '@/components/ui/StatusBadge';
import { 
  FileText, 
  Search, 
  Filter, 
  PlusCircle, 
  Calendar, 
  ChevronRight,
  FileDown,
  Eye
} from 'lucide-react';
import { generateApplicationPDF } from '@/utils/pdfGenerator';
import ApplicationDetailModal from '@/components/applications/ApplicationDetailModal';

export default function ApplicationsPage() {
  const router = useRouter();
  const { data: applications, isLoading } = useApplications();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedApplication, setSelectedApplication] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filter applications based on search term and status
  const filteredApplications = Array.isArray(applications) 
    ? applications.filter((app: any) => {
        const matchesStatus = statusFilter === '' || app.status.code === statusFilter;
        const matchesSearch = searchTerm === '' || 
          app.tracking_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          app.program.name.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesStatus && matchesSearch;
      })
    : [];

  return (
    <ProtectedRoute>
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">My Applications</h1>
              <p className="mt-1 text-sm text-gray-500">
                View and track your admission applications
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <Link
                href="/programs"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition"
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                New Application
              </Link>
            </div>
          </div>

          <div className="mt-6">
            {isLoading ? (
              <div className="py-12 flex justify-center">
                <LoadingSpinner size="large" />
              </div>
            ) : (
              <>
                {/* Search and Filter */}
                <div className="bg-white shadow rounded-xl border border-gray-100 p-4 mb-6">
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
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
                    
                    <div className="w-full md:w-auto">
                      <div className="flex items-center">
                        <Filter className="h-5 w-5 text-gray-400 mr-2" />
                        <select
                          className="block w-full md:w-auto border-gray-300 rounded-md shadow-sm text-sm"
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
                    
                    {(searchTerm || statusFilter) && (
                      <button
                        onClick={() => {
                          setSearchTerm('');
                          setStatusFilter('');
                        }}
                        className="px-3 py-1 border border-gray-300 rounded-md text-xs font-medium text-gray-700 bg-white hover:bg-gray-50"
                      >
                        Clear Filters
                      </button>
                    )}
                  </div>
                </div>

                {/* Applications List */}
                {filteredApplications.length > 0 ? (
                  <div className="bg-white shadow rounded-xl border border-gray-100 overflow-hidden">
                    <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center">
                      <div className="flex items-center">
                        <FileText className="h-5 w-5 text-indigo-500 mr-2" />
                        <h3 className="text-lg font-semibold text-gray-900">Applications</h3>
                      </div>
                      <span className="text-sm text-gray-500">
                        {filteredApplications.length} applications
                      </span>
                    </div>
                    
                    <ul className="divide-y divide-gray-100">
                      {filteredApplications.map((application: any) => (
                        <li key={application.id} className="px-6 py-5 hover:bg-gray-50 transition">
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center">
                                <h4 className="text-base font-medium text-gray-900 truncate">
                                  {application.program.name}
                                </h4>
                                <StatusBadge status={application.status.code} className="ml-3" />
                              </div>
                              <div className="mt-1 flex items-center text-sm text-gray-500">
                                <span className="truncate mr-3">{application.tracking_id}</span>
                                <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                                <span>{new Date(application.applied_at).toLocaleDateString()}</span>
                              </div>
                              <div className="mt-1 text-sm text-gray-500">
                                Session: {application.session.session}
                              </div>
                            </div>
                            
                            <div className="mt-4 md:mt-0 flex items-center space-x-4">
                              <button
                                onClick={() => {
                                  setSelectedApplication(application);
                                  setIsModalOpen(true);
                                }}
                                className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-500"
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                View
                              </button>
                              
                              <button
                                onClick={() => generateApplicationPDF(application)}
                                className="inline-flex items-center text-sm font-medium text-green-600 hover:text-green-500"
                              >
                                <FileDown className="h-4 w-4 mr-1" />
                                Download
                              </button>
                              
                              <Link
                                href={`/applications/${application.id}`}
                                className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-500"
                              >
                                Details
                                <ChevronRight className="h-4 w-4 ml-1" />
                              </Link>
                            </div>
                          </div>
                          
                          {/* Payment Status */}
                          <div className="mt-2">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              application.payment_status === 'paid' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-amber-100 text-amber-800'
                            }`}>
                              Payment: {application.payment_status.toUpperCase()}
                            </span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <div className="bg-white shadow rounded-xl border border-gray-100 p-12 text-center">
                    <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No applications found</h3>
                    <p className="text-gray-500 mb-6">
                      {searchTerm || statusFilter 
                        ? 'Try changing your search or filter criteria' 
                        : 'Start by applying to a program'}
                    </p>
                    <Link
                      href="/programs"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition"
                    >
                      Browse Programs
                    </Link>
                  </div>
                )}
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
      </div>
    </ProtectedRoute>
  );
}