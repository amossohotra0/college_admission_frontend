'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  usePrograms,
  useCourses,
  useAcademicSessions,
  useOfferedPrograms
} from '@/hooks/useApi';
import { api } from '@/lib/api';
import { useMutation } from '@tanstack/react-query';
import { queryClient } from '@/hooks/useApi';
import ProtectedRoute from '@/components/ui/ProtectedRoute';
import RoleGuard from '@/components/ui/RoleGuard';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { 
  BookOpen, 
  Plus,
  Edit,
  Trash2,
  Search,
  Layers,
  BookOpenCheck,
  Calendar
} from 'lucide-react';
import toast from 'react-hot-toast';

// import { mockPrograms, mockCourses, mockAcademicSessions, mockOfferedPrograms } from '@/lib/mockData';

export default function ProgramsPage() {
  const router = useRouter();
  const { data: apiPrograms, isLoading: programsLoading, error: programsError } = usePrograms();
  const { data: apiCourses, isLoading: coursesLoading, error: coursesError } = useCourses();
  const { data: apiSessions, isLoading: sessionsLoading, error: sessionsError } = useAcademicSessions();
  const { data: apiOfferedPrograms, isLoading: offeredProgramsLoading, error: offeredProgramsError } = useOfferedPrograms();

  // Extract data from API response
  const programs = apiPrograms || [];
  const courses = apiCourses || [];
  const sessions = apiSessions || [];
  const offeredPrograms = apiOfferedPrograms || [];
  // Tab state
  const [activeTab, setActiveTab] = useState('programs'); // 'programs', 'courses', 'offered'
  
  // Program state
  const [isProgramModalOpen, setIsProgramModalOpen] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState<any>(null);
  const [programFormData, setProgramFormData] = useState({
    name: '',
    code: '',
    is_active: true,
    courses: [] as number[]
  });
  
  // Course state
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [courseFormData, setCourseFormData] = useState({
    name: '',
    code: '',
    is_active: true
  });
  
  // Academic Session state
  const [isSessionModalOpen, setIsSessionModalOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState<any>(null);
  const [sessionFormData, setSessionFormData] = useState({
    session: '',
    start_date: '',
    end_date: '',
    is_current: false
  });
  
  // Offered Program state
  const [isOfferedModalOpen, setIsOfferedModalOpen] = useState(false);
  const [selectedOffered, setSelectedOffered] = useState<any>(null);
  const [offeredFormData, setOfferedFormData] = useState({
    program: '',
    session: '',
    total_seats: 0,
    is_active: true
  });
  
  const [searchTerm, setSearchTerm] = useState('');

  const isLoading = programsLoading || coursesLoading || sessionsLoading || offeredProgramsLoading;

  // Program mutations
  const createProgramMutation = useMutation({
    mutationFn: (data: any) => api.post('/programs/', data),
    onSuccess: () => {
      toast.success('Program created successfully!');
      queryClient.invalidateQueries({ queryKey: ['programs'] });
      setIsProgramModalOpen(false);
      resetProgramForm();
    },
    onError: () => {
      toast.error('Failed to create program');
    }
  });

  const updateProgramMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => api.put(`/programs/${id}/`, data),
    onSuccess: () => {
      toast.success('Program updated successfully!');
      queryClient.invalidateQueries({ queryKey: ['programs'] });
      setIsProgramModalOpen(false);
      resetProgramForm();
    },
    onError: () => {
      toast.error('Failed to update program');
    }
  });

  const deleteProgramMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/programs/${id}/`),
    onSuccess: () => {
      toast.success('Program deleted successfully!');
      queryClient.invalidateQueries({ queryKey: ['programs'] });
    },
    onError: () => {
      toast.error('Failed to delete program');
    }
  });
  
  // Course mutations
  const createCourseMutation = useMutation({
    mutationFn: (data: any) => api.post('/courses/', data),
    onSuccess: () => {
      toast.success('Course created successfully!');
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      setIsCourseModalOpen(false);
      resetCourseForm();
    },
    onError: () => {
      toast.error('Failed to create course');
    }
  });

  const updateCourseMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => api.put(`/courses/${id}/`, data),
    onSuccess: () => {
      toast.success('Course updated successfully!');
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      setIsCourseModalOpen(false);
      resetCourseForm();
    },
    onError: () => {
      toast.error('Failed to update course');
    }
  });

  const deleteCourseMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/courses/${id}/`),
    onSuccess: () => {
      toast.success('Course deleted successfully!');
      queryClient.invalidateQueries({ queryKey: ['courses'] });
    },
    onError: () => {
      toast.error('Failed to delete course');
    }
  });
  
  // Academic Session mutations
  const createSessionMutation = useMutation({
    mutationFn: (data: any) => api.post('/academic-sessions/', data),
    onSuccess: () => {
      toast.success('Academic session created successfully!');
      queryClient.invalidateQueries({ queryKey: ['academicSessions'] });
      setIsSessionModalOpen(false);
      resetSessionForm();
    },
    onError: () => {
      toast.error('Failed to create academic session');
    }
  });

  const updateSessionMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => api.put(`/academic-sessions/${id}/`, data),
    onSuccess: () => {
      toast.success('Academic session updated successfully!');
      queryClient.invalidateQueries({ queryKey: ['academicSessions'] });
      setIsSessionModalOpen(false);
      resetSessionForm();
    },
    onError: () => {
      toast.error('Failed to update academic session');
    }
  });

  const deleteSessionMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/academic-sessions/${id}/`),
    onSuccess: () => {
      toast.success('Academic session deleted successfully!');
      queryClient.invalidateQueries({ queryKey: ['academicSessions'] });
    },
    onError: () => {
      toast.error('Failed to delete academic session');
    }
  });
  
  // Offered Program mutations
  const createOfferedProgramMutation = useMutation({
    mutationFn: (data: any) => api.post('/offered-programs/', data),
    onSuccess: () => {
      toast.success('Offered program created successfully!');
      queryClient.invalidateQueries({ queryKey: ['offeredPrograms'] });
      setIsOfferedModalOpen(false);
      resetOfferedForm();
    },
    onError: () => {
      toast.error('Failed to create offered program');
    }
  });

  const updateOfferedProgramMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => api.put(`/offered-programs/${id}/`, data),
    onSuccess: () => {
      toast.success('Offered program updated successfully!');
      queryClient.invalidateQueries({ queryKey: ['offeredPrograms'] });
      setIsOfferedModalOpen(false);
      resetOfferedForm();
    },
    onError: () => {
      toast.error('Failed to update offered program');
    }
  });

  const deleteOfferedProgramMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/offered-programs/${id}/`),
    onSuccess: () => {
      toast.success('Offered program deleted successfully!');
      queryClient.invalidateQueries({ queryKey: ['offeredPrograms'] });
    },
    onError: () => {
      toast.error('Failed to delete offered program');
    }
  });

  // Program handlers
  const handleCreateProgram = () => {
    setSelectedProgram(null);
    resetProgramForm();
    setIsProgramModalOpen(true);
  };

  const handleEditProgram = (program: any) => {
    setSelectedProgram(program);
    setProgramFormData({
      name: program.name || '',
      code: program.code || '',
      is_active: program.is_active !== undefined ? program.is_active : true,
      courses: Array.isArray(program.courses) ? program.courses.map((c: any) => c.id) : []
    });
    setIsProgramModalOpen(true);
  };

  const handleDeleteProgram = (id: number) => {
    if (window.confirm('Are you sure you want to delete this program?')) {
      deleteProgramMutation.mutate(id);
    }
  };

  const handleProgramSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedProgram) {
      updateProgramMutation.mutate({
        id: selectedProgram.id,
        data: programFormData
      });
    } else {
      createProgramMutation.mutate(programFormData);
    }
  };

  const resetProgramForm = () => {
    setProgramFormData({
      name: '',
      code: '',
      is_active: true,
      courses: []
    });
  };
  
  // Course handlers
  const handleCreateCourse = () => {
    setSelectedCourse(null);
    resetCourseForm();
    setIsCourseModalOpen(true);
  };

  const handleEditCourse = (course: any) => {
    setSelectedCourse(course);
    setCourseFormData({
      name: course.name || '',
      code: course.code || '',
      is_active: course.is_active !== undefined ? course.is_active : true
    });
    setIsCourseModalOpen(true);
  };

  const handleDeleteCourse = (id: number) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      deleteCourseMutation.mutate(id);
    }
  };

  const handleCourseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedCourse) {
      updateCourseMutation.mutate({
        id: selectedCourse.id,
        data: courseFormData
      });
    } else {
      createCourseMutation.mutate(courseFormData);
    }
  };

  const resetCourseForm = () => {
    setCourseFormData({
      name: '',
      code: '',
      is_active: true
    });
  };
  
  // Academic Session handlers
  const handleCreateSession = () => {
    setSelectedSession(null);
    resetSessionForm();
    setIsSessionModalOpen(true);
  };

  const handleEditSession = (session: any) => {
    setSelectedSession(session);
    setSessionFormData({
      session: session.session || '',
      start_date: session.start_date || '',
      end_date: session.end_date || '',
      is_current: session.is_current !== undefined ? session.is_current : false
    });
    setIsSessionModalOpen(true);
  };

  const handleDeleteSession = (id: number) => {
    if (window.confirm('Are you sure you want to delete this academic session?')) {
      deleteSessionMutation.mutate(id);
    }
  };

  const handleSessionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedSession) {
      updateSessionMutation.mutate({
        id: selectedSession.id,
        data: sessionFormData
      });
    } else {
      createSessionMutation.mutate(sessionFormData);
    }
  };

  const resetSessionForm = () => {
    setSessionFormData({
      session: '',
      start_date: '',
      end_date: '',
      is_current: false
    });
  };
  
  // Offered Program handlers
  const handleCreateOffered = () => {
    setSelectedOffered(null);
    resetOfferedForm();
    setIsOfferedModalOpen(true);
  };

  const handleEditOffered = (offered: any) => {
    setSelectedOffered(offered);
    setOfferedFormData({
      program: offered.program?.id || '',
      session: offered.session?.id || '',
      total_seats: offered.total_seats || 0,
      is_active: offered.is_active !== undefined ? offered.is_active : true
    });
    setIsOfferedModalOpen(true);
  };

  const handleDeleteOffered = (id: number) => {
    if (window.confirm('Are you sure you want to delete this offered program?')) {
      deleteOfferedProgramMutation.mutate(id);
    }
  };

  const handleOfferedSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedOffered) {
      updateOfferedProgramMutation.mutate({
        id: selectedOffered.id,
        data: offeredFormData
      });
    } else {
      createOfferedProgramMutation.mutate(offeredFormData);
    }
  };

  const resetOfferedForm = () => {
    setOfferedFormData({
      program: '',
      session: '',
      total_seats: 0,
      is_active: true
    });
  };

  // Filter data based on search term
  const filteredPrograms = programs.filter((program: any) => {
    return searchTerm === '' || 
      (program.name && program.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (program.code && program.code.toLowerCase().includes(searchTerm.toLowerCase()));
  });

  const filteredCourses = courses.filter((course: any) => {
    return searchTerm === '' || 
      (course.name && course.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (course.code && course.code.toLowerCase().includes(searchTerm.toLowerCase()));
  });

  const filteredSessions = sessions.filter((session: any) => {
    return searchTerm === '' || 
      (session.session && session.session.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (session.start_date && session.start_date.includes(searchTerm)) ||
      (session.end_date && session.end_date.includes(searchTerm));
  });
  
  const filteredOfferedPrograms = offeredPrograms.filter((offered: any) => {
    return searchTerm === '' || 
      (offered.program?.name && offered.program.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (offered.program?.code && offered.program.code.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (offered.session?.session && offered.session.session.toLowerCase().includes(searchTerm.toLowerCase()));
  });

  return (
    <ProtectedRoute>
      <RoleGuard allowedRoles={['admin', 'admission_officer']}>
        <div className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-2xl font-semibold text-gray-900">Programs Management</h1>
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
            {isLoading ? (
              <div className="py-12 flex justify-center">
                <LoadingSpinner size="large" />
              </div>
            ) : (
              <>
                {/* Tabs */}
                <div className="mt-4 border-b border-gray-200">
                  <nav className="-mb-px flex space-x-8">
                    <button
                      onClick={() => setActiveTab('programs')}
                      className={`${
                        activeTab === 'programs'
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
                    >
                      <Layers className="h-5 w-5 mr-2" />
                      Programs
                    </button>
                    <button
                      onClick={() => setActiveTab('courses')}
                      className={`${
                        activeTab === 'courses'
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
                    >
                      <BookOpen className="h-5 w-5 mr-2" />
                      Courses
                    </button>
                    <button
                      onClick={() => setActiveTab('sessions')}
                      className={`${
                        activeTab === 'sessions'
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
                    >
                      <Calendar className="h-5 w-5 mr-2" />
                      Academic Sessions
                    </button>
                    <button
                      onClick={() => setActiveTab('offered')}
                      className={`${
                        activeTab === 'offered'
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
                    >
                      <BookOpenCheck className="h-5 w-5 mr-2" />
                      Offered Programs
                    </button>
                  </nav>
                </div>

                {/* Search and Add */}
                <div className="mt-8">
                  <div className="bg-white shadow rounded-lg p-4">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="relative rounded-md shadow-sm">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            type="text"
                            className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                            placeholder={`Search ${activeTab}...`}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                          />
                        </div>
                      </div>
                      
                      {activeTab === 'programs' && (
                        <button
                          onClick={handleCreateProgram}
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Program
                        </button>
                      )}

                      {activeTab === 'courses' && (
                        <button
                          onClick={handleCreateCourse}
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Course
                        </button>
                      )}
                      
                      {activeTab === 'sessions' && (
                        <button
                          onClick={handleCreateSession}
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Academic Session
                        </button>
                      )}

                      {activeTab === 'offered' && (
                        <button
                          onClick={handleCreateOffered}
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Offered Program
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Programs List */}
                {activeTab === 'programs' && (
                  <div className="mt-8">
                    <div className="bg-white shadow rounded-lg">
                      <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">Programs</h3>
                        <span className="text-sm text-gray-500">
                          {filteredPrograms.length} programs
                        </span>
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
                                  Courses
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
                              {filteredPrograms.map((program: any) => (
                                <tr key={program.id}>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">{program.code}</div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">{program.name}</div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">
                                      {Array.isArray(program.courses) ? program.courses.length : 0} courses
                                    </div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                      program.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                    }`}>
                                      {program.is_active ? 'Active' : 'Inactive'}
                                    </span>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <div className="flex space-x-2">
                                      <button
                                        onClick={() => handleEditProgram(program)}
                                        className="text-indigo-600 hover:text-indigo-900"
                                      >
                                        <Edit className="h-4 w-4" />
                                      </button>
                                      <button
                                        onClick={() => handleDeleteProgram(program.id)}
                                        className="text-red-600 hover:text-red-900"
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                              {filteredPrograms.length === 0 && (
                                <tr>
                                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                                    No programs found
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Courses List */}
                {activeTab === 'courses' && (
                  <div className="mt-8">
                    <div className="bg-white shadow rounded-lg">
                      <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">Courses</h3>
                        <span className="text-sm text-gray-500">
                          {filteredCourses.length} courses
                        </span>
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
                                  Status
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Actions
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {filteredCourses.map((course: any) => (
                                <tr key={course.id}>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">{course.code}</div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">{course.name}</div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                      course.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                    }`}>
                                      {course.is_active ? 'Active' : 'Inactive'}
                                    </span>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <div className="flex space-x-2">
                                      <button
                                        onClick={() => handleEditCourse(course)}
                                        className="text-indigo-600 hover:text-indigo-900"
                                      >
                                        <Edit className="h-4 w-4" />
                                      </button>
                                      <button
                                        onClick={() => handleDeleteCourse(course.id)}
                                        className="text-red-600 hover:text-red-900"
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                              {filteredCourses.length === 0 && (
                                <tr>
                                  <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                                    No courses found
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Academic Sessions List */}
                {activeTab === 'sessions' && (
                  <div className="mt-8">
                    <div className="bg-white shadow rounded-lg">
                      <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">Academic Sessions</h3>
                        <span className="text-sm text-gray-500">
                          {filteredSessions.length} sessions
                        </span>
                      </div>
                      <div className="border-t border-gray-200">
                        <div className="overflow-x-auto">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                              <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Session
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Start Date
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  End Date
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
                              {filteredSessions.map((session: any) => (
                                <tr key={session.id}>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">{session.session}</div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">{session.start_date}</div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">{session.end_date}</div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                      session.is_current ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                    }`}>
                                      {session.is_current ? 'Current' : 'Not Current'}
                                    </span>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <div className="flex space-x-2">
                                      <button
                                        onClick={() => handleEditSession(session)}
                                        className="text-indigo-600 hover:text-indigo-900"
                                      >
                                        <Edit className="h-4 w-4" />
                                      </button>
                                      <button
                                        onClick={() => handleDeleteSession(session.id)}
                                        className="text-red-600 hover:text-red-900"
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                              {filteredSessions.length === 0 && (
                                <tr>
                                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                                    No academic sessions found
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Offered Programs List */}
                {activeTab === 'offered' && (
                  <div className="mt-8">
                    <div className="bg-white shadow rounded-lg">
                      <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">Offered Programs</h3>
                        <span className="text-sm text-gray-500">
                          {filteredOfferedPrograms.length} offered programs
                        </span>
                      </div>
                      <div className="border-t border-gray-200">
                        <div className="overflow-x-auto">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                              <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Program
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Session
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Total Seats
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Available Seats
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
                              {filteredOfferedPrograms.map((offered: any) => (
                                <tr key={offered.id}>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">{offered.program?.name || 'N/A'}</div>
                                    <div className="text-sm text-gray-500">{offered.program?.code || 'N/A'}</div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">{offered.session?.session || 'N/A'}</div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">{offered.total_seats}</div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">{offered.available_seats}</div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                      offered.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                    }`}>
                                      {offered.is_active ? 'Active' : 'Inactive'}
                                    </span>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <div className="flex space-x-2">
                                      <button
                                        onClick={() => handleEditOffered(offered)}
                                        className="text-indigo-600 hover:text-indigo-900"
                                      >
                                        <Edit className="h-4 w-4" />
                                      </button>
                                      <button
                                        onClick={() => handleDeleteOffered(offered.id)}
                                        className="text-red-600 hover:text-red-900"
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                              {filteredOfferedPrograms.length === 0 && (
                                <tr>
                                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                                    No offered programs found
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Program Modal */}
        {isProgramModalOpen && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {selectedProgram ? 'Edit Program' : 'Create Program'}
              </h3>
              <form onSubmit={handleProgramSubmit}>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Program Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={programFormData.name}
                      onChange={(e) => setProgramFormData({ ...programFormData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="code" className="block text-sm font-medium text-gray-700">
                      Program Code
                    </label>
                    <input
                      type="text"
                      id="code"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={programFormData.code}
                      onChange={(e) => setProgramFormData({ ...programFormData, code: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="courses" className="block text-sm font-medium text-gray-700">
                      Courses
                    </label>
                    <select
                      id="courses"
                      multiple
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={programFormData.courses.map(c => c.toString())}
                      onChange={(e) => {
                        const selectedOptions = Array.from(e.target.selectedOptions, option => Number(option.value));
                        setProgramFormData({ ...programFormData, courses: selectedOptions });
                      }}
                    >
                      {Array.isArray(courses) && courses.map((course: any) => (
                        <option key={course.id} value={course.id}>
                          {course.name} ({course.code})
                        </option>
                      ))}
                    </select>
                    <p className="mt-1 text-xs text-gray-500">Hold Ctrl/Cmd to select multiple courses</p>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="is_active"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      checked={programFormData.is_active}
                      onChange={(e) => setProgramFormData({ ...programFormData, is_active: e.target.checked })}
                    />
                    <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900">
                      Active
                    </label>
                  </div>
                </div>
                <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:col-start-2 sm:text-sm"
                  >
                    {selectedProgram ? 'Update' : 'Create'}
                  </button>
                  <button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                    onClick={() => setIsProgramModalOpen(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Course Modal */}
        {isCourseModalOpen && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {selectedCourse ? 'Edit Course' : 'Create Course'}
              </h3>
              <form onSubmit={handleCourseSubmit}>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="course-name" className="block text-sm font-medium text-gray-700">
                      Course Name
                    </label>
                    <input
                      type="text"
                      id="course-name"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={courseFormData.name}
                      onChange={(e) => setCourseFormData({ ...courseFormData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="course-code" className="block text-sm font-medium text-gray-700">
                      Course Code
                    </label>
                    <input
                      type="text"
                      id="course-code"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={courseFormData.code}
                      onChange={(e) => setCourseFormData({ ...courseFormData, code: e.target.value })}
                      required
                    />
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="course-is-active"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      checked={courseFormData.is_active}
                      onChange={(e) => setCourseFormData({ ...courseFormData, is_active: e.target.checked })}
                    />
                    <label htmlFor="course-is-active" className="ml-2 block text-sm text-gray-900">
                      Active
                    </label>
                  </div>
                </div>
                <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:col-start-2 sm:text-sm"
                  >
                    {selectedCourse ? 'Update' : 'Create'}
                  </button>
                  <button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                    onClick={() => setIsCourseModalOpen(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Academic Session Modal */}
        {isSessionModalOpen && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {selectedSession ? 'Edit Academic Session' : 'Create Academic Session'}
              </h3>
              <form onSubmit={handleSessionSubmit}>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="session" className="block text-sm font-medium text-gray-700">
                      Session Name
                    </label>
                    <input
                      type="text"
                      id="session"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={sessionFormData.session}
                      onChange={(e) => setSessionFormData({ ...sessionFormData, session: e.target.value })}
                      placeholder="e.g. 2023-2024"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="start_date" className="block text-sm font-medium text-gray-700">
                      Start Date
                    </label>
                    <input
                      type="date"
                      id="start_date"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={sessionFormData.start_date}
                      onChange={(e) => setSessionFormData({ ...sessionFormData, start_date: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="end_date" className="block text-sm font-medium text-gray-700">
                      End Date
                    </label>
                    <input
                      type="date"
                      id="end_date"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={sessionFormData.end_date}
                      onChange={(e) => setSessionFormData({ ...sessionFormData, end_date: e.target.value })}
                      required
                    />
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="is_current"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      checked={sessionFormData.is_current}
                      onChange={(e) => setSessionFormData({ ...sessionFormData, is_current: e.target.checked })}
                    />
                    <label htmlFor="is_current" className="ml-2 block text-sm text-gray-900">
                      Current Session
                    </label>
                  </div>
                </div>
                <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:col-start-2 sm:text-sm"
                  >
                    {selectedSession ? 'Update' : 'Create'}
                  </button>
                  <button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                    onClick={() => setIsSessionModalOpen(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Offered Program Modal */}
        {isOfferedModalOpen && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {selectedOffered ? 'Edit Offered Program' : 'Create Offered Program'}
              </h3>
              <form onSubmit={handleOfferedSubmit}>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="program" className="block text-sm font-medium text-gray-700">
                      Program
                    </label>
                    <select
                      id="program"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={offeredFormData.program}
                      onChange={(e) => setOfferedFormData({ ...offeredFormData, program: e.target.value })}
                      required
                    >
                      <option value="">Select a program</option>
                      {Array.isArray(programs) && programs.map((program: any) => (
                        <option key={program.id} value={program.id}>
                          {program.name} ({program.code})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="session" className="block text-sm font-medium text-gray-700">
                      Academic Session
                    </label>
                    <select
                      id="session"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={offeredFormData.session}
                      onChange={(e) => setOfferedFormData({ ...offeredFormData, session: e.target.value })}
                      required
                    >
                      <option value="">Select a session</option>
                      {Array.isArray(sessions) && sessions.map((session: any) => (
                        <option key={session.id} value={session.id}>
                          {session.session} {session.is_current ? '(Current)' : ''}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="total_seats" className="block text-sm font-medium text-gray-700">
                      Total Seats
                    </label>
                    <input
                      type="number"
                      id="total_seats"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={offeredFormData.total_seats}
                      onChange={(e) => setOfferedFormData({ ...offeredFormData, total_seats: parseInt(e.target.value) || 0 })}
                      min="0"
                      required
                    />
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="offered-is-active"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      checked={offeredFormData.is_active}
                      onChange={(e) => setOfferedFormData({ ...offeredFormData, is_active: e.target.checked })}
                    />
                    <label htmlFor="offered-is-active" className="ml-2 block text-sm text-gray-900">
                      Active
                    </label>
                  </div>
                </div>
                <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:col-start-2 sm:text-sm"
                  >
                    {selectedOffered ? 'Update' : 'Create'}
                  </button>
                  <button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                    onClick={() => setIsOfferedModalOpen(false)}
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