'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { usePayments, usePaymentMethods } from '@/hooks/useApi';
import ProtectedRoute from '@/components/ui/ProtectedRoute';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { 
  CreditCard, 
  Search, 
  Filter, 
  PlusCircle, 
  Calendar, 
  FileText,
  Download,
  ExternalLink
} from 'lucide-react';

export default function PaymentsPage() {
  const router = useRouter();
  const { data: payments, isLoading: paymentsLoading } = usePayments();
  const { data: paymentMethods, isLoading: methodsLoading } = usePaymentMethods();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  
  const isLoading = paymentsLoading || methodsLoading;

  // Filter payments based on search term, status, and type
  const filteredPayments = Array.isArray(payments) 
    ? payments.filter((payment: any) => {
        const matchesStatus = statusFilter === '' || payment.status === statusFilter;
        const matchesType = typeFilter === '' || payment.payment_type === typeFilter;
        const matchesSearch = searchTerm === '' || 
          payment.transaction_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (payment.bank_reference && payment.bank_reference.toLowerCase().includes(searchTerm.toLowerCase()));
        return matchesStatus && matchesType && matchesSearch;
      })
    : [];

  // Get payment status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-amber-100 text-amber-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'refunded':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Get payment type display name
  const getPaymentTypeDisplay = (type: string) => {
    switch (type) {
      case 'application':
        return 'Application Fee';
      case 'admission':
        return 'Admission Fee';
      case 'security':
        return 'Security Fee';
      default:
        return type.charAt(0).toUpperCase() + type.slice(1);
    }
  };

  return (
    <ProtectedRoute>
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">My Payments</h1>
              <p className="mt-1 text-sm text-gray-500">
                View and manage your payments
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <Link
                href="/payments/new"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition"
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                New Payment
              </Link>
            </div>
          </div>

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
                          placeholder="Search by transaction ID or reference..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <div className="w-full md:w-auto flex flex-col sm:flex-row gap-4">
                      <div className="flex items-center">
                        <Filter className="h-5 w-5 text-gray-400 mr-2" />
                        <select
                          className="block w-full border-gray-300 rounded-md shadow-sm text-sm"
                          value={statusFilter}
                          onChange={(e) => setStatusFilter(e.target.value)}
                        >
                          <option value="">All Statuses</option>
                          <option value="pending">Pending</option>
                          <option value="paid">Paid</option>
                          <option value="failed">Failed</option>
                          <option value="refunded">Refunded</option>
                        </select>
                      </div>
                      
                      <div className="flex items-center">
                        <select
                          className="block w-full border-gray-300 rounded-md shadow-sm text-sm"
                          value={typeFilter}
                          onChange={(e) => setTypeFilter(e.target.value)}
                        >
                          <option value="">All Types</option>
                          <option value="application">Application Fee</option>
                          <option value="admission">Admission Fee</option>
                          <option value="security">Security Fee</option>
                        </select>
                      </div>
                    </div>
                    
                    {(searchTerm || statusFilter || typeFilter) && (
                      <button
                        onClick={() => {
                          setSearchTerm('');
                          setStatusFilter('');
                          setTypeFilter('');
                        }}
                        className="px-3 py-1 border border-gray-300 rounded-md text-xs font-medium text-gray-700 bg-white hover:bg-gray-50"
                      >
                        Clear Filters
                      </button>
                    )}
                  </div>
                </div>

                {/* Payments List */}
                {filteredPayments.length > 0 ? (
                  <div className="bg-white shadow rounded-xl border border-gray-100 overflow-hidden">
                    <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center">
                      <div className="flex items-center">
                        <CreditCard className="h-5 w-5 text-green-500 mr-2" />
                        <h3 className="text-lg font-semibold text-gray-900">Payments</h3>
                      </div>
                      <span className="text-sm text-gray-500">
                        {filteredPayments.length} payments
                      </span>
                    </div>
                    
                    <ul className="divide-y divide-gray-100">
                      {filteredPayments.map((payment: any) => (
                        <li key={payment.id} className="px-6 py-5 hover:bg-gray-50 transition">
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center">
                                <h4 className="text-base font-medium text-gray-900 truncate">
                                  {getPaymentTypeDisplay(payment.payment_type)}
                                </h4>
                                <span className={`ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                                  {payment.status.toUpperCase()}
                                </span>
                              </div>
                              
                              <div className="mt-1 flex items-center text-sm text-gray-500">
                                <span className="truncate mr-3">
                                  Transaction ID: {payment.transaction_id}
                                </span>
                                {payment.bank_reference && (
                                  <span className="truncate">
                                    Ref: {payment.bank_reference}
                                  </span>
                                )}
                              </div>
                              
                              <div className="mt-1 flex items-center text-sm text-gray-500">
                                <FileText className="h-4 w-4 text-gray-400 mr-1" />
                                <span className="truncate mr-3">
                                  {payment.application?.program?.name || 'N/A'}
                                </span>
                                <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                                <span>
                                  {payment.created_at ? new Date(payment.created_at).toLocaleDateString() : 'N/A'}
                                </span>
                              </div>
                            </div>
                            
                            <div className="mt-4 md:mt-0 flex items-center">
                              <div className="text-lg font-semibold text-gray-900 mr-6">
                                Rs. {payment.amount}
                              </div>
                              
                              <div className="flex space-x-3">
                                {payment.receipt && (
                                  <a
                                    href={payment.receipt}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-500"
                                  >
                                    <Download className="h-4 w-4 mr-1" />
                                    Receipt
                                  </a>
                                )}
                                
                                <Link
                                  href={`/payments/${payment.id}`}
                                  className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-500"
                                >
                                  <ExternalLink className="h-4 w-4 mr-1" />
                                  Details
                                </Link>
                              </div>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <div className="bg-white shadow rounded-xl border border-gray-100 p-12 text-center">
                    <CreditCard className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No payments found</h3>
                    <p className="text-gray-500 mb-6">
                      {searchTerm || statusFilter || typeFilter 
                        ? 'Try changing your search or filter criteria' 
                        : 'You have no payments yet'}
                    </p>
                    <Link
                      href="/payments/new"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition"
                    >
                      Make a Payment
                    </Link>
                  </div>
                )}
                
                {/* Payment Methods Info */}
                {paymentMethods && paymentMethods.length > 0 && (
                  <div className="mt-8 bg-white shadow rounded-xl border border-gray-100 overflow-hidden">
                    <div className="px-6 py-5 border-b border-gray-100">
                      <h3 className="text-lg font-semibold text-gray-900">Payment Methods</h3>
                    </div>
                    <div className="p-6">
                      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {paymentMethods.map((method: any) => (
                          <li key={method.id} className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                            <h4 className="font-medium text-gray-900">{method.name}</h4>
                          </li>
                        ))}
                      </ul>
                    </div>
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