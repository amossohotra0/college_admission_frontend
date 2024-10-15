'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStudentProfile } from '@/hooks/useApi';
import { studentService } from '@/lib/services';
import toast from 'react-hot-toast';
import ProtectedRoute from '@/components/ui/ProtectedRoute';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { ArrowLeft, Upload, X } from 'lucide-react';
import Link from 'next/link';

export default function ProfilePicturePage() {
  return (
    <ProtectedRoute>
      <ProfilePictureContent />
    </ProtectedRoute>
  );
}

function ProfilePictureContent() {
  const router = useRouter();
  const { data: profile, isLoading, refetch } = useStudentProfile();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    setIsUploading(true);
    try {
      await studentService.updateProfile({ picture: selectedFile });
      toast.success('Profile picture updated successfully');
      await refetch();
      router.push('/profile');
    } catch (error) {
      console.error('Error updating profile picture:', error);
      toast.error('Failed to update profile picture');
    } finally {
      setIsUploading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="py-12 flex justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <div className="mb-6">
        <Link href="/profile" className="flex items-center text-blue-600 hover:text-blue-800">
          <ArrowLeft className="h-4 w-4 mr-1" />
          <span>Back to Profile</span>
        </Link>
      </div>
      
      <div className="bg-white shadow rounded-xl border border-gray-100 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100">
          <h1 className="text-xl font-semibold text-gray-900">Update Profile Picture</h1>
          <p className="mt-1 text-sm text-gray-500">
            Upload a new profile picture or avatar
          </p>
        </div>
        
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col items-center">
              <div className="mb-4">
                {previewUrl ? (
                  <div className="relative">
                    <img 
                      src={previewUrl} 
                      alt="Preview" 
                      className="h-40 w-40 rounded-full object-cover border-4 border-white shadow"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveFile}
                      className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : profile?.picture ? (
                  <img 
                    src={typeof profile.picture === 'string' 
                      ? (profile.picture.startsWith('/') 
                          ? `${process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') || 'http://localhost:8000'}${profile.picture}` 
                          : profile.picture) 
                      : URL.createObjectURL(profile.picture)} 
                    alt="Current Profile" 
                    className="h-40 w-40 rounded-full object-cover border-4 border-white shadow"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = '/placeholder-profile.svg';
                    }}
                  />
                ) : (
                  <div className="h-40 w-40 rounded-full bg-blue-100 flex items-center justify-center border-4 border-white shadow">
                    <span className="text-blue-600 text-5xl font-bold">
                      {profile?.user?.first_name?.[0] || ''}
                      {profile?.user?.last_name?.[0] || ''}
                    </span>
                  </div>
                )}
              </div>
              
              <label className="btn-secondary flex items-center cursor-pointer">
                <Upload className="h-4 w-4 mr-2" />
                <span>Select Image</span>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleFileChange} 
                  className="hidden" 
                />
              </label>
              
              <p className="text-xs text-gray-500 mt-2">
                Recommended: Square image, at least 300x300 pixels
              </p>
            </div>
            
            <div className="flex justify-end space-x-3">
              <Link href="/profile" className="btn-secondary">
                Cancel
              </Link>
              <button 
                type="submit" 
                className="btn-primary"
                disabled={!selectedFile || isUploading}
              >
                {isUploading ? 'Uploading...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}