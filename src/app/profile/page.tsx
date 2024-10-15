'use client';

import React from 'react';
import { useStudentProfile } from '@/hooks/useApi';
import ProtectedRoute from '@/components/ui/ProtectedRoute';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ProfileBreadcrumb from '@/components/ui/ProfileBreadcrumb';
import Link from 'next/link';
import { 
  User, 
  MapPin, 
  BookOpen, 
  Activity, 
  CheckCircle, 
  AlertCircle,
  ChevronRight,
  Camera,
  Edit
} from 'lucide-react';

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfileContent />
    </ProtectedRoute>
  );
}

function ProfileContent() {
  const { data: profile, isLoading } = useStudentProfile();

  if (isLoading) {
    return (
      <div className="py-12 flex justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  const sections = [
    {
      id: 'personal',
      title: 'Personal Information',
      description: 'Your personal details and identification',
      icon: <User className="h-5 w-5" />,
      isComplete: !!profile?.personal_info,
      href: '/profile/personal',
      color: 'text-blue-500',
      bgColor: 'bg-blue-50',
    },
    {
      id: 'contact',
      title: 'Contact Information',
      description: 'Your address and contact details',
      icon: <MapPin className="h-5 w-5" />,
      isComplete: !!profile?.contact_info,
      href: '/profile/contact',
      color: 'text-indigo-500',
      bgColor: 'bg-indigo-50',
    },
    {
      id: 'education',
      title: 'Educational Background',
      description: 'Your academic qualifications and certificates',
      icon: <BookOpen className="h-5 w-5" />,
      isComplete: profile?.educational_records && profile.educational_records.length > 0,
      href: '/profile/education',
      color: 'text-purple-500',
      bgColor: 'bg-purple-50',
    },
    {
      id: 'medical',
      title: 'Medical Information',
      description: 'Your health information and medical history',
      icon: <Activity className="h-5 w-5" />,
      isComplete: !!profile?.medical_info,
      href: '/profile/medical',
      color: 'text-green-500',
      bgColor: 'bg-green-50',
    },
  ];

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ProfileBreadcrumb items={[{ label: 'Profile', current: true }]} />
        <h1 className="text-2xl font-semibold text-gray-900">My Profile</h1>
        <p className="mt-1 text-sm text-gray-500">
          Complete your profile to apply for programs
        </p>

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Profile Summary Card */}
          <div className="lg:col-span-1">
            <div className="bg-white shadow rounded-xl border border-gray-100 overflow-hidden">
              <div className="p-6 flex flex-col items-center text-center">
                <div className="relative">
                  {profile?.picture ? (
                    <img
                      src={typeof profile.picture === 'string' 
                        ? (profile.picture.startsWith('/') 
                            ? `${process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') || 'http://localhost:8000'}${profile.picture}` 
                            : profile.picture) 
                        : URL.createObjectURL(profile.picture)}
                      alt="Profile"
                      className="h-32 w-32 rounded-full object-cover border-4 border-white shadow"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = '/placeholder-profile.svg';
                      }}
                    />
                  ) : (
                    <div className="h-32 w-32 rounded-full bg-blue-100 flex items-center justify-center border-4 border-white shadow">
                      <span className="text-blue-600 text-4xl font-bold">
                        {profile?.user?.first_name?.[0] || ''}
                        {profile?.user?.last_name?.[0] || ''}
                      </span>
                    </div>
                  )}
                  <Link 
                    href="/profile/picture" 
                    className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition"
                    title="Update profile picture"
                  >
                    <Camera className="h-4 w-4" />
                  </Link>
                </div>
                
                <h2 className="mt-4 text-xl font-semibold text-gray-900">
                  {profile?.user?.first_name} {profile?.user?.last_name}
                </h2>
                <p className="text-sm text-gray-500">{profile?.user?.email}</p>
                
                <div className="mt-4 w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-blue-600 h-2.5 rounded-full" 
                    style={{ width: `${profile?.profile_completion || 0}%` }}
                  ></div>
                </div>
                <p className="mt-2 text-sm font-medium text-gray-700">
                  {profile?.profile_completion || 0}% Complete
                </p>
              </div>
              
              <div className="border-t border-gray-100 px-6 py-4">
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-500">Student ID</div>
                  <div className="text-sm font-medium">{profile?.id || 'N/A'}</div>
                </div>
              </div>
              
              <div className="border-t border-gray-100 px-6 py-4">
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-500">Verification</div>
                  <div className="flex items-center">
                    {profile?.user?.is_verified ? (
                      <>
                        <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                        <span className="text-sm font-medium text-green-700">Verified</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="h-4 w-4 text-amber-500 mr-1" />
                        <span className="text-sm font-medium text-amber-700">Pending</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Profile Sections */}
          <div className="lg:col-span-3">
            <div className="bg-white shadow rounded-xl border border-gray-100 overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900">Profile Sections</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Complete all sections to be eligible for program applications
                </p>
              </div>
              
              <div className="divide-y divide-gray-100">
                {sections.map((section) => (
                  <Link 
                    key={section.id} 
                    href={section.href}
                    className="block hover:bg-gray-50 transition"
                  >
                    <div className="px-6 py-5 flex items-center justify-between">
                      <div className="flex items-start">
                        <div className={`${section.bgColor} ${section.color} p-3 rounded-lg mr-4`}>
                          {section.icon}
                        </div>
                        <div>
                          <h4 className="text-base font-medium text-gray-900">{section.title}</h4>
                          <p className="mt-1 text-sm text-gray-500">{section.description}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        {section.isComplete ? (
                          <div className="flex items-center text-green-700 mr-3">
                            <CheckCircle className="h-5 w-5 text-green-500 mr-1" />
                            <span className="text-sm font-medium">Complete</span>
                          </div>
                        ) : (
                          <div className="flex items-center text-amber-700 mr-3">
                            <AlertCircle className="h-5 w-5 text-amber-500 mr-1" />
                            <span className="text-sm font-medium">Incomplete</span>
                          </div>
                        )}
                        
                        <div className="flex items-center">
                          <span className="text-sm font-medium text-blue-600 mr-1">
                            {section.isComplete ? 'Update' : 'Complete'}
                          </span>
                          <ChevronRight className="h-5 w-5 text-gray-400" />
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
            
            {/* Account Settings */}
            <div className="mt-6 bg-white shadow rounded-xl border border-gray-100 overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900">Account Settings</h3>
              </div>
              
              <div className="divide-y divide-gray-100">
                <Link href="/profile/account" className="block hover:bg-gray-50 transition">
                  <div className="px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center">
                      <Edit className="h-5 w-5 text-gray-400 mr-3" />
                      <span className="text-sm font-medium text-gray-900">Update Account Information</span>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}