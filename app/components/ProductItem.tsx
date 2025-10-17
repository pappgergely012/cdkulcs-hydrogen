import {Link} from 'react-router';
import {Image, Money} from '@shopify/hydrogen';
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
    <div className="flex flex-col justify-start bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
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
            <div className="absolute inset-0 bg-black/40"></div>
          </div>
        )}

        {/* AKCIÓ Badge - only show if there's a discount */}
        {discount > 0 && (
          <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold z-10">
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
                className="w-full h-full object-contain"
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
          <h3 className="font-bold text-gray-900 mb-2">{product.title}</h3>

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
            <span className="text-2xl font-bold text-green-600">
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
          <Link
            to={variantUrl}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-1 px-3 rounded-lg transition-all duration-200 flex items-center gap-2 text-md"
          >
            <ShoppingCartIcon className="w-5 h-5" />
            Kosárba
          </Link>
        </div>
      </div>
    </div>
  );
}
