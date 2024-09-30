import React, { useState, useRef } from 'react';
import { Upload, X, Check } from 'lucide-react';

interface FileUploadProps {
  label: string;
  accept?: string;
  onChange: (file: File | null) => void;
  value?: File | string | null;
  error?: string;
  required?: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({
  label,
  accept = 'image/*',
  onChange,
  value,
  error,
  required = false,
}) => {
  const [fileName, setFileName] = useState<string>('');
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    
    if (file) {
      setFileName(file.name);
      onChange(file);
      
      // Create preview for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = () => {
          setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setPreview(null);
      }
    } else {
      setFileName('');
      setPreview(null);
      onChange(null);
    }
  };

  // Handle click on the upload button
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  // Handle removing the file
  const handleRemoveFile = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setFileName('');
    setPreview(null);
    onChange(null);
  };

  // Set initial preview if value is a string (URL)
  React.useEffect(() => {
    if (typeof value === 'string' && value) {
      setFileName('Current file');
      setPreview(value);
    } else if (value instanceof File) {
      setFileName(value.name);
      
      if (value.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = () => {
          setPreview(reader.result as string);
        };
        reader.readAsDataURL(value);
      }
    }
  }, [value]);

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept={accept}
        className="hidden"
      />
      
      {!fileName ? (
        <div
          onClick={handleUploadClick}
          className="border-2 border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 transition-colors"
        >
          <Upload className="h-8 w-8 text-gray-400 mb-2" />
          <p className="text-sm text-gray-500">Click to upload or drag and drop</p>
          <p className="text-xs text-gray-400 mt-1">{accept.replace('*', '')}</p>
        </div>
      ) : (
        <div className="border rounded-md p-3 flex items-center justify-between">
          <div className="flex items-center">
            {preview ? (
              <img src={preview} alt="Preview" className="h-10 w-10 object-cover rounded mr-3" />
            ) : (
              <Check className="h-5 w-5 text-green-500 mr-3" />
            )}
            <span className="text-sm truncate max-w-xs">{fileName}</span>
          </div>
          <button
            type="button"
            onClick={handleRemoveFile}
            className="text-red-500 hover:text-red-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      )}
      
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default FileUpload;