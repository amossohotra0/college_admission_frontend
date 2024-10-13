'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApplication, useApplicationTracking } from '@/hooks/useApi';
import ProtectedRoute from '@/components/ui/ProtectedRoute';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import StatusBadge from '@/components/ui/StatusBadge';
import { FileDown, ArrowLeft, FileText } from 'lucide-react';
import { generateApplicationPDF } from '@/utils/pdfGenerator';
import Image from 'next/image';

export default function ApplicationDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const applicationId = parseInt(params.id);
  
  const { data: application, isLoading: applicationLoading } = useApplication(applicationId);
  const { data: tracking, isLoading: trackingLoading } = useApplicationTracking(applicationId);
  
  const [activeTab, setActiveTab] = useState('details'); // 'details', 'education', 'documents', 'tracking'
  
  const isLoading = applicationLoading || trackingLoading;

  if (isLoading) {
    return (
      <div className="py-12 flex justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (!application) {
    return (
      <div className="py-12 flex justify-center">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900">Application not found</h3>
          <p className="mt-1 text-sm text-gray-500">The application you're looking for doesn't exist or you don't have permission to view it.</p>
          <button
            onClick={() => router.back()}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const student = application.student;
  const user = student.user;
  const personalInfo = student.personal_info;
  const contactInfo = student.contact_info;
  const educationalRecords = student.educational_records || [];
  const medicalInfo = student.medical_info;

  return (
    <ProtectedRoute>
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => router.back()}
                className="mr-4 text-gray-500 hover:text-gray-700"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <h1 className="text-2xl font-semibold text-gray-900">Application Details</h1>
            </div>
            <button
              onClick={() => generateApplicationPDF(application)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
            >
              <FileDown className="h-4 w-4 mr-2" />
              Generate PDF
            </button>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mt-6">
          {/* Application Header */}
          <div className="bg-white shadow rounded-lg p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <h3 className="text-xs font-medium text-gray-500">Application ID</h3>
                <p className="mt-1 text-sm font-medium text-gray-900">{application.tracking_id}</p>
              </div>
              <div>
                <h3 className="text-xs font-medium text-gray-500">Form Number</h3>
                <p className="mt-1 text-sm font-medium text-gray-900">{application.application_form_no}</p>
              </div>
              <div>
                <h3 className="text-xs font-medium text-gray-500">Applied On</h3>
                <p className="mt-1 text-sm font-medium text-gray-900">{new Date(application.applied_at).toLocaleDateString()}</p>
              </div>
              <div>
                <h3 className="text-xs font-medium text-gray-500">Status</h3>
                <div className="mt-1">
                  <StatusBadge status={application.status.code} />
                </div>
              </div>
            </div>
          </div>
          
          {/* Tabs */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('details')}
                className={`${
                  activeTab === 'details'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Student Details
              </button>
              <button
                onClick={() => setActiveTab('education')}
                className={`${
                  activeTab === 'education'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Education
              </button>
              <button
                onClick={() => setActiveTab('documents')}
                className={`${
                  activeTab === 'documents'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Documents
              </button>
              <button
                onClick={() => setActiveTab('tracking')}
                className={`${
                  activeTab === 'tracking'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Tracking
              </button>
            </nav>
          </div>
          
          {/* Tab Content */}
          <div className="bg-white shadow rounded-lg p-6">
            {/* Student Details Tab */}
            {activeTab === 'details' && (
              <div className="space-y-8">
                {/* Program Details */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Program Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-xs font-medium text-gray-500">Program</h4>
                      <p className="mt-1 text-sm text-gray-900">{application.program.name} ({application.program.code})</p>
                    </div>
                    <div>
                      <h4 className="text-xs font-medium text-gray-500">Session</h4>
                      <p className="mt-1 text-sm text-gray-900">{application.session.session}</p>
                    </div>
                  </div>
                </div>
                
                {/* Basic Information */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-xs font-medium text-gray-500">Full Name</h4>
                      <p className="mt-1 text-sm text-gray-900">{user.first_name} {user.last_name}</p>
                    </div>
                    <div>
                      <h4 className="text-xs font-medium text-gray-500">Email</h4>
                      <p className="mt-1 text-sm text-gray-900">{user.email}</p>
                    </div>
                    <div>
                      <h4 className="text-xs font-medium text-gray-500">Phone</h4>
                      <p className="mt-1 text-sm text-gray-900">{user.phone || 'N/A'}</p>
                    </div>
                    <div>
                      <h4 className="text-xs font-medium text-gray-500">CNIC</h4>
                      <p className="mt-1 text-sm text-gray-900">{user.cnic || 'N/A'}</p>
                    </div>
                  </div>
                </div>
                
                {/* Personal Information */}
                {personalInfo && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-xs font-medium text-gray-500">Father's Name</h4>
                        <p className="mt-1 text-sm text-gray-900">{personalInfo.father_name}</p>
                      </div>
                      <div>
                        <h4 className="text-xs font-medium text-gray-500">CNIC</h4>
                        <p className="mt-1 text-sm text-gray-900">{personalInfo.cnic}</p>
                      </div>
                      <div>
                        <h4 className="text-xs font-medium text-gray-500">Contact</h4>
                        <p className="mt-1 text-sm text-gray-900">{personalInfo.registered_contact}</p>
                      </div>
                      <div>
                        <h4 className="text-xs font-medium text-gray-500">Date of Birth</h4>
                        <p className="mt-1 text-sm text-gray-900">{personalInfo.date_of_birth}</p>
                      </div>
                      <div>
                        <h4 className="text-xs font-medium text-gray-500">Gender</h4>
                        <p className="mt-1 text-sm text-gray-900">{personalInfo.gender.charAt(0).toUpperCase() + personalInfo.gender.slice(1)}</p>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Contact Information */}
                {contactInfo && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-xs font-medium text-gray-500">District</h4>
                        <p className="mt-1 text-sm text-gray-900">{contactInfo.district}</p>
                      </div>
                      <div>
                        <h4 className="text-xs font-medium text-gray-500">Tehsil</h4>
                        <p className="mt-1 text-sm text-gray-900">{contactInfo.tehsil}</p>
                      </div>
                      <div>
                        <h4 className="text-xs font-medium text-gray-500">City</h4>
                        <p className="mt-1 text-sm text-gray-900">{contactInfo.city}</p>
                      </div>
                      <div className="col-span-2">
                        <h4 className="text-xs font-medium text-gray-500">Permanent Address</h4>
                        <p className="mt-1 text-sm text-gray-900">{contactInfo.permanent_address}</p>
                      </div>
                      <div className="col-span-2">
                        <h4 className="text-xs font-medium text-gray-500">Current Address</h4>
                        <p className="mt-1 text-sm text-gray-900">{contactInfo.current_address}</p>
                      </div>
                      <div className="col-span-2">
                        <h4 className="text-xs font-medium text-gray-500">Postal Address</h4>
                        <p className="mt-1 text-sm text-gray-900">{contactInfo.postal_address}</p>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Medical Information */}
                {medicalInfo && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Medical Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-xs font-medium text-gray-500">Blood Group</h4>
                        <p className="mt-1 text-sm text-gray-900">{medicalInfo.blood_group_name}</p>
                      </div>
                      <div>
                        <h4 className="text-xs font-medium text-gray-500">Disabled</h4>
                        <p className="mt-1 text-sm text-gray-900">{medicalInfo.is_disabled ? 'Yes' : 'No'}</p>
                      </div>
                      {medicalInfo.diseases_list && medicalInfo.diseases_list.length > 0 && (
                        <div className="col-span-2">
                          <h4 className="text-xs font-medium text-gray-500">Diseases</h4>
                          <ul className="mt-1 text-sm text-gray-900 list-disc list-inside">
                            {medicalInfo.diseases_list.map((disease: string, index: number) => (
                              <li key={index}>{disease}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {/* Education Tab */}
            {activeTab === 'education' && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Educational Records</h3>
                {educationalRecords.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Degree</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Institution</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Year</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Marks</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Percentage</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grade</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {educationalRecords.map((record: any) => (
                          <tr key={record.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.degree_name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.institution_name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.passing_year}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.obtained_marks}/{record.total_marks}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.percentage}%</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.grade || 'N/A'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No educational records found.</p>
                )}
              </div>
            )}
            
            {/* Documents Tab */}
            {activeTab === 'documents' && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Documents</h3>
                
                {/* CNIC Images */}
                {personalInfo && (
                  <div className="mb-8">
                    <h4 className="text-md font-medium text-gray-700 mb-2">CNIC</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h5 className="text-xs font-medium text-gray-500 mb-2">Front</h5>
                        {personalInfo.cnic_front_img ? (
                          <div className="border border-gray-200 rounded-lg overflow-hidden">
                            <img 
                              src={personalInfo.cnic_front_img as string} 
                              alt="CNIC Front" 
                              className="w-full h-auto"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.onerror = null;
                                target.src = '/placeholder-image.png';
                              }}
                            />
                          </div>
                        ) : (
                          <p className="text-sm text-gray-500">No image available</p>
                        )}
                      </div>
                      <div>
                        <h5 className="text-xs font-medium text-gray-500 mb-2">Back</h5>
                        {personalInfo.cnic_back_img ? (
                          <div className="border border-gray-200 rounded-lg overflow-hidden">
                            <img 
                              src={personalInfo.cnic_back_img as string} 
                              alt="CNIC Back" 
                              className="w-full h-auto"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.onerror = null;
                                target.src = '/placeholder-image.png';
                              }}
                            />
                          </div>
                        ) : (
                          <p className="text-sm text-gray-500">No image available</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Educational Certificates */}
                {educationalRecords.length > 0 && (
                  <div>
                    <h4 className="text-md font-medium text-gray-700 mb-2">Educational Certificates</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {educationalRecords.map((record: any) => (
                        <div key={record.id} className="border border-gray-200 rounded-lg p-4">
                          <h5 className="text-sm font-medium text-gray-900 mb-2">{record.degree_name}</h5>
                          {record.certificate ? (
                            <div className="border border-gray-200 rounded-lg overflow-hidden">
                              <img 
                                src={record.certificate as string} 
                                alt={`${record.degree_name} Certificate`} 
                                className="w-full h-auto"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.onerror = null;
                                  target.src = '/placeholder-image.png';
                                }}
                              />
                            </div>
                          ) : (
                            <p className="text-sm text-gray-500">No certificate available</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Application QR Code */}
                {application.application_qrcode && (
                  <div className="mt-8">
                    <h4 className="text-md font-medium text-gray-700 mb-2">Application QR Code</h4>
                    <div className="w-40 h-40 border border-gray-200 rounded-lg overflow-hidden">
                      <img 
                        src={application.application_qrcode as string} 
                        alt="Application QR Code" 
                        className="w-full h-auto"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.onerror = null;
                          target.src = '/placeholder-image.png';
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {/* Tracking Tab */}
            {activeTab === 'tracking' && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Application Tracking</h3>
                {Array.isArray(tracking) && tracking.length > 0 ? (
                  <div className="flow-root">
                    <ul className="-mb-8">
                      {tracking.map((event: any, eventIdx: number) => (
                        <li key={event.id}>
                          <div className="relative pb-8">
                            {eventIdx !== tracking.length - 1 ? (
                              <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true"></span>
                            ) : null}
                            <div className="relative flex space-x-3">
                              <div>
                                <span className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center ring-8 ring-white">
                                  <FileText className="h-5 w-5 text-white" aria-hidden="true" />
                                </span>
                              </div>
                              <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                                <div>
                                  <p className="text-sm text-gray-500">
                                    Status changed to <span className="font-medium text-gray-900">{event.status.name}</span>
                                    {event.remarks && <span> - {event.remarks}</span>}
                                  </p>
                                </div>
                                <div className="text-right text-sm whitespace-nowrap text-gray-500">
                                  <time dateTime={event.timestamp}>{new Date(event.timestamp).toLocaleString()}</time>
                                </div>
                              </div>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No tracking information available.</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}