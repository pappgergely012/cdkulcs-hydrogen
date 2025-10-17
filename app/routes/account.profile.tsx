import type { CustomerFragment } from 'customer-accountapi.generated';
import type { CustomerUpdateInput } from '@shopify/hydrogen/customer-account-api-types';
import { CUSTOMER_UPDATE_MUTATION } from '~/graphql/customer-account/CustomerUpdateMutation';
import {
  data,
  Form,
  useActionData,
  useNavigation,
  useOutletContext,
} from 'react-router';
import type { Route } from './+types/account.profile';

export type ActionResponse = {
  error: string | null;
  customer: CustomerFragment | null;
};

export const meta: Route.MetaFunction = () => {
  return [{ title: 'Profile' }];
};

export async function loader({ context }: Route.LoaderArgs) {
  context.customerAccount.handleAuthStatus();

  return {};
}

export async function action({ request, context }: Route.ActionArgs) {
  const { customerAccount } = context;

  if (request.method !== 'PUT') {
    return data({ error: 'Method not allowed' }, { status: 405 });
  }

  const form = await request.formData();

  try {
    const customer: CustomerUpdateInput = {};
    const validInputKeys = ['firstName', 'lastName'] as const;
    for (const [key, value] of form.entries()) {
      if (!validInputKeys.includes(key as any)) {
        continue;
      }
      if (typeof value === 'string' && value.length) {
        customer[key as (typeof validInputKeys)[number]] = value;
      }
    }

    // update customer and possibly password
    const { data, errors } = await customerAccount.mutate(
      CUSTOMER_UPDATE_MUTATION,
      {
        variables: {
          customer,
          language: customerAccount.i18n.language,
        },
      }
    );

    if (errors?.length) {
      throw new Error(errors[0].message);
    }

    if (!data?.customerUpdate?.customer) {
      throw new Error('Customer profile update failed.');
    }

    return {
      error: null,
      customer: data?.customerUpdate?.customer,
    };
  } catch (error: any) {
    return data(
      { error: error.message, customer: null },
      {
        status: 400,
      }
    );
  }
}

export default function AccountProfile() {
  const account = useOutletContext<{ customer: CustomerFragment }>();
  const { state } = useNavigation();
  const action = useActionData<ActionResponse>();
  const customer = action?.customer ?? account?.customer;

  return (
    <div className='account-profile'>
      <Form method='PUT' className='space-y-6'>
        <div className='bg-gray-50/50 rounded-2xl p-6'>
          <legend className='text-xl font-semibold text-gray-900 mb-6'>
            Személyes adatok
          </legend>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div>
              <label
                htmlFor='firstName'
                className='block text-sm font-semibold text-gray-700 mb-3'
              >
                Keresztnév
              </label>
              <input
                id='firstName'
                name='firstName'
                type='text'
                autoComplete='given-name'
                placeholder='Keresztneved'
                aria-label='First name'
                defaultValue={customer.firstName ?? ''}
                minLength={2}
                className='w-full px-4 py-4 bg-white border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 placeholder-gray-400'
              />
            </div>
            <div>
              <label
                htmlFor='lastName'
                className='block text-sm font-semibold text-gray-700 mb-3'
              >
                Vezetéknév
              </label>
              <input
                id='lastName'
                name='lastName'
                type='text'
                autoComplete='family-name'
                placeholder='Vezetékneved'
                aria-label='Last name'
                defaultValue={customer.lastName ?? ''}
                minLength={2}
                className='w-full px-4 py-4 bg-white border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 placeholder-gray-400'
              />
            </div>
          </div>
        </div>

        {action?.error ? (
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
              <p className='text-red-700 font-medium'>{action.error}</p>
            </div>
          </div>
        ) : null}

        <button
          type='submit'
          disabled={state !== 'idle'}
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
                d='M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12'
              />
            </svg>
            {state !== 'idle' ? 'Frissítés...' : 'Profil frissítése'}
          </span>
        </button>
      </Form>
    </div>
  );
}
