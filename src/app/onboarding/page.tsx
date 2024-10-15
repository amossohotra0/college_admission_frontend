'use client';

import { useAuth } from '@/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { studentService } from '@/lib/services';
import Link from 'next/link';
import { CheckCircle, XCircle, ArrowRight } from 'lucide-react';

export default function OnboardingPage() {
  const { user } = useAuth();
  
  const { data: personal } = useQuery({ 
    queryKey: ['personal-info'], 
    queryFn: studentService.getPersonalInfo, 
    retry: false 
  });
  const { data: contact } = useQuery({ 
    queryKey: ['contact-info'], 
    queryFn: studentService.getContactInfo, 
    retry: false 
  });
  const { data: education } = useQuery({ 
    queryKey: ['education'], 
    queryFn: studentService.getEducationalBackground, 
    retry: false,
    select: (data: any) => data?.results || data || []
  });
  const { data: medical } = useQuery({ 
    queryKey: ['medical-info'], 
    queryFn: studentService.getMedicalInfo, 
    retry: false 
  });

  if (user?.role?.role !== 'applicant') {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold mb-4">Welcome to College Admission System</h1>
        <Link href="/dashboard" className="btn-primary mt-4 inline-block">
          Go to Dashboard
        </Link>
      </div>
    );
  }

  const steps = [
    { title: 'Personal Information', completed: !!personal, href: '/profile/personal' },
    { title: 'Contact Information', completed: !!contact, href: '/profile/contact' },
    { title: 'Educational Background', completed: Array.isArray(education) && education.length > 0, href: '/profile/education' },
    { title: 'Medical Information', completed: !!medical, href: '/profile/medical' }
  ];

  const completedSteps = steps.filter(step => step.completed).length;
  const allCompleted = completedSteps === steps.length;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="text-center mb-12">
        <div className="w-24 h-24 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
          <span className="text-white font-bold text-3xl">🎓</span>
        </div>
        <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
          Welcome to Your Journey
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Complete your profile to unlock amazing opportunities and start your application process
        </p>
        
        <div className="mt-8 max-w-md mx-auto">
          <div className="bg-gray-200 rounded-full h-3 shadow-inner">
            <div 
              className="bg-gradient-to-r from-blue-500 to-indigo-500 h-3 rounded-full shadow-sm transition-all duration-500 ease-out"
              style={{ width: `${(completedSteps / steps.length) * 100}%` }}
            />
          </div>
          <div className="flex justify-between mt-3">
            <p className="text-sm font-semibold text-gray-700">
              {completedSteps} of {steps.length} completed
            </p>
            <p className="text-sm font-semibold text-blue-600">
              {Math.round((completedSteps / steps.length) * 100)}%
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2">
        {steps.map((step, index) => (
          <div key={index} className={`card hover:scale-105 transition-all duration-300 ${
            step.completed ? 'ring-2 ring-green-200 bg-green-50' : 'hover:shadow-2xl'
          }`}>
            <div className="card-header">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    step.completed ? 'bg-green-500' : 'bg-gray-300'
                  }`}>
                    {step.completed ? (
                      <CheckCircle className="h-6 w-6 text-white" />
                    ) : (
                      <span className="text-white font-bold">{index + 1}</span>
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-800">{step.title}</h3>
                    <p className="text-sm text-gray-600">Step {index + 1} of {steps.length}</p>
                  </div>
                </div>
                {step.completed && (
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                )}
              </div>
            </div>
            
            <Link 
              href={step.href}
              className={`inline-flex items-center justify-center w-full py-3 px-6 rounded-xl font-semibold transition-all duration-200 ${
                step.completed 
                  ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                  : 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-blue-600 hover:to-indigo-600 shadow-lg hover:shadow-xl'
              }`}
            >
              {step.completed ? 'View & Edit' : 'Complete Now'}
              <ArrowRight className="h-5 w-5 ml-2" />
            </Link>
          </div>
        ))}
      </div>

      {allCompleted ? (
        <div className="card bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 text-center animate-slideUp">
          <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-10 w-10 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-green-900 mb-3">🎉 Profile Complete!</h3>
          <p className="text-green-700 mb-6 text-lg">Congratulations! You're all set to apply for programs.</p>
          <Link href="/applications" className="btn-primary text-lg px-8 py-4">
            🚀 Start Your Application Journey
          </Link>
        </div>
      ) : (
        <div className="card bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-2xl">📝</span>
          </div>
          <h3 className="text-xl font-bold text-blue-900 mb-2">Complete Your Profile</h3>
          <p className="text-blue-700">Finish all sections to unlock the application process.</p>
        </div>
      )}
    </div>
  );
}