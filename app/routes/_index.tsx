import {Await, useLoaderData} from 'react-router';
import type {Route} from './+types/_index';
import {Suspense} from 'react';
import {ProductItem} from '~/components/ProductItem';
import {HeroSection} from '~/components/HeroSection';
import {ProductSkeletonRow} from '~/components/ProductSkeleton';
import {RECOMMENDED_PRODUCTS_QUERY} from '~/lib/queries';
import type {RecommendedProductFragment} from 'storefrontapi.generated';

export const meta: Route.MetaFunction = () => {
  return [{title: 'Hydrogen | Home'}];
};

export default function Homepage() {
  const data = useLoaderData<typeof loader>();
  const products = data.recommendedProducts;

  return (
    <div className="home">
      <HeroSection />

      <div className="recommended-products">
        <h2 className="mt-10 text-4xl md:text-5xl font-black text-gray-900 mb-6 text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Kiemelt termékeink
        </h2>

        <Suspense fallback={<ProductSkeletonRow count={4} />}>
          <Await resolve={products}>
            {(response) => (
              <div className="max-w-7xl mx-auto pt-10 grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 px-4">
                {response
                  ? response.products.nodes.map(
                      (product: RecommendedProductFragment) => (
                        <ProductItem key={product.id} product={product} />
                      ),
                    )
                  : null}
              </div>
            )}
          </Await>
        </Suspense>
        <br />
      </div>
    </div>
  );
}

export async function loader(args: Route.LoaderArgs) {
  const deferredData = loadDeferredData(args);

  return {...deferredData};
}

function loadDeferredData({context}: Route.LoaderArgs) {
  const recommendedProducts = context.storefront
    .query(RECOMMENDED_PRODUCTS_QUERY)
    .catch((error: Error) => {
      console.error(error);
      return null;
    });

  return {
    recommendedProducts,
  };
}
