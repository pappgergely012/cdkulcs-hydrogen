import { type FetcherWithComponents } from 'react-router';
import { CartForm, type OptimisticCartLineInput } from '@shopify/hydrogen';

export function AddToCartButton({
  analytics,
  children,
  disabled,
  lines,
  onClick,
}: {
  analytics?: unknown;
  children: React.ReactNode;
  disabled?: boolean;
  lines: Array<OptimisticCartLineInput>;
  onClick?: () => void;
}) {
  return (
    <CartForm
      route='/cart'
      inputs={{ lines }}
      action={CartForm.ACTIONS.LinesAdd}
    >
      {(fetcher: FetcherWithComponents<any>) => (
        <>
          <input
            name='analytics'
            type='hidden'
            value={JSON.stringify(analytics)}
          />
          <button
            type='submit'
            onClick={onClick}
            disabled={disabled ?? fetcher.state !== 'idle'}
            className='bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 flex items-center gap-2 text-base hover:scale-105 hover:shadow-lg cursor-pointer whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100'
          >
            {fetcher.state !== 'idle' ? (
              <div className='flex items-center gap-1'>
                <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
                Hozzáadás...
              </div>
            ) : (
              children
            )}
          </button>
        </>
      )}
    </CartForm>
  );
}
