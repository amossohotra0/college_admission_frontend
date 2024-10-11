'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  usePayments, 
  useFeeStructures,
  useVerifyPayment
} from '@/hooks/useApi';
import ProtectedRoute from '@/components/ui/ProtectedRoute';
import RoleGuard from '@/components/ui/RoleGuard';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { 
  CreditCard, 
  DollarSign, 
  CheckCircle, 
  XCircle, 
  Filter,
  FileText
} from 'lucide-react';

export default function AccountantDashboardPage() {
  const router = useRouter();
  const { data: payments, isLoading: paymentsLoading } = usePayments();
  const { data: feeStructures, isLoading: feeStructuresLoading } = useFeeStructures();
  
  const [paymentTypeFilter, setPaymentTypeFilter] = useState('');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('');
  
  const verifyPayment = useVerifyPayment();

  const isLoading = paymentsLoading || feeStructuresLoading;

  const handleVerifyPayment = (paymentId: number) => {
    if (window.confirm('Are you sure you want to verify this payment?')) {
      verifyPayment.mutate(paymentId);
    }
  };

  // Apply filters
  const filteredPayments = Array.isArray(payments) ? payments.filter(payment => {
    if (paymentTypeFilter && payment.payment_type !== paymentTypeFilter) return false;
    if (paymentStatusFilter && payment.status !== paymentStatusFilter) return false;
    return true;
  }) : [];

  // Calculate totals
  const totalPaid = Array.isArray(payments) ? payments.filter(p => p.status === 'paid').reduce((sum, p) => sum + parseFloat(p.amount), 0) : 0;
  const totalPending = Array.isArray(payments) ? payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + parseFloat(p.amount), 0) : 0;
  const totalApplicationFees = Array.isArray(payments) ? payments.filter(p => p.payment_type === 'application' && p.status === 'paid').reduce((sum, p) => sum + parseFloat(p.amount), 0) : 0;
  const totalAdmissionFees = Array.isArray(payments) ? payments.filter(p => p.payment_type === 'admission' && p.status === 'paid').reduce((sum, p) => sum + parseFloat(p.amount), 0) : 0;

  return (
    <ProtectedRoute>
      <RoleGuard allowedRoles={['admin', 'accountant']}>
        <div className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-2xl font-semibold text-gray-900">Finance Dashboard</h1>
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
            {isLoading ? (
              <div className="py-12 flex justify-center">
                <LoadingSpinner size="large" />
              </div>
            ) : (
              <>
                {/* Financial Overview */}
                <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <DollarSign className="h-6 w-6 text-green-400" />
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate">Total Revenue</dt>
                            <dd>
                              <div className="text-lg font-medium text-gray-900">PKR {totalPaid.toLocaleString()}</div>
                            </dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <CreditCard className="h-6 w-6 text-yellow-400" />
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate">Pending Payments</dt>
                            <dd>
                              <div className="text-lg font-medium text-gray-900">PKR {totalPending.toLocaleString()}</div>
                            </dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <FileText className="h-6 w-6 text-blue-400" />
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate">Application Fees</dt>
                            <dd>
                              <div className="text-lg font-medium text-gray-900">PKR {totalApplicationFees.toLocaleString()}</div>
                            </dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <CheckCircle className="h-6 w-6 text-green-400" />
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate">Admission Fees</dt>
                            <dd>
                              <div className="text-lg font-medium text-gray-900">PKR {totalAdmissionFees.toLocaleString()}</div>
                            </dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Filters */}
                <div className="mt-8">
                  <div className="bg-white shadow rounded-lg p-4">
                    <div className="flex flex-wrap items-center gap-4">
                      <div className="flex items-center">
                        <Filter className="h-5 w-5 text-gray-400 mr-2" />
                        <h3 className="text-sm font-medium text-gray-900">Filters:</h3>
                      </div>
                      
                      <div>
                        <label htmlFor="paymentType" className="block text-xs font-medium text-gray-700 mb-1">
                          Payment Type
                        </label>
                        <select
                          id="paymentType"
                          className="block w-full border-gray-300 rounded-md shadow-sm text-sm"
                          value={paymentTypeFilter}
                          onChange={(e) => setPaymentTypeFilter(e.target.value)}
                        >
                          <option value="">All Types</option>
                          <option value="application">Application Fee</option>
                          <option value="admission">Admission Fee</option>
                        </select>
                      </div>
                      
                      <div>
                        <label htmlFor="paymentStatus" className="block text-xs font-medium text-gray-700 mb-1">
                          Payment Status
                        </label>
                        <select
                          id="paymentStatus"
                          className="block w-full border-gray-300 rounded-md shadow-sm text-sm"
                          value={paymentStatusFilter}
                          onChange={(e) => setPaymentStatusFilter(e.target.value)}
                        >
                          <option value="">All Statuses</option>
                          <option value="pending">Pending</option>
                          <option value="paid">Paid</option>
                        </select>
                      </div>
                      
                      <button
                        onClick={() => {
                          setPaymentTypeFilter('');
                          setPaymentStatusFilter('');
                        }}
                        className="px-3 py-1 border border-gray-300 rounded-md text-xs font-medium text-gray-700 bg-white hover:bg-gray-50"
                      >
                        Clear Filters
                      </button>
                    </div>
                  </div>
                </div>

                {/* Payments List */}
                <div className="mt-8">
                  <div className="bg-white shadow rounded-lg">
                    <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">Payment Transactions</h3>
                      <span className="text-sm text-gray-500">
                        {filteredPayments?.length || 0} transactions
                      </span>
                    </div>
                    <div className="border-t border-gray-200">
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Transaction ID
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Student
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Type
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Amount
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Date
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
                            {Array.isArray(filteredPayments) && filteredPayments.map((payment: any) => (
                              <tr key={payment.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm text-gray-900">{payment.transaction_id}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm font-medium text-gray-900">
                                    {payment.application.student.user.first_name} {payment.application.student.user.last_name}
                                  </div>
                                  <div className="text-sm text-gray-500">{payment.application.student.user.email}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm text-gray-900">
                                    {payment.payment_type === 'application' ? 'Application Fee' : 'Admission Fee'}
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm font-medium text-gray-900">PKR {parseFloat(payment.amount).toLocaleString()}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm text-gray-900">
                                    {new Date(payment.created_at).toLocaleDateString()}
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                    payment.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                  }`}>
                                    {payment.status === 'paid' ? 'Paid' : 'Pending'}
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                  <div className="flex space-x-2">
                                    <button
                                      onClick={() => router.push(`/payments/${payment.id}`)}
                                      className="text-blue-600 hover:text-blue-900"
                                    >
                                      View
                                    </button>
                                    {payment.status === 'pending' && (
                                      <button
                                        onClick={() => handleVerifyPayment(payment.id)}
                                        className="text-green-600 hover:text-green-900"
                                      >
                                        Verify
                                      </button>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Fee Structure */}
                <div className="mt-8">
                  <div className="bg-white shadow rounded-lg">
                    <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">Fee Structure</h3>
                      <button
                        onClick={() => router.push('/admin/finance/fee-structure')}
                        className="text-sm font-medium text-blue-600 hover:text-blue-500"
                      >
                        Manage Fee Structure
                      </button>
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
                                Application Fee
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Admission Fee
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Security Fee
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {Array.isArray(feeStructures) && feeStructures.map((fee: any) => (
                              <tr key={fee.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm font-medium text-gray-900">{fee.program.name}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm text-gray-900">{fee.session.session}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm text-gray-900">PKR {parseFloat(fee.application_fee).toLocaleString()}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm text-gray-900">PKR {parseFloat(fee.admission_fee).toLocaleString()}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm text-gray-900">PKR {parseFloat(fee.security_fee).toLocaleString()}</div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </RoleGuard>
    </ProtectedRoute>
  );
}