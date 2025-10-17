import { useOptimisticCart } from '@shopify/hydrogen';
import { Link } from 'react-router';
import type { CartApiQueryFragment } from 'storefrontapi.generated';
import { useCart } from '~/components/PageLayout';
import { CartLineItem } from '~/components/CartLineItem';
import { CartSummary } from './CartSummary';

export type CartLayout = 'page' | 'aside';

export type CartMainProps = {
  cart: CartApiQueryFragment | null;
  layout: CartLayout;
};

export function CartMain({ layout, cart: originalCart }: CartMainProps) {
  const cart = useOptimisticCart(originalCart);

  const linesCount = Boolean(cart?.lines?.nodes?.length || 0);
  const withDiscount =
    cart &&
    Boolean(cart?.discountCodes?.filter(code => code.applicable)?.length);
  const className = `cart-main ${withDiscount ? 'with-discount' : ''}`;
  const cartHasItems = cart?.totalQuantity ? cart.totalQuantity > 0 : false;

  return (
    <div className={`${className} min-h-full flex flex-col`}>
      <CartEmpty hidden={linesCount} layout={layout} />
      <div className='flex-1 flex flex-col min-h-[100%]'>
        <div aria-labelledby='cart-lines' className='flex-1 overflow-y-auto'>
          <ul className='space-y-4 p-4 flex-1'>
            {(cart?.lines?.nodes ?? []).map(line => (
              <CartLineItem key={line.id} line={line} layout={layout} />
            ))}
          </ul>
        </div>

        {cartHasItems && (
          <div className='flex-shrink-0'>
            <CartSummary cart={cart} layout={layout} />
          </div>
        )}
      </div>
    </div>
  );
}

function CartEmpty({
  hidden = false,
}: {
  hidden: boolean;
  layout?: CartMainProps['layout'];
}) {
  const { close } = useCart();

  return (
    <div
      hidden={hidden}
      className='flex flex-col items-center justify-center h-full p-8 text-center'
    >
      <div className='w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6'>
        <svg
          className='w-12 h-12 text-gray-400'
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={1.5}
            d='M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z'
          />
        </svg>
      </div>
      <h3 className='text-xl font-semibold text-gray-900 mb-2'>A kosár üres</h3>
      <p className='text-gray-600 mb-6 max-w-sm'>
        Még nem adtál hozzá termékeket a kosaradhoz. Nézz szét a termékeink
        között!
      </p>
      <Link
        to='/collections'
        onClick={close}
        prefetch='viewport'
        className='inline-flex items-center px-6 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors duration-200'
      >
        Vásárlás folytatása
        <svg
          className='w-5 h-5 ml-2'
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M9 5l7 7-7 7'
          />
        </svg>
      </Link>
    </div>
  );
}
