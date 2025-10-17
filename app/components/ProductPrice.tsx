import { Money } from '@shopify/hydrogen';
import type { MoneyV2 } from '@shopify/hydrogen/storefront-api-types';

export function ProductPrice({
  price,
  compareAtPrice,
}: {
  price?: MoneyV2;
  compareAtPrice?: MoneyV2 | null;
}) {
  const currentPrice = price ? parseFloat(price.amount) : 0;
  const originalPrice = compareAtPrice
    ? parseFloat(compareAtPrice.amount)
    : currentPrice;
  const discount =
    originalPrice > currentPrice
      ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
      : 0;

  return (
    <div>
      {compareAtPrice && discount > 0 ? (
        <div className='space-y-1'>
          {/* Current Price */}
          <div className='flex items-baseline gap-2'>
            <span className='text-2xl font-bold text-gray-900'>
              {currentPrice.toLocaleString('hu-HU')} Ft
            </span>
            <span className='bg-red-500 text-white px-2 py-0.5 rounded text-xs font-medium'>
              -{discount}%
            </span>
          </div>

          {/* Original Price */}
          <span className='text-sm text-gray-500 line-through'>
            {originalPrice.toLocaleString('hu-HU')} Ft
          </span>
        </div>
      ) : price ? (
        <span className='text-2xl font-bold text-gray-900'>
          {currentPrice.toLocaleString('hu-HU')} Ft
        </span>
      ) : (
        <span className='text-2xl font-bold text-gray-400'>
          Ár nem elérhető
        </span>
      )}
    </div>
  );
}
