import type {CartApiQueryFragment} from 'storefrontapi.generated';
import type {CartLayout} from '~/components/CartMain';
import {CartForm, Money, type OptimisticCart} from '@shopify/hydrogen';
import {useEffect, useRef} from 'react';
import {useFetcher} from 'react-router';
import type {FetcherWithComponents} from 'react-router';

type CartSummaryProps = {
  cart: OptimisticCart<CartApiQueryFragment | null>;
  layout: CartLayout;
};

export function CartSummary({cart, layout}: CartSummaryProps) {
  const isAside = layout === 'aside';

  return (
    <div
      aria-labelledby="cart-summary"
      className={`bg-white border-t border-gray-200 ${isAside ? 'p-4 sticky bottom-0' : 'p-6'}`}
    >
      <h4 className="text-lg font-semibold text-gray-900 mb-4">Összesítés</h4>

      <div className="space-y-3 mb-6">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Részösszeg</span>
          <span className="font-medium text-gray-900">
            {cart?.cost?.subtotalAmount?.amount ? (
              <Money data={cart?.cost?.subtotalAmount} />
            ) : (
              '-'
            )}
          </span>
        </div>

        <CartDiscounts discountCodes={cart?.discountCodes} />
        <CartGiftCard giftCardCodes={cart?.appliedGiftCards} />
      </div>

      <CartCheckoutActions checkoutUrl={cart?.checkoutUrl} />
    </div>
  );
}

function CartCheckoutActions({checkoutUrl}: {checkoutUrl?: string}) {
  if (!checkoutUrl) return null;

  return (
    <a
      href={checkoutUrl}
      target="_self"
      className="block w-full bg-purple-600 text-white text-center font-medium py-3 px-4 rounded-lg hover:bg-purple-700 transition-colors duration-200"
    >
      Tovább a fizetéshez
      <svg
        className="w-5 h-5 inline ml-2"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 5l7 7-7 7"
        />
      </svg>
    </a>
  );
}

function CartDiscounts({
  discountCodes,
}: {
  discountCodes?: CartApiQueryFragment['discountCodes'];
}) {
  const codes: string[] =
    discountCodes
      ?.filter((discount) => discount.applicable)
      ?.map(({code}) => code) || [];

  return (
    <div className="space-y-3">
      {/* Have existing discount, display it with a remove option */}
      {codes.length > 0 && (
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Kedvezmény</span>
          <UpdateDiscountForm>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-green-600 bg-green-100 px-2 py-1 rounded">
                {codes?.join(', ')}
              </span>
              <button
                type="submit"
                className="text-xs text-red-600 hover:text-red-800 transition-colors duration-200"
              >
                Eltávolítás
              </button>
            </div>
          </UpdateDiscountForm>
        </div>
      )}

      {/* Show an input to apply a discount */}
      <UpdateDiscountForm discountCodes={codes}>
        <div className="flex gap-2">
          <input
            type="text"
            name="discountCode"
            placeholder="Kedvezménykód"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors duration-200"
          >
            Alkalmaz
          </button>
        </div>
      </UpdateDiscountForm>
    </div>
  );
}

function UpdateDiscountForm({
  discountCodes,
  children,
}: {
  discountCodes?: string[];
  children: React.ReactNode;
}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.DiscountCodesUpdate}
      inputs={{
        discountCodes: discountCodes || [],
      }}
    >
      {children}
    </CartForm>
  );
}

function CartGiftCard({
  giftCardCodes,
}: {
  giftCardCodes: CartApiQueryFragment['appliedGiftCards'] | undefined;
}) {
  const appliedGiftCardCodes = useRef<string[]>([]);
  const giftCardCodeInput = useRef<HTMLInputElement>(null);
  const giftCardAddFetcher = useFetcher({key: 'gift-card-add'});

  // Clear the gift card code input after the gift card is added
  useEffect(() => {
    if (giftCardAddFetcher.data) {
      giftCardCodeInput.current!.value = '';
    }
  }, [giftCardAddFetcher.data]);

  function saveAppliedCode(code: string) {
    const formattedCode = code.replace(/\s/g, ''); // Remove spaces
    if (!appliedGiftCardCodes.current.includes(formattedCode)) {
      appliedGiftCardCodes.current.push(formattedCode);
    }
  }

  return (
    <div className="space-y-3">
      {/* Display applied gift cards with individual remove buttons */}
      {giftCardCodes && giftCardCodes.length > 0 && (
        <div className="space-y-2">
          <span className="text-gray-600 text-sm">
            Alkalmazott ajándékkártyák
          </span>
          {giftCardCodes.map((giftCard) => (
            <RemoveGiftCardForm key={giftCard.id} giftCardId={giftCard.id}>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded">
                    ***{giftCard.lastCharacters}
                  </span>
                  <span className="text-sm text-gray-600">
                    <Money data={giftCard.amountUsed} />
                  </span>
                </div>
                <button
                  type="submit"
                  className="text-xs text-red-600 hover:text-red-800 transition-colors duration-200"
                >
                  Eltávolítás
                </button>
              </div>
            </RemoveGiftCardForm>
          ))}
        </div>
      )}

      {/* Show an input to apply a gift card */}
      <UpdateGiftCardForm
        giftCardCodes={appliedGiftCardCodes.current}
        saveAppliedCode={saveAppliedCode}
        fetcherKey="gift-card-add"
      >
        <div className="flex gap-2">
          <input
            type="text"
            name="giftCardCode"
            placeholder="Ajándékkártya kód"
            ref={giftCardCodeInput}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
          <button
            type="submit"
            disabled={giftCardAddFetcher.state !== 'idle'}
            className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Alkalmaz
          </button>
        </div>
      </UpdateGiftCardForm>
    </div>
  );
}

function UpdateGiftCardForm({
  giftCardCodes,
  saveAppliedCode,
  fetcherKey,
  children,
}: {
  giftCardCodes?: string[];
  saveAppliedCode?: (code: string) => void;
  fetcherKey?: string;
  children: React.ReactNode;
}) {
  return (
    <CartForm
      fetcherKey={fetcherKey}
      route="/cart"
      action={CartForm.ACTIONS.GiftCardCodesUpdate}
      inputs={{
        giftCardCodes: giftCardCodes || [],
      }}
    >
      {(fetcher: FetcherWithComponents<any>) => {
        const code = fetcher.formData?.get('giftCardCode');
        if (code && saveAppliedCode) {
          saveAppliedCode(code as string);
        }
        return children;
      }}
    </CartForm>
  );
}

function RemoveGiftCardForm({
  giftCardId,
  children,
}: {
  giftCardId: string;
  children: React.ReactNode;
}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.GiftCardCodesRemove}
      inputs={{
        giftCardCodes: [giftCardId],
      }}
    >
      {children}
    </CartForm>
  );
}
