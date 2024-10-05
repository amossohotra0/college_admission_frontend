'use client';

import { AlertTriangle, FileText, Camera, X } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

interface ProfileIncompleteModalProps {
  completionPercentage: number;
  showInitially?: boolean;
}

export default function ProfileIncompleteModal({ 
  completionPercentage,
  showInitially = false
}: ProfileIncompleteModalProps) {
  const [isOpen, setIsOpen] = useState(showInitially);
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <AlertTriangle className="h-6 w-6 text-amber-500 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">Profile Incomplete</h3>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600">
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <div className="mb-4">
            <div className="bg-amber-50 border border-amber-200 rounded-md p-3 mb-4">
              <p className="text-sm text-amber-800">
                Your profile is only <strong>{completionPercentage}% complete</strong>. 
                Please complete all sections to apply for programs.
              </p>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-start">
                <FileText className="h-5 w-5 text-blue-500 mr-3 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Required Information</p>
                  <p className="text-xs text-gray-600">Personal, contact, educational, and medical details</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Camera className="h-5 w-5 text-green-500 mr-3 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Required Documents</p>
                  <p className="text-xs text-gray-600">CNIC images, educational certificates (scanned/clear photos)</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex space-x-3">
            <Link 
              href="/profile" 
              className="flex-1 bg-blue-600 text-white text-center py-2 px-4 rounded-md text-sm font-medium hover:bg-blue-700 transition"
              onClick={() => setIsOpen(false)}
            >
              Complete Profile
            </Link>
            <button 
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition"
            >
              Later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}