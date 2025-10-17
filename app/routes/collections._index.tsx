import { useLoaderData, Link } from 'react-router';
import type { Route } from './+types/collections._index';
import { getPaginationVariables, Image } from '@shopify/hydrogen';
import type { CollectionFragment } from 'storefrontapi.generated';
import { PaginatedResourceSection } from '~/components/PaginatedResourceSection';

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
async function loadCriticalData({ context, request }: Route.LoaderArgs) {
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 4,
  });

  const [{ collections }] = await Promise.all([
    context.storefront.query(COLLECTIONS_QUERY, {
      variables: paginationVariables,
    }),
    // Add other queries here, so that they are loaded in parallel
  ]);

  return { collections };
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */
function loadDeferredData({ context }: Route.LoaderArgs) {
  return {};
}

export default function Collections() {
  const { collections } = useLoaderData<typeof loader>();

  return (
    <div className='min-h-screen bg-gray-50 py-8'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Header Section */}
        <div className='text-center mb-12'>
          <h1 className='text-4xl font-bold text-gray-900 mb-4'>
            Termék Kategóriák
          </h1>
          <p className='text-lg text-gray-600 max-w-2xl mx-auto'>
            Fedezd fel a széles választékot kategóriánként. Minden kategóriában
            megtalálod a legjobb ajánlatokat és legújabb termékeket.
          </p>
        </div>

        {/* Collections Grid */}
        <PaginatedResourceSection<CollectionFragment>
          connection={collections}
          resourcesClassName='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
        >
          {({ node: collection, index }) => (
            <CollectionItem
              key={collection.id}
              collection={collection}
              index={index}
            />
          )}
        </PaginatedResourceSection>
      </div>
    </div>
  );
}

function CollectionItem({
  collection,
  index,
}: {
  collection: CollectionFragment;
  index: number;
}) {
  return (
    <Link
      className='group cursor-pointer flex flex-col justify-start bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl hover:scale-105 transition-all duration-300 ease-in-out'
      key={collection.id}
      to={`/collections/${collection.handle}`}
      prefetch='intent'
    >
      <div className='relative aspect-square overflow-hidden'>
        {collection?.image ? (
          <div className='absolute inset-0'>
            <Image
              alt={collection.image.altText || collection.title}
              data={collection.image}
              loading={index < 3 ? 'eager' : undefined}
              sizes='(min-width: 45em) 400px, 100vw'
              className='w-full h-full object-cover filter blur-sm scale-110'
            />
            {/* Dark overlay for better text readability */}
            <div className='absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors duration-300'></div>
          </div>
        ) : (
          <div className='absolute inset-0 bg-gradient-to-br from-purple-600 to-purple-700'></div>
        )}

        {/* Collection Image/Logo in center */}
        <div className='relative h-full'>
          <div className='w-full h-full bg-white/20 backdrop-blur-sm'>
            {collection?.image ? (
              <Image
                alt={collection.image.altText || collection.title}
                data={collection.image}
                loading={index < 3 ? 'eager' : undefined}
                sizes='(min-width: 45em) 400px, 100vw'
                className='w-full h-full object-contain group-hover:scale-110 transition-transform duration-500 ease-out'
              />
            ) : (
              <div className='absolute inset-0 bg-gradient-to-br from-purple-600 to-purple-700'></div>
            )}
          </div>
        </div>
      </div>

      {/* White Content Section */}
      <div className='p-4 flex-1 flex flex-col justify-center'>
        <h3 className='font-bold text-gray-900 text-center group-hover:text-purple-600 transition-colors duration-300'>
          {collection.title}
        </h3>
      </div>
    </Link>
  );
}

const COLLECTIONS_QUERY = `#graphql
  fragment Collection on Collection {
    id
    title
    handle
    image {
      id
      url
      altText
      width
      height
    }
  }
  query StoreCollections(
    $country: CountryCode
    $endCursor: String
    $first: Int
    $language: LanguageCode
    $last: Int
    $startCursor: String
  ) @inContext(country: $country, language: $language) {
    collections(
      first: $first,
      last: $last,
      before: $startCursor,
      after: $endCursor
    ) {
      nodes {
        ...Collection
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }
  }
` as const;
