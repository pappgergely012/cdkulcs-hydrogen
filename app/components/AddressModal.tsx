import { useState, useEffect } from 'react';
import { useActionData, useNavigation } from 'react-router';
import { AddressForm } from '~/routes/account.addresses';

interface AddressModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddressModal({ isOpen, onClose }: AddressModalProps) {
  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 md:p-4 sm:p-0'>
      <div className='bg-white rounded-3xl p-8 max-w-4xl w-full max-h-[95vh] overflow-y-auto shadow-2xl md:max-h-[95vh] md:rounded-3xl md:p-8 sm:max-h-[100vh] sm:rounded-none sm:p-4 sm:m-0 sm:max-w-none sm:w-full sm:h-full sm:flex sm:flex-col'>
        <div className='flex justify-between items-center mb-6 sm:flex-shrink-0'>
          <h2 className='text-2xl font-bold text-gray-900'>
            Új cím hozzáadása
          </h2>
          <button
            onClick={onClose}
            className='p-2 hover:bg-gray-100 rounded-xl transition-colors'
          >
            <svg
              className='w-6 h-6 text-gray-500'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M6 18L18 6M6 6l12 12'
              />
            </svg>
          </button>
        </div>

        <div className='flex-1 overflow-y-auto sm:flex-1'>
          <AddressForm
            addressId={'NEW_ADDRESS_ID'}
            address={{
              address1: '',
              address2: '',
              city: '',
              company: '',
              territoryCode: '',
              firstName: '',
              lastName: '',
              phoneNumber: '',
              zoneCode: '',
              zip: '',
            }}
            defaultAddress={null}
            onSuccess={onClose}
          >
            {({ stateForMethod }) => (
              <div className='sm:flex-shrink-0 sm:mt-4'>
                <button
                  disabled={stateForMethod('POST') !== 'idle'}
                  formMethod='POST'
                  type='submit'
                  className='w-full bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 hover:from-purple-700 hover:via-blue-700 hover:to-indigo-700 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none'
                >
                  <span className='flex items-center justify-center'>
                    <svg
                      className='w-5 h-5 mr-2'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M12 6v6m0 0v6m0-6h6m-6 0H6'
                      />
                    </svg>
                    {stateForMethod('POST') !== 'idle'
                      ? 'Létrehozás...'
                      : 'Cím hozzáadása'}
                  </span>
                </button>
              </div>
            )}
          </AddressForm>
        </div>
      </div>
    </div>
  );
}
