'use client';

import React from 'react';
import Modal from '@/components/ui/Modal';
import StatusBadge from '@/components/ui/StatusBadge';
import { FileDown } from 'lucide-react';
import { generateApplicationPDF } from '@/utils/pdfGenerator';

interface ApplicationDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  application: any;
}

const ApplicationDetailModal: React.FC<ApplicationDetailModalProps> = ({
  isOpen,
  onClose,
  application,
}) => {
  // Always define these variables, but use safe defaults when application is null
  const student = application?.student || {};
  const user = student?.user || {};
  
  // Return early but after all hooks are called
  if (!application) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="Application Details" size="xl">
        <div className="p-6 text-center text-gray-600 text-sm">
          <p>No application data available.</p>
        </div>
      </Modal>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Application Details" size="xl">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-4">
            {student.picture ? (
              <img
                src={typeof student.picture === 'string' ? student.picture : URL.createObjectURL(student.picture)}
                alt="Student"
                className="h-32 w-32 rounded-full object-cover border-2 border-gray-300 shadow-sm"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = '/placeholder-profile.svg';
                }}
              />
            ) : (
              <div className="h-32 w-32 rounded-full bg-gray-200 flex items-center justify-center text-3xl font-bold text-gray-500 border-2 border-gray-300 shadow-sm">
                {user?.first_name?.[0] || ''}
                {user?.last_name?.[0] || ''}
              </div>
            )}

            <div>
              <h2 className="text-2xl font-semibold text-gray-900">{application.tracking_id}</h2>
              <p className="text-sm text-gray-500">Applied on {new Date(application.applied_at).toLocaleDateString()}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <StatusBadge status={application.status.code} />
            <button
              onClick={() => generateApplicationPDF(application)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition"
              title="Download PDF"
            >
              <FileDown className="w-4 h-4" />
              Download PDF
            </button>
          </div>
        </div>

        {/* Application Info */}
        <div className="grid md:grid-cols-2 gap-6">
          <SectionCard title="Application Information">
            <InfoRow label="Form Number" value={application.application_form_no} />
            <InfoRow label="Program" value={`${application.program.name} (${application.program.code})`} />
            <InfoRow label="Session" value={application.session.session} />
            <InfoRow
              label="Academic Year"
              value={`${application.session.start_date.split('-')[0]} - ${application.session.end_date.split('-')[0]}`}
            />
            <InfoRow
              label="Payment Status"
              value={application.payment_status.toUpperCase()}
              valueClass={application.payment_status === 'paid' ? 'text-green-600' : 'text-amber-600'}
            />
          </SectionCard>

          <SectionCard title="Student Information">
            <InfoRow label="Name" value={`${user.first_name} ${user.last_name}`} />
            <InfoRow label="Email" value={user.email} />
            <InfoRow label="Phone" value={user.phone || 'N/A'} />
            <InfoRow label="CNIC" value={user.cnic || 'N/A'} />
            <InfoRow
              label="Verification"
              value={user.is_verified ? 'Verified' : 'Not Verified'}
              valueClass={user.is_verified ? 'text-green-600' : 'text-red-600'}
            />
          </SectionCard>
        </div>

        {/* Optional Sections */}
        {student.personal_info && (
          <SectionCard title="Personal Information">
            <div className="grid md:grid-cols-2 gap-4">
              <InfoRow label="Father's Name" value={student.personal_info.father_name} />
              <InfoRow
                label="Date of Birth"
                value={new Date(student.personal_info.date_of_birth).toLocaleDateString()}
              />
              <InfoRow label="Gender" value={capitalize(student.personal_info.gender)} />
              <InfoRow label="CNIC" value={student.personal_info.cnic} />
              <InfoRow label="Contact" value={student.personal_info.registered_contact} />
            </div>
          </SectionCard>
        )}

        {student.contact_info && (
          <SectionCard title="Contact Information">
            <div className="grid md:grid-cols-2 gap-4">
              <InfoRow label="District" value={student.contact_info.district} />
              <InfoRow label="Tehsil" value={student.contact_info.tehsil} />
              <InfoRow label="City" value={student.contact_info.city} />
              <InfoRow label="Permanent Address" value={student.contact_info.permanent_address} />
              <InfoRow label="Current Address" value={student.contact_info.current_address} />
              <InfoRow label="Postal Address" value={student.contact_info.postal_address} />
            </div>
          </SectionCard>
        )}

        {student.educational_records?.length > 0 && (
          <SectionCard title="Educational Records">
            <div className="overflow-x-auto rounded-md">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    {['Degree', 'Institution', 'Year', 'Marks', 'Percentage', 'Grade'].map((head) => (
                      <th key={head} className="px-3 py-2 text-left font-semibold text-gray-600 uppercase tracking-wide">
                        {head}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {student.educational_records.map((rec: any, i: number) => (
                    <tr key={i}>
                      <td className="px-3 py-2">{rec.degree_name}</td>
                      <td className="px-3 py-2">{rec.institution_name}</td>
                      <td className="px-3 py-2">{rec.passing_year}</td>
                      <td className="px-3 py-2">{rec.obtained_marks}/{rec.total_marks}</td>
                      <td className="px-3 py-2">{rec.percentage}%</td>
                      <td className="px-3 py-2">{rec.grade || 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </SectionCard>
        )}

        {student.medical_info && (
          <SectionCard title="Medical Information">
            <div className="grid md:grid-cols-3 gap-4">
              <InfoRow label="Blood Group" value={student.medical_info.blood_group_name} />
              <InfoRow label="Disabled" value={student.medical_info.is_disabled ? 'Yes' : 'No'} />
              <InfoRow
                label="Diseases"
                value={
                  student.medical_info.diseases_list?.length
                    ? student.medical_info.diseases_list.join(', ')
                    : 'None'
                }
              />
            </div>
          </SectionCard>
        )}
      </div>
    </Modal>
  );
};

// Helper components
const SectionCard = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="bg-white border rounded-xl shadow-sm p-5 space-y-3">
    <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">{title}</h3>
    {children}
  </div>
);

const InfoRow = ({
  label,
  value,
  valueClass = 'text-gray-800',
}: {
  label: string;
  value: string | number;
  valueClass?: string;
}) => (
  <div className="flex justify-between text-sm">
    <span className="text-gray-500">{label}:</span>
    <span className={`font-medium ${valueClass}`}>{value}</span>
  </div>
);

const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

export default ApplicationDetailModal;