'use client';

import React, { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useApplication, usePaymentMethods, useCreatePayment } from '@/hooks/useApi';
import ProtectedRoute from '@/components/ui/ProtectedRoute';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import FileUpload from '@/components/forms/FileUpload';
import { useForm, Controller } from 'react-hook-form';
import { ArrowLeft } from 'lucide-react';

type PaymentFormData = {
  application: number;
  payment_type: string;
  amount: string;
  payment_method: number;
  bank_reference: string;
  receipt: File | null;
};

export default function NewPaymentPage() {
  return (
      <ProtectedRoute>
        <NewPaymentContent />
      </ProtectedRoute>
  );
}

function NewPaymentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const applicationId = searchParams.get('applicationId');

  const { data: application, isLoading: applicationLoading } = useApplication(Number(applicationId));
  const { data: paymentMethods, isLoading: paymentMethodsLoading } = usePaymentMethods();
  const createPayment = useCreatePayment();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<PaymentFormData>();

  useEffect(() => {
    if (applicationId && !isNaN(Number(applicationId))) {
      setValue('application', Number(applicationId));
      setValue('payment_type', 'application');
    }
  }, [applicationId, setValue]);

  useEffect(() => {
    if (application) {
      // Set the amount based on the application fee
      setValue('amount', '1000.00'); // Ideally fetched from backend
    }
  }, [application, setValue]);

  const onSubmit = (data: PaymentFormData) => {
    const paymentData = {
      ...data,
      receipt: data.receipt || undefined,
    };

    createPayment.mutate(paymentData, {
      onSuccess: () => {
        router.push('/payments');
      },
      onError: (error) => {
        console.error('Error submitting payment:', error);
      },
    });
  };

  const isLoading = applicationLoading || paymentMethodsLoading;

  if (isLoading) {
    return (
        <div className="py-12 flex justify-center">
          <LoadingSpinner size="large" />
        </div>
    );
  }

  if (!application) {
    return (
        <div className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
              <div className="text-center">
                <h3 className="text-lg font-medium text-gray-900">Application not found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  The application you are trying to pay for does not exist or you do not have permission to view it.
                </p>
                <div className="mt-6">
                  <button
                      onClick={() => router.back()}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Go Back
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
    );
  }

  return (
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center mb-6">
            <button
                onClick={() => router.back()}
                className="mr-4 text-gray-500 hover:text-gray-700"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="text-2xl font-semibold text-gray-900">Make Payment</h1>
          </div>

          <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
            <div className="md:grid md:grid-cols-3 md:gap-6">
              <div className="md:col-span-1">
                <h3 className="text-lg font-medium leading-6 text-gray-900">Payment Details</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Submit your payment information for the application.
                </p>
                <div className="mt-4 border-t border-gray-200 pt-4">
                  <h4 className="text-sm font-medium text-gray-900">Application Information</h4>
                  <p className="mt-1 text-sm text-gray-500">{application.program.name}</p>
                  <p className="mt-1 text-sm text-gray-500">{application.tracking_id}</p>
                  <p className="mt-1 text-sm text-gray-500">{application.session.session}</p>
                </div>
              </div>

              <div className="mt-5 md:mt-0 md:col-span-2">
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="grid grid-cols-6 gap-6">
                    <input type="hidden" {...register('application')} />
                    <input type="hidden" {...register('payment_type')} />

                    <div className="col-span-6 sm:col-span-3">
                      <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                        Amount (PKR)
                      </label>
                      <input
                          type="text"
                          id="amount"
                          readOnly
                          className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-gray-100 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          {...register('amount', { required: 'Amount is required' })}
                      />
                    </div>

                    <div className="col-span-6 sm:col-span-3">
                      <label htmlFor="payment_method" className="block text-sm font-medium text-gray-700">
                        Payment Method
                      </label>
                      <select
                          id="payment_method"
                          className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          {...register('payment_method', { required: 'Payment method is required' })}
                      >
                        <option value="">Select a payment method</option>
                        {paymentMethods?.map((method) => (
                            <option key={method.id} value={method.id}>
                              {method.name}
                            </option>
                        ))}
                      </select>
                      {errors.payment_method && (
                          <p className="mt-1 text-sm text-red-600">{errors.payment_method.message}</p>
                      )}
                    </div>

                    <div className="col-span-6">
                      <label htmlFor="bank_reference" className="block text-sm font-medium text-gray-700">
                        Bank Reference / Transaction ID
                      </label>
                      <input
                          type="text"
                          id="bank_reference"
                          placeholder="Enter bank reference or transaction ID"
                          className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          {...register('bank_reference', { required: 'Bank reference is required' })}
                      />
                      {errors.bank_reference && (
                          <p className="mt-1 text-sm text-red-600">{errors.bank_reference.message}</p>
                      )}
                    </div>

                    <div className="col-span-6">
                      <Controller
                          name="receipt"
                          control={control}
                          rules={{ required: 'Receipt is required' }}
                          render={({ field }) => (
                              <FileUpload
                                  label="Payment Receipt"
                                  accept="image/*,.pdf"
                                  onChange={field.onChange}
                                  value={field.value}
                                  error={errors.receipt?.message}
                                  required
                              />
                          )}
                      />
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mr-3"
                    >
                      Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={createPayment.isPending}
                        className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      {createPayment.isPending ? <LoadingSpinner size="small" /> : 'Submit Payment'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}
