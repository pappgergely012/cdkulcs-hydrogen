import { useLoaderData } from 'react-router';
import type { Route } from './+types/pages.$handle';
import { redirectIfHandleIsLocalized } from '~/lib/redirect';

export const meta: Route.MetaFunction = ({ data }) => {
  return [{ title: `Hydrogen | ${data?.page.title ?? ''}` }];
};

export async function loader(args: Route.LoaderArgs) {
  // Start fetching non-critical data without blocking time to first byte
  const deferredData = loadDeferredData(args);

  // Await the critical data required to render initial state of the page
  const criticalData = await loadCriticalData(args);

  return { ...deferredData, ...criticalData };
}

/**
 * Load data necessary for rendering content above the fold. This is the critical data
 * needed to render the page. If it's unavailable, the whole page should 400 or 500 error.
 */
async function loadCriticalData({
  context,
  request,
  params,
}: Route.LoaderArgs) {
  if (!params.handle) {
    throw new Error('Missing page handle');
  }

  const [{ page }] = await Promise.all([
    context.storefront.query(PAGE_QUERY, {
      variables: {
        handle: params.handle,
      },
    }),
    // Add other queries here, so that they are loaded in parallel
  ]);

  if (!page) {
    throw new Response('Not Found', { status: 404 });
  }

  redirectIfHandleIsLocalized(request, { handle: params.handle, data: page });

  return {
    page,
  };
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */
function loadDeferredData({ context }: Route.LoaderArgs) {
  return {};
}

export default function Page() {
  const { page } = useLoaderData<typeof loader>();

  // Special handling for contact page
  if (page.handle === 'contact') {
    return <ContactPage />;
  }

  return (
    <div className='page'>
      <header>
        <h1>{page.title}</h1>
      </header>
      <main dangerouslySetInnerHTML={{ __html: page.body }} />
    </div>
  );
}

function ContactPage() {
  return (
    <div className='min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 py-12'>
      <div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Hero Section */}
        <div className='text-center mb-16'>
          <div className='inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full mb-6'>
            <svg
              className='w-10 h-10 text-white'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z'
              />
            </svg>
          </div>
          <h1 className='text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-6'>
            Kapcsolat
          </h1>
          <p className='text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed'>
            Keress minket bizalommal! Segítünk minden kérdésben és problémában.
          </p>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-16'>
          {/* Contact Form */}
          <div className='bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20'>
            <div className='flex items-center mb-8'>
              <div className='w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center mr-4'>
                <svg
                  className='w-6 h-6 text-white'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z'
                  />
                </svg>
              </div>
              <h2 className='text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent'>
                Küldj üzenetet
              </h2>
            </div>
            <form className='space-y-6'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div>
                  <label
                    htmlFor='name'
                    className='block text-sm font-semibold text-gray-700 mb-3'
                  >
                    Név *
                  </label>
                  <input
                    type='text'
                    id='name'
                    name='name'
                    required
                    className='w-full px-4 py-4 bg-gray-50/50 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 placeholder-gray-400'
                    placeholder='Teljes neved'
                  />
                </div>

                <div>
                  <label
                    htmlFor='email'
                    className='block text-sm font-semibold text-gray-700 mb-3'
                  >
                    Email cím *
                  </label>
                  <input
                    type='email'
                    id='email'
                    name='email'
                    required
                    className='w-full px-4 py-4 bg-gray-50/50 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 placeholder-gray-400'
                    placeholder='email@pelda.hu'
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor='phone'
                  className='block text-sm font-semibold text-gray-700 mb-3'
                >
                  Telefonszám
                </label>
                <input
                  type='tel'
                  id='phone'
                  name='phone'
                  className='w-full px-4 py-4 bg-gray-50/50 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 placeholder-gray-400'
                  placeholder='+36 20 123 4567'
                />
              </div>

              <div>
                <label
                  htmlFor='subject'
                  className='block text-sm font-semibold text-gray-700 mb-3'
                >
                  Tárgy *
                </label>
                <select
                  id='subject'
                  name='subject'
                  required
                  className='w-full px-4 py-4 bg-gray-50/50 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300'
                >
                  <option value=''>Válassz témát</option>
                  <option value='order'>Rendelés kérdése</option>
                  <option value='technical'>Technikai probléma</option>
                  <option value='refund'>Visszatérítés</option>
                  <option value='other'>Egyéb</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor='message'
                  className='block text-sm font-semibold text-gray-700 mb-3'
                >
                  Üzenet *
                </label>
                <textarea
                  id='message'
                  name='message'
                  rows={6}
                  required
                  className='w-full px-4 py-4 bg-gray-50/50 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 resize-none placeholder-gray-400'
                  placeholder='Írd le a kérdésed vagy problémádat...'
                />
              </div>

              <button
                type='submit'
                className='w-full bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 hover:from-purple-700 hover:via-blue-700 hover:to-indigo-700 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl shadow-lg'
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
                      d='M12 19l9 2-9-18-9 18 9-2zm0 0v-8'
                    />
                  </svg>
                  Üzenet küldése
                </span>
              </button>
            </form>
          </div>

          {/* Contact Information */}
          <div className='space-y-8'>
            <div className='bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20'>
              <div className='flex items-center mb-8'>
                <div className='w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center mr-4'>
                  <svg
                    className='w-6 h-6 text-white'
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
                <h2 className='text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent'>
                  Elérhetőségek
                </h2>
              </div>

              <div className='space-y-8'>
                {/* Phone */}
                <div className='group p-6 bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl border border-purple-100 hover:shadow-lg transition-all duration-300'>
                  <div className='flex items-center space-x-4'>
                    <div className='w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300'>
                      <svg
                        className='w-8 h-8 text-white'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z'
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className='text-xl font-bold text-gray-900 mb-1'>
                        Telefon
                      </h3>
                      <p className='text-lg font-semibold text-purple-600 mb-1'>
                        +36/70-257-4500
                      </p>
                      <p className='text-sm text-gray-500'>
                        Hétfő - Péntek: 9:00 - 18:00
                      </p>
                    </div>
                  </div>
                </div>

                {/* Email */}
                <div className='group p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 hover:shadow-lg transition-all duration-300'>
                  <div className='flex items-center space-x-4'>
                    <div className='w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300'>
                      <svg
                        className='w-8 h-8 text-white'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className='text-xl font-bold text-gray-900 mb-1'>
                        Email
                      </h3>
                      <p className='text-lg font-semibold text-blue-600 mb-1'>
                        rendeles@cdkulcs.hu
                      </p>
                      <p className='text-sm text-gray-500'>
                        24 órán belül válaszolunk
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Support Info */}
            <div className='bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 rounded-3xl p-8 shadow-xl border border-white/20'>
              <div className='flex items-center mb-6'>
                <div className='w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center mr-4'>
                  <svg
                    className='w-6 h-6 text-white'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                    />
                  </svg>
                </div>
                <h3 className='text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent'>
                  Gyakori kérdések
                </h3>
              </div>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div className='p-4 bg-white/60 rounded-xl border border-white/40'>
                  <h4 className='font-bold text-purple-600 mb-2'>Rendelés</h4>
                  <p className='text-sm text-gray-600'>
                    Azonnali aktiválás digitális termékeknél
                  </p>
                </div>
                <div className='p-4 bg-white/60 rounded-xl border border-white/40'>
                  <h4 className='font-bold text-blue-600 mb-2'>
                    Visszatérítés
                  </h4>
                  <p className='text-sm text-gray-600'>14 napos elállási jog</p>
                </div>
                <div className='p-4 bg-white/60 rounded-xl border border-white/40'>
                  <h4 className='font-bold text-indigo-600 mb-2'>
                    Technikai segítség
                  </h4>
                  <p className='text-sm text-gray-600'>
                    Ingyenes telepítési támogatás
                  </p>
                </div>
                <div className='p-4 bg-white/60 rounded-xl border border-white/40'>
                  <h4 className='font-bold text-purple-600 mb-2'>Garancia</h4>
                  <p className='text-sm text-gray-600'>
                    Minden termékre érvényes
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const PAGE_QUERY = `#graphql
  query Page(
    $language: LanguageCode,
    $country: CountryCode,
    $handle: String!
  )
  @inContext(language: $language, country: $country) {
    page(handle: $handle) {
      handle
      id
      title
      body
      seo {
        description
        title
      }
    }
  }
` as const;
