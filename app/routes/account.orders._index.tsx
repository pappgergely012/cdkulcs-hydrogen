import {
  Link,
  useLoaderData,
  useNavigation,
  useSearchParams,
} from 'react-router';
import type { Route } from './+types/account.orders._index';
import { useRef } from 'react';
import {
  Money,
  getPaginationVariables,
  flattenConnection,
} from '@shopify/hydrogen';
import {
  buildOrderSearchQuery,
  parseOrderFilters,
  ORDER_FILTER_FIELDS,
  type OrderFilterParams,
} from '~/lib/orderFilters';
import { CUSTOMER_ORDERS_QUERY } from '~/graphql/customer-account/CustomerOrdersQuery';
import type {
  CustomerOrdersFragment,
  OrderItemFragment,
} from 'customer-accountapi.generated';
import { PaginatedResourceSection } from '~/components/PaginatedResourceSection';

type OrdersLoaderData = {
  customer: CustomerOrdersFragment;
  filters: OrderFilterParams;
};

export const meta: Route.MetaFunction = () => {
  return [{ title: 'Orders' }];
};

export async function loader({ request, context }: Route.LoaderArgs) {
  const { customerAccount } = context;
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 20,
  });

  const url = new URL(request.url);
  const filters = parseOrderFilters(url.searchParams);
  const query = buildOrderSearchQuery(filters);

  const { data, errors } = await customerAccount.query(CUSTOMER_ORDERS_QUERY, {
    variables: {
      ...paginationVariables,
      query,
      language: customerAccount.i18n.language,
    },
  });

  if (errors?.length || !data?.customer) {
    throw Error('Customer orders not found');
  }

  return { customer: data.customer, filters };
}

export default function Orders() {
  const { customer, filters } = useLoaderData<OrdersLoaderData>();
  const { orders } = customer;

  return (
    <div className='orders'>
      <div className='space-y-8'>
        <OrderSearchForm currentFilters={filters} />
        <OrdersTable orders={orders} filters={filters} />
      </div>
    </div>
  );
}

function OrdersTable({
  orders,
  filters,
}: {
  orders: CustomerOrdersFragment['orders'];
  filters: OrderFilterParams;
}) {
  const hasFilters = !!(filters.name || filters.confirmationNumber);

  return (
    <div className='acccount-orders' aria-live='polite'>
      {orders?.nodes.length ? (
        <PaginatedResourceSection connection={orders}>
          {({ node: order }) => <OrderItem key={order.id} order={order} />}
        </PaginatedResourceSection>
      ) : (
        <EmptyOrders hasFilters={hasFilters} />
      )}
    </div>
  );
}

function EmptyOrders({ hasFilters = false }: { hasFilters?: boolean }) {
  return (
    <div className='text-center py-12'>
      {hasFilters ? (
        <div className='space-y-6'>
          <div className='w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto'>
            <svg
              className='w-12 h-12 text-gray-400'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
              />
            </svg>
          </div>
          <div>
            <h3 className='text-xl font-semibold text-gray-900 mb-2'>
              Nincs találat
            </h3>
            <p className='text-gray-600 mb-6'>
              Nem találtunk rendelést a keresési feltételeknek megfelelően.
            </p>
            <Link
              to='/account/orders'
              className='inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-2xl hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105'
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
                  d='M6 18L18 6M6 6l12 12'
                />
              </svg>
              Szűrők törlése
            </Link>
          </div>
        </div>
      ) : (
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
                d='M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2'
              />
            </svg>
          </div>
          <div>
            <h3 className='text-xl font-semibold text-gray-900 mb-2'>
              Még nincs rendelésed
            </h3>
            <p className='text-gray-600 mb-6'>
              Kezdj el vásárolni és itt megjelennek a rendeléseid!
            </p>
            <Link
              to='/collections'
              className='inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-2xl hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105'
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
                  d='M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01'
                />
              </svg>
              Vásárlás kezdése
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

function OrderSearchForm({
  currentFilters,
}: {
  currentFilters: OrderFilterParams;
}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigation = useNavigation();
  const isSearching =
    navigation.state !== 'idle' &&
    navigation.location?.pathname?.includes('orders');
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const params = new URLSearchParams();

    const name = formData.get(ORDER_FILTER_FIELDS.NAME)?.toString().trim();
    const confirmationNumber = formData
      .get(ORDER_FILTER_FIELDS.CONFIRMATION_NUMBER)
      ?.toString()
      .trim();

    if (name) params.set(ORDER_FILTER_FIELDS.NAME, name);
    if (confirmationNumber)
      params.set(ORDER_FILTER_FIELDS.CONFIRMATION_NUMBER, confirmationNumber);

    setSearchParams(params);
  };

  const hasFilters = currentFilters.name || currentFilters.confirmationNumber;

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className='bg-gray-50/50 rounded-2xl p-6'
      aria-label='Search orders'
    >
      <fieldset>
        <legend className='text-xl font-semibold text-gray-900 mb-6'>
          Rendelések szűrése
        </legend>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-6'>
          <div>
            <label
              htmlFor={ORDER_FILTER_FIELDS.NAME}
              className='block text-sm font-medium text-gray-700 mb-2'
            >
              Rendelésszám
            </label>
            <input
              type='search'
              id={ORDER_FILTER_FIELDS.NAME}
              name={ORDER_FILTER_FIELDS.NAME}
              placeholder='Rendelésszám'
              aria-label='Order number'
              defaultValue={currentFilters.name || ''}
              className='w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 placeholder-gray-400'
            />
          </div>
          <div>
            <label
              htmlFor={ORDER_FILTER_FIELDS.CONFIRMATION_NUMBER}
              className='block text-sm font-medium text-gray-700 mb-2'
            >
              Megerősítési szám
            </label>
            <input
              type='search'
              id={ORDER_FILTER_FIELDS.CONFIRMATION_NUMBER}
              name={ORDER_FILTER_FIELDS.CONFIRMATION_NUMBER}
              placeholder='Megerősítési szám'
              aria-label='Confirmation number'
              defaultValue={currentFilters.confirmationNumber || ''}
              className='w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 placeholder-gray-400'
            />
          </div>
        </div>

        <div className='flex flex-wrap gap-4'>
          <button
            type='submit'
            disabled={isSearching}
            className='flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-2xl hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none'
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
                d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
              />
            </svg>
            {isSearching ? 'Keresés...' : 'Keresés'}
          </button>
          {hasFilters && (
            <button
              type='button'
              disabled={isSearching}
              onClick={() => {
                setSearchParams(new URLSearchParams());
                formRef.current?.reset();
              }}
              className='flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-2xl hover:bg-gray-200 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed'
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
                  d='M6 18L18 6M6 6l12 12'
                />
              </svg>
              Törlés
            </button>
          )}
        </div>
      </fieldset>
    </form>
  );
}

function OrderItem({ order }: { order: OrderItemFragment }) {
  const fulfillmentStatus = flattenConnection(order.fulfillments)[0]?.status;
  return (
    <div className='bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300'>
      <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
        <div className='flex-1'>
          <div className='flex items-center gap-3 mb-3'>
            <div className='w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center'>
              <svg
                className='w-5 h-5 text-white'
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
            </div>
            <div>
              <Link
                to={`/account/orders/${btoa(order.id)}`}
                className='text-xl font-bold text-gray-900 hover:text-purple-600 transition-colors'
              >
                #{order.number}
              </Link>
              <p className='text-sm text-gray-500'>
                {new Date(order.processedAt).toLocaleDateString('hu-HU')}
              </p>
            </div>
          </div>

          <div className='space-y-2'>
            {order.confirmationNumber && (
              <p className='text-sm text-gray-600'>
                <span className='font-medium'>Megerősítés:</span>{' '}
                {order.confirmationNumber}
              </p>
            )}
            <div className='flex flex-wrap gap-2'>
              <span className='inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800'>
                {order.financialStatus}
              </span>
              {fulfillmentStatus && (
                <span className='inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800'>
                  {fulfillmentStatus}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className='flex flex-col items-end gap-3'>
          <div className='text-right'>
            <p className='text-2xl font-bold text-gray-900'>
              <Money data={order.totalPrice} />
            </p>
          </div>
          <Link
            to={`/account/orders/${btoa(order.id)}`}
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
                d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'
              />
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z'
              />
            </svg>
            Megtekintés
          </Link>
        </div>
      </div>
    </div>
  );
}
