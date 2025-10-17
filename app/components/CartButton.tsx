import {
  type CartViewPayload,
  useAnalytics,
  useOptimisticCart,
} from '@shopify/hydrogen';
import type {CartApiQueryFragment} from 'storefrontapi.generated';
import {useCart} from '~/components/PageLayout';

export function CartButton({cart}: {cart: CartApiQueryFragment | null}) {
  const optimisticCart = useOptimisticCart(cart);
  const totalItems = optimisticCart?.totalQuantity ?? 0;
  const {publish, shop, cart: analyticsCart, prevCart} = useAnalytics();
  const {open} = useCart();

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        open();
        publish('cart_viewed', {
          cart: analyticsCart,
          prevCart,
          shop,
          url: window.location.href || '',
        } as CartViewPayload);
      }}
      className="relative py-1 px-1 rounded-xl transition-all duration-200"
    >
      <div
        className={`cursor-pointer flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200 ${
          totalItems > 0
            ? 'bg-purple-100 hover:bg-purple-200'
            : 'bg-gray-100 hover:bg-gray-200'
        }`}
      >
        <svg
          className={`w-5 h-5 ${
            totalItems > 0 ? 'text-purple-700' : 'text-gray-700'
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
          />
        </svg>
        {totalItems > 0 && (
          <span className="text-sm font-bold text-purple-900">
            {totalItems}
          </span>
        )}
      </div>
    </button>
  );
}
