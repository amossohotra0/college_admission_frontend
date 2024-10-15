'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { usePrograms, useOfferedPrograms, useStudentProfile } from '@/hooks/useApi';
import ProtectedRoute from '@/components/ui/ProtectedRoute';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { Search, Filter, BookOpen, Calendar, Users, ChevronRight, AlertCircle } from 'lucide-react';

export default function ProgramsPage() {
  const router = useRouter();
  const { data: programs, isLoading: programsLoading } = usePrograms();
  const { data: offeredPrograms, isLoading: offeredProgramsLoading } = useOfferedPrograms();
  const { data: profile, isLoading: profileLoading } = useStudentProfile();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isActiveFilter, setIsActiveFilter] = useState(true);
  
  const isLoading = programsLoading || offeredProgramsLoading || profileLoading;
  const profileComplete = (profile?.profile_completion || 0) === 100;

  // Filter and combine program data
  const filteredPrograms = !isLoading && programs && offeredPrograms
    ? programs
        .filter((program: any) => {
          const matchesActive = !isActiveFilter || program.is_active;
          const matchesSearch = searchTerm === '' || 
            program.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            program.code.toLowerCase().includes(searchTerm.toLowerCase());
          return matchesActive && matchesSearch;
        })
        .map((program: any) => {
          // Find offered program sessions for this program
          const offerings = offeredPrograms.filter((op: any) => op.program.id === program.id);
          return {
            ...program,
            offerings
          };
        })
    : [];

  const handleApply = (programId: number, sessionId: number) => {
    if (!profileComplete) {
      alert('Please complete your profile before applying to programs.');
      router.push('/profile');
      return;
    }
    
    router.push(`/applications/new?program=${programId}&session=${sessionId}`);
  };

  return (
    <ProtectedRoute>
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-semibold text-gray-900">Available Programs</h1>
          <p className="mt-1 text-sm text-gray-500">
            Browse and apply to our academic programs
          </p>

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
                          placeholder="Search programs..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <div className="w-full md:w-auto flex items-center">
                      <label className="inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={isActiveFilter} 
                          onChange={() => setIsActiveFilter(!isActiveFilter)}
                          className="sr-only peer"
                        />
                        <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        <span className="ml-3 text-sm font-medium text-gray-700">Active Programs Only</span>
                      </label>
                    </div>
                    
                    {(searchTerm || !isActiveFilter) && (
                      <button
                        onClick={() => {
                          setSearchTerm('');
                          setIsActiveFilter(true);
                        }}
                        className="px-3 py-1 border border-gray-300 rounded-md text-xs font-medium text-gray-700 bg-white hover:bg-gray-50"
                      >
                        Clear Filters
                      </button>
                    )}
                  </div>
                </div>

                {/* Profile Completion Warning */}
                {!profileComplete && (
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 flex items-start">
                    <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <h3 className="text-sm font-medium text-amber-800">Profile Incomplete</h3>
                      <p className="mt-1 text-sm text-amber-700">
                        You need to complete your profile before you can apply to any programs.
                        <button 
                          onClick={() => router.push('/profile')}
                          className="ml-2 font-medium text-amber-800 hover:text-amber-900 underline"
                        >
                          Complete Profile
                        </button>
                      </p>
                    </div>
                  </div>
                )}

                {/* Programs List */}
                {filteredPrograms.length > 0 ? (
                  <div className="space-y-6">
                    {filteredPrograms.map((program: any) => (
                      <div 
                        key={program.id} 
                        className="bg-white shadow rounded-xl border border-gray-100 overflow-hidden"
                      >
                        <div className="px-6 py-5 border-b border-gray-100">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className="bg-blue-50 p-2 rounded-lg mr-4">
                                <BookOpen className="h-6 w-6 text-blue-600" />
                              </div>
                              <div>
                                <h3 className="text-lg font-semibold text-gray-900">{program.name}</h3>
                                <p className="text-sm text-gray-500">Code: {program.code}</p>
                              </div>
                            </div>
                            <div>
                              {program.is_active ? (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  Active
                                </span>
                              ) : (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                  Inactive
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        {/* Program Offerings */}
                        {program.offerings && program.offerings.length > 0 ? (
                          <ul className="divide-y divide-gray-100">
                            {program.offerings.map((offering: any) => (
                              <li key={offering.id} className="px-6 py-4 hover:bg-gray-50 transition">
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                                  <div>
                                    <div className="flex items-center">
                                      <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                                      <h4 className="text-sm font-medium text-gray-900">
                                        {offering.session.session}
                                      </h4>
                                    </div>
                                    <div className="mt-1 flex items-center text-xs text-gray-500">
                                      <Users className="h-4 w-4 text-gray-400 mr-2" />
                                      <span>
                                        {offering.available_seats} seats available
                                      </span>
                                    </div>
                                  </div>
                                  
                                  <div className="mt-3 md:mt-0 flex items-center">
                                    <button
                                      onClick={() => handleApply(program.id, offering.session.id)}
                                      disabled={!profileComplete}
                                      className={`inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm ${
                                        profileComplete
                                          ? 'text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                                          : 'text-gray-500 bg-gray-200 cursor-not-allowed'
                                      } transition`}
                                    >
                                      Apply Now
                                    </button>
                                    
                                    <button
                                      onClick={() => router.push(`/programs/${program.id}`)}
                                      className="ml-3 inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900"
                                    >
                                      Details
                                      <ChevronRight className="h-4 w-4 ml-1" />
                                    </button>
                                  </div>
                                </div>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <div className="px-6 py-8 text-center">
                            <p className="text-gray-500">No active sessions available for this program</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white shadow rounded-xl border border-gray-100 p-12 text-center">
                    <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No programs found</h3>
                    <p className="text-gray-500">
                      {searchTerm ? 'Try changing your search criteria' : 'No programs are currently available'}
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}