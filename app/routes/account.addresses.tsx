import type { CustomerAddressInput } from '@shopify/hydrogen/customer-account-api-types';
import type {
  AddressFragment,
  CustomerFragment,
} from 'customer-accountapi.generated';
import {
  data,
  Form,
  useActionData,
  useNavigation,
  useOutletContext,
  type Fetcher,
} from 'react-router';
import React, { useEffect } from 'react';
import type { Route } from './+types/account.addresses';
import {
  UPDATE_ADDRESS_MUTATION,
  DELETE_ADDRESS_MUTATION,
  CREATE_ADDRESS_MUTATION,
} from '~/graphql/customer-account/CustomerAddressMutations';

export type ActionResponse = {
  addressId?: string | null;
  createdAddress?: AddressFragment;
  defaultAddress?: string | null;
  deletedAddress?: string | null;
  error: Record<AddressFragment['id'], string> | null;
  updatedAddress?: AddressFragment;
};

export const meta: Route.MetaFunction = () => {
  return [{ title: 'Addresses' }];
};

export async function loader({ context }: Route.LoaderArgs) {
  context.customerAccount.handleAuthStatus();

  return {};
}

export async function action({ request, context }: Route.ActionArgs) {
  const { customerAccount } = context;

  try {
    const form = await request.formData();

    const addressId = form.has('addressId')
      ? String(form.get('addressId'))
      : null;
    if (!addressId) {
      throw new Error('You must provide an address id.');
    }

    // this will ensure redirecting to login never happen for mutatation
    const isLoggedIn = await customerAccount.isLoggedIn();
    if (!isLoggedIn) {
      return data(
        { error: { [addressId]: 'Unauthorized' } },
        {
          status: 401,
        }
      );
    }

    const defaultAddress = form.has('defaultAddress')
      ? String(form.get('defaultAddress')) === 'on'
      : false;
    const address: CustomerAddressInput = {};
    const keys: (keyof CustomerAddressInput)[] = [
      'address1',
      'address2',
      'city',
      'company',
      'territoryCode',
      'firstName',
      'lastName',
      'phoneNumber',
      'zoneCode',
      'zip',
    ];

    for (const key of keys) {
      const value = form.get(key);
      if (typeof value === 'string') {
        address[key] = value;
      }
    }

    switch (request.method) {
      case 'POST': {
        // handle new address creation
        try {
          const { data, errors } = await customerAccount.mutate(
            CREATE_ADDRESS_MUTATION,
            {
              variables: {
                address,
                defaultAddress,
                language: customerAccount.i18n.language,
              },
            }
          );

          if (errors?.length) {
            throw new Error(errors[0].message);
          }

          if (data?.customerAddressCreate?.userErrors?.length) {
            throw new Error(data?.customerAddressCreate?.userErrors[0].message);
          }

          if (!data?.customerAddressCreate?.customerAddress) {
            throw new Error('Customer address create failed.');
          }

          return {
            error: null,
            createdAddress: data?.customerAddressCreate?.customerAddress,
            defaultAddress,
          };
        } catch (error: unknown) {
          if (error instanceof Error) {
            return data(
              { error: { [addressId]: error.message } },
              {
                status: 400,
              }
            );
          }
          return data(
            { error: { [addressId]: error } },
            {
              status: 400,
            }
          );
        }
      }

      case 'PUT': {
        // handle address updates
        try {
          const { data, errors } = await customerAccount.mutate(
            UPDATE_ADDRESS_MUTATION,
            {
              variables: {
                address,
                addressId: decodeURIComponent(addressId),
                defaultAddress,
                language: customerAccount.i18n.language,
              },
            }
          );

          if (errors?.length) {
            throw new Error(errors[0].message);
          }

          if (data?.customerAddressUpdate?.userErrors?.length) {
            throw new Error(data?.customerAddressUpdate?.userErrors[0].message);
          }

          if (!data?.customerAddressUpdate?.customerAddress) {
            throw new Error('Customer address update failed.');
          }

          return {
            error: null,
            updatedAddress: address,
            defaultAddress,
          };
        } catch (error: unknown) {
          if (error instanceof Error) {
            return data(
              { error: { [addressId]: error.message } },
              {
                status: 400,
              }
            );
          }
          return data(
            { error: { [addressId]: error } },
            {
              status: 400,
            }
          );
        }
      }

      case 'DELETE': {
        // handles address deletion
        try {
          const { data, errors } = await customerAccount.mutate(
            DELETE_ADDRESS_MUTATION,
            {
              variables: {
                addressId: decodeURIComponent(addressId),
                language: customerAccount.i18n.language,
              },
            }
          );

          if (errors?.length) {
            throw new Error(errors[0].message);
          }

          if (data?.customerAddressDelete?.userErrors?.length) {
            throw new Error(data?.customerAddressDelete?.userErrors[0].message);
          }

          if (!data?.customerAddressDelete?.deletedAddressId) {
            throw new Error('Customer address delete failed.');
          }

          return { error: null, deletedAddress: addressId };
        } catch (error: unknown) {
          if (error instanceof Error) {
            return data(
              { error: { [addressId]: error.message } },
              {
                status: 400,
              }
            );
          }
          return data(
            { error: { [addressId]: error } },
            {
              status: 400,
            }
          );
        }
      }

      default: {
        return data(
          { error: { [addressId]: 'Method not allowed' } },
          {
            status: 405,
          }
        );
      }
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      return data(
        { error: error.message },
        {
          status: 400,
        }
      );
    }
    return data(
      { error },
      {
        status: 400,
      }
    );
  }
}

export default function Addresses() {
  const { customer, openAddressModal } = useOutletContext<{
    customer: CustomerFragment;
    openAddressModal: () => void;
  }>();
  const { defaultAddress, addresses } = customer;

  return (
    <div className='account-addresses'>
      {!addresses.nodes.length ? (
        <div className='text-center py-12'>
          <div className='space-y-6'>
            <div className='w-24 h-24 bg-gradient-to-r from-purple-100 to-blue-100 rounded-full flex items-center justify-center mx-auto'>
              <svg
                className='w-12 h-12 text-purple-600'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z'
                />
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M15 11a3 3 0 11-6 0 3 3 0 016 0z'
                />
              </svg>
            </div>
            <div>
              <h3 className='text-xl font-semibold text-gray-900 mb-2'>
                Nincs mentett cím
              </h3>
              <p className='text-gray-600 mb-6'>
                Adj hozzá egy címet a rendelésekhez!
              </p>
            </div>
            <button
              onClick={openAddressModal}
              className='inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-2xl hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105'
            >
              <svg
                className='w-5 h-5'
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
              Új cím hozzáadása
            </button>
          </div>
        </div>
      ) : (
        <div className='space-y-8'>
          <div className='flex justify-between items-center'>
            <h3 className='text-xl font-semibold text-gray-900'>
              Mentett címek
            </h3>
            <button
              onClick={openAddressModal}
              className='inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105'
            >
              <svg
                className='w-4 h-4'
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
              Új cím
            </button>
          </div>

          <div className='bg-gray-50/50 rounded-2xl p-6'>
            <ExistingAddresses
              addresses={addresses}
              defaultAddress={defaultAddress}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function NewAddressForm({ onSuccess }: { onSuccess?: () => void }) {
  const newAddress = {
    address1: '',
    address2: '',
    city: '',
    company: '',
    territoryCode: '',
    firstName: '',
    id: 'new',
    lastName: '',
    phoneNumber: '',
    zoneCode: '',
    zip: '',
  } as CustomerAddressInput;

  return (
    <AddressForm
      addressId={'NEW_ADDRESS_ID'}
      address={newAddress}
      defaultAddress={null}
      onSuccess={onSuccess}
    >
      {({ stateForMethod }) => (
        <div>
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
  );
}

function ExistingAddresses({
  addresses,
  defaultAddress,
}: Pick<CustomerFragment, 'addresses' | 'defaultAddress'>) {
  return (
    <div>
      <legend>Existing addresses</legend>
      {addresses.nodes.map(address => (
        <AddressForm
          key={address.id}
          addressId={address.id}
          address={address}
          defaultAddress={defaultAddress}
        >
          {({ stateForMethod }) => (
            <div className='flex gap-3'>
              <button
                disabled={stateForMethod('PUT') !== 'idle'}
                formMethod='PUT'
                type='submit'
                className='flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none'
              >
                <span className='flex items-center justify-center'>
                  <svg
                    className='w-4 h-4 mr-2'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12'
                    />
                  </svg>
                  {stateForMethod('PUT') !== 'idle' ? 'Mentés...' : 'Mentés'}
                </span>
              </button>
              <button
                disabled={stateForMethod('DELETE') !== 'idle'}
                formMethod='DELETE'
                type='submit'
                className='bg-red-100 text-red-700 hover:bg-red-200 font-semibold py-3 px-6 rounded-2xl transition-all duration-300 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed'
              >
                <span className='flex items-center justify-center'>
                  <svg
                    className='w-4 h-4 mr-2'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
                    />
                  </svg>
                  {stateForMethod('DELETE') !== 'idle' ? 'Törlés...' : 'Törlés'}
                </span>
              </button>
            </div>
          )}
        </AddressForm>
      ))}
    </div>
  );
}

export function AddressForm({
  addressId,
  address,
  defaultAddress,
  children,
  onSuccess,
}: {
  addressId: AddressFragment['id'];
  address: CustomerAddressInput;
  defaultAddress: CustomerFragment['defaultAddress'];
  children: (props: {
    stateForMethod: (method: 'PUT' | 'POST' | 'DELETE') => Fetcher['state'];
  }) => React.ReactNode;
  onSuccess?: () => void;
}) {
  const { state, formMethod } = useNavigation();
  const action = useActionData<ActionResponse>();
  const error = action?.error?.[addressId];
  const isDefaultAddress = defaultAddress?.id === addressId;

  // Call onSuccess when form is successfully submitted
  useEffect(() => {
    if (action && !action.error && onSuccess) {
      onSuccess();
    }
  }, [action, onSuccess]);
  return (
    <Form id={addressId} className='space-y-6'>
      <fieldset>
        <input type='hidden' name='addressId' defaultValue={addressId} />

        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div>
            <label
              htmlFor='firstName'
              className='block text-sm font-semibold text-gray-700 mb-2'
            >
              Keresztnév*
            </label>
            <input
              aria-label='First name'
              autoComplete='given-name'
              defaultValue={address?.firstName ?? ''}
              id='firstName'
              name='firstName'
              placeholder='Keresztnév'
              required
              type='text'
              className='w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 placeholder-gray-400'
            />
          </div>
          <div>
            <label
              htmlFor='lastName'
              className='block text-sm font-semibold text-gray-700 mb-2'
            >
              Vezetéknév*
            </label>
            <input
              aria-label='Last name'
              autoComplete='family-name'
              defaultValue={address?.lastName ?? ''}
              id='lastName'
              name='lastName'
              placeholder='Vezetéknév'
              required
              type='text'
              className='w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 placeholder-gray-400'
            />
          </div>
        </div>

        <div>
          <label
            htmlFor='company'
            className='block text-sm font-semibold text-gray-700 mb-2'
          >
            Cég
          </label>
          <input
            aria-label='Company'
            autoComplete='organization'
            defaultValue={address?.company ?? ''}
            id='company'
            name='company'
            placeholder='Cég neve'
            type='text'
            className='w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 placeholder-gray-400'
          />
        </div>

        <div>
          <label
            htmlFor='address1'
            className='block text-sm font-semibold text-gray-700 mb-2'
          >
            Cím*
          </label>
          <input
            aria-label='Address line 1'
            autoComplete='address-line1'
            defaultValue={address?.address1 ?? ''}
            id='address1'
            name='address1'
            placeholder='Utca, házszám'
            required
            type='text'
            className='w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 placeholder-gray-400'
          />
        </div>

        <div>
          <label
            htmlFor='address2'
            className='block text-sm font-semibold text-gray-700 mb-2'
          >
            Cím 2
          </label>
          <input
            aria-label='Address line 2'
            autoComplete='address-line2'
            defaultValue={address?.address2 ?? ''}
            id='address2'
            name='address2'
            placeholder='Lakás, emelet, ajtó'
            type='text'
            className='w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 placeholder-gray-400'
          />
        </div>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          <div>
            <label
              htmlFor='city'
              className='block text-sm font-semibold text-gray-700 mb-2'
            >
              Város*
            </label>
            <input
              aria-label='City'
              autoComplete='address-level2'
              defaultValue={address?.city ?? ''}
              id='city'
              name='city'
              placeholder='Város'
              required
              type='text'
              className='w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 placeholder-gray-400'
            />
          </div>
          <div>
            <label
              htmlFor='zoneCode'
              className='block text-sm font-semibold text-gray-700 mb-2'
            >
              Megye*
            </label>
            <input
              aria-label='State/Province'
              autoComplete='address-level1'
              defaultValue={address?.zoneCode ?? ''}
              id='zoneCode'
              name='zoneCode'
              placeholder='Megye'
              required
              type='text'
              className='w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 placeholder-gray-400'
            />
          </div>
          <div>
            <label
              htmlFor='zip'
              className='block text-sm font-semibold text-gray-700 mb-2'
            >
              Irányítószám*
            </label>
            <input
              aria-label='Zip'
              autoComplete='postal-code'
              defaultValue={address?.zip ?? ''}
              id='zip'
              name='zip'
              placeholder='1234'
              required
              type='text'
              className='w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 placeholder-gray-400'
            />
          </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div>
            <label
              htmlFor='territoryCode'
              className='block text-sm font-semibold text-gray-700 mb-2'
            >
              Ország*
            </label>
            <input
              aria-label='territoryCode'
              autoComplete='country'
              defaultValue={address?.territoryCode ?? ''}
              id='territoryCode'
              name='territoryCode'
              placeholder='HU'
              required
              type='text'
              maxLength={2}
              className='w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 placeholder-gray-400'
            />
          </div>
          <div>
            <label
              htmlFor='phoneNumber'
              className='block text-sm font-semibold text-gray-700 mb-2'
            >
              Telefonszám
            </label>
            <input
              aria-label='Phone Number'
              autoComplete='tel'
              defaultValue={address?.phoneNumber ?? ''}
              id='phoneNumber'
              name='phoneNumber'
              placeholder='+36 20 123 4567'
              pattern='^\+?[1-9]\d{3,14}$'
              type='tel'
              className='w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 placeholder-gray-400'
            />
          </div>
        </div>

        <div className='flex items-center space-x-3 p-4 bg-blue-50 rounded-2xl border border-blue-200'>
          <input
            defaultChecked={isDefaultAddress}
            id='defaultAddress'
            name='defaultAddress'
            type='checkbox'
            className='w-5 h-5 text-purple-600 bg-white border-2 border-gray-300 rounded focus:ring-purple-500 focus:ring-2'
          />
          <label
            htmlFor='defaultAddress'
            className='text-sm font-medium text-gray-700'
          >
            Alapértelmezett címként beállítás
          </label>
        </div>

        {error ? (
          <div className='bg-red-50 border border-red-200 rounded-2xl p-4'>
            <div className='flex items-center'>
              <svg
                className='w-5 h-5 text-red-500 mr-2'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                />
              </svg>
              <p className='text-red-700 font-medium'>{error}</p>
            </div>
          </div>
        ) : null}

        {children({
          stateForMethod: method => (formMethod === method ? state : 'idle'),
        })}
      </fieldset>
    </Form>
  );
}
