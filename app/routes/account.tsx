import {
  data as remixData,
  Form,
  NavLink,
  Outlet,
  useLoaderData,
} from 'react-router';
import { useState } from 'react';
import type { Route } from './+types/account';
import { CUSTOMER_DETAILS_QUERY } from '~/graphql/customer-account/CustomerDetailsQuery';
import { AddressModal } from '~/components/AddressModal';

export function shouldRevalidate() {
  return true;
}

export async function loader({ context }: Route.LoaderArgs) {
  const { customerAccount } = context;
  const { data, errors } = await customerAccount.query(CUSTOMER_DETAILS_QUERY, {
    variables: {
      language: customerAccount.i18n.language,
    },
  });

  if (errors?.length || !data?.customer) {
    throw new Error('Customer not found');
  }

  return remixData(
    { customer: data.customer },
    {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    }
  );
}

export default function AccountLayout() {
  const { customer } = useLoaderData<typeof loader>();
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);

  const heading = customer
    ? customer.firstName
      ? `Üdvözöljük, ${customer.firstName}!`
      : `Üdvözöljük a fiókjában!`
    : 'Fiók részletek';

  return (
    <div className='min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 py-12'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Header */}
        <div className='text-center mb-10'>
          <h1 className='text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent pb-2 mb-0'>
            {heading}
          </h1>
        </div>

        {/* Main Content Grid */}
        <div className='grid grid-cols-1 lg:grid-cols-4 gap-8'>
          {/* Account Menu - Left Side */}
          <div className='lg:col-span-1'>
            <div className='bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/20 sticky top-20'>
              <AccountMenu />
            </div>
          </div>

          {/* Content - Right Side */}
          <div className='lg:col-span-3'>
            <div className='bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20'>
              <Outlet
                context={{
                  customer,
                  openAddressModal: () => setIsAddressModalOpen(true),
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Address Modal */}
      <AddressModal
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
      />
    </div>
  );
}

function AccountMenu() {
  return (
    <nav role='navigation' className='flex flex-col gap-3'>
      <NavLink
        to='/account/orders'
        className={({ isActive }) =>
          `flex items-center gap-2 px-6 py-3 rounded-2xl font-semibold transition-all duration-300 ${
            isActive
              ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md'
          }`
        }
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
            d='M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2'
          />
        </svg>
        Rendelések
      </NavLink>

      <NavLink
        to='/account/profile'
        className={({ isActive }) =>
          `flex items-center gap-2 px-6 py-3 rounded-2xl font-semibold transition-all duration-300 ${
            isActive
              ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md'
          }`
        }
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
            d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
          />
        </svg>
        Profil
      </NavLink>

      <NavLink
        to='/account/addresses'
        className={({ isActive }) =>
          `flex items-center gap-2 px-6 py-3 rounded-2xl font-semibold transition-all duration-300 ${
            isActive
              ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md'
          }`
        }
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
            d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z'
          />
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M15 11a3 3 0 11-6 0 3 3 0 016 0z'
          />
        </svg>
        Címek
      </NavLink>

      <Logout />
    </nav>
  );
}

function Logout() {
  return (
    <Form className='account-logout' method='POST' action='/account/logout'>
      <button
        type='submit'
        className='flex items-center gap-2 px-6 py-3 rounded-2xl font-semibold transition-all duration-300 bg-red-100 text-red-700 hover:bg-red-200 hover:shadow-md w-full'
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
            d='M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1'
          />
        </svg>
        Kijelentkezés
      </button>
    </Form>
  );
}
