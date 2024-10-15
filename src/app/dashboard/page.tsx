'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useStudentProfile, useApplications, useAnnouncements } from '@/hooks/useApi';
import ProtectedRoute from '@/components/ui/ProtectedRoute';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import StatusBadge from '@/components/ui/StatusBadge';
import ProfileIncompleteModal from '@/components/ui/ProfileIncompleteModal';
import { 
  BookOpen, 
  FileText, 
  CreditCard, 
  User, 
  Bell, 
  ChevronRight, 
  Calendar,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const { data: profile, isLoading: profileLoading } = useStudentProfile();
  const { data: applications, isLoading: applicationsLoading } = useApplications();
  const { data: announcements, isLoading: announcementsLoading } = useAnnouncements();

  const isLoading = profileLoading || applicationsLoading || announcementsLoading;

  const handleCompleteProfile = () => {
    router.push('/profile');
  };

  return (
    <ProtectedRoute>
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-semibold text-gray-900">Student Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">
            Welcome back, {profile?.user?.first_name || 'Student'}
          </p>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mt-6">
          {isLoading ? (
            <div className="py-12 flex justify-center">
              <LoadingSpinner size="large" />
            </div>
          ) : (
            <>
              {/* Profile Completion Card */}
              <div className="bg-white shadow rounded-xl p-6 border border-gray-100">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div className="mb-4 md:mb-0">
                    <h2 className="text-lg font-semibold text-gray-900">Profile Completion</h2>
                    <p className="text-sm text-gray-500 mt-1">
                      Complete your profile to apply for programs
                    </p>
                  </div>
                  
                  <div className="flex items-center">
                    {profile?.picture ? (
                      <img 
                        src={typeof profile.picture === 'string' 
                          ? (profile.picture.startsWith('/') 
                              ? `${process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') || 'http://localhost:8000'}${profile.picture}` 
                              : profile.picture) 
                          : URL.createObjectURL(profile.picture)} 
                        alt="Profile" 
                        className="h-14 w-14 rounded-full object-cover border-2 border-gray-200 mr-4"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = '/placeholder-profile.svg';
                        }}
                      />
                    ) : (
                      <div className="h-14 w-14 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                        <span className="text-blue-600 text-xl font-bold">
                          {profile?.user?.first_name?.[0] || ''}
                          {profile?.user?.last_name?.[0] || ''}
                        </span>
                      </div>
                    )}
                    
                    <div>
                      <div className="flex items-center">
                        <div className="text-sm font-semibold text-gray-900">
                          {profile?.profile_completion || 0}% Complete
                        </div>
                        {(profile?.profile_completion || 0) === 100 && (
                          <CheckCircle className="h-4 w-4 text-green-500 ml-2" />
                        )}
                      </div>
                      <div className="w-48 h-2 bg-gray-200 rounded-full mt-2">
                        <div 
                          className="h-full rounded-full bg-blue-600" 
                          style={{ width: `${profile?.profile_completion || 0}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {(profile?.profile_completion || 0) < 100 && (
                  <button
                    onClick={handleCompleteProfile}
                    className="mt-4 w-full md:w-auto inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition"
                  >
                    Complete Your Profile
                  </button>
                )}
              </div>

              {/* Quick Links */}
              <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                <QuickLinkCard 
                  href="/programs" 
                  icon={<BookOpen className="h-6 w-6 text-blue-500" />}
                  title="Programs"
                  subtitle="Browse Available Programs"
                />
                
                <QuickLinkCard 
                  href="/applications" 
                  icon={<FileText className="h-6 w-6 text-indigo-500" />}
                  title="Applications"
                  subtitle={`${applications?.length ?? 0} Applications`}
                  badge={Boolean(applications?.length)}
                />
                
                <QuickLinkCard 
                  href="/payments" 
                  icon={<CreditCard className="h-6 w-6 text-green-500" />}
                  title="Payments"
                  subtitle="Manage Your Payments"
                />
                
                <QuickLinkCard 
                  href="/profile" 
                  icon={<User className="h-6 w-6 text-purple-500" />}
                  title="Profile"
                  subtitle="Update Your Information"
                />
              </div>

              <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Applications */}
                <div className="lg:col-span-2">
                  <div className="bg-white shadow rounded-xl border border-gray-100 overflow-hidden">
                    <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center">
                      <div className="flex items-center">
                        <FileText className="h-5 w-5 text-indigo-500 mr-2" />
                        <h3 className="text-lg font-semibold text-gray-900">Recent Applications</h3>
                      </div>
                      <Link
                        href="/applications"
                        className="text-sm font-medium text-blue-600 hover:text-blue-500 flex items-center"
                      >
                        View all <ChevronRight className="h-4 w-4 ml-1" />
                      </Link>
                    </div>
                    
                    {applications?.length ? (
                      <ul className="divide-y divide-gray-100">
                        {applications.slice(0, 3).map((application) => (
                          <li key={application.id} className="px-6 py-4 hover:bg-gray-50 transition">
                            <Link href={`/applications/${application.id}`} className="block">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="text-sm font-medium text-gray-900">
                                    {application.program.name}
                                  </p>
                                  <div className="flex items-center mt-1">
                                    <p className="text-xs text-gray-500 mr-2">
                                      {application.tracking_id}
                                    </p>
                                    <Calendar className="h-3 w-3 text-gray-400 mr-1" />
                                    <p className="text-xs text-gray-500">
                                      {new Date(application.applied_at).toLocaleDateString()}
                                    </p>
                                  </div>
                                </div>
                                <StatusBadge status={application.status.code} />
                              </div>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="text-center py-12 px-6">
                        <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 mb-4">No applications yet</p>
                        <Link
                          href="/programs"
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition"
                        >
                          Browse Programs
                        </Link>
                      </div>
                    )}
                  </div>
                </div>

                {/* Announcements */}
                <div>
                  <div className="bg-white shadow rounded-xl border border-gray-100 overflow-hidden">
                    <div className="px-6 py-5 border-b border-gray-100 flex items-center">
                      <Bell className="h-5 w-5 text-amber-500 mr-2" />
                      <h3 className="text-lg font-semibold text-gray-900">Announcements</h3>
                    </div>
                    
                    {announcements && announcements.length > 0 ? (
                      <ul className="divide-y divide-gray-100">
                        {announcements.slice(0, 4).map((announcement) => (
                          <li key={announcement.id} className="px-6 py-4">
                            <div>
                              <div className="flex items-center">
                                <AlertCircle className="h-4 w-4 text-amber-500 mr-2" />
                                <h4 className="text-sm font-medium text-gray-900">{announcement.title}</h4>
                              </div>
                              <p className="mt-2 text-sm text-gray-600 line-clamp-2">{announcement.content}</p>
                              <p className="mt-1 text-xs text-gray-500">
                                {new Date(announcement.created_at).toLocaleDateString()}
                              </p>
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="text-center py-12 px-6">
                        <Bell className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500">No announcements</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
        
        {profile && (profile.profile_completion || 0) < 100 && (
          <ProfileIncompleteModal 
            completionPercentage={profile.profile_completion || 0}
            showInitially={true}
          />
        )}
      </div>
    </ProtectedRoute>
  );
}

// Helper component for quick link cards
const QuickLinkCard = ({ 
  href, 
  icon, 
  title, 
  subtitle, 
  badge = false 
}: { 
  href: string; 
  icon: React.ReactNode; 
  title: string; 
  subtitle: string; 
  badge?: boolean;
}) => (
  <Link href={href} className="bg-white overflow-hidden shadow rounded-xl border border-gray-100 hover:shadow-md transition">
    <div className="p-5">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          {icon}
        </div>
        <div className="ml-5 w-0 flex-1">
          <div className="flex items-center">
            <h3 className="text-sm font-medium text-gray-900 truncate">{title}</h3>
            {badge && (
              <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                New
              </span>
            )}
          </div>
          <div className="mt-1 text-lg font-semibold text-gray-900">{subtitle}</div>
        </div>
        <ChevronRight className="h-5 w-5 text-gray-400" />
      </div>
    </div>
  </Link>
);