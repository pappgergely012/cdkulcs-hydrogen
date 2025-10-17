import { ShoppingCartIcon } from '@heroicons/react/24/solid';
import type { MoneyV2 } from '@shopify/hydrogen/storefront-api-types';
import type { ProductFragment } from 'storefrontapi.generated';
import { AddToCartButton } from './AddToCartButton';
import { useAside } from './Aside';

export function ProductPriceCard({
  price,
  compareAtPrice,
  selectedVariant,
}: {
  price?: MoneyV2;
  compareAtPrice?: MoneyV2 | null;
  selectedVariant: ProductFragment['selectedOrFirstAvailableVariant'];
}) {
  const { open } = useAside();

  const currentPrice = price ? parseFloat(price.amount) : 0;
  const originalPrice = compareAtPrice
    ? parseFloat(compareAtPrice.amount)
    : currentPrice;
  const discount =
    originalPrice > currentPrice
      ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
      : 0;

  //@ts-ignore
  const isDigital = !selectedVariant?.requiresShipping;

  return (
    <div className='sticky top-20 bg-white rounded-xl shadow-lg border border-gray-200 p-4'>
      <div className='flex items-end justify-between gap-4'>
        <div className='flex flex-col min-w-0 flex-1'>
          <span className='text-2xl font-bold text-green-600'>
            {currentPrice.toLocaleString('hu-HU')} Ft
          </span>
          {discount > 0 && (
            <div className='flex items-center gap-1 flex-wrap'>
              <span className='text-sm text-gray-500 line-through whitespace-nowrap'>
                {originalPrice.toLocaleString('hu-HU')} Ft
              </span>
              <span className='bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold whitespace-nowrap'>
                -{discount}%
              </span>
            </div>
          )}
          {isDigital && (
            <div className='flex items-center gap-1 mt-1'>
              <div className='w-2 h-2 bg-green-500 rounded-full'></div>
              <span className='text-xs text-green-600 font-medium'>
                Digitális szállítás
              </span>
            </div>
          )}
        </div>

        <div className='flex-shrink-0'>
          <AddToCartButton
            disabled={!selectedVariant || !selectedVariant.availableForSale}
            onClick={() => {
              open('cart');
            }}
            lines={
              selectedVariant
                ? [
                    {
                      merchandiseId: selectedVariant.id,
                      quantity: 1,
                      selectedVariant,
                    },
                  ]
                : []
            }
          >
            <div className='flex items-center gap-2'>
              <ShoppingCartIcon className='w-5 h-5' />
              <span className='text-base font-semibold'>
                {selectedVariant?.availableForSale ? 'Kosárba' : 'Elfogyott'}
              </span>
            </div>
          </AddToCartButton>
        </div>
      </div>
    </div>
  );
}
