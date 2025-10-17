import { Link, useNavigate } from 'react-router';
import { type MappedProductOptions } from '@shopify/hydrogen';
import type {
  Maybe,
  ProductOptionValueSwatch,
} from '@shopify/hydrogen/storefront-api-types';
import { AddToCartButton } from './AddToCartButton';
import { useAside } from './Aside';
import type { ProductFragment } from 'storefrontapi.generated';

export function ProductForm({
  productOptions,
  selectedVariant,
}: {
  productOptions: MappedProductOptions[];
  selectedVariant: ProductFragment['selectedOrFirstAvailableVariant'];
}) {
  const navigate = useNavigate();
  const { open } = useAside();
  return (
    <div className='space-y-4'>
      {productOptions.map(option => {
        // If there is only a single value in the option values, don't display the option
        if (option.optionValues.length === 1) return null;

        return (
          <div className='space-y-2' key={option.name}>
            <h3 className='text-xs font-medium text-gray-700 uppercase tracking-wide'>
              {option.name}
            </h3>
            <div className='flex flex-wrap gap-1.5'>
              {option.optionValues.map(value => {
                const {
                  name,
                  handle,
                  variantUriQuery,
                  selected,
                  available,
                  exists,
                  isDifferentProduct,
                  swatch,
                } = value;

                if (isDifferentProduct) {
                  // SEO
                  // When the variant is a combined listing child product
                  // that leads to a different url, we need to render it
                  // as an anchor tag
                  return (
                    <Link
                      className={`px-2.5 py-1.5 rounded border text-sm transition-all duration-200 ${
                        selected
                          ? 'border-gray-900 bg-gray-900 text-white'
                          : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                      } ${!available ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                      key={option.name + name}
                      prefetch='intent'
                      preventScrollReset
                      replace
                      to={`/products/${handle}?${variantUriQuery}`}
                    >
                      <ProductOptionSwatch swatch={swatch} name={name} />
                    </Link>
                  );
                } else {
                  // SEO
                  // When the variant is an update to the search param,
                  // render it as a button with javascript navigating to
                  // the variant so that SEO bots do not index these as
                  // duplicated links
                  return (
                    <button
                      type='button'
                      className={`px-2.5 py-1.5 rounded border text-sm transition-all duration-200 ${
                        selected
                          ? 'border-gray-900 bg-gray-900 text-white'
                          : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                      } ${!exists ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                      key={option.name + name}
                      disabled={!exists}
                      onClick={() => {
                        if (!selected) {
                          void navigate(`?${variantUriQuery}`, {
                            replace: true,
                            preventScrollReset: true,
                          });
                        }
                      }}
                    >
                      <ProductOptionSwatch swatch={swatch} name={name} />
                    </button>
                  );
                }
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ProductOptionSwatch({
  swatch,
  name,
}: {
  swatch?: Maybe<ProductOptionValueSwatch> | undefined;
  name: string;
}) {
  const image = swatch?.image?.previewImage?.url;
  const color = swatch?.color;

  if (!image && !color) {
    return <span className='text-sm font-medium'>{name}</span>;
  }

  return (
    <div aria-label={name} className='flex items-center gap-1.5'>
      {image ? (
        <img
          src={image}
          alt={name}
          className='w-4 h-4 rounded-full object-cover border border-gray-200'
        />
      ) : (
        <div
          className='w-4 h-4 rounded-full border border-gray-200'
          style={{
            backgroundColor: color || 'transparent',
          }}
        />
      )}
      <span className='text-sm font-medium'>{name}</span>
    </div>
  );
}
