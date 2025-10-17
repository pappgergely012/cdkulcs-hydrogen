import type { ProductVariantFragment } from 'storefrontapi.generated';
import { Image } from '@shopify/hydrogen';

export function ProductImage({
  image,
}: {
  image: ProductVariantFragment['image'];
}) {
  if (!image) {
    return (
      <div className='aspect-square bg-gray-50 rounded-md flex items-center justify-center'>
        <svg
          className='w-12 h-12 text-gray-300'
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={1}
            d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'
          />
        </svg>
      </div>
    );
  }
  return (
    <div className='relative aspect-square overflow-hidden rounded-md'>
      <div className='absolute inset-0'>
        <Image
          alt={image.altText || 'Product Image'}
          data={image}
          key={`${image.id}-bg`}
          sizes='(min-width: 45em) 50vw, 100vw'
          className='w-full h-full object-cover filter blur-sm scale-110'
        />
        {/* Dark overlay for better contrast */}
        <div className='absolute inset-0 bg-black/40'></div>
      </div>

      {/* Product Image/Logo in center */}
      <div className='relative h-full'>
        <div className='w-full h-full bg-white/20 backdrop-blur-sm'>
          <Image
            alt={image.altText || 'Product Image'}
            data={image}
            key={image.id}
            sizes='(min-width: 45em) 50vw, 100vw'
            className='w-full h-full object-contain hover:scale-110 transition-transform duration-500 ease-out'
          />
        </div>
      </div>
    </div>
  );
}
