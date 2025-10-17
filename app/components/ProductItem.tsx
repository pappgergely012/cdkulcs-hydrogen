import {Link} from 'react-router';
import {Image, Money, CartForm} from '@shopify/hydrogen';
import type {
  ProductItemFragment,
  CollectionItemFragment,
  RecommendedProductFragment,
} from 'storefrontapi.generated';
import {useVariantUrl} from '~/lib/variants';
import {ShoppingCartIcon} from '@heroicons/react/24/solid';

export function ProductItem({
  product,
  loading,
}: {
  product:
    | CollectionItemFragment
    | ProductItemFragment
    | RecommendedProductFragment;
  loading?: 'eager' | 'lazy';
}) {
  const variantUrl = useVariantUrl(product.handle);
  const image = product.featuredImage;
  const price = product.priceRange.minVariantPrice;

  // Get pricing data from product
  const currentPrice = price ? parseFloat(price.amount) : 0;
  const compareAtPrice =
    'compareAtPriceRange' in product
      ? (product as any).compareAtPriceRange?.minVariantPrice
      : null;
  const originalPrice = compareAtPrice
    ? parseFloat(compareAtPrice.amount)
    : currentPrice;

  // Calculate discount percentage
  const discount =
    originalPrice > currentPrice
      ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
      : 0;

  return (
    <Link
      to={variantUrl}
      className="group cursor-pointer flex flex-col justify-start bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl hover:scale-105 transition-all duration-300 ease-in-out"
    >
      <div className="relative aspect-square overflow-hidden">
        {image && (
          <div className="absolute inset-0">
            <Image
              alt={image.altText || product.title}
              data={image}
              loading={loading}
              className="w-full h-full object-cover filter blur-sm scale-110"
            />
            {/* Dark overlay for better text readability */}
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors duration-300"></div>
          </div>
        )}

        {/* AKCIÓ Badge - only show if there's a discount */}
        {discount > 0 && (
          <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold z-10 group-hover:scale-110 group-hover:bg-red-600 transition-all duration-300">
            AKCIÓ
          </div>
        )}

        {/* Product Image/Logo in center */}
        <div className="relative h-full">
          <div className="w-full h-full bg-white/20 backdrop-blur-sm">
            {image ? (
              <Image
                alt={image.altText || product.title}
                data={image}
                loading={loading}
                className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500 ease-out"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-purple-700"></div>
            )}
          </div>
        </div>
      </div>

      {/* White Content Section */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Product Title */}
          <h3 className="font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300">
            {product.title}
          </h3>

          {/* Description */}
          <div className="h-10">
            <p className="text-sm text-gray-600 line-clamp-2">
              {'description' in product && (product as any).description
                ? (product as any).description
                : 'Vásárold meg a terméket kedvező áron! Rendelj most, és azonnal megkapod a kulcsot.'}
            </p>
          </div>
        </div>

        <div className="flex items-end justify-between">
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-green-600 group-hover:text-green-700 transition-colors duration-300">
              {currentPrice.toLocaleString('hu-HU')} Ft
            </span>
            {discount > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500 line-through">
                  {originalPrice.toLocaleString('hu-HU')} Ft
                </span>
                <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                  -{discount}%
                </span>
              </div>
            )}
          </div>

          {/* Right side - Add to Cart Button */}
          {'variants' in product && product.variants?.nodes?.[0] ? (
            <CartForm
              route="/cart"
              action={CartForm.ACTIONS.LinesAdd}
              inputs={{
                lines: [
                  {
                    merchandiseId: (product.variants.nodes[0] as any).id,
                    quantity: 1,
                  },
                ],
              }}
            >
              {(fetcher) => (
                <button
                  type="submit"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  disabled={fetcher.state !== 'idle'}
                  className={`bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-1 px-3 rounded-lg transition-all duration-200 flex items-center gap-2 text-md group-hover:scale-105 group-hover:shadow-lg cursor-pointer ${
                    fetcher.state === 'submitting'
                      ? 'animate-pulse scale-95'
                      : ''
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <ShoppingCartIcon
                    className={`w-5 h-5 transition-transform duration-200 ${
                      fetcher.state === 'submitting' ? 'animate-bounce' : ''
                    }`}
                  />
                  Kosárba
                </button>
              )}
            </CartForm>
          ) : (
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-1 px-3 rounded-lg transition-all duration-200 flex items-center gap-2 text-md group-hover:scale-105 group-hover:shadow-lg">
              <ShoppingCartIcon className="w-5 h-5" />
              Megnézem
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
