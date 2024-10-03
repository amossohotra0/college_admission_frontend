import React from 'react';
import { FileX } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon = <FileX className="h-12 w-12 text-gray-400" />,
  action,
}) => {
  return (
    <div className="text-center py-12 px-4 border border-dashed rounded-lg">
      <div className="flex justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-medium text-gray-900">{title}</h3>
      <p className="mt-1 text-sm text-gray-500">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
};

export default EmptyState;