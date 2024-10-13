'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  useUsers, 
  useApplicationStatistics, 
  useAdmissionStats,
  useApplications,
  usePayments,
  usePrograms,
  useAnnouncements
} from '@/hooks/useApi';
import ProtectedRoute from '@/components/ui/ProtectedRoute';
import RoleGuard from '@/components/ui/RoleGuard';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import StatusBadge from '@/components/ui/StatusBadge';
import { 
  Users, 
  BarChart3, 
  Settings, 
  CreditCard,
  BookOpen,
  Bell,
  FileText,
  PieChart,
  TrendingUp,
  Calendar,
  CheckCircle
} from 'lucide-react';

export default function AdminDashboardPage() {
  const router = useRouter();
  const { data: users, isLoading: usersLoading } = useUsers();
  const { data: applicationStats, isLoading: statsLoading } = useApplicationStatistics();
  const { data: admissionStats, isLoading: admissionStatsLoading } = useAdmissionStats();
  const { data: applications, isLoading: applicationsLoading } = useApplications();
  const { data: payments, isLoading: paymentsLoading } = usePayments();
  const { data: programs, isLoading: programsLoading } = usePrograms();
  const { data: announcements, isLoading: announcementsLoading } = useAnnouncements();

  const isLoading = usersLoading || statsLoading || admissionStatsLoading || 
                   applicationsLoading || paymentsLoading || programsLoading || 
                   announcementsLoading;

  // Calculate some statistics
  const totalUsers = Array.isArray(users) ? users.length : 0;
  const totalApplications = Array.isArray(applications) ? applications.length : 0;
  const totalPrograms = Array.isArray(programs) ? programs.length : 0;
  
  // Calculate revenue
  const totalRevenue = Array.isArray(payments) ? 
    payments.filter(p => p.status === 'paid')
           .reduce((sum, p) => sum + parseFloat(p.amount), 0) : 0;
  
  // Get recent applications
  const recentApplications = Array.isArray(applications) ? 
    [...applications].sort((a, b) => new Date(b.applied_at).getTime() - new Date(a.applied_at).getTime())
                    .slice(0, 5) : [];
  
  // Get recent payments
  const recentPayments = Array.isArray(payments) ? 
    [...payments].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                 .slice(0, 5) : [];
  
  // Get recent announcements
  const recentAnnouncements = Array.isArray(announcements) ? 
    [...announcements].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                      .slice(0, 3) : [];

  return (
    <ProtectedRoute>
      <RoleGuard allowedRoles={['admin']}>
        <div className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-2xl font-semibold text-gray-900">Admin Dashboard</h1>
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
            {isLoading ? (
              <div className="py-12 flex justify-center">
                <LoadingSpinner size="large" />
              </div>
            ) : (
              <>
                {/* Key Metrics */}
                <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <Users className="h-6 w-6 text-blue-400" />
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate">Total Users</dt>
                            <dd>
                              <div className="text-lg font-medium text-gray-900">{totalUsers}</div>
                            </dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-50 px-5 py-3">
                      <div className="text-sm">
                        <Link href="/admin/users" className="font-medium text-blue-700 hover:text-blue-900">
                          Manage Users
                        </Link>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <FileText className="h-6 w-6 text-green-400" />
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate">Applications</dt>
                            <dd>
                              <div className="text-lg font-medium text-gray-900">{totalApplications}</div>
                            </dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-50 px-5 py-3">
                      <div className="text-sm">
                        <Link href="/admin/applications" className="font-medium text-blue-700 hover:text-blue-900">
                          View Applications
                        </Link>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <CreditCard className="h-6 w-6 text-purple-400" />
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate">Total Revenue</dt>
                            <dd>
                              <div className="text-lg font-medium text-gray-900">PKR {totalRevenue.toLocaleString()}</div>
                            </dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-50 px-5 py-3">
                      <div className="text-sm">
                        <Link href="/admin/finance" className="font-medium text-blue-700 hover:text-blue-900">
                          View Finances
                        </Link>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <BookOpen className="h-6 w-6 text-yellow-400" />
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate">Programs</dt>
                            <dd>
                              <div className="text-lg font-medium text-gray-900">{totalPrograms}</div>
                            </dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-50 px-5 py-3">
                      <div className="text-sm">
                        <Link href="/admin/programs" className="font-medium text-blue-700 hover:text-blue-900">
                          Manage Programs
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Application Status */}
                <div className="mt-8">
                  <div className="bg-white shadow rounded-lg">
                    <div className="px-4 py-5 sm:px-6 flex items-center">
                      <BarChart3 className="h-5 w-5 text-gray-400 mr-2" />
                      <h3 className="text-lg leading-6 font-medium text-gray-900">Application Status</h3>
                    </div>
                    <div className="border-t border-gray-200 p-4">
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        {Array.isArray(applicationStats) && applicationStats.map((stat: any, index: number) => (
                          <div key={index} className="bg-gray-50 p-4 rounded-lg">
                            <div className="flex items-center justify-between">
                              <h4 className="text-sm font-medium text-gray-500">{stat.status__name}</h4>
                              <span className="text-lg font-semibold text-gray-900">{stat.count}</span>
                            </div>
                            <div className="mt-2 w-full bg-gray-200 rounded-full h-2.5">
                              <div 
                                className={`h-2.5 rounded-full ${
                                  stat.status__name === 'Approved' ? 'bg-green-500' : 
                                  stat.status__name === 'Rejected' ? 'bg-red-500' : 
                                  stat.status__name === 'Waitlisted' ? 'bg-yellow-500' : 
                                  'bg-blue-500'
                                }`}
                                style={{ width: `${(stat.count / totalApplications * 100) || 0}%` }}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Applications and Payments */}
                <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-2">
                  {/* Recent Applications */}
                  <div className="bg-white shadow rounded-lg">
                    <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Applications</h3>
                      <Link href="/admin/applications" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                        View all
                      </Link>
                    </div>
                    <div className="border-t border-gray-200">
                      <ul className="divide-y divide-gray-200">
                        {recentApplications.map((application: any) => (
                          <li key={application.id} className="px-4 py-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm font-medium text-gray-900">{application.tracking_id}</p>
                                <p className="text-sm text-gray-500">
                                  {application.student.user.first_name} {application.student.user.last_name}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {new Date(application.applied_at).toLocaleDateString()}
                                </p>
                              </div>
                              <StatusBadge status={application.status.code} />
                            </div>
                          </li>
                        ))}
                        {recentApplications.length === 0 && (
                          <li className="px-4 py-4 text-center text-gray-500">No applications found</li>
                        )}
                      </ul>
                    </div>
                  </div>

                  {/* Recent Payments */}
                  <div className="bg-white shadow rounded-lg">
                    <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Payments</h3>
                      <Link href="/admin/finance" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                        View all
                      </Link>
                    </div>
                    <div className="border-t border-gray-200">
                      <ul className="divide-y divide-gray-200">
                        {recentPayments.map((payment: any) => (
                          <li key={payment.id} className="px-4 py-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm font-medium text-gray-900">{payment.transaction_id}</p>
                                <p className="text-sm text-gray-500">
                                  PKR {parseFloat(payment.amount).toLocaleString()}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {new Date(payment.created_at).toLocaleDateString()}
                                </p>
                              </div>
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                payment.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {payment.status === 'paid' ? 'Paid' : 'Pending'}
                              </span>
                            </div>
                          </li>
                        ))}
                        {recentPayments.length === 0 && (
                          <li className="px-4 py-4 text-center text-gray-500">No payments found</li>
                        )}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="mt-8">
                  <div className="bg-white shadow rounded-lg">
                    <div className="px-4 py-5 sm:px-6 flex items-center">
                      <Settings className="h-5 w-5 text-gray-400 mr-2" />
                      <h3 className="text-lg leading-6 font-medium text-gray-900">Quick Actions</h3>
                    </div>
                    <div className="border-t border-gray-200 p-4">
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <Link href="/admin/users" className="bg-blue-50 hover:bg-blue-100 p-4 rounded-lg flex flex-col items-center justify-center">
                          <Users className="h-8 w-8 text-blue-500 mb-2" />
                          <span className="text-sm font-medium text-blue-700">Manage Users</span>
                        </Link>
                        
                        <Link href="/admin/programs" className="bg-green-50 hover:bg-green-100 p-4 rounded-lg flex flex-col items-center justify-center">
                          <BookOpen className="h-8 w-8 text-green-500 mb-2" />
                          <span className="text-sm font-medium text-green-700">Manage Programs</span>
                        </Link>
                        
                        <Link href="/admin/finance" className="bg-purple-50 hover:bg-purple-100 p-4 rounded-lg flex flex-col items-center justify-center">
                          <CreditCard className="h-8 w-8 text-purple-500 mb-2" />
                          <span className="text-sm font-medium text-purple-700">Manage Finances</span>
                        </Link>
                        
                        <Link href="/admin/announcements" className="bg-yellow-50 hover:bg-yellow-100 p-4 rounded-lg flex flex-col items-center justify-center">
                          <Bell className="h-8 w-8 text-yellow-500 mb-2" />
                          <span className="text-sm font-medium text-yellow-700">Announcements</span>
                        </Link>
                        
                        <Link href="/admin/admission" className="bg-indigo-50 hover:bg-indigo-100 p-4 rounded-lg flex flex-col items-center justify-center">
                          <FileText className="h-8 w-8 text-indigo-500 mb-2" />
                          <span className="text-sm font-medium text-indigo-700">Admission</span>
                        </Link>
                        
                        <Link href="/admin/reviewer" className="bg-red-50 hover:bg-red-100 p-4 rounded-lg flex flex-col items-center justify-center">
                          <CheckCircle className="h-8 w-8 text-red-500 mb-2" />
                          <span className="text-sm font-medium text-red-700">Review Applications</span>
                        </Link>
                        
                        <Link href="/admin/data-entry" className="bg-teal-50 hover:bg-teal-100 p-4 rounded-lg flex flex-col items-center justify-center">
                          <PieChart className="h-8 w-8 text-teal-500 mb-2" />
                          <span className="text-sm font-medium text-teal-700">Data Entry</span>
                        </Link>
                        
                        <Link href="/admin/sessions" className="bg-orange-50 hover:bg-orange-100 p-4 rounded-lg flex flex-col items-center justify-center">
                          <Calendar className="h-8 w-8 text-orange-500 mb-2" />
                          <span className="text-sm font-medium text-orange-700">Academic Sessions</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Announcements */}
                <div className="mt-8">
                  <div className="bg-white shadow rounded-lg">
                    <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                      <div className="flex items-center">
                        <Bell className="h-5 w-5 text-gray-400 mr-2" />
                        <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Announcements</h3>
                      </div>
                      <Link href="/admin/announcements" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                        Manage Announcements
                      </Link>
                    </div>
                    <div className="border-t border-gray-200">
                      <ul className="divide-y divide-gray-200">
                        {recentAnnouncements.map((announcement: any) => (
                          <li key={announcement.id} className="px-4 py-4">
                            <div>
                              <p className="text-sm font-medium text-gray-900">{announcement.title}</p>
                              <p className="mt-1 text-sm text-gray-600 line-clamp-2">{announcement.content}</p>
                              <p className="mt-1 text-xs text-gray-500">
                                {new Date(announcement.created_at).toLocaleDateString()}
                              </p>
                            </div>
                          </li>
                        ))}
                        {recentAnnouncements.length === 0 && (
                          <li className="px-4 py-4 text-center text-gray-500">No announcements found</li>
                        )}
                      </ul>
                    </div>
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